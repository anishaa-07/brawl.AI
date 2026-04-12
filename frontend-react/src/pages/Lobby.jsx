import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Maximize, Minimize, Swords, Users, Target, 
  Trophy, Zap, Shield, Activity, Calendar, 
  ArrowRight, Flame, User, MessageSquare, Terminal,
  Clock, Crown, Gift, Loader2
} from 'lucide-react';
import './Lobby.css';

const Lobby = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showXPFloat, setShowXPFloat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [profile, setProfile] = useState({
    username: 'PLAYER_X',
    level: 5,
    xp: 0, // Start at 0 for entrance animation
    targetXP: 45,
    rank: 'Silver III',
    credits: 1250
  });

  // 🧬 MOCK DATA
  const leaders = [
    { rank: 1, name: 'NEURAL_CRUSHER', level: 99, xp: '999k' },
    { rank: 2, name: 'VOID_WALKER', level: 85, xp: '750k' },
    { rank: 3, name: 'CYBER_PUNK_77', level: 72, xp: '620k' }
  ];

  const [messages, setMessages] = useState([
    { id: 1, user: 'SYSTEM', text: 'Secure neural link active.', time: '12:00' },
    { id: 2, user: 'Pilot_K', text: 'Hard duel, anyone?', time: '12:05' },
    { id: 3, user: 'AI_BOT', text: 'Patterns stable.', time: '12:10' }
  ]);

  // 🔊 SOUND EFFECTS SIMULATION
  const playSound = (type) => {
    // In a real app, use: new Audio('/sounds/click.mp3').play();
    console.log(`[SFX] Playing ${type} sound`);
  };

  // ⏱️ COUNTDOWN LOGIC
  const [timeLeft, setTimeLeft] = useState('12:45:10');
  useEffect(() => {
    const timer = setInterval(() => {
      // Mock countdown decrement
      setTimeLeft(prev => {
        const parts = prev.split(':').map(Number);
        let [h, m, s] = parts;
        if (s > 0) s--; else if (m > 0) { m--; s = 59; } else if (h > 0) { h--; m = 59; s = 59; }
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✨ INITIAL LOAD ANIMATIONS
  useEffect(() => {
    setTimeout(() => {
      setProfile(prev => ({ ...prev, xp: prev.targetXP }));
    }, 500);

    // Initial msg
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now(), user: 'Global', text: 'Daily Tournament begins in 4 hours.', time: '12:15' }]);
      }, 2000);
    }, 3000);
  }, []);

  // 📜 AUTO-SCROLL CHAT
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleFullscreen = () => {
    playSound('click');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(e => console.error(e));
      setIsFullscreen(false);
    }
  };

  const startBattle = (mode) => {
    playSound('click');
    setLoading(true);
    setTimeout(() => {
      navigate('/battle', { state: { mode } });
    }, 2000);
  };

  const claimReward = () => {
    if (showXPFloat) return;
    playSound('success');
    setShowXPFloat(true);
    setProfile(prev => ({ ...prev, xp: Math.min(100, prev.xp + 15), credits: prev.credits + 200 }));
    setTimeout(() => setShowXPFloat(false), 2000);
  };

  return (
    <div className="lobby-wrapper animate-page-fade">
      {/* 🧬 BACKGROUND ELEMENTS */}
      <div className="lobby-bg-anim">
        <div className="bg-particles"></div>
        <div className="bg-grid-move"></div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <Loader2 className="animate-spin" size={48} color="var(--neon-blue)" />
          <h2 className="font-orbitron" style={{ letterSpacing: '6px', marginTop: '20px' }}>ESTABLISHING LINK...</h2>
          <div className="loading-scanner"></div>
        </div>
      )}

      <div className="lobby-main-grid">
        
        {/* ⬅️ LEFT: PROFILE & RANKING */}
        <aside className="left-column">
          <div className="glass-panel profile-card neon-border-blue">
            <div className="avatar-container">
              <div className="avatar-ring"></div>
              <div className="avatar-circle">
                <User size={60} color="var(--neon-blue)" />
              </div>
            </div>
            <div className="rank-badge font-orbitron">{profile.rank}</div>
            
            <div className="profile-info">
              <h2 className="profile-name font-orbitron">{profile.username}</h2>
              <p className="profile-tag font-orbitron">TITAN-CLASS OPERATOR</p>
            </div>

            <div className="xp-container">
              {showXPFloat && <div className="floating-xp font-orbitron">+15 XP</div>}
              <div className="xp-header font-orbitron">
                <span>PROGRESSION</span>
                <span>{profile.xp}%</span>
              </div>
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${profile.xp}%` }}></div>
              </div>
            </div>

            <div className="widget-row" style={{ marginTop: '5px', width: '100%', gap: '10px', display: 'flex' }}>
              <div className="stat-pill" style={{ flex: 1, padding: '12px', background: 'rgba(255,189,46,0.05)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,189,46,0.1)' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--neon-gold)', letterSpacing: '1px' }}>CREDITS</span>
                <div className="font-orbitron" style={{ color: '#fff', fontSize: '1.1rem' }}>{profile.credits}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel neon-border-purple" style={{ marginTop: '25px' }}>
            <h3 className="panel-title font-orbitron"><Crown size={18} className="crown-icon" /> Hall of Fame</h3>
            <div className="leaderboard-list">
              {leaders.map(player => (
                <div key={player.rank} className={`leader-item ${player.rank === 1 ? 'top-rank' : ''}`}>
                  <div className="leader-rank font-orbitron" style={{ color: player.rank === 1 ? 'var(--neon-gold)' : 'var(--neon-blue)' }}>{player.rank}</div>
                  <div className="leader-info">
                    <p className="leader-name font-orbitron">{player.name}</p>
                    <span className="leader-stats">LVL {player.level} • {player.xp}</span>
                  </div>
                  {player.rank === 1 && <Crown size={14} className="crown-icon" />}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ⏹️ CENTER: COMBAT CONTROL */}
        <main className="center-column">
          <div className="glass-panel daily-challenge-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 className="panel-title font-orbitron" style={{ margin: 0 }}><Gift size={18} /> Daily Gift</h3>
              <div className="countdown-timer font-orbitron">
                <Clock size={12} /> {timeLeft}
              </div>
            </div>
            <div className="challenge-content">
              <div className="challenge-icon" style={{ background: 'rgba(162, 56, 255, 0.2)', padding: '15px', borderRadius: '14px' }}>
                <Target size={36} />
              </div>
              <div className="challenge-text">
                <h4 className="font-orbitron" style={{ fontSize: '1.2rem' }}>NEURAL STRIKE</h4>
                <p>Neutralize the AI core in under 60 seconds.</p>
                <div className="bonus-tag font-orbitron" style={{ color: 'var(--neon-green)', marginTop: '8px' }}>
                  <Zap size={14} /> +200 CR Reward
                </div>
              </div>
            </div>
            <button className="claim-btn font-orbitron" onClick={claimReward}>
              {showXPFloat ? 'PROCESSING...' : 'CLAIM REWARD'}
            </button>
          </div>

          <div className="mode-grid">
            <div className="glass-panel mode-card neon-border-blue" onClick={() => startBattle('ai')}>
              <div className="mode-header">
                <div className="mode-icon-box"><Swords size={28} /></div>
                <span className="status-tag status-active font-orbitron">LIVE</span>
              </div>
              <div className="mode-body">
                <h3 className="font-orbitron" style={{ letterSpacing: '2px' }}>NEURAL ARENA</h3>
                <p>Deploy against specialized AI combatants to test your logic.</p>
              </div>
              <div className="card-hover-hint" style={{ position: 'absolute', bottom: '20px', right: '20px', opacity: 0.5 }}>
                <ArrowRight size={20} />
              </div>
            </div>

            <div className="glass-panel mode-card" style={{ opacity: 0.6 }}>
              <div className="mode-header">
                <div className="mode-icon-box"><Users size={28} /></div>
                <span className="status-tag status-coming font-orbitron">LOCKED</span>
              </div>
              <div className="mode-body">
                <h3 className="font-orbitron">CYBER DUEL</h3>
                <p>Ranked matchmaking system currently under maintenance.</p>
              </div>
            </div>
          </div>

          <button className="quick-start-btn font-orbitron" onClick={() => startBattle('random')}>
            Quick Start Protocol ⚡
          </button>
        </main>

        {/* ➡️ RIGHT: ACTIVITY & COMMS */}
        <aside className="right-column">
          <div className="glass-panel neon-border-green">
            <h3 className="panel-title font-orbitron"><Activity size={18} /> Combat Log</h3>
            <div className="activity-feed" style={{ maxHeight: '180px', overflowY: 'auto' }}>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: 'var(--neon-green)' }}></div>
                <div><p>Victory in Arena Mode</p><span style={{ color: '#555', fontSize: '0.7rem' }}>2m ago</span></div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: 'var(--neon-blue)' }}></div>
                <div><p>Level Up: 4 → 5</p><span style={{ color: '#555', fontSize: '0.7rem' }}>15m ago</span></div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ marginTop: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 className="panel-title font-orbitron"><MessageSquare size={18} /> Neural Comms</h3>
            <div className="telemetry-feed" style={{ flex: 1 }}>
              {messages.map(msg => (
                <div key={msg.id} className="msg-item">
                  <span style={{ color: msg.user === 'SYSTEM' ? 'var(--neon-pink)' : 'var(--neon-blue)', fontWeight: 'bold', fontSize: '0.8rem' }}>[{msg.user}]</span>
                  <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: '#ccc' }}>{msg.text}</span>
                </div>
              ))}
              {isTyping && (
                <div className="typing-indicator font-orbitron">
                  <div className="typing-dot"></div>
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                  <span>AI TYPING...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{ marginTop: '20px', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Broadcast message..." 
                className="font-orbitron"
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', padding: '14px', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    playSound('click');
                    setMessages(prev => [...prev, { id: Date.now(), user: 'YOU', text: e.target.value, time: 'Now' }]);
                    e.target.value = '';
                  }
                }}
              />
              <Terminal size={16} color="var(--neon-blue)" style={{ position: 'absolute', right: '15px', top: '14px', opacity: 0.4 }} />
            </div>
          </div>
        </aside>

      </div>

      <button className="fullscreen-sticky" onClick={toggleFullscreen}>
        {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
      </button>

    </div>
  );
};

export default Lobby;
