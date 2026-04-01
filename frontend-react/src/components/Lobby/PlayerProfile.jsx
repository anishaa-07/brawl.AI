import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Coins, Shield } from 'lucide-react';

const avatars = [
  'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=250&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=250&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'
];

const PlayerProfile = ({ profile, playHover, playClick }) => {
  const { user } = useAuth();
  const [animatedXP, setAnimatedXP] = useState(0);

  const getRankData = (level) => {
    if (level < 10) return { name: 'Rookie', color: '#00f0ff' };
    if (level < 30) return { name: 'Warrior', color: '#a238ff' };
    if (level < 50) return { name: 'Gladiator', color: '#ff0055' };
    return { name: 'Legend', color: '#ffd700' };
  };

  const rankData = getRankData(profile.level);
  const avatarSrc = avatars[user.username.length % 3];
  const coins = 12450;
  const xpPercentage = Math.min((profile.xp / profile.maxXP) * 100, 100);

  // Animate XP bar from 0 to actual value
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500;
      const start = performance.now();
      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedXP(eased * xpPercentage);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, 300);
    return () => clearTimeout(timer);
  }, [xpPercentage]);

  return (
    <div className="anime-player-profile glow-border" style={{ '--rank-color': rankData.color }}>
      <div className="profile-header-anime">
        <div className="avatar-container-anime" onMouseEnter={playHover} onClick={playClick}>
          <div className="avatar-aura-effect avatar-aura-pulse" style={{ borderColor: rankData.color, boxShadow: `0 0 15px ${rankData.color}, inset 0 0 10px ${rankData.color}` }}></div>
          <img src={avatarSrc} alt="avatar" className="avatar-image-anime" />
          <div className="level-badge-anime font-orbitron">LVL {profile.level}</div>
          {/* Rank shine effect */}
          <div className="rank-shine-overlay"></div>
        </div>

        <div className="user-details-anime">
           <h2 className="font-orbitron cyber-text-shadow m-0 text-white" style={{ fontSize: '1.1rem' }}>{user.username.toUpperCase()}</h2>
           <div className="rank-display font-montserrat flex items-center gap-5" style={{ color: rankData.color }}>
             <Shield size={14} fill={rankData.color} /> 
             <span className="rank-badge-text">{rankData.name.toUpperCase()}</span>
           </div>
           
           <div className="coins-display font-orbitron flex items-center gap-5 mt-5 text-gold" style={{ fontSize: '0.8rem' }}>
             <Coins size={14} /> {coins.toLocaleString()} CR
           </div>
        </div>
      </div>

      <div className="xp-container-anime mt-15" style={{ marginTop: '15px' }}>
        <div className="xp-details-anime font-montserrat text-xs flex justify-between mb-5" style={{ marginBottom: '5px' }}>
          <span className="text-gray text-shadow-glow">NEXT RANK: {(profile.maxXP - profile.xp)} XP</span>
          <span className="text-white font-bold">{Math.round(animatedXP)}%</span>
        </div>
        <div className="xp-track-anime">
          <div className="xp-bar-anime xp-bar-glow" style={{ width: `${animatedXP}%`, background: `linear-gradient(90deg, ${rankData.color}, #fff)` }}>
            <div className="xp-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
