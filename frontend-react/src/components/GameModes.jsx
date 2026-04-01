import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { User, Users, Crosshair, Zap, Rocket } from 'lucide-react';
import './GameModes.css';

const gameModes = [
  {
    id: 1,
    title: "Solo Mode",
    desc: "Test your AI logic directly against the machine over an intense duel.",
    icon: <User size={36} />,
    color: "cyan",
    badge: "Popular"
  },
  {
    id: 2,
    title: "Duel Mode",
    desc: "1v1 high-stakes battle against another human pilot in real-time.",
    icon: <Crosshair size={36} />,
    color: "magenta",
    badge: "Hot"
  },
  {
    id: 3,
    title: "Squad Battle",
    desc: "Form a team and dominate the grid across coordinated multiplayer assaults.",
    icon: <Users size={36} />,
    color: "purple",
    badge: "New"
  },
  {
    id: 4,
    title: "Practice Arena",
    desc: "Sandbox environment to seamlessly refine your algorithms without losing points.",
    icon: <Zap size={36} />,
    color: "blue",
    badge: ""
  },
  {
    id: 5,
    title: "Quick Match",
    desc: "Instantly jump straight into casual, unranked combat to warm up.",
    icon: <Rocket size={36} />,
    color: "green",
    badge: ""
  }
];

const GameModes = () => {
  return (
    <section className="gm-section" id="game-modes">
      <div className="gm-bg-effect">
        <div className="gm-particle gm-p1"></div>
        <div className="gm-particle gm-p2"></div>
        <div className="gm-particle gm-p3"></div>
      </div>
      
      <div className="container-main gm-container">
        <div className="gm-header center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Choose Your <span className="text-glow accent-magenta">Battle Mode</span>
          </motion.h2>
          <motion.p 
            className="gm-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Enter the arena and prove your dominance
          </motion.p>
        </div>

        <div className="gm-grid">
          {gameModes.map((mode, i) => (
            <motion.div 
              key={mode.id}
              className={`gm-card ${mode.color}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              {mode.badge && <span className={`gm-badge badge-${mode.color}`}>{mode.badge}</span>}
              <div className={`gm-icon-wrapper block-${mode.color}`}>
                {mode.icon}
              </div>
              <h3 className="gm-card-title">{mode.title}</h3>
              <p className="gm-card-desc">{mode.desc}</p>
              
              <button 
                className="gm-play-btn"
                onClick={() => {
                  /* Play sound placeholder */
                  console.log(`Routing to ${mode.title}...`);
                }}
              >
                PLAY NOW
              </button>
              
              <div className={`gm-hover-glow glow-${mode.color}`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameModes;
