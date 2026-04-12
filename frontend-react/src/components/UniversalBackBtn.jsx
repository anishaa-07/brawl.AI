import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const UniversalBackBtn = ({ to, warnTitle, warnMessage, confirmLabel = 'CONFIRM', customAction = null }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBack = () => {
    if (warnMessage) {
      setShowConfirm(true);
    } else {
      executeBack();
    }
  };

  const executeBack = () => {
    if (customAction) {
      customAction();
    } else if (to === -1) {
      navigate(-1);
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showConfirm) {
          setShowConfirm(false);
        } else {
          handleBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirm, warnMessage, to, customAction]);

  return (
    <>
      <button className="back-btn-v4 global-back-btn" onClick={handleBack} title="Go Back">
        <ArrowLeft size={24} />
      </button>

      {showConfirm && (
        <div className="exit-confirm-overlay">
          <div className="exit-confirm-card glass-panel animate-fade-in">
            <h2 className="font-orbitron">{warnTitle || "WARNING"}</h2>
            <p className="font-orbitron" style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '10px' }}>
              {warnMessage}
            </p>
            <div className="exit-actions">
              <button className="end-btn secondary font-orbitron" onClick={() => setShowConfirm(false)}>CANCEL (ESC)</button>
              <button className="end-btn primary font-orbitron" onClick={executeBack}>{confirmLabel}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UniversalBackBtn;
