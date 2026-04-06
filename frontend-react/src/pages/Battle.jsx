import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Swords, Zap, Timer, ChevronLeft, Bot, Terminal, SkipForward, RefreshCw } from 'lucide-react';
import './Battle.css';

// ── CHALLENGE POOL ──────────────────────────────────────────────
const CHALLENGES = {
  Easy: [
    { task: 'Reverse the string', input: '"hello"', answer: 'OLLEH', hint: 'Read it backwards' },
    { task: 'What is 8 × 7?', input: 'Multiply 8 and 7', answer: '56', hint: 'Basic arithmetic' },
    { task: 'Reverse the string', input: '"cyber"', answer: 'REBYC', hint: 'Read it backwards' },
    { task: 'What is 15 + 27?', input: 'Add 15 and 27', answer: '42', hint: 'Basic addition' },
    { task: 'Uppercase this word', input: '"ghost"', answer: 'GHOST', hint: 'All caps' },
  ],
  Medium: [
    { task: 'FizzBuzz for 15', input: 'Is 15 divisible by 3 and 5?', answer: 'FIZZBUZZ', hint: 'Divisible by both → FizzBuzz' },
    { task: 'First + Last char of string', input: '"BRAWL"', answer: 'BL', hint: 'Index 0 and last index' },
    { task: 'Count vowels in the word', input: '"OPERATOR"', answer: '4', hint: 'O, E, A, O' },
    { task: 'What is 2^10?', input: 'Power of 2 to 10', answer: '1024', hint: 'Binary max for 10 bits' },
    { task: 'Reverse + Uppercase', input: '"node"', answer: 'EDON', hint: 'Reverse then uppercase' },
  ],
  Hard: [
    { task: 'Sum of digits', input: 'Number: 9876', answer: '30', hint: '9+8+7+6' },
    { task: 'Palindrome check', input: '"RACECAR"', answer: 'TRUE', hint: 'Same forwards and backwards' },
    { task: 'Binary to Decimal', input: '0b1010', answer: '10', hint: 'Powers of 2: 8+2' },
    { task: 'Fibonacci index 8', input: 'F(8) in sequence 0,1,1,2...', answer: '21', hint: 'Count carefully' },
    { task: 'Rotate array left by 1', input: '[3,7,1,9]', answer: '[7,1,9,3]', hint: 'First element goes to end' },
  ],
};

const TOTAL_ROUNDS = 3;
const TIMER_DURATION = { Easy: 60, Medium: 45, Hard: 30 };

// ── HELPER: pick a random challenge, avoid repeats ──────────────
function pickChallenge(pool, usedIndices) {
  const available = pool.map((_, i) => i).filter(i => !usedIndices.includes(i));
  if (available.length === 0) return { idx: 0, challenge: pool[0] };
  const idx = available[Math.floor(Math.random() * available.length)];
  return { idx, challenge: pool[idx] };
}

