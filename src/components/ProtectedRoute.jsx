import React from 'react';
import { Navigate } from 'react-router-dom';

// This component is a wrapper around our private pages
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, show the page the user wanted to see
  return children;
}

export default ProtectedRoute;