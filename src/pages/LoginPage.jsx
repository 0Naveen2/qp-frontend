import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/authService.js';
import Footer from '../components/Footer.jsx';
import PublicHeader from '../components/PublicHeader.jsx';

function LoginPage({ onLoginSuccess }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(formData.username, formData.password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
            onLoginSuccess();
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="flex flex-col min-h-screen items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: 'url("/login-background.jpg")' }}
        >
            <PublicHeader />
            <main className="flex-grow flex items-center justify-center w-full px-4">
                 {/* Added a subtle shadow and backdrop-blur for a "glass" effect */}
                 <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-40 rounded-xl shadow-2xl backdrop-blur-sm"> 
                    
                    <div className="text-center">
                        {/* Added a drop-shadow to the logo for depth */}
                        <img 
                            src="/logo.png" 
                            alt="Alliance University Logo" 
                            className="mx-auto h-20 w-auto" 
                            style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
                        /> 
                    </div>

                    {/* --- TEXT CHANGES --- */}
                    <h1 className="text-3xl font-bold text-center text-gray-900" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                        Student & Faculty Login
                    </h1>
                    <p className="text-center text-gray-800 font-medium">
                        Please enter your credentials to proceed.
                    </p>
                    {/* --- END OF TEXT CHANGES --- */}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-gray-700 sr-only">Username</label>
                            {/* --- INPUT STYLE CHANGES --- */}
                            <input
                                id="username" name="username" type="text"
                                value={formData.username} onChange={handleChange}
                                placeholder="Username"
                                className="w-full px-4 py-3 text-base text-gray-900 bg-white bg-opacity-50 border-2 border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-700"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 sr-only">Password</label>
                            {/* --- INPUT STYLE CHANGES --- */}
                            <input
                                id="password" name="password" type="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-4 py-3 text-base text-gray-900 bg-white bg-opacity-50 border-2 border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-700"
                                required
                            />
                        </div>
                        
                        {error && <p className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md font-semibold">{error}</p>}

                        <div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all duration-300 shadow-lg"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                    <div className="text-center text-sm text-gray-800 font-medium mt-4">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-blue-800 hover:underline">Sign up</Link>
                    </div>
                </div>
            </main>
            <Footer theme="dark"/>
        </div>
    );
}

export default LoginPage;