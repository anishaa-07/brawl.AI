import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import BattleFeed from '../components/Lobby/BattleFeed';
import ArenaCore from '../components/Lobby/ArenaCore';
import NotificationToast from '../components/Lobby/NotificationToast';
import { Loader2 } from 'lucide-react';

const Lobby = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // Advanced State Management
  const [activeTab, setActiveTab] = useState('home');
  const [matchmaking, setMatchmaking] = useState({ active: false, mode: null, time: 0 });
  const [isCoreBoosted, setIsCoreBoosted] = useState(false);

  // Audio elements
  const hoverSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));
  const clickSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'));

  const handleCoreHover = (hovering) => {
    if (hovering) playHover();
    setIsCoreBoosted(hovering);
  };

  const addNotification = useCallback((message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

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
      
      // Initial notification
      addNotification('CONNECTED TO BATTLE CORE', 'rank');
    }, 1200);
  }, [addNotification]);

  // Simulation: Trigger random notifications
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      const messages = [
        { text: 'CyberShark is challenging you!', type: 'warn' },
        { text: 'Daily reward ready to claim', type: 'unlock' },
        { text: 'New tournament started', type: 'rank' }
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      addNotification(msg.text, msg.type);
    }, 30000); // Pulse every 30s
    return () => clearInterval(interval);
  }, [isLoading, addNotification]);



  // Matchmaking Timer Logic
  useEffect(() => {
    let interval;
    if (matchmaking.active) {
      interval = setInterval(() => {
        setMatchmaking(prev => {
          if (prev.time >= 3) {
             clearInterval(interval);
             setTimeout(() => {
               navigate('/battle', { state: { mode: prev.mode } });
             }, 500);
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
        default: return (
          <GameModes 
            playHover={playHover} 
            playClick={playClick} 
            startMatchmaking={startMatchmaking} 
            onModeHover={handleCoreHover}
          />
        );
     }
  };

  return (
    <div className="anime-lobby-container">
      {/* Dynamic Background Layers */}
      <div className="anime-bg-main" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop")' }}></div>
      <div className="anime-bg-overlay"></div>
      <div className="anime-particles"></div>

      {/* LAYER 1: Floating Light Streaks */}
      <div className="lobby-light-streaks">
        <div className="light-streak ls-1"></div>
        <div className="light-streak ls-2"></div>
        <div className="light-streak ls-3"></div>
      </div>

      {/* LAYER 2: Floating Orbs */}
      <div className="lobby-orbs-layer">
        <div className="lobby-orb orb-cyan"></div>
        <div className="lobby-orb orb-purple"></div>
        <div className="lobby-orb orb-pink"></div>
      </div>

      {/* LAYER 3: Animated Star Particles */}
      <canvas id="lobby-particles-canvas" className="lobby-particles-canvas"></canvas>

      {/* LAYER 4: Anime Characters (unique) */}
      <div className="lobby-anime-chars">
        <img src={`/brawl.AI/assets/lobby_warrior.png`} alt="" className="lobby-anime-char char-left" />
        <img src={`/brawl.AI/assets/lobby_assassin.png`} alt="" className="lobby-anime-char char-right" />
        <img src={`/brawl.AI/assets/lobby_mage.png`} alt="" className="lobby-anime-char char-center" />
      </div>

      {/* LAYER 5: Notification Toast Container */}
      <div className="notif-container">
        {notifications.map(n => (
          <NotificationToast 
            key={n.id} 
            {...n} 
            onClose={() => removeNotification(n.id)} 
          />
        ))}
      </div>

      {/* Full-Screen Matchmaking Overlay */}
      {matchmaking.active && (
        <div className="matchmaking-overlay absolute inset-0 z-50 flex items-center justify-center bg-black-70" style={{ backdropFilter: 'blur(10px)', display: 'flex' }}>
          <div className="bg-black-70 p-15 rounded glow-border border border-primary text-center" style={{ padding: '30px', backgroundColor: 'rgba(5,1,10,0.95)' }}>
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
        <div className="grid-left-col-anime flex-col gap-20 custom-scrollbar" style={{ overflowY: 'auto', paddingBottom: '20px' }}>
          <PlayerProfile 
            profile={profile} 
            playHover={playHover} 
            playClick={playClick} 
          />
          <StatsDashboard stats={profile.stats} />
          <DailyMissions playHover={playHover} playClick={playClick} />
          <BattleFeed playHover={playHover} />
        </div>

        {/* Center Col: Dynamic Views + Arena Core */}
        <div className="grid-center-col-anime">
           {activeTab === 'home' && <ArenaCore isHovered={isCoreBoosted} />}
           {renderCenterView()}
        </div>

        {/* Right Col: Friends & Chat */}
        <div className="grid-right-col-anime flex-col gap-20" style={{ paddingBottom: '20px' }}>
          <div className="friends-panel flex-1" style={{ minHeight: '50%' }}>
            <FriendsList playHover={playHover} playClick={playClick} />
          </div>
          <div className="chat-panel flex-1" style={{ minHeight: '50%' }}>
             <ChatBox playHover={playHover} playClick={playClick} />
          </div>
        </div>

      </div>

      {/* Particle Canvas Init Script */}
      <ParticleEffect />
    </div>
  );
};

/* Particle Effect Component - renders floating dots/stars onto the canvas */
const ParticleEffect = () => {
  useEffect(() => {
    const canvas = document.getElementById('lobby-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: ['#00f0ff', '#a238ff', '#ff0055'][Math.floor(Math.random() * 3)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return null;
};

export default Lobby;
