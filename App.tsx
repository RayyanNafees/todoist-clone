
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for demo

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <AuthPage type="login" onAuth={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <AuthPage type="signup" onAuth={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/project/:id" 
          element={isAuthenticated ? <Dashboard onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
