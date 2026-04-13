import React, { useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sword, Cpu, Target, Globe, Info, Send, ChevronRight, Activity, Zap, Shield, GitFork, Mail, Terminal } from 'lucide-react';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import GameModes from '../components/GameModes';
import './Home.css';

const Home = () => {
  const artRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!artRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 18;
    const y = ((clientY - top) / height - 0.5) * 10;
    artRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!artRef.current) return;
    artRef.current.style.transform = 'translate(0px, 0px) scale(1)';
  }, []);

  return (
    <div className="landing-wrapper">
      <Background>
        <Navbar />
        
        {/* ══════════ CINEMATIC HERO ══════════ */}
        <section
          className="hero-cinematic"
          id="home"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Particle dots */}
          <div className="hero-particles" aria-hidden="true">
            {[...Array(22)].map((_, i) => (
              <span key={i} className="h-particle" style={{
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--d': `${2 + Math.random() * 6}s`,
                '--s': `${2 + Math.random() * 4}px`,
              }} />
            ))}
          </div>

          {/* Grid overlay */}
          <div className="hero-grid-overlay" aria-hidden="true" />

          <div className="hero-cin-inner">

            {/* ── LEFT ── */}
            <motion.div
              className="hero-cin-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              {/* Badge */}
              <motion.div
                className="hero-cin-badge font-orbitron"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Zap size={12} /> NEURAL ARENA v2.0
              </motion.div>

              {/* Heading */}
              <h1 className="hero-cin-heading font-orbitron">
                ONLY THE <span className="hero-cin-accent">SMARTEST</span><br />
                SURVIVE ⚡
              </h1>

              {/* Subtitle */}
              <p className="hero-cin-sub">
                Code is your weapon.<br />
                Defeat AI in the ultimate arena.
              </p>

              {/* System log text */}
              <div className="hero-cin-syslog font-orbitron">
                <motion.div
                  className="syslog-line"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Terminal size={11} className="syslog-icon" />
                  <span>&gt; AI CORE ONLINE</span>
                  <span className="syslog-cursor" />
                </motion.div>
                <motion.div
                  className="syslog-line"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <Terminal size={11} className="syslog-icon" />
                  <span>&gt; READY FOR COMBAT</span>
                </motion.div>
              </div>

              {/* CTA */}
              <motion.div
                className="hero-cin-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Link to="/login" className="hero-cin-btn font-orbitron">
                  <span>⚡ ENTER THE ARENA</span>
                  <span className="hero-cin-btn-glow" />
                </Link>
              </motion.div>

              {/* Stats strip */}
              <motion.div
                className="hero-cin-stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <div className="hcs"><span className="hcs-val">1.28M</span><span className="hcs-label">MATCHES</span></div>
                <div className="hcs-div" />
                <div className="hcs"><span className="hcs-val">15K+</span><span className="hcs-label">PILOTS</span></div>
                <div className="hcs-div" />
                <div className="hcs"><span className="hcs-val">#1</span><span className="hcs-label">ARENA</span></div>
              </motion.div>
            </motion.div>

            {/* ── RIGHT ── */}
            <motion.div
              className="hero-cin-right"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <div className="hero-cin-art-wrap" ref={artRef}>
                {/* Glow rings */}
                <div className="hero-cin-glow-ring ring-outer" />
                <div className="hero-cin-glow-ring ring-inner" />
                <div className="hero-cin-glow-orb" />
                <img
                  src={`${import.meta.env.BASE_URL}assets/anime_fighters_group.png`}
                  alt="Neural Arena Fighters"
                  className="hero-cin-img"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 🎮 GAME MODES SECTION 🎮 */}
        <GameModes />

        {/* 📊 PLAYER STATS SECTION 📊 */}
        <section className="stats-dashboard">
          <div className="container-main">
            <div className="stats-strip glass-panel">
              {[
                { label: "Matches Played", val: "1.2M+" },
                { label: "Win Rate", val: "94.2%" },
                { label: "Elite Rank", val: "GRANDMASTER" },
                { label: "XP Level", val: "MAX" }
              ].map((stat, i) => (
                <div key={i} className="stat-unit">
                  <span className="p-label">{stat.label}</span>
                  <span className="p-val accent-cyan">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🧠 AI CORE FEATURES 🧠 */}
        <section className="tech-spotlight">
          <div className="container-main side-by-side">
            <div className="tech-visual">
               <img src={`${import.meta.env.BASE_URL}assets/hero_squad.png?v=1.1`} alt="Elite Squad" className="squad-img-v2" />
               <div className="visual-pulse" />
            </div>
            <div className="tech-copy">
               <span className="section-label">AI ARCHITECTURE</span>
               <h2>THE NEURAL <span className="text-glow">ADVANTAGE</span></h2>
               <p>Brawl.AI isn't just a game; it's a living, breathing neural ecosystem built for the next generation of digital combat.</p>
               
               <div className="features-simple-grid">
                 {[
                   "Smart AI Opponents", "Adaptive Gameplay", 
                   "Real-time Strategy Analysis", "Skill-based Matchmaking"
                 ].map((feat, i) => (
                   <div key={i} className="feat-item">
                     <div className="dot" />
                     <span>{feat}</span>
                   </div>
                 ))}
               </div>
               <Link to="/login" className="btn-primary-glow">INITIALIZE PILOT</Link>
            </div>
          </div>
        </section>

        {/* 🏆 ACHIEVEMENTS & REWARDS 🏆 */}
        <section className="tech-section alt-bg">
          <div className="container-main">
            <div className="section-head center">
               <span className="section-label">COLLECTABLES</span>
               <h2>EARN YOUR <span className="accent-magenta">LEGACY</span></h2>
            </div>
            <div className="features-grid-premium">
              {[
                { title: "Daily Rewards", desc: "Log in every 24h to claim premium $CORE credits and skins.", progress: 75, xp: "2,400 XP", reward: "🎁", tier: "GOLD" },
                { title: "Unlockable Skins", desc: "Customize your AI pilot with elite cosmetic chassis upgrades.", progress: 45, xp: "1,800 XP", reward: "🎨", tier: "SILVER" },
                { title: "Win Streak Bonus", desc: "Stacked XP multipliers for consecutive logic dominance.", progress: 90, xp: "5,200 XP", reward: "🔥", tier: "PLATINUM" },
                { title: "Master Badges", desc: "Unique identity markers for the top 1% of pilots.", progress: 30, xp: "8,000 XP", reward: "🏆", tier: "DIAMOND" }
              ].map((ach, i) => (
                <motion.div 
                  key={i} 
                  className="f-card achievement-card-v2"
                  whileHover={{ y: -8, scale: 1.03 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="ach-header">
                    <div className="ach-reward-icon">{ach.reward}</div>
                    <span className={`ach-tier tier-${ach.tier.toLowerCase()}`}>{ach.tier}</span>
                  </div>
                  <h4>{ach.title}</h4>
                  <p>{ach.desc}</p>
                  <div className="ach-progress-section">
                    <div className="ach-progress-info">
                      <span className="ach-xp">{ach.xp}</span>
                      <span className="ach-percent">{ach.progress}%</span>
                    </div>
                    <div className="ach-progress-track">
                      <div className="ach-progress-fill" style={{ width: `${ach.progress}%` }} />
                      <div className="ach-progress-glow" style={{ left: `${ach.progress}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 🔥 STREAK MULTIPLIER VISUAL 🔥 */}
            <motion.div 
              className="streak-multiplier-section"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="streak-header">
                <div className="streak-title-group">
                  <Zap size={20} className="accent-magenta" />
                  <h3>STREAK <span className="accent-magenta">MULTIPLIER</span></h3>
                </div>
                <span className="streak-subtitle">Consecutive wins boost your XP earnings</span>
              </div>
              <div className="streak-bars-container">
                {[
                  { wins: 3, multi: "1.5x", height: 20, active: false },
                  { wins: 5, multi: "2x", height: 32, active: false },
                  { wins: 7, multi: "3x", height: 44, active: false },
                  { wins: 10, multi: "4x", height: 56, active: true },
                  { wins: 15, multi: "5x", height: 68, active: false },
                  { wins: 20, multi: "7x", height: 80, active: false },
                  { wins: 30, multi: "10x", height: 100, active: false }
                ].map((streak, i) => (
                  <motion.div 
                    key={i} 
                    className={`streak-bar-item ${streak.active ? 'active' : ''}`}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <span className="streak-multi-label">{streak.multi}</span>
                    <div className="streak-bar-track">
                      <div 
                        className={`streak-bar-fill ${streak.active ? 'glow-active' : ''} ${i <= 3 ? 'filled' : ''}`}
                        style={{ height: `${streak.height}%` }}  
                      />
                    </div>
                    <span className="streak-wins-label">{streak.wins} wins</span>
                    {streak.active && <span className="streak-current-badge">CURRENT</span>}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 📊 PROGRESS TODAY PANEL 📊 */}
            <motion.div 
              className="progress-today-panel"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="pt-left">
                <div className="pt-header">
                  <Activity size={18} className="accent-cyan" />
                  <h3>TODAY'S <span className="accent-cyan">PROGRESS</span></h3>
                </div>
                <div className="pt-tasks">
                  {[
                    { task: "Win 3 Battles", done: true, xp: "+300 XP" },
                    { task: "Complete Daily Challenge", done: true, xp: "+500 XP" },
                    { task: "Play 2 Ranked Matches", done: false, xp: "+400 XP" },
                    { task: "Earn 1,000 $CORE", done: false, xp: "+250 XP" }
                  ].map((t, i) => (
                    <div key={i} className={`pt-task-row ${t.done ? 'completed' : ''}`}>
                      <div className="pt-task-check">
                        {t.done ? '✓' : <div className="pt-task-empty" />}
                      </div>
                      <span className="pt-task-name">{t.task}</span>
                      <span className="pt-task-xp">{t.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-right">
                <div className="pt-circle-progress">
                  <svg viewBox="0 0 120 120" className="pt-ring-svg">
                    <circle cx="60" cy="60" r="52" className="pt-ring-bg" />
                    <circle cx="60" cy="60" r="52" className="pt-ring-fill" 
                      strokeDasharray="326.7" 
                      strokeDashoffset="163.3" 
                    />
                  </svg>
                  <div className="pt-circle-text">
                    <span className="pt-circle-percent">50%</span>
                    <span className="pt-circle-label">COMPLETE</span>
                  </div>
                </div>
                <motion.button 
                  className="claim-reward-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap size={16} />
                  <span>CLAIM REWARD</span>
                </motion.button>
                <span className="pt-reward-hint">2/4 tasks completed</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ⚡ WHY CHOOSE BRAWL.AI ⚡ */}
        <section className="why-section" id="about">
          <div className="container-main">
            <div className="why-top-row">
              <motion.div 
                className="why-copy-block"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="section-label">THE EDGE</span>
                <h2>WHY <span className="accent-magenta text-glow">BRAWL.AI?</span></h2>
                <p className="why-desc">
                  Where raw logic meets real-time combat. No luck, no RNG — 
                  just your code against theirs. Built for developers who live 
                  to compete, train, and dominate.
                </p>
              </motion.div>
              <motion.div 
                className="why-fighters-visual"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <img src={`${import.meta.env.BASE_URL}assets/elite_fighters.png?v=1.0`} alt="Elite Fighters" className="why-fighters-img" />
              </motion.div>
            </div>

            <div className="why-cards-grid">
              {[
                { 
                  icon: <Zap size={28} />, 
                  title: "Sub-50ms Execution", 
                  desc: "Your code compiles, runs, and fights in real-time. Zero lag between logic and action.",
                  stat: "< 50ms",
                  color: "cyan"
                },
                { 
                  icon: <Shield size={28} />, 
                  title: "ELO-Ranked Matchmaking", 
                  desc: "Skill-based tiers ensure every fight is a fair challenge. Climb from Iron to Grandmaster.",
                  stat: "2400+ ELO",
                  color: "magenta"
                },
                { 
                  icon: <Cpu size={28} />, 
                  title: "Distraction-Free Arena", 
                  desc: "A terminal-inspired interface designed for pure focus. No clutter, just code and combat.",
                  stat: "0 ADS",
                  color: "white"
                },
                { 
                  icon: <Target size={28} />, 
                  title: "AI Coach & Replay", 
                  desc: "Post-match AI analysis breaks down your strategy. Learn, adapt, and evolve every round.",
                  stat: "10M+ SIMS",
                  color: "cyan"
                }
              ].map((card, i) => (
                <motion.div 
                  key={i} 
                  className={`why-card glass-panel`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="why-card-top">
                    <div className={`why-card-icon ${card.color}`}>{card.icon}</div>
                    <span className={`why-card-stat ${card.color}`}>{card.stat}</span>
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        {/* 🌑 CINEMATIC FOOTER 🌑 */}
        <footer className="footer-premium-v2">
           <div className="footer-branding">
              <div className="logo-f font-montserrat">BR<span className="accent-magenta">AWL</span>.AI</div>
           </div>

           <div className="footer-socials">
             {[
               { icon: <Globe size={22} />, label: "Website", href: "https://anishaa-07.github.io/brawl.AI/" },
               { icon: <GitFork size={22} />, label: "GitHub", href: "https://github.com/anishaa-07/brawl.AI" },
               { icon: <Mail size={22} />, label: "Email", href: "mailto:anisharanjanaur2007@gmail.com" },
               { icon: <Send size={22} />, label: "Telegram", href: "#" }
             ].map((social, i) => (
               <motion.a 
                 key={i}
                 href={social.href}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="social-icon-btn"
                 whileHover={{ scale: 1.15, y: -5 }}
                 whileTap={{ scale: 0.95 }}
                 title={social.label}
               >
                 {social.icon}
               </motion.a>
             ))}
           </div>

           <div className="footer-divider" />

           <motion.div 
             className="footer-tagline"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
           >
             <h3>Where logic becomes <span className="accent-magenta text-glow">COMPETITION</span> !</h3>
           </motion.div>

           <div className="footer-base-v2">
              <p>© 2026 BRAWL.AI — ALL SYSTEMS OPERATIONAL</p>
           </div>
        </footer>
      </Background>
    </div>
  );
};

export default Home;

