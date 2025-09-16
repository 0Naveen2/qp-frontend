import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import Page Components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage.jsx';
import AdminDepartmentsPage from './pages/AdminDepartmentsPage.jsx';
import AdminCoursesPage from './pages/AdminCoursesPage.jsx';
import AdminSubjectsPage from './pages/AdminSubjectsPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx'; // <-- Import the new page

// Import Route Protection Components
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

function App() {
  // This state helps re-render the app on login/logout
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <Routes>

      <Route 
        path="/admin/users" 
        element={<AdminRoute><AdminUsersPage onLogout={handleLogout} /></AdminRoute>} 
      />
      {/* Public Routes */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes (for all logged-in users) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadPage onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* Admin-Only Routes */}
      <Route
        path="/admin/departments"
        element={
          <AdminRoute>
            <AdminDepartmentsPage onLogout={handleLogout} />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <AdminRoute>
            <AdminCoursesPage onLogout={handleLogout} />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/subjects"
        element={
          <AdminRoute>
            <AdminSubjectsPage onLogout={handleLogout} />
          </AdminRoute>
        }
      />
      
      {/* THIS IS THE NEW ROUTE THAT WAS MISSING */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage onLogout={handleLogout} />
          </AdminRoute>
        }
      />
      
    </Routes>
  );
}

// A small wrapper component is needed because App uses useNavigate
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;