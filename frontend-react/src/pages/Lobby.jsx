import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';

// Anime Theme Components
import TopBar from '../components/Lobby/TopBar';
import PlayerProfile from '../components/Lobby/PlayerProfile';
import StatsDashboard from '../components/Lobby/StatsDashboard';
import GameModes from '../components/Lobby/GameModes';
import FriendsList from '../components/Lobby/FriendsList';
import ChatBox from '../components/Lobby/ChatBox';
import DailyMissions from '../components/Lobby/DailyMissions';
import Achievements from '../components/Lobby/Achievements';
import Store from '../components/Lobby/Store';
import Spectator from '../components/Lobby/Spectator';
import { Loader2 } from 'lucide-react';

const Lobby = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  
  // Advanced State Management
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'store', 'spectate', 'achievements'
  const [matchmaking, setMatchmaking] = useState({ active: false, mode: null, time: 0 });

  // Audio elements
  const hoverSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));
  const clickSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'));

  useEffect(() => {
    hoverSound.current.volume = 0.1;
    clickSound.current.volume = 0.3;

    setTimeout(() => {
      setProfile({
        level: 24,
        xp: 8500,
        maxXP: 10000,
        rank: 'WARRIOR',
        stats: { totalMatches: 1420, winRate: '68%', streak: 12 }
      });
      setIsLoading(false);
    }, 1200);
  }, []);

  // Matchmaking Timer Logic
  useEffect(() => {
    let interval;
    if (matchmaking.active) {
      interval = setInterval(() => {
        setMatchmaking(prev => {
          if (prev.time >= 3) { // Simulate match found after 3 seconds
             clearInterval(interval);
             setTimeout(() => {
               navigate('/battle', { state: { mode: prev.mode } });
             }, 500); // short delay before navigating
             return { ...prev, active: false, found: true };
          }
          return { ...prev, time: prev.time + 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [matchmaking.active, navigate]);

  const playHover = () => {
    if (!soundOn) return;
    hoverSound.current.currentTime = 0;
    hoverSound.current.play().catch(e => console.log('Audio block', e));
  };

  const playClick = () => {
    if (!soundOn) return;
    clickSound.current.currentTime = 0;
    clickSound.current.play().catch(e => console.log('Audio block', e));
  };

  const startMatchmaking = (mode) => {
    playClick();
    setMatchmaking({ active: true, mode, time: 0, found: false });
  };
  
  const cancelMatchmaking = () => {
    playClick();
    setMatchmaking({ active: false, mode: null, time: 0, found: false });
  }

  if (isLoading) {
    return (
      <div className="lobby-loading-anime">
        <div className="loader-glitch-anime text-neon">CONNECTING TO ARENA...</div>
        <div className="loading-bar-anime"><div className="loading-fill-anime bg-primary"></div></div>
      </div>
    );
  }

  const renderCenterView = () => {
     switch (activeTab) {
        case 'store': return <Store playHover={playHover} playClick={playClick} />;
        case 'spectate': return <Spectator playHover={playHover} playClick={playClick} />;
        case 'achievements': return <Achievements playHover={playHover} playClick={playClick} />;
        default: return <GameModes playHover={playHover} playClick={playClick} startMatchmaking={startMatchmaking} />;
     }
  };

  return (
    <div className="anime-lobby-container">
      {/* Dynamic Background */}
      <div className="anime-bg-main" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop")' }}></div>
      <div className="anime-bg-overlay"></div>
      <div className="anime-particles"></div>

      {/* Full-Screen Matchmaking Overlay */}
      {matchmaking.active && (
        <div className="matchmaking-overlay absolute inset-0 z-50 flex-col items-center justify-center bg-black-70 backdrop-blur" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="bg-black-90 bg-opacity-80 p-30 rounded glow-border border border-primary text-center">
             <h2 className="font-orbitron cyber-text-shadow text-primary text-2xl mb-15 animate-pulse">
               {matchmaking.found ? 'OPPONENT FOUND!' : 'SEARCHING FOR TARGET...'}
             </h2>
             {!matchmaking.found && (
                <>
                  <Loader2 className="animate-spin text-neon mx-auto mb-20" size={50} />
                  <p className="font-montserrat text-gray m-0 mb-20 text-sm">Estimated wait time: 0:03s | Elapsed: 0:0{matchmaking.time}s</p>
                  <button onClick={cancelMatchmaking} className="font-orbitron text-xs font-bold text-black bg-neon px-20 py-10 rounded border-none cursor-pointer transition hover-scale" onMouseEnter={playHover}>
                    CANCEL
                  </button>
                </>
             )}
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="anime-grid-layout">
        
        {/* Top Header */}
        <div className="grid-header-anime">
          <TopBar 
            playHover={playHover} 
            playClick={playClick} 
            soundOn={soundOn} 
            toggleSound={() => setSoundOn(!soundOn)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Left Col: Profile, Stats, Missions */}
        <div className="grid-left-col-anime flex-col gap-20 overflow-y-auto hide-scrollbar pb-20">
          <PlayerProfile 
            profile={profile} 
            playHover={playHover} 
            playClick={playClick} 
          />
          <StatsDashboard stats={profile.stats} />
          <DailyMissions playHover={playHover} playClick={playClick} />
        </div>

        {/* Center Col: Dynamic Views */}
        <div className="grid-center-col-anime">
           {renderCenterView()}
        </div>

        {/* Right Col: Friends & Chat */}
        <div className="grid-right-col-anime flex-col gap-20 pb-20">
          <div className="friends-panel flex-1 min-h-[50%]">
            <FriendsList playHover={playHover} playClick={playClick} />
          </div>
          <div className="chat-panel flex-1 min-h-[50%]">
             <ChatBox playHover={playHover} playClick={playClick} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Lobby;
