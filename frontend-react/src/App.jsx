import React, { useRef, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { socket } from './socket';

import Home from './pages/Home';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Battle from './pages/Battle';
import Arena from './pages/Arena';
import QuestionHub from './pages/QuestionHub';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  const getDepth = (path) => {
    if (path.includes('/lobby')) return 1;
    if (path.includes('/question-hub')) return 2;
    if (path.includes('/battle')) return 3;
    return 0; // Home/Login
  };

  const currDepth = getDepth(location.pathname);
  const prevDepth = getDepth(prevPathRef.current);
  
  // Track the direction we are moving across pages
  // 1 = Forward (Lobby -> Hub -> Battle)
  // -1 = Backward (Battle -> Hub -> Lobby)
  // 0 = Lateral or initial load
  let direction = 0;
  if (currDepth > prevDepth) direction = 1;
  else if (currDepth < prevDepth) direction = -1;

  const variants = {
    initial: (custom) => {
      if (custom.dir === 1) {
        if (custom.path.includes('/question-hub')) return { x: '100vw', opacity: 0 };
        if (custom.path.includes('/battle')) return { scale: 1.5, opacity: 0 };
      } else if (custom.dir === -1) {
        if (custom.path.includes('/question-hub')) return { scale: 0.8, opacity: 0 };
        if (custom.path.includes('/lobby')) return { x: '-100vw', opacity: 0 };
      }
      return { opacity: 0 };
    },
    animate: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: 'circOut' }
    },
    exit: (custom) => {
      // Exiting component uses the SAME direction setting as the entering one
      if (custom.dir === 1) {
        if (custom.path.includes('/lobby')) return { x: '-100vw', opacity: 0, transition: { duration: 0.4 } };
        if (custom.path.includes('/question-hub')) return { scale: 0.8, opacity: 0, transition: { duration: 0.4 } };
      } else if (custom.dir === -1) {
        if (custom.path.includes('/battle')) return { scale: 1.5, opacity: 0, transition: { duration: 0.4 } };
        if (custom.path.includes('/question-hub')) return { x: '100vw', opacity: 0, transition: { duration: 0.4 } };
      }
      return { opacity: 0, transition: { duration: 0.3 } };
    }
  };

  const motionProps = (path) => ({
    variants,
    custom: { dir: direction, path },
    initial: "initial",
    animate: "animate",
    exit: "exit",
    style: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
  });

  return (
    <AnimatePresence mode="wait" custom={{ dir: direction, path: location.pathname }}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <motion.div {...motionProps('/login')}><Login /></motion.div>
        } />
        <Route path="/lobby" element={
          <PrivateRoute>
            <motion.div {...motionProps('/lobby')}><Lobby /></motion.div>
          </PrivateRoute>
        } />
        <Route path="/question-hub" element={
          <PrivateRoute>
             <motion.div {...motionProps('/question-hub')}><QuestionHub /></motion.div>
          </PrivateRoute>
        } />
        <Route path="/battle" element={
          <PrivateRoute>
            <motion.div {...motionProps('/battle')}><Battle /></motion.div>
          </PrivateRoute>
        } />
        <Route path="/arena" element={
          <PrivateRoute>
            <Arena />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    // 1. Setup Theme
    const savedTheme = localStorage.getItem('brawl_theme');
    if (savedTheme === 'dark') document.body.className = 'brawl-theme-dark';

    // 2. Open Real-time Socket globally
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
