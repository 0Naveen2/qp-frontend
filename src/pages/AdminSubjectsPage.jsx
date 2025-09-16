import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getDepartments, getCoursesByDepartment, getSubjectsByCourse, addSubject, deleteSubject } from '../services/paperService';

function AdminSubjectsPage({ onLogout }) {
    const user = JSON.parse(localStorage.getItem('user'));

    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    const [newSubject, setNewSubject] = useState({ name: '', code: '', semester: '' });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDepartments()
            .then(setDepartments)
            .catch(() => setError('Could not fetch departments.'));
    }, []);

    const handleDeptChange = async (deptId) => {
        setSelectedDept(deptId);
        setCourses([]);
        setSubjects([]);
        setSelectedCourse('');
        if (!deptId) return;
        try {
            const courseData = await getCoursesByDepartment(deptId);
            setCourses(courseData);
        } catch (err) {
            setError('Could not fetch courses.');
        }
    };
    
    const handleCourseChange = async (courseId) => {
        setSelectedCourse(courseId);
        setSubjects([]);
        if (!courseId) return;
        try {
            setLoading(true);
            const subjectData = await getSubjectsByCourse(courseId);
            setSubjects(subjectData);
        } catch (err) {
            setError('Could not fetch subjects.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewSubject(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!selectedCourse || !newSubject.name || !newSubject.semester) {
            setError('Please select a department/course and fill in all subject details.');
            return;
        }
        setError('');
        setSuccess('');
        try {
            const addedSubject = await addSubject(selectedCourse, newSubject);
            setSuccess(`Successfully added subject: ${addedSubject.name}`);
            setNewSubject({ name: '', code: '', semester: '' });
            handleCourseChange(selectedCourse);
        } catch (err) {
            setError(err.message || 'Failed to add subject.');
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        if (window.confirm('Are you sure you want to delete this subject? This might affect associated papers.')) {
            setError('');
            setSuccess('');
            try {
                await deleteSubject(subjectId);
                setSuccess('Subject deleted successfully.');
                handleCourseChange(selectedCourse);
            } catch (err) {
                setError(err.message || 'Failed to delete subject.');
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Subjects</h1>

                <div className="p-6 bg-white rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Subject</h2>
                    <form onSubmit={handleAddSubject} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-600">Select Department</label>
                                <select id="department" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                                    <option value="">-- First Select Department --</option>
                                    {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="course" className="block text-sm font-medium text-gray-600">Select Course</label>
                                <select id="course" value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md" disabled={!selectedDept}>
                                    <option value="">-- Then Select Course --</option>
                                    {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-600">Subject Name</label>
                                <input id="name" name="name" type="text" value={newSubject.name} onChange={handleFormChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" placeholder="e.g., Structural Analysis" required disabled={!selectedCourse} />
                            </div>
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-600">Subject Code</label>
                                <input id="code" name="code" type="text" value={newSubject.code} onChange={handleFormChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" placeholder="e.g., CE401" disabled={!selectedCourse} />
                            </div>
                            <div>
                                <label htmlFor="semester" className="block text-sm font-medium text-gray-600">Semester</label>
                                <input id="semester" name="semester" type="number" min="1" max="8" value={newSubject.semester} onChange={handleFormChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" placeholder="e.g., 4" required disabled={!selectedCourse} />
                            </div>
                            <button type="submit" disabled={!selectedCourse} className="w-full py-2 px-4 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-400">
                                Add Subject
                            </button>
                        </div>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
                </div>

                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Existing Subjects</h2>
                    {!selectedCourse && <p className="text-gray-500">Please select a department and course to see its subjects.</p>}
                    {loading && <p>Loading subjects...</p>}
                    {selectedCourse && !loading && (
                        <ul className="space-y-3">
                            {subjects.map(subject => (
                                <li key={subject.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <span className="font-semibold text-gray-800">{subject.name}</span>
                                        <span className="text-sm text-gray-500 ml-4">(Code: {subject.code}, Sem: {subject.semester})</span>
                                    </div>
                                    <button onClick={() => handleDeleteSubject(subject.id)} className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
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

export default AdminSubjectsPage;