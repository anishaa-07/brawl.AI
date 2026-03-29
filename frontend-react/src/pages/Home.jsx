import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sword, Cpu, Target, Globe, Info, Send, ChevronRight, Activity, Zap, Shield, GitFork, Mail } from 'lucide-react';
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

