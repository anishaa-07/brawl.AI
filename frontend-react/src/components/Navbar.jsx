import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Maximize2, Minimize2, Swords, BookOpen, Shield, Zap, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const close = () => setMobileMenuOpen(false);

  const NAV_LINKS = [
    { label: 'HOME',         to: '/',             icon: <Shield    size={13} />, type: 'route'  },
    { label: 'LOBBY',        to: '/lobby',         icon: <Zap       size={13} />, type: 'route', requireAuth: true },
    { label: 'BATTLE AI',    to: '/question-hub',  icon: <Swords    size={13} />, type: 'route', requireAuth: true },
    { label: 'ARENA',        to: '/arena',         icon: <Shield    size={13} />, type: 'route', requireAuth: true },
    { label: 'HOW TO PLAY',  to: '#how-to-play',   icon: <BookOpen  size={13} />, type: 'anchor' },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo font-montserrat" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        BR<span>AWL</span>.AI
      </div>

      {/* Nav Links */}
      <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => {
          const locked = link.requireAuth && !user;
          if (link.type === 'anchor') {
            return (
              <a
                key={link.label}
                href={link.to}
                onClick={close}
                className="nav-link-item"
              >
                {link.icon} {link.label}
              </a>
            );
          }
          return (
            <Link
              key={link.label}
              to={locked ? '/login' : link.to}
              onClick={close}
              className={`nav-link-item${locked ? ' nav-link-locked' : ''}`}
              title={locked ? 'Login required' : ''}
            >
              {link.icon} {link.label}
              {locked && <span className="nav-lock-badge">🔒</span>}
            </Link>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="nav-actions">
        <button
          className="nav-fullscreen-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Auth CTA */}
        {user ? (
          <Link to="/lobby" className="create-btn font-montserrat" onClick={close}>
            <Zap size={14} /> DASHBOARD
          </Link>
        ) : (
          <Link to="/login" className="create-btn font-montserrat" onClick={close}>
            <LogIn size={14} /> LOGIN
          </Link>
        )}

        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
