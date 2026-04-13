import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LogIn, UserPlus, Mail, Lock, User, KeyRound } from 'lucide-react';
import characterImg from '../assets/login_character.png';
import './Login.css';

const LOGS = {
  login: ['Scanning credentials...', 'Neural sync standby...', 'Bypassing firewall...'],
  register: ['Creating identity...', 'Allocating memory...', 'Encrypting bio-signature...'],
};

const Login = () => {
  const [activeMode, setActiveMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logLine, setLogLine] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Cycle system log
  useEffect(() => {
    const pool = LOGS[activeMode];
    let i = 0;
    setLogLine(pool[0]);
    const t = setInterval(() => {
      i = (i + 1) % pool.length;
      setLogLine(pool[i]);
    }, 3500);
    return () => clearInterval(t);
  }, [activeMode]);

  const handleInput = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrorMsg('');
    setErrorStatus(false);
  };

  const switchMode = (m) => {
    setActiveMode(m);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setErrorMsg('');
    setErrorStatus(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorStatus(false);
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (!formData.username || !formData.password) throw new Error('All fields are required.');
      await new Promise(r => setTimeout(r, 900));

      const usersDB = JSON.parse(localStorage.getItem('brawl_users_db') || '[]');

      if (activeMode === 'login') {
        const found = usersDB.find(u => u.username === formData.username && u.password === formData.password);
        if (!found) throw new Error('ACCESS DENIED — Invalid credentials.');
        setSuccessStatus(true);
        setTimeout(() => { login({ username: found.username, level: found.level, xp: found.xp }); navigate('/lobby'); }, 1400);

      } else {
        if (!formData.email) throw new Error('Email is required.');
        if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match.');
        if (usersDB.find(u => u.username === formData.username)) throw new Error('Identity already taken.');
        const newUser = { username: formData.username, email: formData.email, password: formData.password, level: 1, xp: 0 };
        usersDB.push(newUser);
        localStorage.setItem('brawl_users_db', JSON.stringify(usersDB));
        setSuccessStatus(true);
        setTimeout(() => { login({ username: newUser.username, level: newUser.level, xp: newUser.xp }); navigate('/lobby'); }, 1400);
      }
    } catch (err) {
      setErrorMsg(err.message);
      setErrorStatus(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={`lp-root${successStatus ? ' lp-success' : ''}`}>
      {/* ── Animated BG ── */}
      <div className="lp-grid" aria-hidden="true" />
      <div className="lp-ambient" aria-hidden="true" />

      <div className="lp-split">

        {/* ══ LEFT PANEL ══ */}
        <div className="lp-left">
          {/* Logo */}
          <div className="lp-logo">
            <Zap size={26} className="lp-logo-icon" />
            <span className="font-orbitron lp-logo-text">BRAWL.AI</span>
          </div>

          {/* Hero Text */}
          <div className="lp-hero-text">
            <h1 className="font-orbitron lp-heading">
              ENTER THE<br />
              <span className="lp-heading-accent">NEURAL ARENA</span>
            </h1>
            <p className="lp-subtitle">Where code meets combat.<br />Defeat AI using logic.</p>
          </div>

          {/* Card */}
          <div className={`lp-card${errorStatus ? ' lp-card-error' : ''}`}>

            {/* Tabs */}
            <div className="lp-tabs font-orbitron">
              <button
                type="button"
                className={`lp-tab${activeMode === 'login' ? ' active' : ''}`}
                onClick={() => switchMode('login')}
              >
                <LogIn size={13} /> LOGIN
              </button>
              <button
                type="button"
                className={`lp-tab${activeMode === 'register' ? ' active' : ''}`}
                onClick={() => switchMode('register')}
              >
                <UserPlus size={13} /> REGISTER
              </button>
            </div>

            {/* Form */}
            <form className="lp-form" onSubmit={handleSubmit} noValidate>

              {/* Username */}
              <div className="lp-field">
                <User size={14} className="lp-field-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="USERNAME"
                  value={formData.username}
                  onChange={handleInput}
                  className="lp-input font-orbitron"
                  autoComplete="off"
                  disabled={isLoading || successStatus}
                  required
                />
              </div>

              {/* Email (register only) */}
              {activeMode === 'register' && (
                <div className="lp-field">
                  <Mail size={14} className="lp-field-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="EMAIL ADDRESS"
                    value={formData.email}
                    onChange={handleInput}
                    className="lp-input font-orbitron"
                    autoComplete="off"
                    disabled={isLoading || successStatus}
                    required
                  />
                </div>
              )}

              {/* Password */}
              <div className="lp-field">
                <Lock size={14} className="lp-field-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={handleInput}
                  className="lp-input font-orbitron"
                  disabled={isLoading || successStatus}
                  required
                />
              </div>

              {/* Confirm Password (register only) */}
              {activeMode === 'register' && (
                <div className="lp-field">
                  <KeyRound size={14} className="lp-field-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="CONFIRM PASSWORD"
                    value={formData.confirmPassword}
                    onChange={handleInput}
                    className="lp-input font-orbitron"
                    disabled={isLoading || successStatus}
                    required
                  />
                </div>
              )}

              {/* Error */}
              {errorMsg && (
                <div className="lp-error font-orbitron">
                  ⚠ {errorMsg}
                </div>
              )}

              {/* System log line */}
              <div className="lp-syslog font-orbitron">
                <span className="lp-syslog-dot" />
                {logLine}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`lp-btn font-orbitron${isLoading || successStatus ? ' lp-btn-loading' : ''}`}
                disabled={isLoading || successStatus}
              >
                <span className="lp-btn-inner">
                  {isLoading ? 'PROCESSING...' : successStatus ? '✓ ACCESS GRANTED' : activeMode === 'login' ? 'INITIALIZE ACCESS ⚡' : 'CREATE IDENTITY 🚀'}
                </span>
                <span className="lp-btn-glow" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="lp-right" aria-hidden="true">
          <div className="lp-right-glow" />
          <img src={characterImg} alt="Neural Arena Character" className="lp-character" />
          <div className="lp-right-overlay" />
          {/* floating scanlines */}
          <div className="lp-scanlines" />
        </div>

      </div>
    </div>
  );
};

export default Login;
