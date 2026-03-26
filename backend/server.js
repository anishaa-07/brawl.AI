const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const https = require('https');

app.use(cors());
app.use(express.json());

// Serve static frontend files from the React dist folder
app.use(express.static(path.join(__dirname, '..', 'frontend-react', 'dist')));


// Piston Runtime Cache
let pistonRuntimes = [];
async function fetchRuntimes() {
    return new Promise((resolve) => {
        https.get('https://emkc.org/api/v2/piston/runtimes', { headers: { 'User-Agent': 'BrawlAI-Client/1.1' } }, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try { pistonRuntimes = JSON.parse(body); resolve(true); } 
                catch(e) { console.error('Piston Runtime Fetch Error:', e); resolve(false); }
            });
        }).on('error', () => resolve(false));
    });
}

// Proxy for Piston API with dynamic version discovery
app.post('/api/piston/proxy', async (req, res) => {
    // 1. Fetch runtimes if empty
    if (pistonRuntimes.length === 0) await fetchRuntimes();

    // 2. Resolve version automatically if possible
    const { language, version } = req.body;
    const runtime = pistonRuntimes.find(r => r.language === language || (r.aliases && r.aliases.includes(language)));
    
    if (runtime) {
        req.body.version = runtime.version; // Use the first available version from Piston
        req.body.language = runtime.language;
    }

    const data = JSON.stringify(req.body);
    const instances = [
        { host: 'emkc.org', path: '/api/v2/piston/execute' },
        { host: 'piston.codes', path: '/api/v2/piston/execute' }
    ];

    function tryInstance(idx) {
        if (idx >= instances.length) return res.status(500).json({ error: 'All Piston instances failed.' });
        
        const inst = instances[idx];
        const options = {
            hostname: inst.host, port: 443, path: inst.path, method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': data.length, 'User-Agent': 'BrawlAI-Client/1.1' },
            timeout: 10000
        };

        const proxyReq = https.request(options, (proxyRes) => {
            if (proxyRes.statusCode !== 200 && idx < instances.length - 1) return tryInstance(idx + 1);
            let body = '';
            proxyRes.on('data', d => body += d);
            proxyRes.on('end', () => res.status(proxyRes.statusCode).send(body));
        });
        proxyReq.on('error', () => tryInstance(idx + 1));
        proxyReq.write(data);
        proxyReq.end();
    }

    tryInstance(0);
});

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const levelsFilePath = path.join(__dirname, 'data', 'levels.json');

// Helper to read/write data
function readData(filePath) {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ----------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------

app.post('/api/auth/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || username.length < 3 || password.length < 5) {
        return res.status(400).json({ error: 'Invalid username or password length.' });
    }

    const users = readData(usersFilePath);
    if (users[username]) {
        return res.status(400).json({ error: 'Pilot ID already registered.' });
    }

    users[username] = {
        password,
        level: 1,
        xp: 0,
        matches: [],
        stats: { aiDefeated: 0, tournaments: 0 }
    };
    writeData(usersFilePath, users);

    res.json({ success: true, message: 'Signup successful.' });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData(usersFilePath);

    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ error: 'Invalid Pilot ID or Access Code.' });
    }

    res.json({ success: true, message: 'Login successful.', user: { username, level: users[username].level, xp: users[username].xp } });
});

// ----------------------------------------
// USER PROFILE ENDPOINT
// ----------------------------------------

app.get('/api/user/profile/:username', (req, res) => {
    const username = req.params.username;
    const users = readData(usersFilePath);

    if (!users[username]) {
        return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
        username,
        level: users[username].level,
        xp: users[username].xp,
        matches: users[username].matches || [],
        stats: users[username].stats || { aiDefeated: 0, tournaments: 0 }
    });
});

// ----------------------------------------
// BATTLE & LEVEL ENDPOINTS
// ----------------------------------------

app.get('/api/levels/:level', (req, res) => {
    const levelId = parseInt(req.params.level);
    const levels = readData(levelsFilePath);
    
    const levelData = levels.find(l => l.level === levelId);
    if (!levelData) {
        return res.status(404).json({ error: 'Level not found.' });
    }
    
    // Don't send testCases with expected answers to client initially for security,
    // but in this simple prototype we can just send everything or validate on backend.
    // Let's validate on the backend.
    res.json({
        level: levelData.level,
        title: levelData.title,
        description: levelData.description,
        xpReward: levelData.xpReward
    });
});

