import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner

  // Only check authentication for protected routes
  const isProtectedRoute = location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/instructor') ||
                          location.pathname === '/dashboard';

  if (isProtectedRoute && !user?.email) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Role-based routing
  const path = location.pathname;
  
  // Admin routes
  if (path.startsWith('/admin')) {
    if (user?.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Instructor routes
  if (path.startsWith('/instructor')) {
    if (user?.role !== 'instructor') {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // User routes
  if (path === '/dashboard' && user?.role === 'instructor') {
    return <Navigate to="/instructor/dashboard" replace />;
  }
  
  if (path === '/dashboard' && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
