import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Swords, Users, Target, Activity,
  Crown, LogOut, ChevronRight, RefreshCw, Maximize, Minimize, Award, Loader2, Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_QUESTIONS } from '../data/questionsDB';
import UniversalBackBtn from '../components/UniversalBackBtn';
import SettingsModal from '../components/SettingsModal';
import './Lobby.css';

/* ── Avatar Utility ──────────────────────────────────────
   detectGender: names ending in a/i/aa → female
   getStyle:     female → adventurer (soft anime)
                  male   → adventurer-neutral (warrior)
   getSeed:      username + stored random suffix → unique
──────────────────────────────────────────────────────── */
const detectGender = (name = '') => {
  const n = name.trim().toLowerCase();
  if (/aa$|[ai]$/i.test(n)) return 'female';
  return 'male';
};

const STYLES = {
  female: 'adventurer',
  male:   'adventurer-neutral',
};

const STORAGE_KEY = 'brawl_avatar_seed';

const makeSeed = (username) => {
  const suffix = Math.random().toString(36).slice(2, 8);
  const seed = `${username}_${suffix}`;
  localStorage.setItem(STORAGE_KEY, seed);
  return seed;
};

const getSeed = (username) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  // Only reuse if it belongs to this user
  if (stored && stored.startsWith(username + '_')) return stored;
  return makeSeed(username);
};