app.post('/api/battle/result', (req, res) => {
    const { username, result, xpChange, mode, opponent, level, code } = req.body;
    
    const users = readData(usersFilePath);
    if (!users[username]) return res.status(404).json({ error: 'User not found.' });

    // ── NEW FLOW: Direct Result Reporting (Action Arena) ──
    if (result && xpChange !== undefined) {
        const xp = parseInt(xpChange) || 0;
        users[username].xp += xp;
        
        if (result === 'VICTORY') {
            users[username].stats = users[username].stats || { aiDefeated: 0, tournaments: 0 };
            users[username].stats.aiDefeated += 1;
            // Level up if they beat an AI level corresponding to their current level
            if (opponent && opponent.includes('AI') && users[username].level < 10) {
                // simple heuristic
                users[username].level += 1;
            }
        }

        users[username].matches = users[username].matches || [];
        users[username].matches.unshift({
            result,
            opponent: opponent || 'Unknown Opponent',
            xpChange: xp >= 0 ? `+${xp}` : `${xp}`,
            mode: mode || 'Battle',
            date: new Date().toISOString()
        });
        if(users[username].matches.length > 20) users[username].matches.pop();
        
        writeData(usersFilePath, users);
        return res.json({ success: true, newXP: users[username].xp, newLevel: users[username].level });
    }

    // ── LEGACY FLOW: Code Verification (Coding Challenge) ──
    const levels = readData(levelsFilePath);
    const levelData = levels.find(l => l.level === parseInt(level));
    if (!levelData) return res.status(404).json({ error: 'Level data not found.' });
    
    let allPassed = true;
    let errorMessage = '';
    
    try {
        const sandboxCode = `${code}\n`;
        for (let test of levelData.testCases) {
            const resultVal = eval(`
                ${sandboxCode}
                ${test.input}
            `);
            if (resultVal !== test.expected) {
                allPassed = false;
                errorMessage = `Test failed: ${test.input} returned ${resultVal}, expected ${test.expected}`;
                break;
            }
        }
    } catch (err) {
        allPassed = false;
        errorMessage = 'Execution Failed: ' + err.message;
    }
    
    if (allPassed) {
        users[username].xp += levelData.xpReward;
        users[username].stats = users[username].stats || { aiDefeated: 0, tournaments: 0 };
        users[username].stats.aiDefeated += 1;
        users[username].matches = users[username].matches || [];
        users[username].matches.unshift({
            result: 'VICTORY',
            opponent: levelData.title,
            xpChange: `+${levelData.xpReward}`,
            date: new Date().toISOString()
        });
        if (users[username].level === parseInt(level)) users[username].level += 1;
        writeData(usersFilePath, users);
        res.json({ success: true, xpGained: levelData.xpReward, newLevel: users[username].level });
    } else {
        res.json({ success: false, message: errorMessage });
    }
});

// ----------------------------------------
// LOBBY DATA ENDPOINTS
// ----------------------------------------
app.get('/api/leaderboard', (req, res) => {
    const users = readData(usersFilePath);
    const sorted = Object.keys(users).map(username => ({
        username,
        level: users[username].level || 1,
        xp: users[username].xp || 0
    })).sort((a, b) => b.level - a.level || b.xp - a.xp).slice(0, 5);
    res.json(sorted);
});

app.get('/api/system/nodes', (req, res) => {
    // Mock dynamic node status
    const nodes = [
        { name: 'US-EAST-1 (NEURAL CLUSTER)', status: 'ONLINE', ping: Math.floor(Math.random() * 20 + 5) + 'ms', color: '#00ff73' },
        { name: 'EU-WEST-2 (QUANTUM GRID)', status: 'ONLINE', ping: Math.floor(Math.random() * 50 + 20) + 'ms', color: '#00ff73' },
        { name: 'ASIA-PAC-1 (HACKER NEXUS)', status: Math.random() > 0.8 ? 'HEAVY LOAD' : 'ONLINE', ping: Math.floor(Math.random() * 100 + 80) + 'ms', color: Math.random() > 0.8 ? '#ffb800' : '#00ff73' },
        { name: 'MARS-ORBITAL-1', status: Math.random() > 0.95 ? 'ONLINE' : 'OFFLINE', ping: 'ERR_TIMEOUT', color: '#ff003c' }
    ];
    if(nodes[3].status === 'ONLINE') { nodes[3].ping = Math.floor(Math.random() * 800 + 400) + 'ms'; nodes[3].color = '#ffb800'; }
    res.json(nodes);
});

// Fallback: Always serve index.html for any other routes (SPA routing)
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend-react', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Brawl.AI backend running on http://localhost:${PORT}`);
});
