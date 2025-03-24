import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import OneBox from './pages/OneBox';
import AuthCallback from './pages/AuthCallback';
import ApiTesterPage from './pages/ApiTesterPage';

// Protected Route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route 
              path="/onebox" 
              element={
                <ProtectedRoute>
                  <OneBox />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/api-tester" 
              element={
                <ProtectedRoute>
                  <ApiTesterPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 