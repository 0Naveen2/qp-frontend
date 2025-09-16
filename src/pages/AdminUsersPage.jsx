import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createUserByAdmin } from '../services/paperService';

function AdminUsersPage({ onLogout }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const newUser = await createUserByAdmin(formData);
            setSuccess(`Successfully created user: ${newUser.username} with role ${newUser.role}`);
            setFormData({ username: '', email: '', password: '', role: 'STUDENT' });
        } catch (err) {
            setError(err.message || 'Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
                <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Create New User</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
                            <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-600">Role</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                                <option value="STUDENT">Student</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-500 text-sm">{success}</p>}
                        <button type="submit" disabled={loading} className="w-full py-2 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// THIS LINE WAS LIKELY MISSING
export default AdminUsersPage;