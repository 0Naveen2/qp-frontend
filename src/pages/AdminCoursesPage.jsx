import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getDepartments, getCoursesByDepartment, addCourse, deleteCourse } from '../services/paperService';

function AdminCoursesPage({ onLogout }) {
    const user = JSON.parse(localStorage.getItem('user'));

    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDepartments()
            .then(setDepartments)
            .catch(() => setError('Could not fetch departments.'));
    }, []);

    const fetchCourses = async (departmentId) => {
        if (!departmentId) {
            setCourses([]);
            return;
        }
        try {
            setLoading(true);
            setError('');
            const data = await getCoursesByDepartment(departmentId);
            setCourses(data);
        } catch (err) {
            setError('Could not fetch courses for this department.');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeptChange = (deptId) => {
        setSelectedDept(deptId);
        fetchCourses(deptId);
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!selectedDept) {
            setError('Please select a department first.');
            return;
        }
        setError('');
        setSuccess('');
        try {
            const newCourse = await addCourse(selectedDept, { name: newCourseName, code: newCourseCode });
            setSuccess(`Successfully added course: ${newCourse.name}`);
            setNewCourseName('');
            setNewCourseCode('');
            fetchCourses(selectedDept); // Refresh the list
        } catch (err) {
            setError(err.message || 'Failed to add course.');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course? This will also delete all associated subjects.')) {
            setError('');
            setSuccess('');
            try {
                await deleteCourse(courseId);
                setSuccess('Course deleted successfully.');
                fetchCourses(selectedDept); // Refresh the list
            } catch (err) {
                setError(err.message || 'Failed to delete course.');
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Courses</h1>

                {/* Add Course Form */}
                <div className="p-6 bg-white rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Course</h2>
                    <form onSubmit={handleAddCourse} className="space-y-4">
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-600">First, select a Department</label>
                            <select id="department" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                                <option value="">-- Select a Department --</option>
                                {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label htmlFor="courseName" className="block text-sm font-medium text-gray-600">Course Name</label>
                                <input id="courseName" type="text" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md" placeholder="e.g., B.Tech" required disabled={!selectedDept} />
                            </div>
                            <div>
                                <label htmlFor="courseCode" className="block text-sm font-medium text-gray-600">Course Code</label>
                                <input id="courseCode" type="text" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md" placeholder="e.g., BT" disabled={!selectedDept} />
                            </div>
                            <button type="submit" disabled={!selectedDept} className="w-full py-2 px-4 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-400">
                                Add Course
                            </button>
                        </div>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
                </div>

                {/* Existing Courses List */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Existing Courses</h2>
                    {loading && <p>Loading...</p>}
                    {!loading && selectedDept && courses.length === 0 && <p>No courses found for this department. Add one above.</p>}
                    {!selectedDept && <p className="text-gray-500">Please select a department to see its courses.</p>}
                    {courses.length > 0 && (
                        <ul className="space-y-3">
                            {courses.map(course => (
                                <li key={course.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <span className="font-semibold text-gray-800">{course.name}</span>
                                        <span className="text-sm text-gray-500 ml-4">({course.code})</span>
                                    </div>
                                    <button onClick={() => handleDeleteCourse(course.id)} className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
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

export default AdminCoursesPage;