// ── COMPONENT ───────────────────────────────────────────────────
const Battle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = location.state?.difficulty || 'Medium';
  const pool = CHALLENGES[difficulty] || CHALLENGES.Medium;
  const roundDuration = TIMER_DURATION[difficulty] || 45;

  // ── State ──
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [playerHp, setPlayerHp] = useState(100);
  const [aiHp, setAiHp] = useState(100);
  const [userInput, setUserInput] = useState('');
  const [isAttacking, setIsAttacking] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'hit'|'miss'|'timeout', msg }
  const [phase, setPhase] = useState('battle'); // 'battle' | 'result' | 'end'
  const [battleResult, setBattleResult] = useState(''); // 'VICTORY' | 'DEFEAT' | 'DRAW'
  const [roundResult, setRoundResult] = useState(null); // null | 'hit' | 'miss' | 'timeout'
  const [usedIndices, setUsedIndices] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(() => {
    const { idx, challenge } = pickChallenge(pool, []);
    return { idx, ...challenge };
  });
  const [showEntrance, setShowEntrance] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef(null);

  // ── Entrance Animation ──
  useEffect(() => {
    const t = setTimeout(() => setShowEntrance(false), 800);
    return () => clearTimeout(t);
  }, []);

  // ── Timer ──
  useEffect(() => {
    if (phase !== 'battle') return;
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, phase]);

  // Focus input when battle phase activates
  useEffect(() => {
    if (phase === 'battle') {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [phase]);

  // ── Attack Handler ──
  const handleAttack = useCallback(() => {
    if (isAttacking || phase !== 'battle') return;
    const answer = userInput.trim().toUpperCase();
    const correct = currentChallenge.answer.toUpperCase();
    const isHit = answer === correct;
    setIsAttacking(true);
    setShowHint(false);

    setTimeout(() => {
      if (isHit) {
        const dmg = difficulty === 'Easy' ? 34 : difficulty === 'Medium' ? 38 : 42;
        setAiHp(prev => Math.max(0, prev - dmg));
        setFeedback({ type: 'hit', msg: 'CRITICAL HIT! ⚡ AI CORE DAMAGED.' });
        setRoundResult('hit');
      } else {
        const dmg = difficulty === 'Easy' ? 18 : difficulty === 'Medium' ? 22 : 28;
        setPlayerHp(prev => Math.max(0, prev - dmg));
        setFeedback({ type: 'miss', msg: 'MISS! ❌ AI COUNTER-ATTACK!' });
        setRoundResult('miss');
      }
      setIsAttacking(false);
      setPhase('result');
    }, 700);
  }, [isAttacking, phase, userInput, currentChallenge, difficulty]);

  const handleTimeOut = useCallback(() => {
    const dmg = 15;
    setPlayerHp(prev => Math.max(0, prev - dmg));
    setFeedback({ type: 'timeout', msg: 'TIME EXPIRED! ⏱ AI GAINS ADVANTAGE.' });
    setRoundResult('timeout');
    setPhase('result');
  }, []);

  // ── After Result: Next Round or End ──
  const handleNext = useCallback(() => {
    const newAiHp = aiHp;
    const newPlayerHp = playerHp;

    if (round >= TOTAL_ROUNDS || newAiHp <= 0 || newPlayerHp <= 0) {
      // End battle
      let result;
      if (newAiHp <= 0 && newPlayerHp > 0) result = 'VICTORY';
      else if (newPlayerHp <= 0) result = 'DEFEAT';
      else if (newAiHp < newPlayerHp) result = 'VICTORY';
      else if (newPlayerHp < newAiHp) result = 'DEFEAT';
      else result = 'DRAW';
      setBattleResult(result);
      setPhase('end');
      return;
    }

    // Next round
    const newUsed = [...usedIndices, currentChallenge.idx];
    setUsedIndices(newUsed);
    const { idx, challenge } = pickChallenge(pool, newUsed);
    setCurrentChallenge({ idx, ...challenge });
    setRound(r => r + 1);
    setTimeLeft(roundDuration);
    setUserInput('');
    setFeedback(null);
    setRoundResult(null);
    setIsAttacking(false);
    setShowHint(false);
    setPhase('battle');
  }, [round, aiHp, playerHp, usedIndices, currentChallenge, pool, roundDuration]);

  const handleRetry = () => window.location.reload();
  const handleRetreat = () => navigate('/lobby');

  const timerPct = (timeLeft / roundDuration) * 100;
  const timerDanger = timeLeft <= 10;
  const playerName = user?.username?.toUpperCase() || 'PLAYERX';

  // Difficulty color
  const diffColor = { Easy: '#00ff73', Medium: '#a238ff', Hard: '#ff3c8d' }[difficulty] || '#a238ff';
  const diffLabel = { Easy: 'BEGINNER', Medium: 'ADVANCED', Hard: 'ELITE' }[difficulty] || 'STANDARD';

  return (
    <div className={`battle-screen ${showEntrance ? 'battle-enter' : ''} ${isAttacking ? 'screen-shake' : ''}`}>
      {/* ── ANIMATED BACKGROUND ── */}
      <div className="battle-bg">
        <div className="bg-grid"></div>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-scanlines"></div>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`bg-particle bp-${(i % 4) + 1}`} style={{ '--i': i }}></div>
        ))}
      </div>

      {/* ── HUD: TOP BAR ── */}
      <header className="battle-hud glass-panel">
        {/* Player Side */}
        <div className="hud-fighter hud-player">
          <div className="hud-name font-orbitron">
            <span className="hud-icon">⚡</span> {playerName}
          </div>
          <div className="hud-bar-track">
            <div className="hud-bar-fill player-fill" style={{ width: `${playerHp}%` }}></div>
            <div className="hud-bar-glow player-glow" style={{ width: `${playerHp}%` }}></div>
          </div>
          <div className="hud-hp-label font-orbitron">{playerHp}<span>%</span></div>
        </div>

        {/* Center Info */}
        <div className="hud-center">
          <div className={`timer-circle ${timerDanger ? 'timer-danger' : ''}`}>
            <svg viewBox="0 0 56 56" className="timer-svg">
              <circle cx="28" cy="28" r="24" className="timer-track" />
              <circle
                cx="28" cy="28" r="24"
                className="timer-progress"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - timerPct / 100)}`}
                style={{ stroke: timerDanger ? '#ff3c8d' : diffColor }}
              />
            </svg>
            <div className="timer-text font-orbitron">{timeLeft}</div>
          </div>
          <div className="hud-round font-orbitron">RD {round}/{TOTAL_ROUNDS}</div>
          <div className="diff-badge font-orbitron" style={{ color: diffColor }}>{diffLabel}</div>
        </div>

        {/* AI Side */}
        <div className="hud-fighter hud-ai">
          <div className="hud-name font-orbitron" style={{ justifyContent: 'flex-end' }}>
            AI-CORE-X <span className="hud-icon">🤖</span>
          </div>
          <div className="hud-bar-track">
            <div className="hud-bar-fill ai-fill" style={{ width: `${aiHp}%` }}></div>
            <div className="hud-bar-glow ai-glow" style={{ width: `${aiHp}%` }}></div>
          </div>
          <div className="hud-hp-label font-orbitron" style={{ textAlign: 'right' }}>{aiHp}<span>%</span></div>
        </div>
      </header>

      {/* ── MAIN BATTLE ZONE ── */}
      <main className="battle-main">

        {/* ── CHALLENGE TERMINAL ── */}
        <div className="challenge-card glass-panel">
          <div className="card-topbar font-orbitron">
            <Terminal size={16} />
            <span>NEURAL CHALLENGE — ROUND {round}</span>
            <div className="card-dots">
              <span style={{ background: '#ff5f56' }}></span>
              <span style={{ background: '#ffbd2e' }}></span>
              <span style={{ background: '#27c93f' }}></span>
            </div>
          </div>

          <div className="card-body">
            <p className="terminal-line dim">&gt; ACCESSING NEURAL DATABASE...</p>
            <p className="terminal-line dim">&gt; CHALLENGE LOADED: <span className="text-bright">{currentChallenge.task.toUpperCase()}</span></p>

            <div className="challenge-input-box font-orbitron">
              {currentChallenge.input}
            </div>

            <p className="terminal-line prompt">&gt; ENTER YOUR SOLUTION:</p>
          </div>

          {showHint && (
            <div className="hint-bar font-orbitron">
              💡 HINT: {currentChallenge.hint}
            </div>
          )}
        </div>

        {/* ── ACTION AREA (battle phase) ── */}
        {phase === 'battle' && (
          <div className="battle-action-zone">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAttack()}
                placeholder="TYPE YOUR ANSWER..."
                className="cyber-input font-orbitron"
                disabled={isAttacking}
                autoComplete="off"
                spellCheck={false}
              />
              <div className="input-border-glow"></div>
            </div>

            <div className="action-buttons">
              <button
                className={`attack-btn font-orbitron ${isAttacking ? 'btn-loading' : ''}`}
                onClick={handleAttack}
                disabled={isAttacking || !userInput.trim()}
                id="submit-attack-btn"
              >
                {isAttacking
                  ? <><Zap size={20} className="spin-icon" /> CALCULATING...</>
                  : <><Swords size={20} /> SUBMIT ATTACK ⚡</>
                }
              </button>

              <button
                className="hint-btn font-orbitron"
                onClick={() => setShowHint(v => !v)}
                id="hint-btn"
              >
                {showHint ? '🙈 HIDE HINT' : '💡 HINT'}
              </button>
            </div>
          </div>
        )}

        {/* ── RESULT FEEDBACK (result phase) ── */}
        {phase === 'result' && feedback && (
          <div className={`result-feedback-card ${feedback.type} animate-fade-in`}>
            <div className={`result-icon-big ${feedback.type}`}>
              {feedback.type === 'hit' ? '💥' : feedback.type === 'miss' ? '❌' : '⏱'}
            </div>
            <div className={`result-label font-orbitron ${feedback.type}`}>
              {feedback.type === 'hit' ? 'HIT!' : feedback.type === 'miss' ? 'MISS!' : 'TIMEOUT!'}
            </div>
            <p className="result-msg font-orbitron">{feedback.msg}</p>

            {feedback.type !== 'hit' && (
              <p className="answer-reveal font-orbitron">
                CORRECT ANSWER: <span>{currentChallenge.answer}</span>
              </p>
            )}

            <button
              className="next-btn font-orbitron"
              onClick={handleNext}
              id="next-round-btn"
            >
              {round >= TOTAL_ROUNDS || aiHp <= 0 || playerHp <= 0
                ? <><SkipForward size={18} /> END BATTLE</>
                : <><SkipForward size={18} /> NEXT ROUND</>
              }
            </button>
          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="battle-footer">
        <button className="retreat-btn font-orbitron" onClick={handleRetreat} id="retreat-btn">
          <ChevronLeft size={16} /> RETREAT
        </button>
        <div className="footer-sparks">
          {[...Array(5)].map((_, i) => <div className="spark" key={i} style={{ '--d': `${i * 0.4}s` }}></div>)}
        </div>
      </footer>

      {/* ── BATTLE END OVERLAY ── */}
      {phase === 'end' && (
        <div className="end-overlay">
          <div className={`end-card glass-panel animate-fade-in ${battleResult.toLowerCase()}`}>
            <div className="end-icon">
              {battleResult === 'VICTORY' ? '🏆' : battleResult === 'DEFEAT' ? '💀' : '⚔️'}
            </div>
            <h1 className={`end-title font-orbitron ${battleResult.toLowerCase()}`}>{battleResult}</h1>
            <p className="end-subtitle font-orbitron">
              {battleResult === 'VICTORY'
                ? 'AI CORE NEUTRALIZED. MISSION COMPLETE.'
                : battleResult === 'DEFEAT'
                ? 'SYSTEM OVERRIDE. YOU WERE OUTMATCHED.'
                : 'STALEMATE. THE WAR CONTINUES.'}
            </p>
            <div className="end-stats glass-panel">
              <div className="stat-item">
                <span className="stat-label font-orbitron">DIFFICULTY</span>
                <span className="stat-val font-orbitron" style={{ color: diffColor }}>{difficulty.toUpperCase()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label font-orbitron">ROUNDS</span>
                <span className="stat-val font-orbitron">{TOTAL_ROUNDS}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label font-orbitron">YOUR HP</span>
                <span className="stat-val font-orbitron" style={{ color: playerHp > 50 ? '#00ff73' : '#ff3c8d' }}>{playerHp}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label font-orbitron">AI HP</span>
                <span className="stat-val font-orbitron" style={{ color: aiHp > 50 ? '#ff3c8d' : '#00ff73' }}>{aiHp}%</span>
              </div>
            </div>
            {battleResult === 'VICTORY' && (
              <div className="xp-reward font-orbitron">
                <Zap size={18} /> +{difficulty === 'Easy' ? 150 : difficulty === 'Medium' ? 250 : 400} XP EARNED
              </div>
            )}
            <div className="end-actions">
              <button className="end-btn primary font-orbitron" onClick={handleRetry} id="retry-btn">
                <RefreshCw size={16} /> RETRY BATTLE
              </button>
              <button className="end-btn secondary font-orbitron" onClick={handleRetreat} id="lobby-btn">
                <ChevronLeft size={16} /> LOBBY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle;
