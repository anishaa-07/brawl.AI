import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

const feedTemplates = [
  { text: 'CyberShark defeated NeonSamurai', type: 'kill', emoji: '🔥' },
  { text: 'VoidWalker reached GRANDMASTER rank', type: 'rank', emoji: '👑' },
  { text: 'New tournament starting in 5 min', type: 'event', emoji: '⚡' },
  { text: 'Akira2049 won 10 matches in a row', type: 'streak', emoji: '🔥' },
  { text: 'GlitchTrap unlocked Legendary Skin', type: 'unlock', emoji: '✨' },
  { text: 'DragonPulse eliminated 3 squad members', type: 'kill', emoji: '💀' },
  { text: 'Weekly rewards are now claimable', type: 'event', emoji: '🎁' },
  { text: 'PhantomBlade achieved 2500 ELO', type: 'rank', emoji: '🏆' },
  { text: 'Server maintenance in 30 minutes', type: 'system', emoji: '⚠️' },
  { text: 'NeonSword defeated AI Boss on INSANE', type: 'kill', emoji: '⚔️' },
  { text: 'New map "Neon District" now available', type: 'event', emoji: '🗺️' },
  { text: 'HyperStrike joined Squad Battle lobby', type: 'join', emoji: '🎮' },
];

const BattleFeed = ({ playHover }) => {
  const [feed, setFeed] = useState(() => feedTemplates.slice(0, 5));
  const [activePlayers] = useState(() => Math.floor(Math.random() * 200) + 80);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prev => {
        const remaining = feedTemplates.filter(t => !prev.find(p => p.text === t.text));
        const pool = remaining.length > 0 ? remaining : feedTemplates;
        const next = pool[Math.floor(Math.random() * pool.length)];
        const newItem = { ...next, id: Date.now(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        return [newItem, ...prev.slice(0, 6)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type) => {
    switch(type) {
      case 'kill': return 'var(--neon)';
      case 'rank': return 'var(--gold)';
      case 'event': return 'var(--primary)';
      case 'streak': return '#ff6a00';
      case 'unlock': return 'var(--secondary)';
      case 'system': return '#ff4444';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="battle-feed-panel glow-border">
      <div className="anime-panel-header">
        <h3 className="font-orbitron cyber-text-shadow m-0" style={{ fontSize: '0.85rem' }}>
          <Flame size={14} className="inline" style={{ marginRight: '6px', color: 'var(--neon)' }} />
          LIVE BATTLE FEED
        </h3>
        <div className="bf-live-dot-wrap">
          <span className="bf-live-dot"></span>
          <span className="font-orbitron text-xs text-neon">{activePlayers} LIVE</span>
        </div>
      </div>

      <div className="bf-feed-list custom-scrollbar">
        {feed.map((item, i) => (
          <div 
            key={item.id || i}
            className="bf-item"
            onMouseEnter={playHover}
            style={{ 
              animationDelay: `${i * 0.08}s`,
              borderLeftColor: getTypeColor(item.type)
            }}
          >
            <span className="bf-emoji">{item.emoji}</span>
            <span className="bf-text font-montserrat">{item.text}</span>
            {item.timestamp && <span className="bf-time font-orbitron">{item.timestamp}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleFeed;
