import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords, Users, Target, Activity, Crown, LogOut,
  User, Award, Zap, Shield, Maximize2, Minimize2,
  MessageSquare, Send, Settings as SettingsIcon, Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_QUESTIONS } from '../data/questionsDB';
import SettingsModal from '../components/SettingsModal';
import './Lobby.css';

const CHAT_MSGS = [
  { user: 'VOID_WALKER', msg: 'gg ez round lmao', time: '2m' },
  { user: 'CYBER_X77', msg: 'anyone queue squad?', time: '4m' },
  { user: 'NEURAL_CRUSH', msg: 'that last problem was insane', time: '7m' },
  { user: 'ANON_99', msg: 'battled the AI at hard mode 🔥', time: '12m' },
];

const ACTIVITY = [
  { icon: '⚡', text: 'Victory in AI Core — +120 XP', time: '2m ago', color: '#00ff88' },
  { icon: '📈', text: 'Level Up: 4 → 5', time: '1h ago', color: '#a855f7' },
  { icon: '🎁', text: 'Daily Bonus Claimed — +200 Credits', time: '3h ago', color: '#ffbd2e' },
  { icon: '🏆', text: 'Badge Unlocked: Code Ninja', time: '5h ago', color: '#00f2ff' },
  { icon: '💥', text: '3x Combo Streak achieved', time: '6h ago', color: '#ff4060' },
];

const GAME_MODES = [
  {
    id: 'ai',
    icon: <Swords size={30} />,
    title: 'BATTLE AI',
    desc: 'Test your logic against the neural core.',
    tag: 'ACTIVE',
    color: '#00ff88',
    minLevel: 1,
  },
  {
    id: 'duel',
    icon: <Users size={30} />,
    title: 'DUEL PLAYER',
    desc: 'Ranked matchmaking against live pilots.',
    tag: 'LVL 2+',
    color: '#a855f7',
    minLevel: 2,
  },
  {
    id: 'squad',
    icon: <Target size={30} />,
    title: 'SQUAD ARENA',
    desc: 'Tactical 3v3 team skirmish mode.',
    tag: 'LVL 3+',
    color: '#00f2ff',
    minLevel: 3,
  },
];

