import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import AboutModal from './AboutModal'; // Assuming AboutModal.jsx is in the same folder

function Header({ user, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeLinkStyle = {
        color: '#2563eb',
        fontWeight: '600',
    };

    return (
        <>
            <header className="bg-white shadow-md sticky top-0 z-20">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <NavLink to="/dashboard" className="text-2xl font-bold text-gray-800">
                        QP<span className="text-blue-600">Archive</span>
                    </NavLink>

                    {/* Desktop Menu - Hidden on small screens */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            About
                        </button>
                        <span className="text-gray-700 border-l pl-6">
                            Welcome, <span className="font-semibold text-blue-600">{user.username}</span>
                        </span>
                        
                        {user.role === 'ADMIN' && (
                            <div className="flex items-center space-x-4 border-l pl-4">
                                <NavLink to="/admin/departments" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-blue-600 transition-colors">Departments</NavLink>
                                <NavLink to="/admin/courses" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-blue-600 transition-colors">Courses</NavLink>
                                <NavLink to="/admin/subjects" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-blue-600 transition-colors">Subjects</NavLink>
                                <NavLink to="/admin/users" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-blue-600 transition-colors">Users</NavLink>
                            </div>
                        )}
                         <button
                            onClick={onLogout}
                            className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                    
                    {/* Mobile Menu Button - Only visible on small screens */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown - Shows when isMenuOpen is true */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 border-t">
                        <button onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }} className="block text-gray-600 hover:text-blue-600 w-full text-left">About</button>
                        {user.role === 'ADMIN' && (
                            <div className="border-t pt-2 space-y-2">
                                <NavLink to="/admin/departments" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-blue-600">Departments</NavLink>
                                <NavLink to="/admin/courses" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-blue-600">Courses</NavLink>
                                <NavLink to="/admin/subjects" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-blue-600">Subjects</NavLink>
                                <NavLink to="/admin/users" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-blue-600">Users</NavLink>
                            </div>
                        )}
                        <button
                            onClick={onLogout}
                            className="w-full text-left mt-2 px-3 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>

            {/* Your About Modal */}
            <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

export default Header;