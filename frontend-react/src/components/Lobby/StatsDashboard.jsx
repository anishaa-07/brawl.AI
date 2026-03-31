import React from 'react';
import { Swords, Trophy, Flame } from 'lucide-react';

const StatsDashboard = ({ stats }) => {
  return (
    <div className="anime-stats-dashboard glow-border mt-20">
      <div className="anime-panel-header">
         <h3 className="section-header font-orbitron m-0 cyber-text-shadow">COMBAT TELEMETRY</h3>
      </div>
      
      <div className="stats-grid-anime p-15">
        <div className="stat-box-anime flex-col items-center p-10 bg-black-50 rounded border border-gray hover-border-primary transition-all">
          <Swords size={20} className="text-secondary mb-5" />
          <span className="font-orbitron text-xl font-bold text-white">{stats.totalMatches}</span>
          <span className="font-montserrat text-xs text-gray uppercase tracking-widest mt-5">Matches</span>
        </div>
        
        <div className="stat-box-anime flex-col items-center p-10 bg-black-50 rounded border border-gray hover-border-primary transition-all">
          <Trophy size={20} className="text-primary mb-5" />
          <span className="font-orbitron text-xl font-bold text-white">{stats.winRate}</span>
          <span className="font-montserrat text-xs text-gray uppercase tracking-widest mt-5">Win Rate</span>
        </div>
        
        <div className="stat-box-anime flex-col items-center p-10 bg-black-50 rounded border border-gray hover-border-primary transition-all col-span-2 mt-10">
          <Flame size={20} className="text-neon mb-5" />
          <span className="font-orbitron text-xl font-bold text-white">{stats.streak}</span>
          <span className="font-montserrat text-xs text-gray uppercase tracking-widest mt-5">Highest Win Streak</span>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
