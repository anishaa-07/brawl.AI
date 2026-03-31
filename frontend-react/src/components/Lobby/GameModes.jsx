import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Swords, Users, Trophy } from 'lucide-react';

const GameModes = ({ playHover, playClick, startMatchmaking }) => {
  const navigate = useNavigate();
  const [showAiSubmenu, setShowAiSubmenu] = useState(false);

  const handleModeClick = (id) => {
    playClick();
    if (id === 'ai') {
       setShowAiSubmenu(true);
    } else if (id === 'duel' || id === 'squad') {
       startMatchmaking(id);
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
      <section className="anime-modes-section h-full flex flex-col justify-center items-center">
         <div className="bg-black-70 glow-border p-25 rounded-xl border border-primary w-full max-w-lg text-center mx-auto" style={{ maxWidth: '500px' }}>
            <Bot size={40} className="text-primary mb-10 mx-auto" />
            <h2 className="font-orbitron cyber-text-shadow text-white mb-20">SELECT AI PERSONALITY</h2>
            
            <div className="flex-col gap-15 w-full">
              {aiModes.map(m => (
                <button 
                  key={m.id} 
                  className="ai-diff-btn font-orbitron w-full px-20 py-15 bg-opacity-20 flex justify-between items-center rounded cursor-pointer transition-all hover:scale-105 border"
                  style={{ borderColor: m.color, color: m.color, background: 'rgba(0,0,0,0.5)' }}
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
            >
               RETURN
            </button>
         </div>
      </section>
    );
  }

  const modes = [
    { id: 'ai', title: 'AI Showdown', icon: <Bot size={28} />, desc: 'Train your reflexes against neural bots.', tag: 'TRAINING', color: 'cyan', bgImg: 'url("https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2070&auto=format&fit=crop")' },
    { id: 'duel', title: 'Quick Match', icon: <Swords size={28} />, desc: 'Jump into intense 1v1 arenas.', tag: 'CASUAL', color: 'pink', bgImg: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop")' },
    { id: 'squad', title: 'Ranked Match', icon: <Users size={28} />, desc: 'Climb the global ladder.', tag: 'COMPETITIVE', color: 'purple', bgImg: 'url("https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop")' },
    { id: 'custom', title: 'Custom Room', icon: <Trophy size={28} />, desc: 'Host your own ruleset.', tag: 'PRIVATE', color: 'gold', bgImg: 'url("https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop")' }
  ];

  return (
    <section className="anime-modes-section">
      <div className="section-title-anime">
        <h2 className="font-orbitron cyber-text-glow">SELECT ARENA</h2>
      </div>

      <div className="anime-modes-grid">
         {modes.map((mode) => (
           <div 
             key={mode.id}
             className={`anime-card color-theme-${mode.color}`}
             onClick={() => handleModeClick(mode.id)}
             onMouseEnter={playHover}
           >
             <div className="anime-card-bg" style={{ backgroundImage: mode.bgImg }}></div>
             <div className="anime-card-overlay"></div>
             <div className="anime-card-content">
               <div className="anime-tag-bar">
                 <span className="anime-tag">{mode.tag}</span>
               </div>
               
               <div className="anime-card-center">
                 <div className="anime-icon-wrapper">{mode.icon}</div>
                 <h2 className="font-orbitron anime-title">{mode.title}</h2>
                 <p className="font-montserrat anime-desc">{mode.desc}</p>
               </div>
               
               <div className="anime-card-action">
                 <button className="anime-btn font-orbitron">{mode.id === 'custom' ? 'CREATE' : 'ENTER'}</button>
               </div>
             </div>
           </div>
         ))}
      </div>
    </section>
  );
};

export default GameModes;
