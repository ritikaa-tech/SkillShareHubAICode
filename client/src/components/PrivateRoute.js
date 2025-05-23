import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = false; // This should be replaced with actual auth state

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 