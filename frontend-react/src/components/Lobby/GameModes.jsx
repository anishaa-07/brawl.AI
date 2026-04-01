import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Swords, Users, Trophy, Zap, Rocket, User, Crosshair } from 'lucide-react';

const GameModes = ({ playHover, playClick, startMatchmaking }) => {
  const navigate = useNavigate();
  const [showAiSubmenu, setShowAiSubmenu] = useState(false);

  const handleModeClick = (id) => {
    playClick();
    if (id === 'solo') {
       setShowAiSubmenu(true);
    } else if (id === 'duel' || id === 'squad') {
       startMatchmaking(id);
    } else if (id === 'practice') {
       navigate('/battle', { state: { difficulty: 'easy' } });
    } else if (id === 'quick') {
       startMatchmaking('quick');
    } else {
       navigate('/leaderboard');
    }
  };

  const startAiMatch = (difficulty) => {
    playClick();
    navigate('/battle', { state: { difficulty } });
  };

  const aiModes = [
     { id: 'easy', label: 'EASY', desc: 'Predictable patterns', color: 'var(--primary)' },
     { id: 'smart', label: 'SMART', desc: 'Adaptive learning algorithm', color: 'var(--secondary)' },
     { id: 'aggressive', label: 'AGGRESSIVE', desc: 'Relentless offensive neural net', color: 'var(--neon)' }
  ];

  if (showAiSubmenu) {
    return (
      <section className="anime-modes-section h-full flex flex-col items-center" style={{ justifyContent: 'center' }}>
         <div className="bg-black-70 glow-border p-25 rounded border border-primary text-center" style={{ maxWidth: '400px', width: '100%', padding: '30px', margin: '0 auto' }}>
            <Bot size={40} className="text-primary mb-10" style={{ margin: '0 auto 10px auto' }} />
            <h2 className="font-orbitron cyber-text-shadow text-white mb-20">SELECT AI PERSONALITY</h2>
            
            <div className="flex-col w-full" style={{ gap: '15px' }}>
              {aiModes.map(m => (
                <button 
                  key={m.id} 
                  className="ai-diff-btn font-orbitron w-full bg-opacity-20 flex justify-between items-center rounded cursor-pointer transition-all border"
                  style={{ borderColor: m.color, color: m.color, background: 'rgba(0,0,0,0.5)', padding: '15px 20px', margin: '5px 0' }}
                  onClick={() => startAiMatch(m.id)}
                  onMouseEnter={playHover}
                >
                  <span className="font-bold text-lg">{m.label}</span>
                  <span className="font-montserrat text-xs text-gray">{m.desc}</span>
                </button>
              ))}
            </div>

            <button 
               className="mt-20 font-orbitron text-gray bg-transparent border-none underline cursor-pointer hover:text-white"
               onClick={() => setShowAiSubmenu(false)}
               onMouseEnter={playHover}
               style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#a0a0a0', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Orbitron, sans-serif' }}
            >
               RETURN
            </button>
         </div>
      </section>
    );
  }

  const modes = [
    { id: 'solo', title: 'Solo Mode', icon: <User size={32} />, desc: 'Test your AI logic against the machine.', badge: 'POPULAR', color: 'cyan' },
    { id: 'duel', title: 'Duel Mode', icon: <Crosshair size={32} />, desc: '1v1 high-stakes battle against another pilot.', badge: 'HOT', color: 'pink' },
    { id: 'squad', title: 'Squad Battle', icon: <Users size={32} />, desc: 'Coordinate multiplayer assaults as a team.', badge: 'NEW', color: 'purple' },
    { id: 'practice', title: 'Practice Arena', icon: <Zap size={32} />, desc: 'Refine algorithms without losing rank.', badge: '', color: 'blue' },
    { id: 'quick', title: 'Quick Match', icon: <Rocket size={32} />, desc: 'Jump into casual, unranked combat.', badge: '', color: 'green' }
  ];

  return (
    <section className="anime-modes-section">
      <div className="section-title-anime" style={{ marginBottom: '15px' }}>
        <h2 className="font-orbitron cyber-text-glow" style={{ fontSize: '1.4rem', margin: 0 }}>CHOOSE YOUR BATTLE MODE</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#a0a0a0', fontFamily: 'Montserrat, sans-serif', borderBottom: 'none' }}>Enter the arena and prove your dominance</p>
      </div>

      <div className="lobby-gm-grid">
         {modes.map((mode) => (
           <div 
             key={mode.id}
             className={`lobby-gm-card lgm-${mode.color}`}
             onClick={() => handleModeClick(mode.id)}
             onMouseEnter={playHover}
           >
             {mode.badge && <span className={`lobby-gm-badge lgm-badge-${mode.color}`}>{mode.badge}</span>}
             
             <div className={`lobby-gm-icon lgm-icon-${mode.color}`}>
               {mode.icon}
             </div>
             <h3 className="lobby-gm-title font-orbitron">{mode.title}</h3>
             <p className="lobby-gm-desc font-montserrat">{mode.desc}</p>
             
             <button 
                className={`lobby-gm-btn lgm-btn-${mode.color} font-orbitron`}
                onMouseEnter={playHover}
             >
                PLAY NOW
             </button>
             
             <div className={`lobby-gm-glow lgm-glow-${mode.color}`}></div>
           </div>
         ))}
      </div>
    </section>
  );
};

export default GameModes;
