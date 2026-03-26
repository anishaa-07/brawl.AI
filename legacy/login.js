const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000/api' : '/api';

document.addEventListener('DOMContentLoaded', () => {
    // --- GLITTER BACKGROUND EFFECT FOR LOGIN ---
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
        'rgba(255, 0, 60, 0.8)',  // Red Theme
        'rgba(255, 0, 60, 0.9)',
        'rgba(255, 255, 255, 0.8)',
        'rgba(255, 255, 255, 0.9)'
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
});

// Auth state toggle
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Clear inputs and errors on toggle
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('.error-message').forEach(err => {
        err.textContent = '';
        err.classList.remove('show');
    });

    if (loginForm.classList.contains('active')) {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}

// Display error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Shake effect
    const authPanel = document.getElementById('auth-panel');
    authPanel.classList.remove('shake');
    void authPanel.offsetWidth; // Trigger reflow
    authPanel.classList.add('shake');
}

function setLoading(formId, isLoading) {
    const btn = document.querySelector(`#${formId} button`);
    if (isLoading) {
        btn.classList.add('loading');
    } else {
        btn.classList.remove('loading');
    }
}

// ================= SIGNUP =================
document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usrn = document.getElementById('signup-username').value.trim();
    const pass = document.getElementById('signup-password').value;
    
    if (usrn.length < 3) {
        showError('signup-error', 'PILOT ID MUST BE AT LEAST 3 CHARACTERS.');
        return;
    }
    if (pass.length < 5) {
        showError('signup-error', 'ACCESS CODE MUST BE AT LEAST 5 CHARACTERS.');
        return;
    }
    
    document.getElementById('signup-error').classList.remove('show');
    setLoading('signup-form', true);
    
    try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usrn, password: pass })
        });
        const data = await res.json();
        
        if (!res.ok) {
            showError('signup-error', data.error || 'SIGNUP FAILED.');
        } else {
            // Auto-login on success
            localStorage.setItem('brawl_current_user', usrn);
            window.location.href = "lobby.html";
        }
    } catch (err) {
        showError('signup-error', 'SERVER CONNECTION ERROR.');
        console.error(err);
    } finally {
        setLoading('signup-form', false);
    }
});

// ================= LOGIN =================
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usrn = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value;
    
    document.getElementById('login-error').classList.remove('show');
    setLoading('login-form', true);
    
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usrn, password: pass })
        });
        const data = await res.json();
        
        if (!res.ok) {
            showError('login-error', data.error || 'LOGIN FAILED.');
        } else {
            // Success
            localStorage.setItem('brawl_current_user', usrn);
            window.location.href = "lobby.html";
        }
    } catch (err) {
        showError('login-error', 'SERVER CONNECTION ERROR.');
        console.error(err);
    } finally {
        setLoading('login-form', false);
    }
});
