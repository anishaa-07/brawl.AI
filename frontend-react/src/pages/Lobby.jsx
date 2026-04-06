import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';
import { X } from 'lucide-react';

const Lobby = () => {
  const navigate = useNavigate();
  // 👤 PLAYER PROFILE STATUS SYSTEM
  const [profile, setProfile] = React.useState({
    username: 'PlayerX',
    level: 1,
    xp: 0,
    coins: 250
  });

  // 🛡️ MODAL SYSTEM
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');

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

  const handleDifficultySelect = (diff) => {
    setIsModalOpen(false);
    setStatusMessage(`Initializing AI Battle [${diff.toUpperCase()}]...`);
    setTimeout(() => {
      navigate('/battle', { state: { difficulty: diff } });
    }, 900);
  };

  return (
    <div className="lobby-wrapper">
      {/* 🌑 MODAL OVERLAY (DIM BACKGROUND) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') setIsModalOpen(false); }}>
          <div className="difficulty-modal glass-panel fadeInScale">
            {/* CLOSE BUTTON */}
            <button className="modal-close-x" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>

            <h2 className="modal-title font-orbitron">SELECT AI DIFFICULTY</h2>
            
            <div className="difficulty-grid">
              <div className="difficulty-card" onClick={() => handleDifficultySelect('Easy')}>
                <span className="diff-label text-primary">BEGINNER AI</span>
                <p className="diff-desc">Slow and predictable neural patterns.</p>
              </div>
              <div className="difficulty-card" onClick={() => handleDifficultySelect('Medium')}>
                <span className="diff-label text-secondary">SMART AI</span>
                <p className="diff-desc">Balanced tactical challenge.</p>
              </div>
              <div className="difficulty-card" onClick={() => handleDifficultySelect('Hard')}>
                <span className="diff-label text-neon">AGGRESSIVE AI</span>
                <p className="diff-desc">Competitive and hyper-fast response.</p>
              </div>
            </div>

            <button className="cancel-btn font-orbitron" onClick={() => setIsModalOpen(false)}>ABORT MISSION</button>
          </div>
        </div>
      )}


      {/* 🚀 STATUS MESSAGE */}
      {statusMessage && (
        <div className="status-toast font-orbitron animate-slide-up">
           {statusMessage}
        </div>
      )}

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
            <h1 className="mission-title">DASHBOARD COMMAND</h1>
            
            <div className="dashboard-layout-split">
              {/* LEFT: MISSION BOXES */}
              <div className="mission-stack">
                <div className="mission-box" onClick={() => setIsModalOpen(true)}>
                  <h2>BATTLE AI</h2>
                  <p>Train against neural networks.</p>
                </div>
                <div className="mission-box">
                  <h2>DUEL PLAYER</h2>
                  <p>Ranked 1v1 combat.</p>
                </div>
                <div className="mission-box">
                  <h2>SQUAD ARENA</h2>
                  <p>Team-based tactical skirmish.</p>
                </div>
              </div>

              {/* RIGHT: PLAYER PROFILE (RELOCATED) */}
              <div className="profile-panel-side simple-card">
                <div className="profile-header">
                  <span className="username font-orbitron">{profile.username}</span>
                  <span className="level text-secondary">Lv. {profile.level}</span>
                </div>
                
                <div className="xp-container">
                  <div className="xp-header">
                    <span>PROGRESSION</span>
                    <span>{profile.xp} / 100</span>
                  </div>
                  <div className="xp-track">
                    <div className="xp-fill" style={{ width: `${profile.xp}%` }}></div>
                  </div>
                </div>

                <div className="status-metrics">
                   <div className="metric">
                      <span className="m-label">CREDITS</span>
                      <span className="m-value text-primary">{profile.coins} CR</span>
                   </div>
                   <div className="metric">
                      <span className="m-label">STATUS</span>
                      <span className="m-value text-neon">ACTIVE</span>
                   </div>
                </div>

                <div className="profile-footer">
                  <p>Neural Link: STABLE</p>
                  <button className="reconnect-btn">RESET CORE</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="right">
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