const Lobby = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState(CHAT_MSGS);
  const [selectedMode, setSelectedMode] = useState('ai');
  const [isBooting, setIsBooting] = useState(
    () => !sessionStorage.getItem('brawl_booted')
  );
  const chatEndRef = useRef(null);

  const currentLevel = user?.level || 1;
  const currentXP = user?.xp || 0;
  const xpInLevel = currentXP % 100;
  const xpPercent = Math.min(100, xpInLevel);
  const accuracy = user?.totalAttempts
    ? Math.round(((user?.totalCorrect || 0) / user.totalAttempts) * 100)
    : 0;

  useEffect(() => {
    if (isBooting) {
      const t = setTimeout(() => {
        setIsBooting(false);
        sessionStorage.setItem('brawl_booted', 'true');
      }, 2600);
      return () => clearTimeout(t);
    }
  }, [isBooting]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatLog(prev => [...prev, {
      user: user?.username || 'YOU',
      msg: chatInput.trim(),
      time: 'now',
    }]);
    setChatInput('');
  };

  const startBattle = (mode) => {
    if (mode === 'quick' || mode === 'ai') {
      const q = ALL_QUESTIONS[Math.floor(Math.random() * ALL_QUESTIONS.length)];
      navigate('/battle', { state: { selectedQuestion: q, difficulty: q.difficulty } });
    } else {
      navigate('/question-hub');
    }
  };

  const handleInitiateCombat = () => {
    const mode = GAME_MODES.find(m => m.id === selectedMode);
    if (mode && currentLevel >= mode.minLevel) {
      startBattle(selectedMode);
    }
  };

  return (
    <>
      {/* ── Boot Screen ── */}
      {isBooting && (
        <div className="lob-boot">
          <div className="lob-boot-inner">
            <div className="lob-boot-logo font-orbitron">BRAWL.AI</div>
            <p className="lob-boot-sub font-orbitron">INITIALIZING COMMAND CENTER...</p>
            <div className="lob-boot-bar"><div className="lob-boot-fill" /></div>
          </div>
        </div>
      )}

      <div className={`lob-root${isBooting ? ' lob-hidden' : ' lob-visible'}`}>

        {/* ── Background ── */}
        <div className="lob-bg" aria-hidden="true">
          <div className="lob-bg-grid" />
          <div className="lob-bg-glow" />
        </div>

        {/* ══ TOP BAR ══ */}
        <header className="lob-topbar">
          <div className="lob-topbar-brand font-orbitron">
            <Zap size={18} className="lob-brand-icon" />
            BRAWL.AI
            <span className="lob-brand-tag">COMMAND CENTER</span>
          </div>

          <div className="lob-topbar-hud font-orbitron">
            <div className="lob-hud-item">
              <span className="lob-hud-label">PILOT</span>
              <span className="lob-hud-val">{user?.username || 'ANON'}</span>
            </div>
            <div className="lob-hud-divider" />
            <div className="lob-hud-item">
              <span className="lob-hud-label">LEVEL</span>
              <span className="lob-hud-val lob-val-cyan">{currentLevel}</span>
            </div>
            <div className="lob-hud-divider" />
            <div className="lob-hud-item xp-item">
              <span className="lob-hud-label">XP {xpInLevel}/100</span>
              <div className="lob-xp-track">
                <div
                  className="lob-xp-fill"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
            <div className="lob-hud-divider" />
            <div className="lob-hud-item">
              <span className="lob-hud-label">CREDITS</span>
              <span className="lob-hud-val lob-val-gold">
                {user?.credits || 0} ₢
              </span>
            </div>
          </div>

          <div className="lob-topbar-actions">
            <button className="lob-icon-btn" onClick={toggleFullscreen} title="Fullscreen">
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button className="lob-icon-btn" onClick={() => setShowSettings(true)} title="Settings">
              <SettingsIcon size={16} />
            </button>
            <button className="lob-icon-btn lob-logout-btn" onClick={() => { logout(); navigate('/login'); }} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* ══ MAIN GRID ══ */}
        <div className="lob-grid">

          {/* ── LEFT: Player Profile ── */}
          <aside className="lob-panel lob-left">
            <div className="lob-panel-title font-orbitron">
              <User size={14} /> PILOT PROFILE
            </div>

            {/* Avatar */}
            <div className="lob-avatar-wrap">
              <div className="lob-avatar-ring" />
              <div className="lob-avatar">
                <User size={44} />
              </div>
              <div className="lob-avatar-rank font-orbitron">
                {user?.rank || 'BRONZE III'}
              </div>
            </div>

            <h2 className="lob-pilot-name font-orbitron">
              {user?.username || 'ANON_USER'}
            </h2>
            <p className="lob-pilot-class font-orbitron">TITAN-CLASS OPERATOR</p>

            {/* Stats grid */}
            <div className="lob-stat-grid">
              {[
                { label: 'BATTLES', val: user?.totalBattles || 0, color: '#fff' },
                { label: 'WINS', val: user?.wins || 0, color: '#00ff88' },
                { label: 'ACCURACY', val: `${accuracy}%`, color: '#00f2ff' },
                { label: 'MAX COMBO', val: `${user?.highestCombo || 0}🔥`, color: '#ffbd2e' },
              ].map((s, i) => (
                <div key={i} className="lob-stat-cell">
                  <span className="lob-stat-label font-orbitron">{s.label}</span>
                  <span className="lob-stat-val font-orbitron" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="lob-panel-title font-orbitron" style={{ marginTop: '20px' }}>
              <Award size={14} /> HONORS
            </div>
            <div className="lob-badges">
              {(!user?.badges || user.badges.length === 0) ? (
                <p className="lob-empty-text">No honors yet. Win battles to earn badges.</p>
              ) : (
                user.badges.map(b => (
                  <div key={b.id} className="lob-badge" title={b.desc}>
                    <span className="lob-badge-icon">{b.icon}</span>
                    <span className="font-orbitron lob-badge-name">{b.name}</span>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* ── CENTER: Game Modes ── */}
          <main className="lob-center">
            <div className="lob-panel-title font-orbitron lob-modes-title">
              <Radio size={14} /> SELECT COMBAT PROTOCOL
            </div>

            <div className="lob-modes">
              {GAME_MODES.map(mode => {
                const locked = currentLevel < mode.minLevel;
                const active = selectedMode === mode.id;
                return (
                  <div
                    key={mode.id}
                    className={`lob-mode-card${active ? ' lob-mode-active' : ''}${locked ? ' lob-mode-locked' : ''}`}
                    style={{ '--mode-color': mode.color }}
                    onClick={() => !locked && setSelectedMode(mode.id)}
                  >
                    <div className="lob-mode-glow" />
                    <div className="lob-mode-icon" style={{ color: mode.color }}>
                      {mode.icon}
                    </div>
                    <div className="lob-mode-body">
                      <h3 className="font-orbitron lob-mode-title">{mode.title}</h3>
                      <p className="lob-mode-desc">{locked ? `Unlocks at Level ${mode.minLevel}` : mode.desc}</p>
                    </div>
                    <span
                      className="lob-mode-tag font-orbitron"
                      style={{ color: mode.color, borderColor: mode.color }}
                    >
                      {locked ? '🔒 LOCKED' : mode.tag}
                    </span>
                    {active && !locked && <div className="lob-mode-active-bar" style={{ background: mode.color }} />}
                  </div>
                );
              })}
            </div>

            {/* ── Big CTA ── */}
            <button
              className="lob-cta font-orbitron"
              onClick={handleInitiateCombat}
            >
              <span className="lob-cta-text">⚡ INITIATE COMBAT</span>
              <span className="lob-cta-glow" />
            </button>

            {/* Quick battle shortcut */}
            <button
              className="lob-quick font-orbitron"
              onClick={() => startBattle('quick')}
            >
              <Zap size={14} /> QUICK BATTLE (RANDOM)
            </button>
          </main>

          {/* ── RIGHT: Activity + Chat ── */}
          <aside className="lob-panel lob-right">

            {/* Activity Log */}
            <div className="lob-panel-title font-orbitron">
              <Activity size={14} /> ACTIVITY LOG
            </div>
            <div className="lob-activity">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="lob-activity-item">
                  <span className="lob-activity-dot" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                  <div className="lob-activity-body">
                    <p className="lob-activity-text">{a.icon} {a.text}</p>
                    <span className="lob-activity-time">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat */}
            <div className="lob-panel-title font-orbitron" style={{ marginTop: '20px' }}>
              <MessageSquare size={14} /> GLOBAL COMMS
            </div>
            <div className="lob-chat">
              <div className="lob-chat-msgs">
                {chatLog.map((m, i) => (
                  <div key={i} className="lob-chat-msg">
                    <span
                      className="lob-chat-user font-orbitron"
                      style={{ color: m.user === (user?.username || 'YOU') ? '#00ff88' : '#a855f7' }}
                    >
                      {m.user}
                    </span>
                    <span className="lob-chat-text">{m.msg}</span>
                    <span className="lob-chat-time">{m.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form className="lob-chat-form" onSubmit={sendChat}>
                <input
                  className="lob-chat-input font-orbitron"
                  placeholder="TRANSMIT MESSAGE..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  maxLength={80}
                />
                <button type="submit" className="lob-chat-send">
                  <Send size={14} />
                </button>
              </form>
            </div>

            {/* Leaderboard mini */}
            <div className="lob-panel-title font-orbitron" style={{ marginTop: '20px' }}>
              <Crown size={14} /> TOP PILOTS
            </div>
            <div className="lob-leaders">
              {[
                { rank: 1, name: 'NEURAL_CRUSHER', lvl: 99, color: '#ffbd2e' },
                { rank: 2, name: 'VOID_WALKER', lvl: 85, color: '#c0c0c0' },
                { rank: 3, name: 'CYBER_PUNK_77', lvl: 72, color: '#cd7f32' },
              ].map(p => (
                <div key={p.rank} className="lob-leader-row">
                  <span className="lob-leader-rank font-orbitron" style={{ color: p.color }}>#{p.rank}</span>
                  <span className="lob-leader-name font-orbitron">{p.name}</span>
                  <span className="lob-leader-lvl font-orbitron">LVL {p.lvl}</span>
                </div>
              ))}
            </div>

          </aside>
        </div>

        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </div>
    </>
  );
};

export default Lobby;
