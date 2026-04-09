/* ═══════════════════════════════════
   BRAWL.AI app.js — Interactions & Animations
═══════════════════════════════════ */
'use strict';

// ── Time ──
function updateTime() {
  const now = new Date();
  document.getElementById('hudTime').textContent =
    now.toLocaleTimeString('en-US', { hour12: false });
}
updateTime();
setInterval(updateTime, 1000);

// ── Mission Timer ──
let missionSeconds = 23 * 3600 + 47 * 60 + 12;
function updateMissionTimer() {
  missionSeconds = Math.max(0, missionSeconds - 1);
  const h = Math.floor(missionSeconds / 3600);
  const m = Math.floor((missionSeconds % 3600) / 60);
  const s = missionSeconds % 60;
  document.getElementById('missionTimer').textContent =
    `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
setInterval(updateMissionTimer, 1000);

// ── Particle Canvas ──
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const COLORS = ['#00f5ff', '#a855f7', '#3b82f6', '#f43f8e'];
  const PARTICLE_COUNT = 120;

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.8 + 0.3;
      this.speed = Math.random() * 0.4 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.1;
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = (Math.random() * 0.02 + 0.005);
    }
    update() {
      this.y -= this.speed;
      this.x += Math.sin(this.y * 0.01) * 0.3;
      this.twinkle += this.twinkleSpeed;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.globalAlpha = this.alpha * (0.6 + 0.4 * Math.sin(this.twinkle));
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  // shooting stars
  let shootingStar = null;
  let ssTimer = 0;
  function spawnShootingStar() {
    shootingStar = {
      x: Math.random() * W,
      y: 0,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 4 + 2,
      len: Math.random() * 80 + 40,
      alpha: 1,
    };
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // shooting star
    ssTimer++;
    if (ssTimer > 300 && !shootingStar) { spawnShootingStar(); ssTimer = 0; }
    if (shootingStar) {
      ctx.globalAlpha = shootingStar.alpha;
      const grad = ctx.createLinearGradient(
        shootingStar.x, shootingStar.y,
        shootingStar.x - shootingStar.vx * shootingStar.len / 6,
        shootingStar.y - shootingStar.vy * shootingStar.len / 6
      );
      grad.addColorStop(0, '#00f5ff');
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(
        shootingStar.x - shootingStar.vx * (shootingStar.len / 6),
        shootingStar.y - shootingStar.vy * (shootingStar.len / 6)
      );
      ctx.stroke();
      shootingStar.x += shootingStar.vx;
      shootingStar.y += shootingStar.vy;
      shootingStar.alpha -= 0.02;
      if (shootingStar.alpha <= 0 || shootingStar.y > H) shootingStar = null;
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── Radar Chart ──
(function drawRadar() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 90, cy = 90, r = 70;
  const labels = ['AIM', 'TACTIC', 'SPEED', 'STEALTH', 'INTEL'];
  const values = [0.82, 0.76, 0.91, 0.65, 0.88];
  const angles = labels.map((_, i) => (i / labels.length) * Math.PI * 2 - Math.PI / 2);

  function draw(progress) {
    ctx.clearRect(0, 0, 180, 180);

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      angles.forEach((a, i) => {
        const rr = (ring / 4) * r;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,245,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axes
    angles.forEach(a => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = 'rgba(0,245,255,0.12)';
      ctx.stroke();
    });

    // Data fill
    ctx.beginPath();
    angles.forEach((a, i) => {
      const rr = values[i] * r * progress;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(168,85,247,0.5)');
    grad.addColorStop(1, 'rgba(0,245,255,0.2)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(107,139,184,0.9)';
    ctx.font = '500 8px "Share Tech Mono"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    angles.forEach((a, i) => {
      const rx = cx + Math.cos(a) * (r + 14);
      const ry = cy + Math.sin(a) * (r + 14);
      ctx.fillText(labels[i], rx, ry);
    });
    // Dots
    angles.forEach((a, i) => {
      const rr = values[i] * r * progress;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00f5ff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,245,255,0.3)';
      ctx.fill();
    });
  }

  let prog = 0;
  const anim = setInterval(() => {
    prog = Math.min(1, prog + 0.04);
    draw(prog);
    if (prog >= 1) clearInterval(anim);
  }, 16);
})();

// ── Toast ──
function showToast(msg, icon = '⚡') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4200);
}

// ── Sound Toggle ──
let soundOn = true;
document.getElementById('soundToggle').addEventListener('click', function() {
  soundOn = !soundOn;
  this.classList.toggle('muted', !soundOn);
  showToast(soundOn ? 'Audio enabled' : 'Audio muted', soundOn ? '🔊' : '🔇');
});

// ── Nav ──
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Settings ──
document.getElementById('settingsBtn').addEventListener('click', () => {
  openModal(`
    <h2 style="font-family:var(--font-head);font-size:1rem;letter-spacing:0.1em;color:var(--cyan);margin-bottom:20px">⚙ SETTINGS</h2>
    <div style="display:flex;flex-direction:column;gap:14px">
      ${['GRAPHICS QUALITY', 'PARTICLE DENSITY', 'SOUND FX VOLUME', 'MUSIC VOLUME', 'MOTION BLUR'].map((s, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(0,245,255,0.1);border-radius:8px">
          <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-dim)">${s}</span>
          <span style="font-family:var(--font-head);font-size:0.72rem;color:var(--cyan)">${['ULTRA', 'HIGH', '80%', '60%', 'ON'][i]}</span>
        </div>
      `).join('')}
      <button onclick="closeModal()" style="margin-top:8px;padding:10px;background:linear-gradient(135deg,rgba(0,245,255,0.2),rgba(168,85,247,0.2));border:1px solid rgba(0,245,255,0.3);border-radius:8px;color:var(--cyan);font-family:var(--font-head);font-size:0.75rem;letter-spacing:0.1em;cursor:pointer">APPLY CHANGES</button>
    </div>
  `);
});

