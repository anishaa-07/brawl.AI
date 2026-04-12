import React, { useState, useEffect } from 'react';
import { Settings, X, Volume2, VolumeX, Music, Moon, Sun, Monitor } from 'lucide-react';
import { SoundFX } from '../utils/sounds';

const SettingsModal = ({ onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('brawl_sound_enabled') !== 'false');
  const [musicEnabled, setMusicEnabled] = useState(() => localStorage.getItem('brawl_music_enabled') !== 'false');
  const [theme, setTheme] = useState(() => localStorage.getItem('brawl_theme') || 'neon');

  const toggleSound = () => {
    SoundFX.click();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('brawl_sound_enabled', next.toString());
  };

  const toggleMusic = () => {
    SoundFX.click();
    const next = !musicEnabled;
    setMusicEnabled(next);
    localStorage.setItem('brawl_music_enabled', next.toString());
  };

  const toggleTheme = (newTheme) => {
    SoundFX.click();
    setTheme(newTheme);
    localStorage.setItem('brawl_theme', newTheme);
    document.body.className = newTheme === 'dark' ? 'brawl-theme-dark' : '';
  };

  return (
    <div className="settings-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="settings-card font-orbitron" style={{ background: '#0a0f19', border: '1px solid var(--neon-cyan)', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '400px', boxShadow: '0 0 40px rgba(0, 242, 255, 0.2)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid rgba(0, 242, 255, 0.3)', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={22} color="var(--neon-cyan)"/> SYSTEM SETTINGS</h2>
          <button onClick={() => { SoundFX.click(); onClose(); }} style={{ background: 'none', border: 'none', color: '#ff3c8d', cursor: 'pointer', outline: 'none' }}>
            <X size={24} />
          </button>
        </div>

        {/* SOUND TOGGLE */}
        <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />} AUDIO EFFECTS
          </div>
          <button onClick={toggleSound} style={{ background: soundEnabled ? 'var(--neon-cyan)' : 'transparent', color: soundEnabled ? '#000' : '#888', border: `1px solid ${soundEnabled ? 'var(--neon-cyan)' : '#444'}`, padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Orbitron', fontWeight: 700, transition: '0.2s' }}>
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* MUSIC TOGGLE */}
        <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={16} /> BGM TRACKS
          </div>
          <button onClick={toggleMusic} style={{ background: musicEnabled ? '#a238ff' : 'transparent', color: musicEnabled ? '#000' : '#888', border: `1px solid ${musicEnabled ? '#a238ff' : '#444'}`, padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Orbitron', fontWeight: 700, transition: '0.2s' }}>
            {musicEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* THEME SELECTOR */}
        <div className="setting-row" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px' }}>
          <div style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '2px' }}>INTERFACE THEME</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => toggleTheme('neon')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: theme === 'neon' ? 'rgba(0, 242, 255, 0.1)' : 'transparent', border: `1px solid ${theme === 'neon' ? 'var(--neon-cyan)' : '#333'}`, color: theme === 'neon' ? 'var(--neon-cyan)' : '#666', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Orbitron' }}>
              <Sun size={14} /> NEON
            </button>
            <button 
              onClick={() => toggleTheme('dark')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', border: `1px solid ${theme === 'dark' ? '#fff' : '#333'}`, color: theme === 'dark' ? '#fff' : '#666', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Orbitron' }}>
              <Moon size={14} /> DARK
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
