import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getDepartments, addDepartment, deleteDepartment } from '../services/paperService';

function AdminDepartmentsPage({ onLogout }) {
    const user = JSON.parse(localStorage.getItem('user'));

    const [departments, setDepartments] = useState([]);
    const [newDeptName, setNewDeptName] = useState('');
    const [newDeptCode, setNewDeptCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await getDepartments();
            setDepartments(data);
        } catch (err) {
            setError('Could not fetch departments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const newDept = await addDepartment({ name: newDeptName, code: newDeptCode });
            setSuccess(`Successfully added department: ${newDept.name}`);
            setNewDeptName('');
            setNewDeptCode('');
            fetchDepartments(); // Refresh the list
        } catch (err) {
            setError(err.message || 'Failed to add department.');
        }
    };

    const handleDeleteDepartment = async (deptId) => {
        if (window.confirm('Are you sure you want to delete this department? This might affect associated courses and subjects.')) {
            setError('');
            setSuccess('');
            try {
                await deleteDepartment(deptId);
                setSuccess('Department deleted successfully.');
                fetchDepartments(); // Refresh the list
            } catch (err) {
                setError(err.message || 'Failed to delete department.');
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Departments</h1>

                {/* Add Department Form */}
                <div className="p-6 bg-white rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Department</h2>
                    <form onSubmit={handleAddDepartment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label htmlFor="deptName" className="block text-sm font-medium text-gray-600">Department Name</label>
                            <input
                                id="deptName" type="text" value={newDeptName}
                                onChange={(e) => setNewDeptName(e.target.value)}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                placeholder="e.g., Mechanical Engineering" required
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="deptCode" className="block text-sm font-medium text-gray-600">Department Code</label>
                            <input
                                id="deptCode" type="text" value={newDeptCode}
                                onChange={(e) => setNewDeptCode(e.target.value)}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                placeholder="e.g., ME"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600">
                                Add Department
                            </button>
                        </div>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
                </div>

                {/* Existing Departments List */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Existing Departments</h2>
                    {loading ? <p>Loading...</p> : (
                        <ul className="space-y-3">
                            {departments.map(dept => (
                                <li key={dept.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <span className="font-semibold text-gray-800">{dept.name}</span>
                                        <span className="text-sm text-gray-500 ml-4">({dept.code})</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteDepartment(dept.id)}
                                        className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AdminDepartmentsPage;