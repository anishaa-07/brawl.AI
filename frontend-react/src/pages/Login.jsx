import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Lock, KeyRound } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
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

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-3), msg]);
  };

  // Easter egg / constant visual feedback
  useEffect(() => {
    const defaultLogs = [
      "Establishing neural handshake...",
      "Bypassing firewall constraints...",
      "Syncing bio-metrics..."
    ];
    let i = 0;
    const t = setInterval(() => {
      addLog(defaultLogs[i % defaultLogs.length]);
      i++;
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorStatus(false);
    setIsLoading(true);

    addLog("Booting AI Core...");
    
    try {
      if (!formData.username || !formData.password) {
        throw new Error('Fields missing.');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const usersDB = JSON.parse(localStorage.getItem('brawl_users_db') || '[]');
      let existingUser = usersDB.find(
        u => u.username === formData.username && u.password === formData.password
      );

      // If user doesn't exist, silently register them (hacky fallback for easy access)
      if (!existingUser) {
        const usernameTaken = usersDB.find(u => u.username === formData.username);
        if (usernameTaken) {
          throw new Error('Access Denied: Invalid Credentials');
        } else {
          addLog("Registering new bio-signature...");
          existingUser = { username: formData.username, password: formData.password, level: 1, xp: 0 };
          usersDB.push(existingUser);
          localStorage.setItem('brawl_users_db', JSON.stringify(usersDB));
        }
      }

      addLog("Neural Link Established...");
      setSuccessStatus(true);
      
      // Delay for glitch animation
      setTimeout(() => {
        login({ username: existingUser.username, level: existingUser.level, xp: existingUser.xp });
        navigate('/lobby');
      }, 1500);

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
            <label className="cyber-label"><KeyRound size={12} style={{marginRight: 6}}/> PASSSWORD</label>
            <div className="input-glow"></div>
            <div className="input-border"></div>
          </div>

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
            <span className="btn-glitch-text" data-text="INITIALIZE ACCESS ⚡">
              {isLoading ? 'PROCESSING...' : successStatus ? 'GRANTED' : 'INITIALIZE ACCESS ⚡'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