const buildAvatarUrl = (username) => {
  const gender = detectGender(username);
  const style  = STYLES[gender];
  const seed   = getSeed(username);
  // Extra query params add cyberpunk flair
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0a0e1a&radius=50`;
};

const Lobby = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Dynamic anime avatar URL
  const [avatarUrl, setAvatarUrl] = useState(() =>
    buildAvatarUrl(user?.username || 'ANON_USER')
  );
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  const regenerateAvatar = useCallback(() => {
    const username = user?.username || 'ANON_USER';
    const gender   = detectGender(username);
    const style    = STYLES[gender];
    const newSeed  = makeSeed(username);
    setAvatarLoaded(false);
    setAvatarUrl(
      `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(newSeed)}&backgroundColor=0a0e1a&radius=50`
    );
  }, [user?.username]);

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
  const xpPercent = Math.min(100, Math.floor((currentXP % 100) / 100 * 100));

  const [profile] = useState({
    username: user?.username || 'ANON_USER',
    rank: user?.rank || 'Bronze III',
    credits: user?.credits || 1200
  });

  const leaders = [
    { rank: 1, name: 'NEURAL_CRUSHER', level: 99, xp: '999k' },
    { rank: 2, name: 'VOID_WALKER',    level: 85, xp: '750k' },
    { rank: 3, name: 'CYBER_PUNK_77',  level: 72, xp: '620k' },
  ];

  const activities = [
    { text: 'Victory in AI Core',    time: '2m ago' },
    { text: 'Level Up: 4 \u2192 5',  time: '1h ago' },
    { text: 'Claimed Daily Bonus',   time: '3h ago' },
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
    if (mode === 'quick') {
      const q = ALL_QUESTIONS[Math.floor(Math.random() * ALL_QUESTIONS.length)];
      navigate('/battle', { state: { selectedQuestion: q, difficulty: q.difficulty } });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (mode === 'ai') navigate('/question-hub');
      else navigate('/battle', { state: { mode } });
    }, 1500);
  };

  const accuracy = user?.totalAttempts
    ? Math.round(((user?.totalCorrect || 0) / user.totalAttempts) * 100)
    : 0;

  return (
    <>
      {/* CINEMATIC BOOT SCREEN */}
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

      {/* MAIN LOBBY */}
      <div className={`lobby-v4-wrapper ${!isBooting ? 'animate-lobby-entry' : 'hidden-lobby'}`}>

        {/* BACK BUTTON */}
        <UniversalBackBtn
          warnTitle="EXIT TO LOGIN?"
          warnMessage="Are you sure you want to disconnect from the terminal?"
          customAction={() => { logout(); navigate('/login'); }}
          confirmLabel="DISCONNECT"
        />

        {/* BACKGROUND */}
        <div className="lobby-v4-bg">
          <div className="bg-grid-v4"></div>
          <div className="bg-blur-overlay"></div>
        </div>

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="loading-overlay" style={{
            background: '#000', zIndex: 9999, position: 'fixed', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <Loader2 className="animate-spin" size={60} color="var(--neon-cyan)" />
            <h2 className="font-orbitron" style={{ letterSpacing: '8px', marginTop: '20px', color: '#fff' }}>
              INITIALIZING...
            </h2>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="lobby-v4-container">

          {/* LEFT: LEADERBOARD */}
          <aside className="lobby-v4-side left-side">
            <div className="glass-panel-v4">
              <h3 className="panel-title-v4"><Crown size={16} /> Global Ranks</h3>
              <div className="leaderboard-list">
                {leaders.map(player => (
                  <div key={player.rank} className="leader-item-v4">
                    <div className="font-orbitron" style={{
                      color: player.rank === 1 ? '#ffbd2e' : 'var(--neon-cyan)',
                      fontSize: '1.2rem', minWidth: '25px'
                    }}>
                      #{player.rank}
                    </div>
                    <div>
                      <h4 className="font-orbitron" style={{
                        margin: 0, fontSize: '0.8rem',
                        color: player.rank === 1 ? '#ffbd2e' : '#fff'
                      }}>
                        {player.name}
                      </h4>
                      <span style={{ fontSize: '0.65rem', color: '#777' }}>
                        LVL {player.level} &bull; {player.xp} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER: PROFILE + MODES + CTA */}
          <main className="lobby-v4-center">

            <div className="profile-hub-v4">
              <div className="avatar-v4">
                {/* Outer dual-color spinning ring */}
                <div className="avatar-ring-v4"></div>
                {/* Glow orb behind avatar */}
                <div className="avatar-glow-orb"></div>
                {/* Avatar image circle */}
                <div className={`avatar-circle-v4 avatar-anime${avatarLoaded ? ' avatar-ready' : ''}`}>
                  <img
                    src={avatarUrl}
                    alt="Pilot Avatar"
                    className="avatar-img"
                    onLoad={() => setAvatarLoaded(true)}
                    onError={() => setAvatarLoaded(true)}
                  />
                  {/* Skeleton shimmer while loading */}
                  {!avatarLoaded && <div className="avatar-skeleton" />}
                </div>
                <div className="rank-badge-v4 font-orbitron">{profile.rank}</div>
              </div>

              {/* Regenerate Button */}
              <button
                className="avatar-regen-btn font-orbitron"
                onClick={regenerateAvatar}
                title="Regenerate Avatar"
              >
                <RefreshCw size={10} />
                REGEN
              </button>

              <h2 className="profile-name-v4 font-orbitron">{profile.username}</h2>
              <div className="profile-level-v4 font-orbitron">TITAN-CLASS OPERATOR</div>

              {/* Credits + XP Row */}
              <div className="profile-stats-row">
                <div className="profile-stat-box">
                  <div className="stat-box-label">CREDITS</div>
                  <div className="font-orbitron stat-box-val" style={{ color: '#ffbd2e' }}>
                    {user?.credits || 0}
                  </div>
                </div>
                <div className="profile-stat-box">
                  <div className="stat-box-label">LEVEL {currentLevel}</div>
                  <div className="font-orbitron stat-box-val" style={{ color: 'var(--neon-cyan)' }}>
                    {xpPercent}%
                  </div>
                </div>
              </div>

              {/* Extended Stats Grid */}
              <div className="profile-ext-grid">
                <div className="profile-ext-cell">
                  <div className="ext-label">TOTAL BATTLES</div>
                  <div className="font-orbitron ext-val" style={{ color: '#fff' }}>
                    {user?.totalBattles || 0}
                  </div>
                </div>
                <div className="profile-ext-cell">
                  <div className="ext-label">W / L RATIO</div>
                  <div className="font-orbitron ext-val">
                    <span style={{ color: '#00ff73' }}>{user?.wins || 0}</span>
                    <span style={{ color: '#888' }}> / </span>
                    <span style={{ color: '#ff3c8d' }}>{user?.losses || 0}</span>
                  </div>
                </div>
                <div className="profile-ext-cell">
                  <div className="ext-label">ACCURACY</div>
                  <div className="font-orbitron ext-val" style={{ color: 'var(--neon-cyan)' }}>
                    {accuracy}%
                  </div>
                </div>
                <div className="profile-ext-cell">
                  <div className="ext-label">MAX COMBO</div>
                  <div className="font-orbitron ext-val" style={{ color: '#ffbd2e' }}>
                    {user?.highestCombo || 0} &#x1F525;
                  </div>
                </div>
              </div>
            </div>

            {/* GAME MODE CARDS */}
            <div className="game-modes-v4">
              <div className="mode-card-v4" onClick={() => startBattle('ai')}>
                <div className="mode-icon-v4"><Swords size={28} /></div>
                <h3 className="font-orbitron">BATTLE AI</h3>
                <p>Test your logic against the neural core.</p>
              </div>

              <div
                className="mode-card-v4"
                style={currentLevel < 2 ? { cursor: 'not-allowed', filter: 'grayscale(0.8)', opacity: 0.45 } : {}}
                onClick={() => currentLevel >= 2 && startBattle('duel')}
              >
                <div className="mode-icon-v4"><Users size={28} /></div>
                <h3 className="font-orbitron">DUEL</h3>
                <p>{currentLevel < 2 ? 'Ranked matchmaking (Unlocks at LVL 2).' : 'Ranked matchmaking against live players.'}</p>
              </div>

              <div
                className="mode-card-v4"
                style={currentLevel < 3 ? { cursor: 'not-allowed', filter: 'grayscale(0.8)', opacity: 0.45 } : {}}
                onClick={() => currentLevel >= 3 && startBattle('squad')}
              >
                <div className="mode-icon-v4"><Target size={28} /></div>
                <h3 className="font-orbitron">SQUAD</h3>
                <p>{currentLevel < 3 ? 'Tactical 3v3 team skirmish (Unlocks at LVL 3).' : 'Tactical 3v3 team skirmish.'}</p>
              </div>
            </div>

            {/* CTA */}
            <button
              className="cta-start-v4 font-orbitron animate-quick-pulse"
              onClick={() => startBattle('quick')}
            >
              QUICK BATTLE &#x26A1;
            </button>

          </main>

          {/* RIGHT: HONORS + ACTIVITY */}
          <aside className="lobby-v4-side right-side">

            <div className="glass-panel-v4" style={{ marginBottom: '20px' }}>
              <h3 className="panel-title-v4"><Award size={16} /> Honors</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {(!user?.badges || user.badges.length === 0) ? (
                  <div style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>
                    No honors acquired yet.
                  </div>
                ) : (
                  user.badges.map(b => (
                    <div key={b.id} title={b.desc} style={{
                      background: 'rgba(0,255,115,0.1)', border: '1px solid rgba(0,255,115,0.4)',
                      borderRadius: '8px', padding: '6px 12px',
                      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default'
                    }}>
                      <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 5px rgba(0,255,115,0.8))' }}>
                        {b.icon}
                      </span>
                      <span className="font-orbitron" style={{ fontSize: '0.7rem', color: '#fff', letterSpacing: '1px' }}>
                        {b.name}
                      </span>
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
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: 'var(--neon-cyan)', marginTop: '6px',
                      boxShadow: '0 0 5px var(--neon-cyan)', flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, color: '#fff' }}>{act.text}</p>
                      <span style={{ fontSize: '0.65rem', color: '#666' }}>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>

        {/* FULLSCREEN BTN */}
        <button className="fs-btn-v4" onClick={toggleFullscreen} style={{ bottom: '20px', right: '20px' }}>
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        {/* SETTINGS BTN */}
        <button
          className="settings-btn-v4"
          onClick={() => setShowSettings(true)}
          style={{
            position: 'fixed', top: '20px', right: '20px',
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            color: '#fff', width: '50px', height: '50px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 100, backdropFilter: 'blur(10px)', transition: '0.3s'
          }}
        >
          <SettingsIcon size={22} className="hover-spin" />
        </button>

        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      </div>
    </>
  );
};

export default Lobby;
