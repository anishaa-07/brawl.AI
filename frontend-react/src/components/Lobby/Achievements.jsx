import React from 'react';
import { Award, Zap, Shield, Crown } from 'lucide-react';

const Achievements = ({ playHover, playClick }) => {
  const achievements = [
    { title: 'First Win', desc: 'Secure your first victory', icon: <Award size={24} className="text-primary" />, status: 'COMPLETED' },
    { title: 'Win Streak', desc: 'Win 5 matches in a row', icon: <Zap size={24} className="text-secondary" />, status: 'COMPLETED' },
    { title: '10 Matches Played', desc: 'Participate in 10 battles', icon: <Shield size={24} className="text-neon" />, status: 'IN PROGRESS' },
    { title: 'Legendary Gladiator', desc: 'Reach Legend Rank', icon: <Crown size={24} className="text-gold" />, status: 'LOCKED' },
  ];

  return (
    <div className="anime-achievements-panel glow-border flex-col h-full mx-auto" style={{ maxWidth: '800px', width: '100%' }}>
      <div className="anime-panel-header p-20 border-b border-gray">
         <h2 className="font-orbitron cyber-text-shadow text-white text-xl m-0 flex items-center gap-10">
           <Award className="text-primary" /> MEDALS OF HONOR
         </h2>
      </div>

      <div className="achievements-list flex-col gap-15 p-20 overflow-y-auto w-full flex-1 custom-scrollbar">
        {achievements.map((a, i) => (
          <div key={i} className={`achievement-item flex items-center justify-between p-20 border rounded cursor-pointer transition-all hover-border-primary bg-black-50 ${a.status === 'LOCKED' ? 'opacity-50 grayscale-100' : ''}`} onMouseEnter={playHover} onClick={playClick}>
            <div className="flex items-center gap-20">
              <div className="ach-icon bg-opacity-20 p-15 rounded">
                {a.icon}
              </div>
              <div>
                <h3 className="font-orbitron text-lg m-0 text-white">{a.title}</h3>
                <p className="font-montserrat text-sm text-gray mt-5 m-0 block">{a.desc}</p>
              </div>
            </div>
            <div className="ach-status font-orbitron text-xs font-bold rounded py-5 px-10 border border-current"
                 style={{ 
                   color: a.status === 'COMPLETED' ? 'var(--primary)' : a.status === 'IN PROGRESS' ? 'var(--secondary)' : 'var(--dark-gray)' 
                 }}>
              {a.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
