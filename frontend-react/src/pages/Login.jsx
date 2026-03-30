import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, KeyRound, Flame } from 'lucide-react';
import characterImg from '../assets/login_character.png';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'forgot') return;

    setError('');
    setIsLoading(true);

    try {
      if (!formData.username || !formData.password) {
        throw new Error('Please fill all fields');
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      const usersDB = JSON.parse(localStorage.getItem('brawl_users_db') || '[]');

      if (activeTab === 'login') {
        const existingUser = usersDB.find(
          u => u.username === formData.username && u.password === formData.password
        );
        
        if (!existingUser) {
          throw new Error('Invalid username or password');
        }

        login({ username: existingUser.username, level: existingUser.level, xp: existingUser.xp });
        navigate('/lobby');
      } else if (activeTab === 'register') {
        const userExists = usersDB.find(u => u.username === formData.username);
        
        if (userExists) {
          throw new Error('Username already taken');
        }

        usersDB.push({ 
          username: formData.username, 
          password: formData.password,
          level: 1,
          xp: 0
        });
        localStorage.setItem('brawl_users_db', JSON.stringify(usersDB));
        
        setActiveTab('login');
        alert("Registration successful! You can now sign in.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Side: Form */}
        <div className="login-left">
          
          <div className="logo-header">
            <div className="logo-brawl">
              <Flame size={32} color="#FF4F33" className="logo-icon"/>
              <div className="logo-text-wrapper">
                <span className="logo-sub">Esports Portal</span>
                <span className="logo-main">BRAWL.AI</span>
              </div>
            </div>
            <p className="header-desc">
              Live the life you've always dreamed of! Become<br/>
              who you've always wanted to be in real life!
            </p>
          </div>

          <div className="tab-menu">
            <div 
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
              {activeTab === 'login' && <div className="tab-indicator"></div>}
            </div>
            <div 
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Registration
              {activeTab === 'register' && <div className="tab-indicator"></div>}
            </div>
            <div 
              className={`tab-btn ${activeTab === 'forgot' ? 'active' : ''}`}
              onClick={() => setActiveTab('forgot')}
            >
              Forget Password?
              {activeTab === 'forgot' && <div className="tab-indicator"></div>}
            </div>
          </div>

          <div className="auth-section">
            <h1 className="auth-title">Authorization</h1>
            <p className="auth-subtitle">
              If you already have an account, fill in all the fields. To select<br/>
              other actions, click on the desired tab above.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <div className="input-label">
                  <User size={14} /> Login
                </div>
                <input 
                  type="text" 
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Aleksandr"
                  autoComplete="username"
                />
              </div>

              <div className="input-group">
                <div className="input-label">
                  <Lock size={14} /> Password
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required 
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="***************"
                  autoComplete={activeTab === 'login' ? "current-password" : "new-password"}
                />
                <button 
                  type="button" 
                  className="eye-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && <div className="error-text">{error}</div>}

              <div className="form-options">
                <label className="checkbox-wrap">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={() => setRememberMe(!rememberMe)} 
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
              </div>

              <button type="submit" className="action-btn" disabled={isLoading}>
                <KeyRound size={20} className="btn-icon" /> 
                {isLoading ? 'Processing...' : (activeTab === 'login' ? 'Login to Account' : 'Register Account')}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Showcase */}
        <div className="login-right">
          {/* Subtle background landscape simulation with CSS */}
          <div className="landscape-bg"></div>

          <div className="user-badge">
            <span className="badge-label">Your account?</span>
            <span className="badge-name">Unknown Pilot <span className="profile-pic"></span></span>
          </div>

          <div className="showcase-content">
            <h2 className="showcase-title">
              Where Technology Meets<br/>
              <span className="highlight">Total Control.</span>
            </h2>
            <p className="showcase-desc">
              Unique skins, modifications and accessories are<br/>
              waiting for you! Stand out, create, surprise -<br/>
              your character will become a legend. Go to the<br/>
              store and create your own story!
            </p>
            <div className="showcase-divider"></div>
          </div>

          <img src={characterImg} alt="Character" className="character-render" />
        </div>
      </div>
    </div>
  );
};

export default Login;
