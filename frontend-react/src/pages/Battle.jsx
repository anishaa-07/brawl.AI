import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Swords, Zap, Shield, Timer, ChevronLeft, Bot, User, Share2 } from 'lucide-react';
import './Battle.css';

const Battle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = location.state?.difficulty || 'Normal';

  // Game State
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerHp, setPlayerHp] = useState(100);
  const [aiHp, setAiHp] = useState(100);
  const [isBattleEnd, setIsBattleEnd] = useState(false);
  const [battleResult, setBattleResult] = useState('');
  const [isAttacking, setIsAttacking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('PROTOCOL INITIALIZED. WAITING FOR ATTACK...');

  // Mock Challenge
  const [challenge] = useState({
    title: 'NEURAL LINK CHALLENGE',
    task: 'REVERSE THE ENCRYPTED STRING',
    target: 'X-CYBER-7',
    answer: '7-REBYC-X'
  });

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !isBattleEnd) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isBattleEnd) {
      endBattle('TIME EXPIRED. AI DOMINANCE ESTABLISHED.');
    }
  }, [timeLeft, isBattleEnd]);

  const endBattle = (msg) => {
    setIsBattleEnd(true);
    setBattleResult(msg);
  };

  const handleAttack = () => {
    if (isAttacking || isBattleEnd) return;
    
    setIsAttacking(true);
    setFeedback('CALCULATING TRAJECTORY...');

    // Simulate "Hit" or "Miss" logic
    setTimeout(() => {
      const isHit = userInput.trim().toUpperCase() === challenge.answer;
      
      if (isHit) {
        setAiHp(prev => Math.max(0, prev - 34));
        setFeedback('CRITICAL HIT! AI CORE DAMAGED.');
        if (aiHp <= 34) endBattle('VICTORY! AI CORE NEUTRALIZED.');
      } else {
        setPlayerHp(prev => Math.max(0, prev - 20));
        setFeedback('MISS! AI COUNTER-ATTACK DETECTED.');
        if (playerHp <= 20) endBattle('DEFEAT! SYSTEM OVERRIDE COMPLETE.');
      }
      
      setIsAttacking(false);
      setUserInput('');
    }, 800);
  };

  const handleRetreat = () => {
    navigate('/lobby');
  };

  return (
    <div className={`battle-arena-container ${isAttacking ? 'screen-shake' : ''}`}>
      {/* Background FX */}
      <div className="battle-bg-overlay"></div>
      <div className="battle-scanline"></div>

      {/* TOP BAR: HUD */}
      <header className="battle-hud-top glass-panel">
        <div className="hud-player-info">
          <div className="hud-label font-orbitron text-primary">PILOT: {user?.username || 'PlayerX'}</div>
          <div className="hud-hp-bar-wrap">
            <div className="hud-hp-fill player-hp" style={{ width: `${playerHp}%` }}></div>
            <div className="hud-hp-glow" style={{ width: `${playerHp}%` }}></div>
          </div>
          <div className="hud-hp-text font-orbitron">{playerHp}%</div>
        </div>

        <div className="hud-center-timer">
          <div className={`timer-ring ${timeLeft < 10 ? 'timer-danger' : ''}`}>
            <Timer size={24} className="timer-icon" />
            <span className="font-orbitron">{timeLeft}s</span>
          </div>
          <div className="difficulty-tag font-orbitron">{difficulty.toUpperCase()} MODE</div>
        </div>

        <div className="hud-ai-info">
          <div className="hud-label font-orbitron text-neon" style={{ textAlign: 'right' }}>TARGET: AI-CORE-9000</div>
          <div className="hud-hp-bar-wrap ai-wrap">
            <div className="hud-hp-fill ai-hp" style={{ width: `${aiHp}%` }}></div>
            <div className="hud-hp-glow-ai" style={{ width: `${aiHp}%` }}></div>
          </div>
          <div className="hud-hp-text font-orbitron" style={{ textAlign: 'right' }}>{aiHp}%</div>
        </div>
      </header>

      {/* MAIN BATTLE ZONE */}
      <main className="battle-main-content">
        
        {/* Challenge Terminal */}
        <div className="challenge-terminal glass-panel">
          <div className="terminal-header font-orbitron">
            <Bot size={18} className="text-neon" />
            <span>ENCRYPTION CHALLENGE</span>
            <div className="terminal-dots"><span></span><span></span><span></span></div>
          </div>
          <div className="terminal-body font-montserrat">
            <p className="terminal-static">&gt; ACCESSING NEURAL INTERFACE...</p>
            <p className="terminal-static">&gt; CHALLENGE: {challenge.task}</p>
            <div className="challenge-target-box font-orbitron">
              {challenge.target}
            </div>
            <p className="terminal-prompt mt-20">&gt; INPUT DECRYPTION KEY:</p>
          </div>
        </div>

        {/* Input Area */}
        {!isBattleEnd ? (
          <div className="battle-action-area">
            <div className="battle-input-wrap">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="TYPE DECRYPTION KEY..."
                className="battle-cyber-input font-orbitron"
                onKeyDown={(e) => e.key === 'Enter' && handleAttack()}
                disabled={isAttacking}
              />
              <div className="input-glow"></div>
            </div>
            
            <button 
              className={`attack-submit-btn font-orbitron ${isAttacking ? 'btn-attacking' : ''}`}
              onClick={handleAttack}
              disabled={isAttacking}
            >
              {isAttacking ? (
                <Zap className="animate-spin" size={24} />
              ) : (
                <>SUBMIT ATTACK <Swords size={20} /></>
              )}
            </button>
          </div>
        ) : (
          <div className="battle-end-overlay modal-pulse">
            <h1 className="font-orbitron result-title text-shadow-glow">{battleResult.split('.')[0]}</h1>
            <p className="font-montserrat result-desc">{battleResult.split('.')[1]}</p>
            <div className="battle-end-actions mt-20">
              <button className="end-btn btn-primary font-orbitron" onClick={() => window.location.reload()}>RETRY BATTLE</button>
              <button className="end-btn btn-secondary font-orbitron" onClick={handleRetreat}>RETURN TO LOBBY</button>
            </div>
          </div>
        )}

        <div className={`battle-status-message font-orbitron ${isAttacking ? 'text-primary' : ''}`}>
          {feedback}
        </div>
      </main>

      {/* FOOTER FX */}
      <footer className="battle-footer">
        <div className="fx-particles">
          <div className="p-dot p-1"></div>
          <div className="p-dot p-2"></div>
          <div className="p-dot p-3"></div>
        </div>
        <button className="retreat-link font-orbitron" onClick={handleRetreat}>
          <ChevronLeft size={16} /> EMERGENCY RETREAT
        </button>
      </footer>
    </div>
  );
};

export default Battle;

