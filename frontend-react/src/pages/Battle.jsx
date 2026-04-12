import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Swords, Zap, ChevronLeft, Terminal, SkipForward,
  RefreshCw, Tag, Lightbulb, CheckCircle, XCircle, Clock,
} from 'lucide-react';
import {
  QUESTIONS, pickQuestion, executeCode, parseKeywords,
  TOTAL_ROUNDS, TIMER_DURATION, XP_PER_CORRECT,
} from './questionsData';
import UniversalBackBtn from '../components/UniversalBackBtn';
import { SoundFX } from '../utils/sounds';
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

// ── SUB-COMPONENT: Typewriter Effect ─────────────────────────────
const Typewriter = ({ text }) => {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    setDisplay('');
    let i = 0;
    if (!text) return;
    const t = setInterval(() => {
      setDisplay(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [text]);

  return <span>{display}</span>;
};

// ── MAIN BATTLE COMPONENT ────────────────────────────────────────
const Battle = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const preSelected = location.state?.selectedQuestion || null;
  const userLevel = user?.level || 1;
  const progressiveDiff = userLevel >= 7 ? 'Hard' : userLevel >= 4 ? 'Medium' : 'Easy';
  const difficulty   = preSelected ? (location.state?.difficulty || progressiveDiff) : progressiveDiff;

  const pool         = QUESTIONS[difficulty] || QUESTIONS.Medium;
  const roundDuration = TIMER_DURATION[difficulty] || 45;

  // ── AI Personality Specs ────────────────────────────────────
  const aiPersonality = {
    Easy: {
      wait: "I am ready when you are.",
      hit: "Ouch. Logic error.",
      crit: "System overload... please stop.",
      wrong: "Incorrect syntax.",
      timeout: "Time is up. Try faster next time."
    },
    Medium: {
      wait: "Awaiting logic input...",
      hit: "System breached...",
      crit: "Critical damage... recalibrating...",
      wrong: "Weak logic detected.",
      timeout: "Timeout. Processing superior."
    },
    Hard: {
      wait: "Hurry up and fail.",
      hit: "Insignificant damage.",
      crit: "WARNING. Core destabilizing.",
      wrong: "Pathetic human intellect.",
      timeout: "Too slow. You are obsolete."
    }
  }[difficulty] || aiPersonality.Medium;

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
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [damageOverlay, setDamageOverlay] = useState(null);
  const [laserEffect,   setLaserEffect]   = useState(null);
  const [levelUpMsg,    setLevelUpMsg]    = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [aiMessage,     setAiMessage]     = useState(aiPersonality.wait);
  const [comboStreak,   setComboStreak]   = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [creditsAwarded, setCreditsAwarded] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(2);
  const [hintUsedThisRound, setHintUsedThisRound] = useState(false);
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

  // ── Achievement Unlocker ────────────────────────────────────
  const checkAndUnlockBadge = useCallback((id, name, icon, desc) => {
    if (!updateProfile || !user) return;
    const badges = user.badges || [];
    if (!badges.some(b => b.id === id)) {
      const newBadges = [...badges, { id, name, icon, desc, unlockedAt: Date.now() }];
      updateProfile({ badges: newBadges });
      setUnlockedBadge({ name, icon, desc });
      SoundFX.levelUp(); // re-use level-up sound for badge unlock
      setTimeout(() => setUnlockedBadge(null), 4000); // hide after 4s
    }
  }, [updateProfile, user]);

  // ── Hint Toggle ─────────────────────────────────────────────
  const toggleHint = useCallback(() => {
    if (showHint) {
      setShowHint(false);
    } else {
      if (hintUsedThisRound) {
        setShowHint(true);
      } else if (hintsRemaining > 0) {
        SoundFX.click();
        setHintsRemaining(prev => prev - 1);
        setHintUsedThisRound(true);
        setShowHint(true);
      }
    }
  }, [showHint, hintUsedThisRound, hintsRemaining]);

  // ── Submit Attack ───────────────────────────────────────────
  const handleAttack = useCallback(() => {
    if (isAttacking || phase !== 'battle' || !userInput.trim()) return;
    setIsAttacking(true);
    setShowHint(false);

    // Dynamic XP if hint used
    const currentXpReward = hintUsedThisRound ? Math.floor(xpPerHit / 2) : xpPerHit;

    // Execute user code — returns { isCorrect, userOutput, expectedOutput, error, isError }
    const result = executeCode(question, userInput);

    if (updateProfile && user) {
      updateProfile({ totalAttempts: (user.totalAttempts || 0) + 1 });
    }

    setTimeout(() => {
      if (result.isCorrect) {
        // ── HIT ────────────────────────────────────────────────
        const newCombo = comboStreak + 1;
        setComboStreak(newCombo);
        setSessionCorrectCount(prev => prev + 1);

        setLaserEffect('player-to-ai');

        let minDmg = 10, maxDmg = 20;
        if (difficulty === 'Medium') { minDmg = 20; maxDmg = 35; }
        else if (difficulty === 'Hard') { minDmg = 35; maxDmg = 50; }
        let dmg = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
        const isCrit = Math.random() < 0.10;
        if (isCrit) dmg *= 2;
        // Combo multiplier: x1.5 at streak 3+
        if (newCombo >= 3) dmg = Math.floor(dmg * 1.5);

        const newHp = Math.max(0, aiHp - dmg);
        setAiHp(newHp);
        setTotalXp(prev => prev + currentXpReward);
        setFeedback({ type: 'hit', xp: currentXpReward, userOutput: result.userOutput, combo: newCombo });
        setWrongAttempts(0);
        const comboText = isCrit ? 'CRITICAL STRIKE! 🔥' : newCombo >= 3 ? `COMBO x${newCombo} 🔥` : 'Attack Successful ⚡';
        setDamageOverlay({ target: 'ai', amount: dmg, text: comboText });

        // Sounds
        if (isCrit) SoundFX.crit();
        else if (newCombo >= 3) { SoundFX.combo3(); SoundFX.hit(); }
        else if (newCombo === 2) { SoundFX.combo2(); SoundFX.hit(); }
        else SoundFX.hit();

        if (newHp <= 30 && newHp > 0) setAiMessage(aiPersonality.crit);
        else if (newHp <= 0) setAiMessage('System offline...');
        else setAiMessage(aiPersonality.hit);

        // ── ACHIEVEMENTS & PROGRESSION ──
        if (updateProfile && user) {
          // Track Total Correct
          const newTotalCorrect = (user.totalCorrect || 0) + 1;
          const userUpdates = { totalCorrect: newTotalCorrect };

          // Level-up calculation
          const newXp = (user.xp || 0) + currentXpReward;
          const newLevel = Math.floor(newXp / 100) + 1;
          if (newLevel > (user.level || 1)) {
            setLevelUpMsg(true);
            setTimeout(() => setLevelUpMsg(false), 2500);
            SoundFX.levelUp();
            userUpdates.level = newLevel;
          }
          userUpdates.xp = newXp;

          if (newCombo > (user.highestCombo || 0)) {
            userUpdates.highestCombo = newCombo;
          }

          updateProfile(userUpdates);

          // Triggers: Code Ninja (5 total correct)
          if (newTotalCorrect === 5) {
            checkAndUnlockBadge('code_ninja', 'Code Ninja', '🥷', 'Got 5 correct answers overall.');
          }
          // Triggers: Unstoppable (3x combo)
          if (newCombo === 3) {
            checkAndUnlockBadge('unstoppable', 'Unstoppable', '🔥', 'Hit a 3x combo streak.');
          }
        }

        setUserInput('');
        setIsAttacking(false);
        setPhase('result');
        setTimeout(() => setLaserEffect(null), 800);

        // ── AUTO-ADVANCE after 1.5 s on correct ────────────────
        setTimeout(() => handleNextRef.current?.(), 1500);

      } else if (result.isError) {
        // ── COMPILATION ERROR ──────────────────────────────────
        setLaserEffect('ai-to-player');
        const dmg = 5;
        setPlayerHp(prev => Math.max(0, prev - dmg));
        setWrongAttempts(prev => prev + 1);
        setComboStreak(0); // reset combo
        setFeedback({ type: 'error', error: result.error, expectedOutput: result.expectedOutput });
        setDamageOverlay({ target: 'player', amount: dmg, text: 'Compilation Failed ❌' });
        setAiMessage('Logic error detected. Pathetic.');
        SoundFX.error();
        setUserInput('');
        setIsAttacking(false);
        setPhase('result');
        setTimeout(() => setLaserEffect(null), 800);

      } else {
        // ── WRONG ANSWER ───────────────────────────────────────
        setLaserEffect('ai-to-player');
        let minBase = 5, maxBase = 10;
        if (difficulty === 'Medium') { minBase = 10; maxBase = 20; }
        else if (difficulty === 'Hard') { minBase = 15; maxBase = 25; }
        let dmg = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;
        const isCrit = Math.random() < 0.10;
        if (isCrit) dmg *= 2;

        setPlayerHp(prev => Math.max(0, prev - dmg));
        setWrongAttempts(prev => prev + 1);
        setComboStreak(0); // reset combo
        setFeedback({ type: 'miss', expectedOutput: result.expectedOutput, userOutput: result.userOutput });
        setDamageOverlay({ target: 'player', amount: dmg, text: isCrit ? 'SYSTEM BREACH 💀' : 'Wrong Answer ❌' });
        setAiMessage(aiPersonality.wrong);
        SoundFX.miss();
        setUserInput('');
        setIsAttacking(false);
        setPhase('result');
        setTimeout(() => setLaserEffect(null), 800);
      }
    }, 650);
  }, [isAttacking, phase, userInput, question, difficulty, aiHp, xpPerHit, hintUsedThisRound]); // eslint-disable-line

  // Stable ref so the auto-advance timer can call handleNext without stale closure
  const handleNextRef = useRef(null);

  const handleTimeOut = useCallback(() => {
    setPlayerHp(prev => Math.max(0, prev - 15));
    setFeedback({ type: 'timeout', expectedOutput: question.answer[0] });
    setWrongAttempts(0);
    setComboStreak(0); // reset combo on timeout
    setAiMessage(aiPersonality.timeout);
    setDamageOverlay({ target: 'player', amount: 15, text: 'Time Up ⏱' });
    setLaserEffect('ai-to-player');
    SoundFX.timeout();
    setPhase('result');
    setTimeout(() => setLaserEffect(null), 800);
    setTimeout(() => handleNextRef.current?.(), 2500);
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
      SoundFX[result === 'VICTORY' ? 'victory' : result === 'DEFEAT' ? 'defeat' : 'miss']();

      if (updateProfile && user) {
        const statsUpdate = { totalBattles: (user.totalBattles || 0) + 1 };
        
        let earnedCredits = 0;
        if (result === 'VICTORY') {
          statsUpdate.wins = (user.wins || 0) + 1;
          // Calculate credits: base 100 + difficulty bonus
          earnedCredits = 100 + (difficulty === 'Hard' ? 100 : difficulty === 'Medium' ? 50 : 0);
          statsUpdate.credits = (user.credits || 0) + earnedCredits;
          setCreditsAwarded(earnedCredits);
        }
        
        if (result === 'DEFEAT') statsUpdate.losses = (user.losses || 0) + 1;
        
        updateProfile(statsUpdate);
      }

      // Trigger: First Blood (win 1 game)
      if (result === 'VICTORY') {
        checkAndUnlockBadge('first_blood', 'First Blood', '🩸', 'Won your first battle against AI Core.');
      }

      return;
    }

    // Advance to next round
    const newUsed = [...usedIds, question?.id].filter(Boolean);
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
    setHintUsedThisRound(false);
    setIsAttacking(false);
    setAiMessage(aiPersonality.wait);
    setPhase('battle');
  }, [round, aiHp, playerHp, usedIds, question.id, pool, roundDuration, aiPersonality]);

  // Keep ref in sync for auto-advance
  useEffect(() => { handleNextRef.current = handleNext; }, [handleNext]);

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

          {/* ── COMBO BADGE ── */}
          {comboStreak >= 2 && (
            <div className={`combo-badge font-orbitron ${comboStreak >= 3 ? 'combo-hot' : ''}`}>
              {comboStreak >= 3
                ? `COMBO x${comboStreak} 🔥`
                : `COMBO x2 🔥`}
            </div>
          )}
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
          
          {/* AI CHAT BUBBLE */}
          <div className="ai-chat-bubble font-orbitron">
            <Typewriter text={aiMessage} />
          </div>
        </div>
      </header>

      {/* ── MAIN BATTLE ZONE ── */}
      <main className="battle-main">
        
        {/* ACHIEVEMENT UNLOCK OVERLAY */}
        {unlockedBadge && (
          <div className="achievement-popup show font-orbitron">
            <div className="ach-icon">{unlockedBadge.icon}</div>
            <div className="ach-info">
              <div className="ach-title">ACHIEVEMENT UNLOCKED</div>
              <div className="ach-name">{unlockedBadge.name}</div>
            </div>
          </div>
        )}

        {/* LEVEL UP ANIMATION OVERLAY */}
        {levelUpMsg && (
          <div className="level-up-pulse-overlay font-orbitron">
            <div className="level-up-text">LEVEL UP 🚀</div>
          </div>
        )}

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
                    <div className="hint-bar font-orbitron" style={{ marginTop: '12px', border: '1px solid rgba(255, 189, 46, 0.4)', background: 'rgba(255, 189, 46, 0.1)', color: '#ffbd2e' }}>
                      <Lightbulb size={13} /> {question.hint || 'No hint available.'}
                      <span style={{ display: 'block', fontSize: '0.6rem', color: '#ff3c8d', marginTop: '4px' }}>⚠️ XP halved for this round</span>
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
                    onClick={() => { SoundFX.click(); setUserInput(''); }}
                    disabled={isAttacking}
                  >
                    <RefreshCw size={15} /> RESET
                  </button>

                  <button
                    className={`attack-btn font-orbitron ${isAttacking ? 'btn-loading' : ''}`}
                    onClick={() => { SoundFX.click(); handleAttack(); }}
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
                    onClick={toggleHint}
                    disabled={isAttacking || (!hintUsedThisRound && hintsRemaining === 0 && !showHint)}
                    id="hint-btn"
                  >
                    <Lightbulb size={15} />
                    {showHint ? 'HIDE HINT' : `HINT (${hintsRemaining} LEFT)`}
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
                    : feedback.type === 'error'
                    ? <XCircle    size={52} color="#ffbe00" strokeWidth={1.5} />
                    : <Clock      size={52} color="#ffbe00" strokeWidth={1.5} />
                  }
                </div>

                {/* ── STATUS LABEL ── */}
                <div className={`result-label font-orbitron ${feedback.type}`}>
                  {feedback.type === 'hit'     ? 'Attack Successful ⚡'
                  : feedback.type === 'miss'   ? 'Wrong Answer ❌'
                  : feedback.type === 'error'  ? 'Compilation Failed ❌'
                  :                              'Time Up ⏱'}
                </div>

                {/* ── HIT: XP + output ── */}
                {feedback.type === 'hit' && (
                  <>
                    <div className="xp-pop font-orbitron">+{feedback.xp} XP EARNED <Zap size={14} /></div>
                    <div className="output-compare-box">
                      <div className="oc-row correct">
                        <span className="oc-label">YOUR OUTPUT</span>
                        <span className="oc-value correct">{feedback.userOutput ?? '—'}</span>
                      </div>
                    </div>
                    <p className="result-try font-orbitron" style={{ color: '#888', fontSize: '0.6rem' }}>
                      Loading next question...
                    </p>
                  </>
                )}

                {/* ── WRONG ANSWER: show diff ── */}
                {feedback.type === 'miss' && (
                  <>
                    <p className="result-try font-orbitron">Check your logic and try again.</p>
                    <div className="output-compare-box">
                      <div className="oc-row wrong">
                        <span className="oc-label">YOUR OUTPUT</span>
                        <span className="oc-value wrong">{feedback.userOutput ?? '(no output)'}</span>
                      </div>
                      <div className="oc-row correct">
                        <span className="oc-label">EXPECTED</span>
                        <span className="oc-value correct">{feedback.expectedOutput}</span>
                      </div>
                    </div>
                    <button className="next-btn font-orbitron" onClick={handleNext} id="next-round-btn">
                      {isLastRound ? <><SkipForward size={16} /> END BATTLE</> : <><SkipForward size={16} /> NEXT ROUND</>}
                    </button>
                  </>
                )}

                {/* ── COMPILATION ERROR: show message ── */}
                {feedback.type === 'error' && (
                  <>
                    <div className="error-msg-box font-orbitron">
                      <span className="error-label">RUNTIME ERROR</span>
                      <span className="error-text">{feedback.error}</span>
                    </div>
                    <div className="output-compare-box">
                      <div className="oc-row correct">
                        <span className="oc-label">EXPECTED</span>
                        <span className="oc-value correct">{feedback.expectedOutput}</span>
                      </div>
                    </div>
                    <button className="next-btn font-orbitron" onClick={handleNext} id="next-round-btn">
                      {isLastRound ? <><SkipForward size={16} /> END BATTLE</> : <><SkipForward size={16} /> NEXT ROUND</>}
                    </button>
                  </>
                )}

                {/* ── TIMEOUT ── */}
                {feedback.type === 'timeout' && (
                  <>
                    <p className="result-try font-orbitron">Time's up! The correct answer was:</p>
                    <div className="output-compare-box">
                      <div className="oc-row correct">
                        <span className="oc-label">EXPECTED</span>
                        <span className="oc-value correct">{feedback.expectedOutput}</span>
                      </div>
                    </div>
                    <button className="next-btn font-orbitron" onClick={handleNext} id="next-round-btn">
                      {isLastRound ? <><SkipForward size={16} /> END BATTLE</> : <><SkipForward size={16} /> NEXT ROUND</>}
                    </button>
                  </>
                )}

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
            <div className={`end-stats glass-panel ${battleResult.toLowerCase()}`}>
              <div className="stat-item">
                <span className="stat-label font-orbitron">DIFFICULTY</span>
                <span className="stat-val font-orbitron" style={{ color: diffColor }}>{difficulty.toUpperCase()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label font-orbitron">YOUR HP</span>
                <span className="stat-val font-orbitron" style={{ color: playerHp > 50 ? '#00ff73' : '#ff3c8d' }}>{playerHp}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label font-orbitron">CODE XP</span>
                <span className="stat-val font-orbitron" style={{ color: '#a238ff' }}>{totalXp}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label font-orbitron">ANSWERS</span>
                <span className="stat-val font-orbitron" style={{ color: '#00ff73' }}>{sessionCorrectCount} <span style={{fontSize: '0.6rem', color:'#fff'}}>/ {TOTAL_ROUNDS}</span></span>
              </div>
            </div>

            {/* Dynamic Rewards / Summary */}
            {battleResult === 'VICTORY' ? (
              <div className="victory-rewards">
                <div className="xp-reward font-orbitron glow-text">
                  <Zap size={16} /> +{totalXp} XP EARNED
                </div>
                <div className="credits-reward font-orbitron glow-text-gold">
                  <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>💰</span> +{creditsAwarded} CREDITS
                </div>
              </div>
            ) : (
              <div className="defeat-summary font-orbitron">
                <div style={{ color: '#ff3c8d', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '8px' }}>POST-MATCH ANALYSIS</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  <div style={{ background: 'rgba(255,60,141,0.1)', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,60,141,0.3)' }}>
                    <div style={{ fontSize: '1.5rem', color: '#ff3c8d', fontWeight: '900' }}>{sessionCorrectCount}</div>
                    <div style={{ fontSize: '0.6rem', color: '#fff', letterSpacing: '1px' }}>HITS</div>
                  </div>
                  <div style={{ background: 'rgba(0,255,115,0.1)', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(0,255,115,0.3)' }}>
                    <div style={{ fontSize: '1.5rem', color: '#00ff73', fontWeight: '900' }}>+{totalXp}</div>
                    <div style={{ fontSize: '0.6rem', color: '#fff', letterSpacing: '1px' }}>XP SALVAGED</div>
                  </div>
                </div>
              </div>
            )}

            <div className="end-actions" style={{ marginTop: '30px' }}>
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
