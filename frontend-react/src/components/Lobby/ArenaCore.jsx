import React, { useState, useEffect } from 'react';

const ArenaCore = ({ isHovered }) => {
  const [playerCount, setPlayerCount] = useState(126);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`arena-core-system ${isHovered ? 'core-boosted' : ''}`}>
      {/* Massive Background Glow */}
      <div className="core-bg-blur"></div>

      {/* Rotating Sci-Fi Rings */}
      <div className="reactor-rings">
        <div className="ring r1"></div>
        <div className="ring r2"></div>
        <div className="ring r3"></div>
        <div className="ring r4"></div>
      </div>

      {/* Orbiting Particles */}
      <div className="orbit-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`p-dot p${i+1}`}></div>
        ))}
      </div>

      {/* Central Holographic Display */}
      <div className="core-display">
        <div className="core-inner-glow"></div>
        <div className="core-content font-orbitron">
          <div className="core-number animate-pulse">{playerCount}</div>
          <div className="core-status font-montserrat">PLAYERS FIGHTING NOW&nbsp;⚡</div>
        </div>
      </div>

      {/* Radial Scanner Effect */}
      <div className="core-scanner"></div>
    </div>
  );
};

export default ArenaCore;
