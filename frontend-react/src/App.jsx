import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Battle from './pages/Battle';
import Arena from './pages/Arena';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lobby" element={
            <PrivateRoute>
              <Lobby />
            </PrivateRoute>
          } />
          <Route path="/battle" element={
            <PrivateRoute>
              <Battle />
            </PrivateRoute>
          } />
          <Route path="/arena" element={
            <PrivateRoute>
              <Arena />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
