import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Lock, KeyRound, Mail, UserPlus, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [activeMode, setActiveMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errorStatus, setErrorStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorStatus(false);
  };

  const handleModeSwitch = (mode) => {
    setActiveMode(mode);
    setErrorStatus(false);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-3), msg]);
  };

  // Easter egg / constant visual feedback
  useEffect(() => {
    const defaultLogs = activeMode === 'login' 
      ? ["Scanning credentials...", "Bypassing firewall constraints...", "Neural sync standby..."]
      : ["Creating identity...", "Allocating memory...", "Encrypting subroutines..."];
      
    let i = 0;
    const t = setInterval(() => {
      addLog(defaultLogs[i % defaultLogs.length]);
      i++;
    }, 4000);
    return () => clearInterval(t);
  }, [activeMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorStatus(false);
    setIsLoading(true);

    addLog(activeMode === 'login' ? "Scanning credentials..." : "Creating identity...");
    
    try {
      if (!formData.username || !formData.password) {
        throw new Error('Fields missing.');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const usersDB = JSON.parse(localStorage.getItem('brawl_users_db') || '[]');
      
      if (activeMode === 'login') {
        const existingUser = usersDB.find(
          u => u.username === formData.username && u.password === formData.password
        );
        if (!existingUser) throw new Error('Access Denied: Invalid Credentials');
        
        addLog("Neural sync ready...");
        setSuccessStatus(true);
        setTimeout(() => {
          login({ username: existingUser.username, level: existingUser.level, xp: existingUser.xp });
          navigate('/lobby');
        }, 1500);

      } else {
        // Register Mode
        if (!formData.email || !formData.confirmPassword) {
          throw new Error('All fields required.');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        const usernameTaken = usersDB.find(u => u.username === formData.username);
        if (usernameTaken) throw new Error('Identity already exists.');

        addLog("Allocating memory...");
        const newUser = { username: formData.username, password: formData.password, level: 1, xp: 0 };
        usersDB.push(newUser);
        localStorage.setItem('brawl_users_db', JSON.stringify(usersDB));
        
        addLog("Database updated. Identity verified.");
        setSuccessStatus(true);
        setTimeout(() => {
          login({ username: newUser.username, level: newUser.level, xp: newUser.xp });
          navigate('/lobby');
        }, 1500);
      }

    } catch (err) {
      addLog(err.message);
      setErrorStatus(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-terminal-wrapper ${successStatus ? 'glitch-success' : ''}`}>
      {/* Animated Background */}
      <div className="cyber-grid"></div>
      <div className="cyber-particles"></div>

      <div className={`terminal-card ${errorStatus ? 'shake-error' : ''}`}>
        
        <div className="terminal-header">
          <Terminal size={28} className="terminal-icon" color="#00ffcc" />
          <h1 className="font-orbitron">AI ACCESS TERMINAL</h1>
          <div className="status-dot blink"></div>
        </div>

        <div className="cyber-tabs font-orbitron">
          <div 
            className={`cyber-tab ${activeMode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('login')}
          >
            <LogIn size={14} style={{marginRight: 6}} /> LOGIN
          </div>
          <div 
            className={`cyber-tab ${activeMode === 'register' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('register')}
          >
            <UserPlus size={14} style={{marginRight: 6}} /> REGISTER
          </div>
        </div>

        <form onSubmit={handleSubmit} className="terminal-form">
          <div className="cyber-input-group">
            <input 
              type="text" 
              name="username"
              required
              value={formData.username}
              onChange={handleInputChange}
              className="cyber-input font-orbitron"
              placeholder=" "
              autoComplete="off"
              disabled={isLoading || successStatus}
            />
            <label className="cyber-label"><Lock size={12} style={{marginRight: 6}}/> USERNAME</label>
            <div className="input-glow"></div>
            <div className="input-border"></div>
          </div>

          {activeMode === 'register' && (
            <div className="cyber-input-group">
              <input 
                type="email" 
                name="email"
                required={activeMode === 'register'}
                value={formData.email}
                onChange={handleInputChange}
                className="cyber-input font-orbitron"
                placeholder=" "
                autoComplete="off"
                disabled={isLoading || successStatus}
              />
              <label className="cyber-label"><Mail size={12} style={{marginRight: 6}}/> EMAIL</label>
              <div className="input-glow"></div>
              <div className="input-border"></div>
            </div>
          )}

          <div className="cyber-input-group">
            <input 
              type="password" 
              name="password"
              required 
              value={formData.password}
              onChange={handleInputChange}
              className="cyber-input font-orbitron"
              placeholder=" "
              disabled={isLoading || successStatus}
            />
            <label className="cyber-label"><KeyRound size={12} style={{marginRight: 6}}/> PASSWORD</label>
            <div className="input-glow"></div>
            <div className="input-border"></div>
          </div>

          {activeMode === 'register' && (
            <div className="cyber-input-group">
              <input 
                type="password" 
                name="confirmPassword"
                required={activeMode === 'register'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="cyber-input font-orbitron"
                placeholder=" "
                disabled={isLoading || successStatus}
              />
              <label className="cyber-label"><KeyRound size={12} style={{marginRight: 6}}/> CONFIRM PASSWORD</label>
              <div className="input-glow"></div>
              <div className="input-border"></div>
            </div>
          )}

          {/* System Logs */}
          <div className="terminal-logs font-orbitron">
            {logs.map((log, i) => (
              <div key={i} className={`log-entry ${errorStatus && i === logs.length - 1 ? 'log-error' : ''}`}>
                <span className="log-prefix">&gt;</span> {log}
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            className={`cyber-btn font-orbitron ${isLoading || successStatus ? 'processing' : ''}`}
            disabled={isLoading || successStatus}
          >
            <span className="btn-glitch-text" data-text={activeMode === 'login' ? "INITIALIZE ACCESS ⚡" : "CREATE IDENTITY 🚀"}>
              {isLoading 
                ? 'PROCESSING...' 
                : successStatus 
                  ? 'GRANTED' 
                  : activeMode === 'login' 
                    ? 'INITIALIZE ACCESS ⚡' 
                    : 'CREATE IDENTITY 🚀'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
