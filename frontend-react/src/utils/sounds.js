/**
 * BRAWL.AI — Procedural Sound Engine
 * All sounds are synthesized via the Web Audio API.
 * No external files required. Gain kept subtle for gaming feel.
 */

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Low-level helper: play a short oscillator burst */
function playTone({ type = 'sine', freq = 440, endFreq, gain = 0.18, duration = 0.15, startDelay = 0 }) {
  if (localStorage.getItem('brawl_sound_enabled') === 'false') return;
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gainNode = ac.createGain();

    osc.connect(gainNode);
    gainNode.connect(ac.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + startDelay);
    if (endFreq !== undefined) {
      osc.frequency.linearRampToValueAtTime(endFreq, ac.currentTime + startDelay + duration);
    }

    gainNode.gain.setValueAtTime(0, ac.currentTime + startDelay);
    gainNode.gain.linearRampToValueAtTime(gain, ac.currentTime + startDelay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startDelay + duration);

    osc.start(ac.currentTime + startDelay);
    osc.stop(ac.currentTime + startDelay + duration + 0.01);
  } catch (e) {
    // Silently ignore — audio may be blocked
  }
}

/** White-noise burst for click feedback */
function playNoise({ gain = 0.05, duration = 0.04, startDelay = 0 }) {
  if (localStorage.getItem('brawl_sound_enabled') === 'false') return;
  try {
    const ac = getCtx();
    const bufSize = ac.sampleRate * duration;
    const buffer = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ac.createBufferSource();
    source.buffer = buffer;

    const gainNode = ac.createGain();
    gainNode.gain.setValueAtTime(gain, ac.currentTime + startDelay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startDelay + duration);

    source.connect(gainNode);
    gainNode.connect(ac.destination);
    source.start(ac.currentTime + startDelay);
  } catch (e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export const SoundFX = {
  /** Quick UI click — subtle tick */
  click() {
    playNoise({ gain: 0.06, duration: 0.03 });
    playTone({ type: 'sine', freq: 900, endFreq: 600, gain: 0.08, duration: 0.05 });
  },

  /** Correct answer — ascending sci-fi laser sweep */
  hit() {
    // Rising energy sweep
    playTone({ type: 'sine',    freq: 300,  endFreq: 900,  gain: 0.14, duration: 0.18 });
    playTone({ type: 'square',  freq: 600,  endFreq: 1200, gain: 0.06, duration: 0.12, startDelay: 0.05 });
    // Short bright ping at the end
    playTone({ type: 'sine',    freq: 1400, endFreq: 1200, gain: 0.10, duration: 0.10, startDelay: 0.18 });
  },

  /** Wrong answer — descending error buzz */
  miss() {
    playTone({ type: 'sawtooth', freq: 380, endFreq: 120, gain: 0.12, duration: 0.22 });
    playTone({ type: 'square',   freq: 200, endFreq: 80,  gain: 0.08, duration: 0.18, startDelay: 0.06 });
  },

  /** Compilation error — harsh glitch pop */
  error() {
    playNoise({ gain: 0.12, duration: 0.08 });
    playTone({ type: 'sawtooth', freq: 250, endFreq: 60, gain: 0.10, duration: 0.20, startDelay: 0.04 });
  },

  /** Timer danger (plays on each tick when ≤5s) — short warning beep */
  timerBeep() {
    playTone({ type: 'sine', freq: 880, endFreq: 860, gain: 0.09, duration: 0.07 });
  },

  /** Timeout — flat dull thud */
  timeout() {
    playTone({ type: 'sine',     freq: 160, endFreq: 80, gain: 0.14, duration: 0.30 });
    playNoise({ gain: 0.06, duration: 0.10, startDelay: 0.05 });
  },

  /** Critical hit — sharp crack + power surge */
  crit() {
    playNoise({ gain: 0.15, duration: 0.05 });
    playTone({ type: 'sine',   freq: 200,  endFreq: 1600, gain: 0.18, duration: 0.25 });
    playTone({ type: 'square', freq: 800,  endFreq: 1400, gain: 0.08, duration: 0.15, startDelay: 0.10 });
  },

  /** Combo x2 — double ping */
  combo2() {
    playTone({ type: 'sine', freq: 700,  gain: 0.10, duration: 0.08 });
    playTone({ type: 'sine', freq: 1050, gain: 0.10, duration: 0.08, startDelay: 0.09 });
  },

  /** Combo x3+ — triple ascending ping */
  combo3() {
    playTone({ type: 'sine', freq: 700,  gain: 0.12, duration: 0.08 });
    playTone({ type: 'sine', freq: 1050, gain: 0.12, duration: 0.08, startDelay: 0.09 });
    playTone({ type: 'sine', freq: 1400, gain: 0.12, duration: 0.10, startDelay: 0.18 });
  },

  /** Level Up — ascending triumphant arpeggio */
  levelUp() {
    const notes = [523, 659, 784, 1047]; // C5-E5-G5-C6
    notes.forEach((freq, i) => {
      playTone({ type: 'sine', freq, gain: 0.15, duration: 0.18, startDelay: i * 0.12 });
    });
  },

  /** Victory fanfare — epic ascending chord sequence */
  victory() {
    // Chord 1: low
    [261, 329, 392].forEach(f => playTone({ type: 'sine', freq: f, gain: 0.12, duration: 0.35 }));
    // Chord 2: rise
    [329, 415, 523].forEach(f => playTone({ type: 'sine', freq: f, gain: 0.14, duration: 0.35, startDelay: 0.30 }));
    // Chord 3: high resolution
    [392, 523, 659, 784].forEach(f => playTone({ type: 'sine', freq: f, gain: 0.15, duration: 0.55, startDelay: 0.60 }));
    // Sparkle top
    playTone({ type: 'sine', freq: 1046, gain: 0.10, duration: 0.20, startDelay: 0.90 });
    playTone({ type: 'sine', freq: 1318, gain: 0.08, duration: 0.30, startDelay: 1.05 });
  },

  /** Defeat — grim descending dirge */
  defeat() {
    [392, 329, 261, 196].forEach((f, i) => {
      playTone({ type: 'sine', freq: f, gain: 0.13, duration: 0.40, startDelay: i * 0.22 });
    });
    playTone({ type: 'sawtooth', freq: 130, endFreq: 65, gain: 0.08, duration: 0.60, startDelay: 0.80 });
  },
};
