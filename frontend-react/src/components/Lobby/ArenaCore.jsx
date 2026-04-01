import React, { useState, useEffect } from 'react';

const ArenaCore = () => {
  const [playerCount, setPlayerCount] = useState(123);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="arena-core-widget">
      <div className="ac-ring ac-ring-outer"></div>
      <div className="ac-ring ac-ring-inner"></div>
      <div className="ac-core-center">
        <span className="ac-count font-orbitron">{playerCount}</span>
        <span className="ac-label font-montserrat">PILOTS FIGHTING&nbsp;⚡</span>
      </div>
      <div className="ac-pulse"></div>
    </div>
  );
};

export default ArenaCore;
