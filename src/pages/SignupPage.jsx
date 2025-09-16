import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../services/authService.js';
import Footer from '../components/Footer.jsx';
import PublicHeader from '../components/PublicHeader.jsx';

function SignupPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
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
            await signup(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to register.');
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
                {/* Same styling for the card as LoginPage */}
                <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-40 rounded-xl shadow-2xl backdrop-blur-sm">
                    
                    {success ? (
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-green-600">Registration Successful!</h1>
                            <p className="mt-4 text-gray-700">
                                We've sent a verification link to your email. Please click the link to activate your account.
                            </p>
                            <div className="mt-8">
                                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                                    &larr; Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                {/* Added drop-shadow to the logo */}
                                <img 
                                    src="/logo.png" 
                                    alt="Alliance University Logo" 
                                    className="mx-auto h-20 w-auto mb-4" 
                                    style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
                                /> 
                            </div>
                            {/* --- TEXT CHANGES --- */}
                            <h1 className="text-3xl font-bold text-center text-gray-900" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                                Create Your Account
                            </h1>
                            <p className="text-center text-gray-800 font-medium">
                                Join the QPArchive community to get started.
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
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 sr-only">Email</label>
                                    {/* --- INPUT STYLE CHANGES --- */}
                                    <input
                                        id="email" name="email" type="email"
                                        value={formData.email} onChange={handleChange}
                                        placeholder="Email Address"
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
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                            <div className="text-center text-sm text-gray-800 font-medium mt-4">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-blue-800 hover:underline">Sign in</Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer theme="dark" /> 
        </div>
    );
}

export default SignupPage;