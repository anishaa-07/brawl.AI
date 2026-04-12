import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Swords, Zap, ChevronLeft, Terminal, SkipForward,
  RefreshCw, Tag, Lightbulb, CheckCircle, XCircle, Clock,
} from 'lucide-react';
import {
  QUESTIONS, pickQuestion, checkAnswer, parseKeywords,
  TOTAL_ROUNDS, TIMER_DURATION, XP_PER_CORRECT,
} from './questionsData';
import UniversalBackBtn from '../components/UniversalBackBtn';
import './Battle.css';

// ── SUB-COMPONENT: Question Text with keyword highlighting ───────
const HighlightedQuestion = ({ raw }) => {
  const segments = parseKeywords(raw);
  return (
    <span>
      {segments.map((seg, i) =>
        seg.highlight
          ? <mark key={i} className="kw-highlight">{seg.text}</mark>
          : <span key={i}>{seg.text}</span>
      )}
    </span>
  );
};

// ── SUB-COMPONENT: Topic tag badge ──────────────────────────────
const TagBadge = ({ label }) => (
  <span className="topic-tag font-orbitron">
    <Tag size={9} /> {label}
  </span>
);

// ── MAIN BATTLE COMPONENT ────────────────────────────────────────
const Battle = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const difficulty   = location.state?.difficulty || 'Medium';
  const pool         = QUESTIONS[difficulty] || QUESTIONS.Medium;
  const roundDuration = TIMER_DURATION[difficulty] || 45;

  // If a question was pre-selected in the hub, use it as the first question
  const preSelected = location.state?.selectedQuestion || null;

  // ── State ───────────────────────────────────────────────────
  const [round,         setRound]         = useState(1);
  const [timeLeft,      setTimeLeft]      = useState(roundDuration);
  const [playerHp,      setPlayerHp]      = useState(100);
  const [aiHp,          setAiHp]          = useState(100);
  const [totalXp,       setTotalXp]       = useState(0);
  const [userInput,     setUserInput]      = useState('');
  const [isAttacking,   setIsAttacking]   = useState(false);
  const [feedback,      setFeedback]      = useState(null);
  const [phase,         setPhase]         = useState('battle');
  const [battleResult,  setBattleResult]  = useState('');
  const [usedIds,       setUsedIds]       = useState(() => preSelected ? [preSelected.id] : []);
  const [question,      setQuestion]      = useState(() => preSelected || pickQuestion(pool, []));
  const [showHint,      setShowHint]      = useState(false);
  const [showEntrance,  setShowEntrance]  = useState(true);
  const [wrongAttempts, setWrongAttempts] = useState(0); // track misses per round
  const [damageOverlay, setDamageOverlay] = useState(null); // { target, amount, text }
  const [laserEffect, setLaserEffect]   = useState(null); // 'player-to-ai' | 'ai-to-player'
  const inputRef = useRef(null);

  // Derived
  const timerPct    = (timeLeft / roundDuration) * 100;
  const timerDanger = timeLeft <= 10;
  const playerName  = user?.username?.toUpperCase() || 'PLAYERX';
  const diffColor   = { Easy: '#00ff73', Medium: '#a238ff', Hard: '#ff3c8d' }[difficulty] || '#a238ff';
  const diffLabel   = { Easy: 'BEGINNER', Medium: 'ADVANCED', Hard: 'ELITE' }[difficulty] || 'STANDARD';
  const xpPerHit    = XP_PER_CORRECT[difficulty] || 10;
  const isLastRound = round >= TOTAL_ROUNDS || aiHp <= 0 || playerHp <= 0;

  // ── Entrance Animation ──────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShowEntrance(false), 800);
    return () => clearTimeout(t);
  }, []);

  // ── Focus input on battle phase ─────────────────────────────
  useEffect(() => {
    if (phase === 'battle') setTimeout(() => inputRef.current?.focus(), 150);
  }, [phase]);

  // ── Timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'battle') return;
    if (timeLeft <= 0) { handleTimeOut(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, phase]); // eslint-disable-line

  // ── Submit Attack ───────────────────────────────────────────
  const handleAttack = useCallback(() => {
    if (isAttacking || phase !== 'battle' || !userInput.trim()) return;
    setIsAttacking(true);
    setShowHint(false);

    const isHit = checkAnswer(question, userInput);

    setTimeout(() => {
      if (isHit) {
        setLaserEffect('player-to-ai');
        const dmg = Math.floor(Math.random() * 21) + 20; // 20-40 dmg
        setAiHp(prev => Math.max(0, prev - dmg));
        setTotalXp(prev => prev + xpPerHit);
        setFeedback({ type: 'hit', xp: xpPerHit });
        setWrongAttempts(0);
        setDamageOverlay({ target: 'ai', amount: dmg, text: 'Attack Successful ⚡' });
      } else {
        setLaserEffect('ai-to-player');
        const dmg = Math.floor(Math.random() * 6) + 10; // 10-15 dmg
        setPlayerHp(prev => Math.max(0, prev - dmg));
        setWrongAttempts(prev => prev + 1);
        setFeedback({ type: 'miss', answer: question.answer[0] });
        setDamageOverlay({ target: 'player', amount: dmg, text: 'Compilation Failed ❌' });
      }
      setUserInput('');
      setIsAttacking(false);
      setPhase('result');
      
      // Clear laser after animation ends
      setTimeout(() => setLaserEffect(null), 800);
    }, 650);
  }, [isAttacking, phase, userInput, question, difficulty, wrongAttempts, xpPerHit]);

  const handleTimeOut = useCallback(() => {
    setPlayerHp(prev => Math.max(0, prev - 15));
    setFeedback({ type: 'timeout', answer: question.answer[0] });
    setWrongAttempts(0);
    setPhase('result');
  }, [question]);

  // ── Next Round ──────────────────────────────────────────────
  const handleNext = useCallback(() => {
    const newAiHp     = aiHp;
    const newPlayerHp = playerHp;
    const ending      = round >= TOTAL_ROUNDS || newAiHp <= 0 || newPlayerHp <= 0;

    if (ending) {
      let result;
      if      (newAiHp <= 0 && newPlayerHp > 0) result = 'VICTORY';
      else if (newPlayerHp <= 0)                 result = 'DEFEAT';
      else if (newAiHp < newPlayerHp)            result = 'VICTORY';
      else if (newPlayerHp < newAiHp)            result = 'DEFEAT';
      else                                        result = 'DRAW';
      setBattleResult(result);
      setPhase('end');
      return;
    }

    // Advance to next round
    const newUsed = [...usedIds, question.id];
    setUsedIds(newUsed);
    const next = pickQuestion(pool, newUsed);
    setQuestion(next);
    setRound(r => r + 1);
    setTimeLeft(roundDuration);
    setUserInput('');
    setFeedback(null);
    setWrongAttempts(0);
    setDamageOverlay(null);
    setShowHint(false);
    setIsAttacking(false);
    setPhase('battle');
  }, [round, aiHp, playerHp, usedIds, question.id, pool, roundDuration]);

  const handleRetry   = () => window.location.reload();
  const handleRetreatPrompt = () => {
    const backBtn = document.querySelector('.global-back-btn');
    if (backBtn) backBtn.click();
  };
  const handleRetreat = () => navigate('/lobby');

  // XP totals for end screen
  const maxXp    = TOTAL_ROUNDS * xpPerHit;
  const xpBonus  = battleResult === 'VICTORY'
    ? (difficulty === 'Easy' ? 150 : difficulty === 'Medium' ? 250 : 400)
    : 0;

  if (!question) {
    return (
      <div className="battle-screen">
        <div className="battle-bg">
          <div className="bg-grid"></div>
          <div className="bg-orb orb-1"></div>
          <div className="bg-orb orb-2"></div>
          <div className="bg-scanlines"></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff', position: 'relative', zIndex: 10 }}>
           <h2 className="font-orbitron" style={{ fontSize: '1.5rem', letterSpacing: '4px' }}>Loading battle...</h2>
           <p className="font-orbitron" style={{ color: '#aaa', marginTop: '10px', fontSize: '0.8rem', letterSpacing: '2px' }}>Initializing combat data.</p>
           <button className="retreat-btn font-orbitron" style={{ marginTop: '30px', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => navigate('/lobby')}>
             <ChevronLeft size={16} /> RETURN TO LOBBY
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`battle-screen ${showEntrance ? 'battle-enter' : ''} ${damageOverlay?.target === 'player' ? 'screen-shake' : ''}`}>

      <UniversalBackBtn 
        to={phase === 'end' ? '/lobby' : '/question-hub'} 
        warnTitle={phase !== 'end' ? "WARN: EXIT BATTLE?" : null}
        warnMessage={phase !== 'end' ? "Leaving battle will lose progress. Continue?" : null}
        confirmLabel="LEAVE BATTLE"
      />

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

      {/* ── BREADCRUMB NAVIGATION ── */}
      <nav className="battle-breadcrumbs font-orbitron">
        <span className="bc-link" onClick={handleRetreatPrompt}>Lobby</span>
        <span className="bc-divider">/</span>
        <span className="bc-link">Battle AI</span>
        <span className="bc-divider">/</span>
        <span className="bc-current">Round {round}</span>
      </nav>

      {/* ── HUD: TOP BAR ── */}
      <header className="battle-hud glass-panel">
        {/* Player */}
        <div className={`hud-fighter hud-player ${damageOverlay?.target === 'player' ? 'flash-red' : ''}`} style={{ position: 'relative' }}>
          {damageOverlay?.target === 'player' && (
            <div className="floating-dmg player-dmg font-orbitron">
              <span className="dmg-amount">-{damageOverlay.amount} HP</span>
              <span className="dmg-text">{damageOverlay.text}</span>
            </div>
          )}
          <div className="hud-name font-orbitron"><span className="hud-icon">⚡</span> {playerName}</div>
          <div className="hud-bar-track">
            <div className="hud-bar-fill player-fill" style={{ width: `${playerHp}%` }}></div>
            <div className="hud-bar-glow player-glow" style={{ width: `${playerHp}%` }}></div>
          </div>
          <div className="hud-hp-label font-orbitron">{playerHp}<span>%</span></div>
        </div>

        {/* Timer + XP */}
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
          <div className="xp-counter font-orbitron">
            <Zap size={11} /> {totalXp} XP
          </div>
        </div>

        {/* AI */}
        <div className={`hud-fighter hud-ai ${damageOverlay?.target === 'ai' ? 'flash-red' : ''}`} style={{ position: 'relative' }}>
          {damageOverlay?.target === 'ai' && (
            <div className="floating-dmg ai-dmg font-orbitron">
              <span className="dmg-amount">-{damageOverlay.amount} HP</span>
              <span className="dmg-text">{damageOverlay.text}</span>
            </div>
          )}
          <div className="hud-name font-orbitron" style={{ justifyContent: 'flex-end' }}>
            AI-CORE-X <span className="hud-icon">🤖</span>
          </div>
          <div className="hud-bar-track">
            <div className="hud-bar-fill ai-fill"  style={{ width: `${aiHp}%` }}></div>
            <div className="hud-bar-glow ai-glow"  style={{ width: `${aiHp}%` }}></div>
          </div>
          <div className="hud-hp-label font-orbitron" style={{ textAlign: 'right' }}>{aiHp}<span>%</span></div>
        </div>
      </header>

      {/* ── MAIN BATTLE ZONE ── */}
      <main className="battle-main">
        
        {/* LASER ANIMATION OVERLAY */}
        {laserEffect && <div className={`laser-blast ${laserEffect}`}></div>}

        <div className="battle-split">

          {/* ══════════════════════ LEFT: QUESTION PANEL ══════════════════════ */}
          <div className="question-panel glass-panel">
            {question ? (
              <>
                {/* Panel header */}
                <div className="qp-topbar font-orbitron">
                  <Terminal size={14} />
                  <span>NEURAL CHALLENGE — ROUND {round}</span>
                  <div className="q-tags">
                    {Array.isArray(question?.tags) && question.tags.map(t => <TagBadge key={t} label={t} />)}
                  </div>
                  <div className="card-dots">
                    <span style={{ background: '#ff5f56' }}></span>
                    <span style={{ background: '#ffbd2e' }}></span>
                    <span style={{ background: '#27c93f' }}></span>
                  </div>
                </div>

                {/* Question body */}
                <div className="qp-body">
                  {/* Title */}
                  <div className="q-title font-orbitron">{question.title || 'Unknown Challenge'}</div>

                  {/* Description */}
                  <div className="qp-section-label font-orbitron">PROBLEM</div>
                  <p className="q-statement">
                    <HighlightedQuestion raw={question.question || question.description || 'No description available.'} />
                  </p>

                  {/* Input / Output Format */}
                  {question.example && (
                    <div className="qp-io-grid">
                      <div className="qp-io-block">
                        <div className="qp-io-label font-orbitron">
                          <span className="qp-io-dot input-dot"></span>INPUT FORMAT
                        </div>
                        <pre className="qp-io-value">{question.example.input || '—'}</pre>
                      </div>
                      <div className="qp-io-block">
                        <div className="qp-io-label font-orbitron">
                          <span className="qp-io-dot output-dot"></span>EXPECTED OUTPUT
                        </div>
                        <pre className="qp-io-value output-val">{question.example.output || '—'}</pre>
                      </div>
                    </div>
                  )}

                  {/* Hint */}
                  {showHint && (
                    <div className="hint-bar font-orbitron" style={{ marginTop: '12px' }}>
                      <Lightbulb size={13} /> HINT: {question.hint || 'No hint available.'}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Fallback when no question */
              <div className="qp-no-question">
                <Terminal size={36} style={{ color: '#3d4a5c', marginBottom: '16px' }} />
                <p className="font-orbitron qp-no-q-text">No question selected.</p>
                <p className="qp-no-q-sub">Please choose a challenge from the Question Hub.</p>
              </div>
            )}
          </div>

          {/* ══════════════════════ RIGHT: EDITOR PANEL ══════════════════════ */}
          <div className="editor-panel">

            {/* ── CODE EDITOR ── */}
            {phase === 'battle' && (
              <div className="battle-action-zone code-mode" style={{ maxWidth: '100%' }}>
                <div className="code-editor-wrapper">
                  <div className="editor-header font-orbitron">
                    <div className="editor-tab active">solution.code</div>
                    <select className="lang-dropdown font-orbitron" defaultValue="javascript">
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <div className="editor-body">
                    <div className="editor-lines">
                      {Array.from({ length: Math.max(10, (userInput.match(/\n/g) || []).length + 1) }).map((_, i) => (
                        <div key={i} className="line-num font-orbitron">{i + 1}</div>
                      ))}
                    </div>
                    <textarea
                      ref={inputRef}
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          const target = e.target;
                          const { selectionStart, selectionEnd } = target;
                          setUserInput(userInput.substring(0, selectionStart) + '  ' + userInput.substring(selectionEnd));
                          setTimeout(() => { target.selectionStart = target.selectionEnd = selectionStart + 2; }, 0);
                        }
                      }}
                      className="code-textarea"
                      placeholder={"// Write your solution here...\n// Example:\nfunction solution(input) {\n  // your logic\n}"}
                      disabled={isAttacking}
                      spellCheck={false}
                    />
                  </div>
                </div>

                <div className="action-buttons code-actions">
                  <button
                    className="reset-btn font-orbitron"
                    onClick={() => setUserInput('')}
                    disabled={isAttacking}
                  >
                    <RefreshCw size={15} /> RESET
                  </button>

                  <button
                    className={`attack-btn font-orbitron ${isAttacking ? 'btn-loading' : ''}`}
                    onClick={handleAttack}
                    disabled={isAttacking || !userInput.trim()}
                    id="submit-attack-btn"
                  >
                    {isAttacking
                      ? <><Zap size={18} className="spin-icon" /> COMPILING...</>
                      : <><Terminal size={18} /> RUN &amp; ATTACK ⚡</>
                    }
                  </button>

                  <button
                    className={`hint-btn font-orbitron ${showHint ? 'hint-active' : ''}`}
                    onClick={() => setShowHint(v => !v)}
                    id="hint-btn"
                  >
                    <Lightbulb size={15} />
                    {showHint ? 'HIDE HINT' : 'HINT'}
                  </button>
                </div>
              </div>
            )}

            {/* ── RESULT FEEDBACK ── */}
            {phase === 'result' && feedback && (
              <div className={`result-feedback-card ${feedback.type} animate-fade-in`}>
                <div className="result-icon-big">
                  {feedback.type === 'hit'
                    ? <CheckCircle size={52} color="#00ff73" strokeWidth={1.5} />
                    : feedback.type === 'miss'
                    ? <XCircle    size={52} color="#ff3c8d" strokeWidth={1.5} />
                    : <Clock      size={52} color="#ffbe00" strokeWidth={1.5} />
                  }
                </div>
                <div className={`result-label font-orbitron ${feedback.type}`}>
                  {feedback.type === 'hit' ? 'Attack Successful ⚡' : feedback.type === 'miss' ? 'Compilation Failed ❌' : 'Timeout ❌'}
                </div>
                {feedback.type === 'hit' ? (
                  <div className="xp-pop font-orbitron">+{feedback.xp} XP EARNED <Zap size={14} /></div>
                ) : (
                  <p className="result-try font-orbitron">Check your logic and try again.</p>
                )}
                {feedback.type !== 'hit' && (
                  <div className="answer-reveal-box font-orbitron">
                    <span className="ar-label">CORRECT ANSWER</span>
                    <span className="ar-value">{feedback.answer}</span>
                  </div>
                )}
                <button className="next-btn font-orbitron" onClick={handleNext} id="next-round-btn">
                  {isLastRound
                    ? <><SkipForward size={16} /> END BATTLE</>
                    : <><SkipForward size={16} /> NEXT ROUND</>
                  }
                </button>
              </div>
            )}

          </div>{/* end editor-panel */}
        </div>{/* end battle-split */}
      </main>



      {/* ── FOOTER Quick Navigation ── */}
      <footer className="battle-footer">
        <button className="retreat-btn font-orbitron" onClick={handleRetreatPrompt} id="retreat-btn">
          <ChevronLeft size={14} /> EXIT BATTLE
        </button>
        <div className="footer-sparks">
          {[...Array(5)].map((_, i) => (
            <div className="spark" key={i} style={{ '--d': `${i * 0.4}s` }}></div>
          ))}
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

            {/* Stats grid */}
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
                <span className="stat-label font-orbitron">CODE XP</span>
                <span className="stat-val font-orbitron" style={{ color: '#a238ff' }}>{totalXp}</span>
              </div>
            </div>

            {/* XP reward */}
            <div className="xp-reward font-orbitron">
              <Zap size={16} />
              CODE XP: {totalXp}
              {xpBonus > 0 && <span className="bonus-pill">+{xpBonus} VICTORY BONUS</span>}
            </div>

            <div className="end-actions">
              <button className="end-btn primary font-orbitron" onClick={handleRetry} id="retry-btn">
                <RefreshCw size={14} /> RETRY
              </button>
              <button className="end-btn secondary font-orbitron" onClick={handleRetreat} id="lobby-btn">
                <ChevronLeft size={14} /> LOBBY
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Battle;
