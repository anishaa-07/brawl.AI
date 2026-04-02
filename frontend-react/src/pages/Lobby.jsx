import React from 'react';
import './Lobby.css';

const Lobby = () => {
  // 👤 PLAYER PROFILE STATUS SYSTEM
  const [profile, setProfile] = React.useState({
    username: 'PlayerX',
    level: 1,
    xp: 0,
    coins: 250
  });

  React.useEffect(() => {
    // 💾 Load from localStorage
    const saved = localStorage.getItem('brawl_profile');
    let currentProfile = saved ? JSON.parse(saved) : profile;

    // 🚀 Simulate XP gain on load
    currentProfile.xp += 10;
    if (currentProfile.xp >= 100) {
      currentProfile.level += 1;
      currentProfile.xp = 0;
    }

    setProfile(currentProfile);
    localStorage.setItem('brawl_profile', JSON.stringify(currentProfile));
  }, []);

  return (
    <div className="lobby-wrapper">
      {/* BACKGROUND PARTICLES LAYER */}
      <div className="bg-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="container">
        
        {/* LEFT SIDEBAR */}
        <div className="left">
          <div className="simple-card">
            <h3>TELEMETRY</h3>
            <p>System Online: 100%</p>
            <p>Neural Link: Active</p>
          </div>
          <div className="simple-card">
            <h3>BOUNTY BOARD</h3>
            <ul>
              <li>Neutralize 5 AI Units</li>
              <li>Complete 1 Duel</li>
            </ul>
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="center">
          <div className="center-content">
            <h1 className="mission-title">SELECT MISSION PROTOCOL</h1>
            
            <div className="mission-grid">
              <div className="mission-box">
                <h2>BATTLE AI</h2>
                <p>Train against advanced neural networks.</p>
              </div>
              <div className="mission-box">
                <h2>DUEL PLAYER</h2>
                <p>Ranked 1v1 combat engagement.</p>
              </div>
              <div className="mission-box">
                <h2>SQUAD ARENA</h2>
                <p>Team-based tactical skirmish.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="right">
          {/* FUNCTIONAL PLAYER PROFILE */}
          <div className="profile-card simple-card">
            <div className="profile-header">
               <span className="username font-orbitron">{profile.username}</span>
               <span className="level text-secondary">Lv. {profile.level}</span>
            </div>
            
            <div className="xp-container">
               <div className="xp-header">
                 <span>XP FEED</span>
                 <span>{profile.xp} / 100</span>
               </div>
               <div className="xp-track">
                  <div className="xp-fill" style={{ width: `${profile.xp}%` }}></div>
               </div>
            </div>

            <div className="coins-display text-primary">
               <span>CREDITS: {profile.coins} CR</span>
            </div>
          </div>

          <div className="simple-card">
            <h3>OPERATORS</h3>
            <p>No active units deployed.</p>
          </div>
          
          <div className="simple-card chat-section">
            <h3>CHAT</h3>
            <div className="chat-content">
              Welcome to the Hub.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


export default Lobby;
