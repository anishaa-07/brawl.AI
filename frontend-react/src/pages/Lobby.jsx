import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Swords, Users, Target, Activity, 
  Crown, LogOut, ChevronRight, User, Maximize, Minimize, Award, Loader2, Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UniversalBackBtn from '../components/UniversalBackBtn';
import SettingsModal from '../components/SettingsModal';
import './Lobby.css';

const Lobby = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Cinematic Boot State
  const [isBooting, setIsBooting] = useState(() => !sessionStorage.getItem('brawl_booted'));

  useEffect(() => {
    if (isBooting) {
      const timer = setTimeout(() => {
        setIsBooting(false);
        sessionStorage.setItem('brawl_booted', 'true');
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [isBooting]);
  
  // Real-time calculated properties from user
  const currentLevel = user?.level || 1;
  const currentXP = user?.xp || 0;
  const nextLevelXP = currentLevel * 100;
  const xpPercent = Math.min(100, Math.floor((currentXP % 100) / 100 * 100));

  const [profile] = useState({
    username: user?.username || 'ANON_USER',
    rank: user?.rank || 'Bronze III',
    credits: user?.credits || 1200
  });

  const leaders = [
    { rank: 1, name: 'NEURAL_CRUSHER', level: 99, xp: '999k' },
    { rank: 2, name: 'VOID_WALKER', level: 85, xp: '750k' },
    { rank: 3, name: 'CYBER_PUNK_77', level: 72, xp: '620k' }
  ];

  const activities = [
    { text: 'Victory in AI Core', time: '2m ago' },
    { text: 'Level Up: 4 → 5', time: '1h ago' },
    { text: 'Claimed Daily Bonus', time: '3h ago' }
  ];

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
    <>
      {/* 🎬 CINEMATIC BOOT SCREEN */}
      {isBooting && (
        <div className="cinematic-boot-overlay">
          <div className="boot-content">
            <h1 className="boot-title font-orbitron">BRAWL.AI</h1>
            <p className="boot-subtitle font-orbitron">INITIALIZING...</p>
            <div className="boot-progress-bar">
              <div className="boot-progress-fill"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Lobby - only visible/zoomed when not booting */}
      <div className={`lobby-v4-wrapper ${!isBooting ? 'animate-lobby-entry' : 'hidden-lobby'}`}>
        
        {/* 🔙 BACK BUTTON */}
      <UniversalBackBtn 
        warnTitle="EXIT TO LOGIN?"
        warnMessage="Are you sure you want to disconnect from the terminal?"
        customAction={() => {
          logout();
          navigate('/login');
        }}
        confirmLabel="DISCONNECT"
      />

      {/* 🧬 BACKGROUND */}
      <div className="lobby-v4-bg">
        <div className="bg-grid-v4"></div>
        <div className="bg-blur-overlay"></div>
      </div>

      {loading && (
        <div className="loading-overlay" style={{ background: '#000', zIndex: 9999, position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="animate-spin" size={60} color="var(--neon-cyan)" />
          <h2 className="font-orbitron" style={{ letterSpacing: '8px', marginTop: '20px', color: '#fff' }}>INITIALIZING...</h2>
        </div>
      )}

      {/* 📱 MAIN STRUCTURE */}
      <div className="lobby-v4-container">
        
        {/* ⬅️ LEFT SIDE: LEADERBOARD */}
        <aside className="lobby-v4-side left-side">
          <div className="glass-panel-v4">
            <h3 className="panel-title-v4"><Crown size={16} /> Global Ranks</h3>
            <div className="leaderboard-list">
              {leaders.map(player => (
                <div key={player.rank} className="leader-item-v4">
                  <div className="font-orbitron" style={{ color: player.rank === 1 ? '#ffbd2e' : 'var(--neon-cyan)', fontSize: '1.2rem', minWidth: '25px' }}>#{player.rank}</div>
                  <div>
                    <h4 className="font-orbitron" style={{ margin: 0, fontSize: '0.8rem', color: player.rank === 1 ? '#ffbd2e' : '#fff' }}>{player.name}</h4>
                    <span style={{ fontSize: '0.65rem', color: '#777' }}>LVL {player.level} • {player.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ⏹️ CENTER: PROFILE + MODES + CTA */}
        <main className="lobby-v4-center">
          
          <div className="profile-hub-v4">
            <div className="avatar-v4">
              <div className="avatar-ring-v4"></div>
              <div className="avatar-circle-v4">
                <User size={60} color="var(--neon-cyan)" />
              </div>
              <div className="rank-badge-v4 font-orbitron">{profile.rank}</div>
            </div>
            
            <h2 className="profile-name-v4 font-orbitron">{profile.username}</h2>
            <div className="profile-level-v4 font-orbitron">TITAN-CLASS OPERATOR</div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', width: '100%', maxWidth: '300px' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.6rem', color: '#888', letterSpacing: '2px', marginBottom: '5px' }}>CREDITS</div>
                <div className="font-orbitron" style={{ color: '#ffbd2e', fontSize: '1.1rem' }}>{user?.credits || 0}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.6rem', color: '#888', letterSpacing: '2px', marginBottom: '5px' }}>LEVEL {currentLevel}</div>
                <div className="font-orbitron" style={{ color: 'var(--neon-cyan)', fontSize: '1.1rem' }}>{xpPercent}%</div>
              </div>
            </div>

            {/* Extended Player Stats */}
            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', maxWidth: '300px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <div style={{ fontSize: '0.55rem', color: '#888', letterSpacing: '1px' }}>TOTAL BATTLES</div>
                <div className="font-orbitron" style={{ color: '#fff', fontSize: '0.9rem' }}>{user?.totalBattles || 0}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <div style={{ fontSize: '0.55rem', color: '#888', letterSpacing: '1px' }}>W / L RATIO</div>
                <div className="font-orbitron" style={{ color: '#00ff73', fontSize: '0.9rem' }}>{user?.wins || 0} <span style={{color: '#ff3c8d'}}>/ {user?.losses || 0}</span></div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <div style={{ fontSize: '0.55rem', color: '#888', letterSpacing: '1px' }}>ACCURACY</div>
                <div className="font-orbitron" style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>
                  {user?.totalAttempts ? Math.round(((user?.totalCorrect || 0) / user.totalAttempts) * 100) : 0}%
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <div style={{ fontSize: '0.55rem', color: '#888', letterSpacing: '1px' }}>MAX COMBO</div>
                <div className="font-orbitron" style={{ color: '#ffbd2e', fontSize: '0.9rem' }}>{user?.highestCombo || 0} 🔥</div>
              </div>
            </div>
          </div>

          <div className="game-modes-v4">
            <div className="mode-card-v4" onClick={() => startBattle('ai')}>
              <div className="mode-icon-v4"><Swords size={28} /></div>
              <h3 className="font-orbitron">BATTLE AI</h3>
              <p>Test your logic against the neural core.</p>
            </div>
            
            <div 
              className="mode-card-v4" 
              style={currentLevel < 2 ? { cursor: 'not-allowed', filter: 'grayscale(0.8)' } : {}}
              onClick={() => currentLevel >= 2 && startBattle('duel')}
            >
              <div className="mode-icon-v4"><Users size={28} /></div>
              <h3 className="font-orbitron">DUEL</h3>
              <p>{currentLevel < 2 ? 'Ranked matchmaking (Unlocks at LVL 2).' : 'Ranked matchmaking against live players.'}</p>
            </div>

            <div 
              className="mode-card-v4" 
              style={currentLevel < 3 ? { cursor: 'not-allowed', filter: 'grayscale(0.8)' } : {}}
              onClick={() => currentLevel >= 3 && startBattle('squad')}
            >
              <div className="mode-icon-v4"><Target size={28} /></div>
              <h3 className="font-orbitron">SQUAD</h3>
              <p>{currentLevel < 3 ? 'Tactical 3v3 team skirmish (Unlocks at LVL 3).' : 'Tactical 3v3 team skirmish.'}</p>
            </div>
          </div>

          <button className="cta-start-v4 font-orbitron" onClick={() => startBattle('random')}>
            INITIATE COMBAT ⚡
          </button>
          
        </main>

        {/* ➡️ RIGHT SIDE: ACTIVITY & BADGES */}
        <aside className="lobby-v4-side right-side">
          
          <div className="glass-panel-v4" style={{ marginBottom: '20px' }}>
            <h3 className="panel-title-v4"><Award size={16} /> Honors</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {(!user?.badges || user.badges.length === 0) ? (
                <div style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>No honors acquired yet.</div>
              ) : (
                user.badges.map(b => (
                  <div key={b.id} title={b.desc} style={{ 
                    background: 'rgba(0, 255, 115, 0.1)', border: '1px solid rgba(0, 255, 115, 0.4)', 
                    borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' 
                  }}>
                    <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 5px rgba(0,255,115,0.8))' }}>{b.icon}</span>
                    <span className="font-orbitron" style={{ fontSize: '0.7rem', color: '#fff', letterSpacing: '1px' }}>{b.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-panel-v4">
            <h3 className="panel-title-v4"><Activity size={16} /> Data Log</h3>
            <div className="activity-feed-v4">
              {activities.map((act, i) => (
                <div key={i} className="activity-item-v4">
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-cyan)', marginTop: '6px', boxShadow: '0 0 5px var(--neon-cyan)' }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#fff' }}>{act.text}</p>
                    <span style={{ fontSize: '0.65rem' }}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      <button className="fs-btn-v4" onClick={toggleFullscreen} style={{ bottom: '20px', right: '20px' }}>
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      <button className="settings-btn-v4" onClick={() => setShowSettings(true)} style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, backdropFilter: 'blur(10px)', transition: '0.3s' }}>
        <SettingsIcon size={22} className="hover-spin" />
      </button>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

    </div>
    </>
  );
};

export default Lobby;
