import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authContext.js';  // Correct relative path

const PrivateRoute = ({ element, requiredRole, ...rest }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect if the user doesn't have the required role (e.g., admin)
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated, render the protected component
  return element;
};

export default PrivateRoute;
