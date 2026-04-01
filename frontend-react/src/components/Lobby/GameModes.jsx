import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, User, Users, X, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';

const GameModes = ({ playHover, playClick, onModeHover }) => {
  const navigate = useNavigate();
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');

  const handleModeClick = (modeId, modeTitle) => {
    playClick();
    setSelectedMode(modeTitle);
    if (modeId === 'ai') {
      setShowDifficulty(true);
    } else {
      setShowComingSoon(true);
    }
  };

  const startBattle = (difficulty) => {
    playClick();
    navigate('/battle', { state: { difficulty } });
  };

  const modes = [
    { 
      id: 'ai', 
      title: 'Battle AI', 
      icon: <Swords size={48} />, 
      desc: 'Fight smart AI', 
      color: 'cyan',
      accent: '#00f0ff'
    },
    { 
      id: 'duel', 
      title: 'Duel Player', 
      icon: <User size={48} />, 
      desc: 'Challenge real players', 
      color: 'pink',
      accent: '#ff0055'
    },
    { 
      id: 'squad', 
      title: 'Squad Arena', 
      icon: <Users size={48} />, 
      desc: 'Multiplayer group battle', 
      color: 'purple',
      accent: '#a238ff'
    }
  ];

  return (
    <section className="anime-modes-section premium-dashboard">
      <div className="section-title-anime" style={{ marginBottom: '30px', textAlign: 'center', width: '100%' }}>
        <h2 className="font-orbitron cyber-text-glow" style={{ fontSize: '2rem', margin: '0 auto' }}>SELECT MISSION PROTOCOL</h2>
        <p style={{ margin: '10px 0 0', fontSize: '1rem', color: '#a0a0a0', fontFamily: 'Montserrat, sans-serif' }}>Deploy into high-fidelity combat zones</p>
      </div>

      <div className="premium-gm-grid">
         {modes.map((mode) => (
           <div 
             key={mode.id}
             className={`premium-gm-card gm-${mode.color}`}
             onClick={() => handleModeClick(mode.id, mode.title)}
             onMouseEnter={() => { playHover(); onModeHover(true); }}
             onMouseLeave={() => onModeHover(false)}
             style={{ '--card-accent': mode.accent }}
           >
             <div className={`premium-gm-icon gm-icon-${mode.color}`}>
               {mode.icon}
             </div>
             
             <div className="premium-card-info">
               <h3 className="premium-gm-title font-orbitron">{mode.title}</h3>
               <p className="premium-gm-desc font-montserrat">{mode.desc}</p>
             </div>

             <div className="premium-card-footer">
               <span className="premium-status-indicator"></span>
               <span className="premium-status-text">INITIALIZING...</span>
             </div>
             
             <div className="card-surface-reflection"></div>
             <div className={`premium-gm-glow gm-glow-${mode.color}`}></div>
           </div>
         ))}
      </div>

      {/* Difficulty Selector Modal */}
      {showDifficulty && (
        <div className="coming-soon-overlay" onClick={() => setShowDifficulty(false)}>
          <div className="difficulty-modal modal-pulse" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDifficulty(false)}>
              <X size={20} />
            </button>
            <div className="modal-content">
              <h2 className="font-orbitron text-primary mb-10">SELECT DIFFICULTY</h2>
              <p className="font-montserrat mb-20 text-gray text-xs">Choose the AI core complexity level</p>
              
              <div className="difficulty-grid">
                <div className="diff-option easy" onClick={() => startBattle('Easy')}>
                  <ShieldCheck size={32} />
                  <span className="font-orbitron">EASY</span>
                  <p className="font-montserrat">Training Core</p>
                </div>
                <div className="diff-option medium" onClick={() => startBattle('Normal')}>
                  <ShieldAlert size={32} />
                  <span className="font-orbitron">NORMAL</span>
                  <p className="font-montserrat">Neural Core</p>
                </div>
                <div className="diff-option hard" onClick={() => startBattle('Hard')}>
                  <ShieldOff size={32} />
                  <span className="font-orbitron">HARD</span>
                  <p className="font-montserrat">Elite Core</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="coming-soon-overlay" onClick={() => setShowComingSoon(false)}>
          <div className="coming-soon-modal modal-pulse" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowComingSoon(false)}>
              <X size={20} />
            </button>
            <div className="modal-content">
              <h2 className="font-orbitron text-primary">{selectedMode}</h2>
              <p className="font-montserrat">Mode coming soon...</p>
              <div className="modal-progress-bar">
                <div className="modal-progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GameModes;


