import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import AboutModal from './AboutModal';

function Header({ user, onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeLinkStyle = { color: '#2563eb', textDecoration: 'underline' };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <NavLink to="/dashboard" className="text-2xl font-bold text-gray-800">
            QP<span className="text-blue-600">Archive</span>
          </NavLink>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              About
            </button>
            <span className="text-gray-700 border-l pl-4">
              Welcome, <span className="font-semibold text-blue-600">{user.username}</span>
            </span>
            
            {user.role === 'ADMIN' && (
              <div className="flex items-center space-x-4 ml-4 border-l pl-4">
                <NavLink to="/admin/departments" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 font-semibold hover:text-blue-600 transition-colors">Departments</NavLink>
                <NavLink to="/admin/courses" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 font-semibold hover:text-blue-600 transition-colors">Courses</NavLink>
                <NavLink to="/admin/subjects" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 font-semibold hover:text-blue-600 transition-colors">Subjects</NavLink>
                <NavLink to="/admin/users" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 font-semibold hover:text-blue-600 transition-colors">Users</NavLink>
              </div>
            )}

            <button
              onClick={onLogout}
              className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default Header;