// ── Game Cards ──
const cardModes = {
  'card-battle-ai': { name: 'BATTLE AI', desc: 'Engage neural network enemies. Adaptive difficulty. No mercy.', color: 'var(--cyan)', emoji: '🤖' },
  'card-duel': { name: 'DUEL PLAYER', desc: '1v1 ranked combat. Your rank is on the line. Show no weakness.', color: 'var(--purple)', emoji: '⚔️' },
  'card-squad': { name: 'SQUAD ARENA', desc: '5v5 team warfare in open-world zones. Coordinate or die.', color: 'var(--blue)', emoji: '👥' },
};

Object.entries(cardModes).forEach(([id, info]) => {
  const card = document.getElementById(id);
  if (!card) return;
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-10px) scale(1.02) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Play Buttons ──
['playBattleAI','playDuel','playSquad'].forEach((id, i) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  const names = ['BATTLE AI', 'DUEL', 'SQUAD ARENA'];
  const emojis = ['🤖', '⚔️', '👥'];
  btn.addEventListener('click', e => {
    e.stopPropagation();
    btn.textContent = 'SEARCHING...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.textContent = ['ENGAGE','CHALLENGE','ASSEMBLE'][i];
      btn.style.opacity = '1';
      showToast(`Queued for ${names[i]} — ETA ~23s`, emojis[i]);
    }, 2000);
  });
});

document.getElementById('playNowBtn').addEventListener('click', () => {
  showToast('Finding the best match for you...', '▶');
});

// ── Reset Core ──
document.getElementById('resetCoreBtn').addEventListener('click', () => {
  openModal(`
    <div style="text-align:center">
      <div style="font-size:2.5rem;margin-bottom:16px">⚠️</div>
      <h2 style="font-family:var(--font-head);font-size:1rem;letter-spacing:0.1em;color:var(--pink);margin-bottom:12px">RESET CORE</h2>
      <p style="font-size:0.85rem;color:var(--text-dim);line-height:1.6;margin-bottom:24px">This will wipe your skill tree and redistribute all core points. Your rank and credits will be preserved.</p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button onclick="closeModal();showToast('Core reset cancelled','✕')" style="padding:10px 24px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:var(--text-dim);font-family:var(--font-head);font-size:0.72rem;letter-spacing:0.1em;cursor:pointer">CANCEL</button>
        <button onclick="closeModal();showToast('Core has been reset!','🔄')" style="padding:10px 24px;background:rgba(244,63,142,0.15);border:1px solid var(--pink);border-radius:8px;color:var(--pink);font-family:var(--font-head);font-size:0.72rem;letter-spacing:0.1em;cursor:pointer">CONFIRM RESET</button>
      </div>
    </div>
  `);
});

