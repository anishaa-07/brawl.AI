const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000/api' : '/api';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check authentication
    const currentUser = localStorage.getItem('brawl_current_user');
    
    // If no user is logged in, redirect to login page
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // 2. Load User Data
    const displayUsername = document.getElementById('display-username');
    displayUsername.textContent = currentUser.toUpperCase();
    
    // --- GLITTER BACKGROUND EFFECT ---
    const style = document.createElement('style');
    style.innerHTML = `
        .glitter-container {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0; 
            overflow: hidden;
        }
        .glitter-star {
            position: absolute;
            background: #fff;
            border-radius: 50%;
            animation: twinkle linear infinite;
            opacity: 0;
        }
        @keyframes twinkle {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    const glitterBox = document.createElement('div');
    glitterBox.className = 'glitter-container';
    document.body.prepend(glitterBox);

    const colors = [
        'rgba(0, 255, 115, 0.8)', // Brand Green
        'rgba(0, 240, 255, 0.8)', // Cyan
        'rgba(255, 0, 60, 0.8)',  // Red
        'rgba(255, 255, 255, 0.9)' // White
    ];

    for(let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'glitter-star';
        
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        star.style.animationDuration = (Math.random() * 4 + 2) + 's';
        star.style.animationDelay = (Math.random() * 5) + 's';
        
        const col = colors[Math.floor(Math.random() * colors.length)];
        star.style.boxShadow = `0 0 ${size*2}px ${size}px ${col}`;
        
        glitterBox.appendChild(star);
    }
    // ---------------------------------
    
    // Assign unique anime avatar dynamically based on username
    let hash = 0;
    for (let i = 0; i < currentUser.length; i++) {
        hash = currentUser.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Simple heuristic for female names: commonly ends in 'a', 'i', 'e', 'y'
    const cleanName = currentUser.trim();
    const isFemale = /[aiey]$/i.test(cleanName) || ['mary', 'chloe', 'sruti', 'anishaa'].includes(cleanName.toLowerCase());
    
    let avatarIndex;
    if (isFemale) {
        // Female anime avatars
        const femaleAvatars = [2, 5];
        avatarIndex = femaleAvatars[Math.abs(hash) % femaleAvatars.length];
    } else {
        // Male anime avatars
        const maleAvatars = [1, 3, 4];
        avatarIndex = maleAvatars[Math.abs(hash) % maleAvatars.length];
    }
    
    const avatarElement = document.querySelector('.avatar-placeholder');
    if (avatarElement) {
        avatarElement.style.backgroundImage = `url('avatar_${avatarIndex}.png')`;
        avatarElement.style.backgroundSize = 'cover';
        avatarElement.style.backgroundPosition = 'top center';
    }
    
    try {
        const res = await fetch(`${API_BASE}/user/profile/${currentUser}`);
        if (!res.ok) {
            throw new Error('Failed to fetch profile');
        }
        const userData = await res.json();
        
        document.getElementById('display-level').textContent = userData.level;
        
        // Calculate XP progress for current level
        // For gamification, let's just make max XP arbitrary based on level (e.g., level * 100)
        // Since we didn't specify a strict formula in backend, we'll just show raw XP or a simulated bar.
        const currentXP = userData.xp;
        const maxXP = userData.level * 200; // Example formula
        const percentage = Math.min((currentXP / maxXP) * 100, 100);
        
        const xpText = document.querySelector('.xp-header span:nth-child(2)');
        if (xpText) xpText.textContent = `${currentXP} / ${maxXP} XP`;
        
        // Animate XP Bar
        setTimeout(() => {
            const xpBar = document.querySelector('.xp-bar');
            if(xpBar) xpBar.style.width = Math.max(percentage, 5) + '%'; 
        }, 300);

        // NEW: Render stats and match history
        const aiDefeatedStat = document.getElementById('stat-ai-defeated');
        if(aiDefeatedStat) {
            aiDefeatedStat.textContent = `${userData.stats?.aiDefeated || 0} AI Opponents Defeated`;
        }

        const combatLogList = document.getElementById('combat-log-list');
        if(combatLogList && userData.matches) {
            combatLogList.innerHTML = '';
            if(userData.matches.length === 0) {
                combatLogList.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 20px;">No combat data found for Pilot.</div>`;
            } else {
                userData.matches.slice(0, 3).forEach(match => {
                    const isWin = match.result === 'VICTORY';
                    const color = isWin ? 'var(--brand-green)' : '#ff003c';
                    const bgColor = isWin ? 'rgba(0,255,115,0.1)' : 'rgba(255,0,60,0.1)';
                    combatLogList.innerHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: ${bgColor}; border-radius: 4px;">
                        <div>
                            <strong style="color: ${color}; font-size: 0.9rem;">${match.result}</strong>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">vs ${match.opponent}</div>
                        </div>
                        <span style="color: ${color}; font-weight: bold; font-size: 0.9rem;">${match.xpChange} XP</span>
                    </div>`;
                });
            }
        }

    } catch (err) {
        console.error(err);
        // Fallback or handle error
    }
    
    // 3. Setup Logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('brawl_current_user');
        window.location.href = 'login.html';
    });
    
    // 4. Setup Game Modes
    const aiBattleBtn = document.querySelector('.ai-card button');
    if(aiBattleBtn) {
        aiBattleBtn.addEventListener('click', () => {
            // Visual feedback for interaction
            const originalText = aiBattleBtn.innerHTML;
            aiBattleBtn.innerHTML = 'INITIALIZING...';
            aiBattleBtn.style.boxShadow = '0 0 20px #ff003c';
            
            setTimeout(() => {
                window.location.href = 'battle.html';
            }, 1000);
        });
    }

    // 5. Fetch and render Leaderboard
    try {
        const leadRes = await fetch(`${API_BASE}/leaderboard`);
        const leaderboardData = await leadRes.json();
        const leaderboardList = document.getElementById('leaderboard-list');
        if(leaderboardList) {
            leaderboardList.innerHTML = '';
            leaderboardData.forEach((player, idx) => {
                const color = idx === 0 ? 'var(--brand-yellow)' : '#fff';
                const bgColor = idx === 0 ? 'rgba(255,184,0,0.1)' : 'rgba(0,255,115,0.05)';
                const border = idx === 0 ? `4px solid var(--brand-yellow)` : '4px solid #fff';
                
                leaderboardList.innerHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: ${bgColor}; border-left: ${border}; border-radius: 4px;">
                    <strong style="color: ${color}; font-size: ${idx===0?'1rem':'0.9rem'};">#${idx+1} ${player.username.toUpperCase()}</strong>
                    <span style="color: var(--text-muted); font-size: 0.9rem;">LVL ${player.level}</span>
                </div>`;
            });
        }
    } catch(err) {
        console.error("Leaderboard fetch error:", err);
    }

    // 6. Fetch and render Server Nodes
    try {
        const nodeRes = await fetch(`${API_BASE}/system/nodes`);
        const nodesData = await nodeRes.json();
        const nodesList = document.getElementById('server-nodes-list');
        if(nodesList) {
            nodesList.innerHTML = '';
            nodesData.forEach(node => {
                nodesList.innerHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                    <span style="color: #00f0ff; font-family: monospace;">${node.name}</span>
                    <span style="color: ${node.color};">${node.status} [${node.ping}]</span>
                </div>`;
            });
        }
    } catch(err) {
        console.error("Nodes fetch error:", err);
    }
});
