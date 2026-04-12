import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Maximize, Minimize, Swords, Users, Target, 
  Trophy, Activity, User, Crown, Loader2, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UniversalBackBtn from '../components/UniversalBackBtn';
import './Lobby.css';

const Lobby = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [profile, setProfile] = useState({
    username: 'PLAYER_X',
    level: 5,
    xp: 45,
    rank: 'SILVER III',
    credits: 1250
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
    <div className="lobby-v4-wrapper animate-page-fade">
      
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
                <div className="font-orbitron" style={{ color: '#ffbd2e', fontSize: '1.1rem' }}>{profile.credits}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.6rem', color: '#888', letterSpacing: '2px', marginBottom: '5px' }}>COMPLETION</div>
                <div className="font-orbitron" style={{ color: 'var(--neon-cyan)', fontSize: '1.1rem' }}>{profile.xp}%</div>
              </div>
            </div>
          </div>

          <div className="game-modes-v4">
            <div className="mode-card-v4" onClick={() => startBattle('ai')}>
              <div className="mode-icon-v4"><Swords size={28} /></div>
              <h3 className="font-orbitron">BATTLE AI</h3>
              <p>Test your logic against the neural core.</p>
            </div>
            
            <div className="mode-card-v4" style={{ cursor: 'not-allowed', filter: 'grayscale(0.8)' }}>
              <div className="mode-icon-v4"><Users size={28} /></div>
              <h3 className="font-orbitron">DUEL</h3>
              <p>Ranked matchmaking (Locked).</p>
            </div>

            <div className="mode-card-v4" style={{ cursor: 'not-allowed', filter: 'grayscale(0.8)' }}>
              <div className="mode-icon-v4"><Target size={28} /></div>
              <h3 className="font-orbitron">SQUAD</h3>
              <p>Tactical 3v3 team skirmish (Locked).</p>
            </div>
          </div>

          <button className="cta-start-v4 font-orbitron" onClick={() => startBattle('random')}>
            INITIATE COMBAT ⚡
          </button>
          
        </main>

        {/* ➡️ RIGHT SIDE: ACTIVITY */}
        <aside className="lobby-v4-side right-side">
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

      <button className="fs-btn-v4" onClick={toggleFullscreen}>
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

    </div>
  );
};

export default Lobby;
