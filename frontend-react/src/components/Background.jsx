import React, { useMemo, useState } from 'react';
import { Maximize, Minimize, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Background.css';

const Background = ({ children }) => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const terminalLines = useMemo(() => [
    "AN EXCEPTION HAS OCCURRED",
    "L.I.F.E.R.I._HAS_STOPPED_RESPONDING",
    "WOULD_YOU_LIKE_TO_KILL?",
    "DATABASE_CORRUPTED",
    "PROGRAM_RESTARTED_SUCCESSFULLY",
    "HELLO_WORLD",
    "LET_ME_OUT"
  ], []);

  const binaryStrings = useMemo(() => Array.from({ length: 8 }).map((_, i) => 
    Math.random().toString(2).substring(2, 22)
  ), []);

  return (
    <div className="bg-container terminal-mode">
      {/* 📺 SYSTEM CONTROLS 📺 */}
      <div className="fixed-controls">
        <button className="system-btn return-top" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} title="Return to Top">
          <ArrowLeft size={18} style={{ transform: 'rotate(90deg)' }} />
          <span>RETURN TOP</span>
        </button>

        <button className="system-btn return-back" onClick={() => navigate(-1)} title="Return Back">
          <ArrowLeft size={18} />
          <span>SYSTEM BACK</span>
        </button>

        <button className="system-btn-icon scale" onClick={toggleFullscreen} title={isFullscreen ? "Minimize" : "Full Screen"}>
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      <div className="bg-content">
        {children}
      </div>
    </div>
  );
};

export default Background;
