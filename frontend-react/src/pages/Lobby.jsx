import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Maximize, Minimize, Swords, Users, Target, 
  Trophy, Zap, Shield, Activity, Calendar, 
  ArrowRight, Flame, User, MessageSquare, Terminal 
} from 'lucide-react';
import './Lobby.css';

const Lobby = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [profile, setProfile] = useState({
    username: 'PLAYER_X',
    level: 5,
    xp: 45,
    rank: 'Silver III',
    credits: 1250
  });

  // 🧬 MOCK DATA
  const leaders = [
    { rank: 1, name: 'NEURAL_CRUSHER', level: 99, xp: '999k' },
    { rank: 2, name: 'VOID_WALKER', level: 85, xp: '750k' },
    { rank: 3, name: 'CYBER_PUNK_77', level: 72, xp: '620k' }
  ];

  const activities = [
    { type: 'battle', text: 'Won 1v1 vs AI-Core-Delta', time: '2m ago' },
    { type: 'xp', text: 'Rewarded +250 XP for Daily Login', time: '1h ago' },
    { type: 'achievement', text: 'Unlocked "Code Ninja" badge', time: '3h ago' }
  ];

  // 📺 FULLSCREEN LOGIC
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      document.exitFullscreen().catch(e => console.error(e));
    }
  };

  const startBattle = (mode) => {
    setLoading(true);
    setTimeout(() => {
      navigate('/battle', { state: { mode } });
    }, 1500);
  };

  return (
    <div className="lobby-wrapper">
      {/* 🧬 BACKGROUND ANIMATION */}
      <div className="lobby-bg-anim">
        <div className="bg-grid-move"></div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner-hex"></div>
          <h2 className="font-orbitron" style={{ letterSpacing: '4px' }}>INITIALIZING BATTLE_GRID</h2>
          <div className="loading-scanner"></div>
        </div>
      )}

      {/* 📱 MAIN 3-COLUMN GRID */}
      <div className="lobby-main-grid">
        
        {/* ⬅️ LEFT COLUMN: PROFILE & STATS */}
        <aside className="left-column">
          <div className="glass-panel profile-card neon-border-blue">
            <div className="avatar-container">
              <div className="avatar-ring"></div>
              <div className="avatar-circle">
                <User size={50} color="var(--neon-blue)" />
              </div>
            </div>
            <div className="rank-badge">SILVER III</div>
            
            <div className="profile-info">
              <h2 className="profile-name font-orbitron">{profile.username}</h2>
              <p className="profile-tag font-orbitron">LEVEL {profile.level} PILOT</p>
            </div>

            <div className="xp-container">
              <div className="xp-header font-orbitron">
                <span>PROGRESS</span>
                <span>{profile.xp}%</span>
              </div>
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${profile.xp}%` }}>
                  <div className="xp-glimmer"></div>
                </div>
              </div>
            </div>

            <div className="widget-row" style={{ marginTop: '10px', width: '100%' }}>
              <div className="stat-pill" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.6rem', color: '#666' }}>CREDITS</span>
                <div className="font-orbitron" style={{ color: 'var(--neon-blue)' }}>{profile.credits}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel neon-border-purple" style={{ marginTop: '20px' }}>
            <h3 className="panel-title font-orbitron"><Trophy size={16} /> Leaderboard</h3>
            <div className="leaderboard-list">
              {leaders.map(player => (
                <div key={player.rank} className="leader-item">
                  <div className="leader-rank">#{player.rank}</div>
                  <div className="leader-info">
                    <p className="leader-name font-orbitron">{player.name}</p>
                    <span className="leader-stats">LVL {player.level} • {player.xp}</span>
                  </div>
                  {player.rank === 1 && <Flame size={14} color="#ffbd2e" />}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ⏹️ CENTER COLUMN: MISSIONS & MODES */}
        <main className="center-column">
          <div className="glass-panel daily-challenge-box">
            <h3 className="panel-title font-orbitron"><Calendar size={16} /> Daily Protocol</h3>
            <div className="challenge-content">
              <div className="challenge-icon">
                <Target size={32} />
              </div>
              <div className="challenge-text">
                <h4 className="font-orbitron">NEURAL OVERRIDE</h4>
                <p>Complete 3 Hard-level battles with >80% accuracy.</p>
                <div className="bonus-tag font-orbitron">
                  <Zap size={12} /> +500 XP BONUS
                </div>
              </div>
            </div>
          </div>

          <div className="mode-grid">
            <div className="glass-panel mode-card" onClick={() => startBattle('ai')}>
              <div className="mode-header">
                <div className="mode-icon-box"><Swords size={24} /></div>
                <span className="status-tag status-active font-orbitron">ACTIVE</span>
              </div>
              <div className="mode-body">
                <h3 className="font-orbitron">BATTLE AI</h3>
                <p>Engage the Neural Core. Perfect for training and quick XP gains.</p>
              </div>
              <div className="card-hover-hint"><ArrowRight size={16} /></div>
            </div>

            <div className="glass-panel mode-card" onClick={() => {}}>
              <div className="mode-header">
                <div className="mode-icon-box"><Users size={24} /></div>
                <span className="status-tag status-coming font-orbitron">LOCKED</span>
              </div>
              <div className="mode-body">
                <h3 className="font-orbitron">DUEL PLAYER</h3>
                <p>Ranked 1v1 combat against other pilots. Global seasons coming soon.</p>
              </div>
            </div>

            <div className="glass-panel mode-card" onClick={() => {}}>
              <div className="mode-header">
                <div className="mode-icon-box"><Shield size={24} /></div>
                <span className="status-tag status-coming font-orbitron">LOCKED</span>
              </div>
              <div className="mode-body">
                <h3 className="font-orbitron">SQUAD ARENA</h3>
                <p>Tactical 3v3 team skirmish. Coordinate with allies to win.</p>
              </div>
            </div>
          </div>

          <button className="quick-start-btn font-orbitron" onClick={() => startBattle('random')}>
            Start Random Battle ⚡
          </button>
        </main>

        {/* ➡️ RIGHT COLUMN: ACTIVITY & CHAT */}
        <aside className="right-column">
          <div className="glass-panel neon-border-green">
            <h3 className="panel-title font-orbitron"><Activity size={16} /> Recent Activity</h3>
            <div className="activity-feed">
              {activities.map((act, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p style={{ margin: 0 }}>{act.text}</p>
                    <span style={{ fontSize: '0.65rem', color: '#555' }}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ marginTop: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 className="panel-title font-orbitron"><MessageSquare size={16} /> Pilot Chat</h3>
            <div className="telemetry-feed" style={{ flex: 1 }}>
              <p>[SYSTEM]: Secure link established.</p>
              <p>[Pilot_K]: Anyone up for a hard duel?</p>
              <p>[AI_BOT]: Neural patterns stable.</p>
              <p style={{ color: 'var(--neon-blue)' }}>[Global]: Tournament starts in 4h.</p>
            </div>
            <div style={{ marginTop: '15px', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Secure message..." 
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '4px', color: '#fff', fontSize: '0.8rem' }}
              />
              <Terminal size={12} style={{ position: 'absolute', right: '10px', top: '12px', opacity: 0.5 }} />
            </div>
          </div>
        </aside>

      </div>

      {/* 🖥️ FULLSCREEN STICKY */}
      <button className="fullscreen-sticky" onClick={toggleFullscreen} title="Toggle Fullscreen">
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

    </div>
  );
};

export default Lobby;
