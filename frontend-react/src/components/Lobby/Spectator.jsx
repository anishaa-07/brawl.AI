import React from 'react';
import { Eye, Play } from 'lucide-react';

const Spectator = ({ playHover, playClick }) => {
  const matches = [
    { p1: 'CyberShark', p2: 'NeonSamurai', rank: 'Legend', time: '12:04' },
    { p1: 'VoidWalker', p2: 'Akira2049', rank: 'Gladiator', time: '04:22' },
    { p1: 'GlitchTrap', p2: 'ZeroNull', rank: 'Warrior', time: '08:55' },
  ];

  return (
    <div className="anime-spectator-panel glow-border flex-col h-full w-full mx-auto" style={{ maxWidth: '800px', width: '100%' }}>
      <div className="anime-panel-header p-20 border-b border-gray">
         <h2 className="font-orbitron cyber-text-shadow text-white text-xl m-0 flex items-center gap-10">
           <Eye className="text-primary" /> SPECTATOR NETWORK
         </h2>
      </div>

      <div className="spectator-list flex-col gap-15 p-20 overflow-y-auto w-full flex-1 custom-scrollbar">
        {matches.map((m, i) => (
          <div key={i} className="spectator-item flex items-center justify-between p-20 border rounded transition-all hover-border-primary bg-black-50 group cursor-pointer" onMouseEnter={playHover} onClick={playClick}>
            
            <div className="flex items-center gap-20">
              <div className="live-icon bg-red-900 bg-opacity-20 p-10 rounded flex items-center gap-5 text-neon font-bold text-xs font-orbitron animate-pulse border border-neon">
                <span className="dot bg-neon rounded-full w-2 h-2" style={{ display: 'inline-block', width: '8px', height: '8px' }}></span>
                LIVE
              </div>
              
              <div className="match-info flex-col gap-5">
                <div className="font-orbitron text-white text-lg font-bold flex items-center gap-10">
                   {m.p1} <span className="text-secondary text-xs bg-black-70 px-5 rounded">VS</span> {m.p2}
                </div>
                <div className="font-montserrat text-xs text-gray tracking-widest uppercase">
                  Rank: {m.rank} | Duration: {m.time}
                </div>
              </div>
            </div>

            <button className="watch-btn font-orbitron text-xs font-bold text-black bg-primary px-15 py-10 rounded border-none cursor-pointer flex items-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: 0 }}>
               WATCH STREAM <Play size={14} fill="currentColor" />
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spectator;
