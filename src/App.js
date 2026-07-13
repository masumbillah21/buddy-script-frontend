import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import Layout from './components/Layout';

// Wrapper for auth-protected routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  return token ? children : <Navigate to="/login" replace />;
};

// Wrapper to prevent logged-in users from visiting login/register
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <FeedPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Catch-all route redirecting back to home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
