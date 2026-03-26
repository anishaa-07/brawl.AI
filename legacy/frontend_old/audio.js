const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(freq, type, duration, vol=0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playHoverSound() {
    playTone(600, 'sine', 0.1, 0.03);
}

function playClickSound() {
    playTone(1200, 'square', 0.1, 0.05);
}

function playAttackSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.4);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
}

function playVictorySound() {
    playTone(440, 'triangle', 0.2, 0.1);
    setTimeout(() => playTone(554, 'triangle', 0.2, 0.1), 200);
    setTimeout(() => playTone(659, 'triangle', 0.5, 0.1), 400);
}

function playDefeatSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1);
}

function playDamageSound() {
    playTone(100, 'triangle', 0.3, 0.2);
}

function playTypingSound() {
    playTone(800 + Math.random()*400, 'triangle', 0.03, 0.02);
}

function playGenericClick() {
    playTone(400, 'sine', 0.05, 0.01);
}

// Bind strictly after user interaction
document.addEventListener('click', () => {
    initAudio();
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
    // Hover logic
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('cyber-btn') || e.target.tagName === 'A') {
            if(window.audioCtx && audioCtx.state === 'running') playHoverSound();
        }
    });

    // Click logic
    document.body.addEventListener('mousedown', (e) => {
        initAudio();
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('cyber-btn') || e.target.tagName === 'A' || e.target.closest('button')) {
            if(audioCtx) playClickSound();
        } else {
            if(audioCtx) playGenericClick();
        }
    });

    // Typing logic
    document.body.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            initAudio();
            if(audioCtx) playTypingSound();
        }
    });

    // --- FULLSCREEN TOGGLE INJECTION ---
    const fsBtn = document.createElement('button');
    fsBtn.innerHTML = '[ ] FULLSCREEN';
    fsBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(10,15,22,0.8);
        border: 1px solid rgba(255,255,255,0.3);
        color: #fff;
        padding: 5px 15px;
        font-family: monospace;
        font-size: 12px;
        cursor: pointer;
        z-index: 9999;
        text-transform: uppercase;
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        transition: all 0.3s ease;
    `;
    
    fsBtn.addEventListener('mouseover', () => {
        fsBtn.style.background = '#fff';
        fsBtn.style.color = '#000';
    });
    fsBtn.addEventListener('mouseout', () => {
        fsBtn.style.background = 'rgba(10,15,22,0.8)';
        fsBtn.style.color = '#fff';
    });

    fsBtn.addEventListener('click', () => {
        initAudio();
        if(window.audioCtx) playClickSound();

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
            localStorage.setItem('brawl_fs', 'true');
            fsBtn.innerHTML = '>< EXIT FULLSCREEN';
        } else {
            document.exitFullscreen();
            localStorage.setItem('brawl_fs', 'false');
            fsBtn.innerHTML = '[ ] FULLSCREEN';
        }
    });

    document.body.appendChild(fsBtn);

    // ──────────────────────────────────────────────────
    // PERSISTENT FULLSCREEN ENGINE
    // Browsers forcibly exit fullscreen on page navigation.
    // We work around this with an instant click-to-restore
    // overlay so the user just has to click once per page.
    // ──────────────────────────────────────────────────
    if (localStorage.getItem('brawl_fs') === 'true' && !document.fullscreenElement) {
        // Create a fullscreen restoration overlay
        const fsOverlay = document.createElement('div');
        fsOverlay.id = 'fs-restore-overlay';
        fsOverlay.style.cssText = `
            position: fixed; inset: 0; z-index: 100000;
            background: rgba(0,0,0,0.92);
            display: flex; flex-direction: column;
            justify-content: center; align-items: center;
            cursor: pointer;
            animation: fsOverlayIn 0.3s ease;
        `;
        const style = document.createElement('style');
        style.textContent = `@keyframes fsOverlayIn { from{opacity:0} to{opacity:1} }`;
        document.head.appendChild(style);

        fsOverlay.innerHTML = `
            <div style="font-family: 'Orbitron', monospace; font-size: 3rem; font-weight: 900;
                color: #fff; letter-spacing: 6px; margin-bottom: 16px;
                text-shadow: 0 0 30px rgba(0,255,115,0.9);">⚔ BRAWL.AI</div>
            <div style="font-size: 1rem; color: rgba(255,255,255,0.6);
                letter-spacing: 3px; font-family: monospace;
                margin-bottom: 40px;">CLICK ANYWHERE TO RE-ENTER FULLSCREEN</div>
            <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #00ff73, #00c8ff);
                border-radius: 2px; animation: xpGlow 1.5s infinite;"></div>
        `;

        const restoreFs = () => {
            document.documentElement.requestFullscreen().then(() => {
                fsBtn.innerHTML = '>< EXIT FULLSCREEN';
                fsOverlay.style.animation = 'fsOverlayIn 0.2s ease reverse';
                setTimeout(() => fsOverlay.remove(), 200);
            }).catch(() => fsOverlay.remove());
        };

        fsOverlay.addEventListener('click', restoreFs, { once: true });
        document.body.appendChild(fsOverlay);
    }

    // Track when user manually exits fullscreen via Escape
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            // Only clear preference if they pressed Escape (not from our programmatic exits)
            // We detect Escape key separately
        }
        fsBtn.innerHTML = document.fullscreenElement ? '>< EXIT FULLSCREEN' : '[ ] FULLSCREEN';
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && localStorage.getItem('brawl_fs') === 'true') {
            localStorage.setItem('brawl_fs', 'false');
        }
    });

    // --- GLOBAL BACK BUTTON ---
    const path = window.location.pathname;
    const isRoot = path.endsWith('index.html') || path === '/' || path.endsWith('\\');
    if (!isRoot) {
        const backBtn = document.createElement('button');
        backBtn.innerHTML = '◄ RETURN';
        backBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(10,15,22,0.8);
            border: 1px solid rgba(255,255,255,0.3);
            color: #fff;
            padding: 8px 15px;
            font-family: inherit;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            z-index: 9999;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            transition: all 0.3s ease;
        `;
        
        backBtn.addEventListener('mouseover', () => {
            backBtn.style.background = '#ff003c';
            backBtn.style.border = '1px solid #ff003c';
        });
        backBtn.addEventListener('mouseout', () => {
            backBtn.style.background = 'rgba(10,15,22,0.8)';
            backBtn.style.border = '1px solid rgba(255,255,255,0.3)';
        });

        backBtn.addEventListener('click', () => {
            initAudio();
            if(window.audioCtx) playClickSound();
            
            setTimeout(() => {
                if(window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = 'index.html';
                }
            }, 200);
        });

        document.body.appendChild(backBtn);
    }
});

window.BrawlAudio = {
    initAudio,
    playHoverSound,
    playClickSound,
    playAttackSound,
    playVictorySound,
    playDefeatSound,
    playDamageSound,
    playTypingSound
};
