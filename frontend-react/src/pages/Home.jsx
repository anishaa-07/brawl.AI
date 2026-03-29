import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sword, Cpu, Target, Globe, Info, Send, ChevronRight, Activity, Zap, Shield } from 'lucide-react';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  return (
    <div className="landing-wrapper">
      <Background>
        <Navbar />
        
        {/* 🏆 EPIC HERO: CINEMATIC BATTLE ARENA 🏆 */}
        <section className="hero-section premium" id="home">
          {/* Anime Background Overlay */}
          <div className="hero-anime-bg" style={{ 
            backgroundImage: `url(${import.meta.env.BASE_URL}assets/anime_bg.png)`,
            position: 'absolute', inset: 0, opacity: 0.15, zIndex: 1, pointerEvents: 'none',
            backgroundSize: 'cover', backgroundPosition: 'center'
          }} />

          <div className="container-hero">
            <motion.div 
              className="hero-text-content"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ zIndex: 10 }}
            >
              <motion.div 
                className="tagline-badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Zap size={14} className="accent-magenta" />
                <span>NEURAL ARENA PILOT</span>
              </motion.div>

              <motion.h1 
                className="hero-display font-montserrat"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Only The <span className="accent-magenta text-glow">SMARTEST</span><br />
                Survive !
              </motion.h1>

              <motion.p 
                className="hero-lead"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                The first decentralized AI fighting arena where combat is code, 
                and logic is the ultimate weapon. Dominate the global grid.
              </motion.p>

              <motion.div 
                className="hero-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/login" className="btn-primary-glow">
                  <span>ENTER ARENA</span>
                  <ChevronRight size={18} />
                </Link>

              </motion.div>
            </motion.div>

            {/* Cinematic Clashing Art (Single Consolidated Image) */}
            <motion.div 
              className="hero-art-main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ zIndex: 5 }}
            >
              <div className="hero-art-single">
                <img src={`${import.meta.env.BASE_URL}assets/hero_main_new.png?v=1.4`} alt="Elite Pilots" className="hero-center-art-v2" />
                <div className="clash-glow" />
              </div>
            </motion.div>
          </div>

          <div className="stat-bar-premium">
             <div className="p-stat"><span className="p-label">TOTAL MATCHES</span><span className="p-val">1.28M</span><Activity size={12} className="accent-magenta" /></div>
             <div className="v-divider" />
             <div className="p-stat"><span className="p-label">SYSTEM RANK</span><span className="p-val">CORE-01</span><Shield size={12} className="accent-cyan" /></div>
             <div className="v-divider" />
             <div className="p-stat"><span className="p-label">ACTIVE PILOTS</span><span className="p-val">15,842</span><div className="online-indicator" /></div>
          </div>
        </section>

        {/* 🎮 GAME MODES SECTION 🎮 */}
        <section className="tech-section" id="modes">
          <div className="container-main">
            <div className="section-head center">
               <span className="section-label">COMBAT INTERFACE</span>
               <h2>LEVEL UP YOUR <span className="accent-magenta text-glow">SKILLS</span></h2>
            </div>
            <div className="features-grid-premium">
              {[
                { title: "1v1 Duel", desc: "Face off against elite AI or human pilots in high-stakes logic combat.", icon: <Sword size={32}/>, color: "magenta" },
                { title: "AI Training", desc: "Refine your algorithms in a sandbox environment with real-time feedback.", icon: <Target size={32}/>, color: "cyan" },
                { title: "Ranked Match", desc: "Climb the global grid and earn seasonal rewards for your logic mastery.", icon: <Cpu size={32}/>, color: "white" },
                { title: "Casual Mode", desc: "Experiment with new tactics in a low-pressure environment.", icon: <Zap size={32}/>, color: "cyan" },
                { title: "Daily Challenges", desc: "Complete daily neural puzzles to earn unique $CORE rewards and XP.", icon: <Zap size={32}/>, color: "magenta" },
                { title: "Multiplayer", desc: "Large-scale node battles where multiple pilots clash for grid supremacy.", icon: <Globe size={32}/>, color: "white" }
              ].map((mode, index) => (
                <motion.div key={index} className="f-card glass-panel" whileHover={{ y: -10, scale: 1.02 }}>
                  <div className={`f-icon-box ${mode.color}`}>{mode.icon}</div>
                  <h4>{mode.title}</h4>
                  <p>{mode.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
          </div>
        </section>

        {/* ⚡ WHY CHOOSE BRAWL.AI ⚡ */}
        <section className="preview-section">
          <div className="container-main side-by-side">
            <div className="tech-copy">
               <span className="section-label">SYSTEM CORE</span>
               <h2>WHY <span className="accent-magenta">BRAWL.AI?</span></h2>
               <div className="why-grid">
                 {[
                   { t: "Fast Gameplay", d: "Zero-latency neural processing for instant combat feedback." },
                   { t: "Fair Matchmaking", d: "ELO-based logic tiers ensure balanced competition." },
                   { t: "Clean UI", d: "High-end aesthetic inspired by futuristic terminal interfaces." },
                   { t: "AI-Powered", d: "Millions of battle simulations every second for true variety." }
                 ].map((item, i) => (
                    <div key={i} className="why-item">
                       <h5>{item.t}</h5>
                       <p>{item.d}</p>
                    </div>
                 ))}
               </div>
            </div>
            <div className="tech-visual">
               <img src={`${import.meta.env.BASE_URL}assets/arena_wide.png`} alt="Arena Wide" className="preview-img-frame" />
            </div>
          </div>
        </section>

        {/* 🌐 COMMUNITY & ROADMAP: PROFESSIONAL HUD 🌐 */}
        <section className="dual-section tech-section" id="community">
          <div className="container-main">
            <div className="dual-grid">
              {/* Community Pulse Card */}
              <motion.div 
                className="community-box glass-panel professional"
                whileHover={{ scale: 1.01 }}
              >
                <div className="panel-header">
                  <Globe size={18} className="accent-cyan" />
                  <span className="section-label">GLOBAL NETWORK</span>
                </div>
                <h2>COMMUNITY <span className="text-glow">HUB</span></h2>
                <div className="pulse-stats-grid">
                  {[
                    { label: "CONNECTED PILOTS", val: "842k+", trend: "+12%" },
                    { label: "BATTLE FREQUENCY", val: "1.2ms", trend: "LEGACY" },
                    { label: "NODES ONLINE", val: "15,842", trend: "STABLE" }
                  ].map((stat, i) => (
                    <div key={i} className="pulse-stat-card">
                       <span className="p-label">{stat.label}</span>
                       <div className="p-val-row">
                         <span className="p-val">{stat.val}</span>
                         <span className="p-trend">{stat.trend}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Roadmap Strategy Card */}
              <motion.div 
                className="upcoming-box glass-panel professional"
                whileHover={{ scale: 1.01 }}
              >
                <div className="panel-header">
                  <Activity size={18} className="accent-magenta" />
                  <span className="section-label">ROADMAP // Q3-Q4 2026</span>
                </div>
                <h2>UPCOMING <span className="accent-magenta">FEATURES</span></h2>
                <div className="roadmap-list-professional">
                  {[
                    { name: "Neural Voice Chat", progress: 85, status: "TESTING" },
                    { name: "Global Team Battles", progress: 60, status: "STAGING" },
                    { name: "Tournament Protocol", progress: 30, status: "DEV" },
                    { name: "Mobile Client Node", progress: 15, status: "PLANNING" }
                  ].map((feat, i) => (
                    <div key={i} className="roadmap-item-pro">
                       <div className="item-meta">
                         <span className="f-name">{feat.name}</span>
                         <span className="f-status">{feat.status}</span>
                       </div>
                       <div className="progress-track">
                         <div className="progress-fill" style={{ width: `${feat.progress}%` }} />
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 🌑 CINEMATIC FOOTER 🌑 */}
        <footer className="footer-premium">
           <div className="footer-main">
              <div className="f-branding">
                 <div className="logo-f font-montserrat">BR<span className="accent-magenta">AWL</span>.AI</div>
                 <p className="f-tagline">DECENTRALIZED NEURAL ARENA</p>
              </div>
              <div className="f-links-grid">
                 <div className="f-col">
                   <h6>GRID</h6>
                   <Link to="/">ARENA</Link><Link to="/">RANKINGS</Link><Link to="/">MODES</Link>
                 </div>
                 <div className="f-col">
                   <h6>INTELLIGENCE</h6>
                   <Link to="/">SYSTEMS</Link><Link to="/">DOCUMENTATION</Link><Link to="/">SUPPORT</Link>
                 </div>
                 <div className="f-col social">
                   <h6>NETWORK</h6>
                   <div className="social-row"><Globe size={18}/><Info size={18}/><Send size={18}/></div>
                 </div>
              </div>
           </div>
           <div className="footer-base">
              <p>© 2026 BRAWL.AI - SECURE SYSTEM ENDPOINT</p>
           </div>
        </footer>
      </Background>
    </div>
  );
};

export default Home;

