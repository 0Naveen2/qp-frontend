import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));

  // If there's no user or the user is not an ADMIN, redirect them.
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is an admin, show the protected page.
  return children;
}

export default AdminRoute;