// ── Operators ──
['deployNova','deployShadow','deployWraith'].forEach((id, i) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  const names = ['NOVA', 'SHADOW', 'WRAITH'];
  const emojis = ['🟦', '🟣', '💙'];
  btn.addEventListener('click', e => {
    e.stopPropagation();
    // Toggle selected
    const ops = document.querySelectorAll('.operator-card');
    ops.forEach(op => op.classList.remove('op-selected'));
    ops[i].classList.add('op-selected');
    showToast(`${names[i]} deployed to your squad`, emojis[i]);
  });
});

// ── Chat ──
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const typingIndicator = document.getElementById('typingIndicator');

const botReplies = [
  { user: 'NOVA_X', color: 'cyan', initial: 'N', avClass: 'av-cyan', msgs: ['Nice move 🔥', 'GG EZ let\'s go!', 'Their flank is weak, rush mid'] },
  { user: 'SHARD_99', color: 'purple', initial: 'S', avClass: 'av-purple', msgs: ['Copy that', 'I\'m on overwatch', 'Got 3 kills on south lane 💀'] },
  { user: 'WREN', color: 'blue', initial: 'W', avClass: 'av-blue', msgs: ['Hold on respawning', 'Watch for the AI sniper on roof', 'Need backup at sector C'] },
];

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg msg-self';
  msg.innerHTML = `
    <div class="msg-body">
      <span class="msg-user self-name">YOU</span>
      <p class="msg-text">${text.replace(/</g,'&lt;')}</p>
      <span class="msg-time">${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false})}</span>
    </div>
    <div class="msg-avatar av-self">C</div>
  `;
  chatMessages.insertBefore(msg, typingIndicator);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Bot response with typing indicator
  setTimeout(() => {
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 800);

  setTimeout(() => {
    typingIndicator.style.display = 'none';
    const bot = botReplies[Math.floor(Math.random() * botReplies.length)];
    const reply = bot.msgs[Math.floor(Math.random() * bot.msgs.length)];
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg';
    botMsg.innerHTML = `
      <div class="msg-avatar ${bot.avClass}">${bot.initial}</div>
      <div class="msg-body">
        <span class="msg-user ${bot.color}">${bot.user}</span>
        <p class="msg-text">${reply}</p>
        <span class="msg-time">${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false})}</span>
      </div>
    `;
    chatMessages.insertBefore(botMsg, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 2500);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

// ── Modal ──
function openModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
window.openModal = openModal;
window.closeModal = closeModal;
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── XP Bar Animation ──
setTimeout(() => {
  const xpFill = document.getElementById('xpFill');
  if (xpFill) {
    xpFill.style.width = '73.4%';
  }
}, 300);

// ── Animated credit counter ──
function animateCounter(el, target, prefix = '', suffix = '') {
  const start = 0;
  const duration = 2000;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const val = Math.round(start + (target - start) * ease);
    el.textContent = prefix + val.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const credEl = document.getElementById('credits');
if (credEl) animateCounter(credEl, 47820);

// ── Quick Stats live update ──
const qsVals = [48293, 1847, 312];
const qsEls = document.querySelectorAll('.qs-val');
qsEls.forEach((el, i) => {
  setInterval(() => {
    const delta = Math.floor(Math.random() * 30) - 15;
    qsVals[i] = Math.max(0, qsVals[i] + delta);
    el.textContent = qsVals[i].toLocaleString();
  }, 3000 + i * 1000);
});

// ── Initial toast ──
setTimeout(() => showToast('Welcome back, CIPHER_X — Season 7 Active 🔥', '🎮'), 1500);
