import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Volume2, VolumeX, Bell, ShoppingCart, Eye, Award, Maximize, Minimize } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ playHover, playClick, soundOn, toggleSound, setActiveTab, activeTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const unreadNotifs = 3;

  const toggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message} (${e.name})`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Shortcut key "F" for toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'f' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  const handleLogout = () => {
    playClick();
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'home', label: 'HUB', icon: null },
    { id: 'store', label: 'BLACK MARKET', icon: <ShoppingCart size={16} /> },
    { id: 'spectate', label: 'SPECTATE', icon: <Eye size={16} /> },
    { id: 'achievements', label: 'MEDALS', icon: <Award size={16} /> }
  ];

  return (
    <div className="anime-topbar glow-border flex justify-between items-center px-25" style={{ height: '100%' }}>
      <div className="anime-brand-logo font-orbitron cyber-text-shadow text-white text-xl cursor-pointer" onClick={() => setActiveTab('home')}>
         BRAWL<span className="text-primary">.AI</span>
      </div>

      <div className="anime-top-nav flex items-center gap-20 font-orbitron text-xs font-bold tracking-widest" style={{ display: 'flex' }}>
        {navItems.map(item => (
          <div 
             key={item.id} 
             onClick={() => { playClick(); setActiveTab(item.id); }}
             onMouseEnter={playHover}
             className={`nav-link flex items-center gap-5 cursor-pointer pb-5 border-b-2 transition-all ${activeTab === item.id ? 'text-primary border-primary' : 'text-gray border-transparent hover:text-white hover:border-white'}`}
          >
             {item.icon} {item.label}
          </div>
        ))}
      </div>

      <div className="anime-topbar-actions flex gap-15 items-center relative">
        <div className="relative cursor-pointer text-gray transition-all" style={{ color: '#a0a0a0' }} onClick={playClick} onMouseEnter={playHover}>
           <Bell size={20} />
           {unreadNotifs > 0 && <span className="absolute bg-neon text-white flex justify-center items-center font-bold" style={{ top: '-5px', right: '-5px', borderRadius: '50%', width: '15px', height: '15px', fontSize: '10px' }}>{unreadNotifs}</span>}
        </div>

        <div className="vertical-divider" style={{ width: '1px', height: '20px', backgroundColor: '#a0a0a0', opacity: 0.3, margin: '0 5px' }}></div>

        <button className="anime-icon-btn glow-btn hover-primary" onClick={toggleSound} onMouseEnter={playHover}>
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <button 
          className="anime-icon-btn glow-btn hover-primary fs-toggle-btn" 
          onClick={toggleFullscreen} 
          onMouseEnter={playHover}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        <button className="anime-icon-btn glow-btn hover-secondary" onClick={() => { playClick(); setDropdownOpen(!dropdownOpen); }} onMouseEnter={playHover}>
          <Settings size={20} />
        </button>

        {dropdownOpen && (
          <div className="anime-dropdown-menu glow-border absolute right-0 top-100 mt-10 bg-black-70 w-200 z-50">
             <div className="anime-dropdown-header p-15 border-b border-gray font-orbitron text-primary">SYSTEM</div>
             <div className="anime-dropdown-item p-15 flex justify-between items-center cursor-pointer hover:bg-black-50" onClick={handleLogout}>
               <span className="font-montserrat text-sm text-neon font-bold">DISCONNECT</span>
               <LogOut size={16} className="text-neon" />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
