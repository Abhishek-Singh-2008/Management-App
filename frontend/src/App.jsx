import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        backgroundColor: 'hsl(224, 71%, 4%)', 
        color: 'white' 
      }}>
        <div style={{ fontSize: '1.2rem', fontFamily: 'Outfit' }}>Loading Workspace...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Redirect if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

// Global Layout with Navbar
function AppLayout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && (
        <nav className="navbar">
          <a href="/" className="nav-brand">
            <span className="brand-icon">✓</span>
            <span className="brand-name">ProManage</span>
          </a>
          <div className="nav-actions">
            <span className="user-badge">
              <span className="user-dot" />
              {user?.email}
            </span>
            <button className="btn btn-secondary btn-text" onClick={logout}>
              Sign Out
            </button>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:id" 
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
