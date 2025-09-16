import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { getDepartments, getCoursesByDepartment, getSubjectsByCourse, uploadPaper } from '../services/paperService.js';

function UploadPage({ onLogout }) {
    const user = JSON.parse(localStorage.getItem('user'));

    // State for dropdown lists
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // State for user selections
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    
    // State for the form data, now including semester
    const [formData, setFormData] = useState({
        semester: '', // <-- THIS IS THE NEW FIELD
        year: new Date().getFullYear(),
        session: '',
        subjectId: '',
        file: null,
    });

    // State for loading and messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    useEffect(() => {
        getDepartments().then(setDepartments).catch(() => setError('Failed to load initial data.'));
    }, []);
    
    const handleDeptChange = async (deptId) => {
        setSelectedDept(deptId);
        setCourses([]); setSelectedCourse('');
        setSubjects([]); setFormData(p => ({...p, subjectId: ''}));
        if (!deptId) return;
        try { setCourses(await getCoursesByDepartment(deptId)); } catch (e) { setError('Could not load courses.'); }
    };
    
    const handleCourseChange = async (courseId) => {
        setSelectedCourse(courseId);
        setSubjects([]); setFormData(p => ({...p, subjectId: ''}));
        if (!courseId) return;
        try { setSubjects(await getSubjectsByCourse(courseId)); } catch (e) { setError('Could not load subjects.'); }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Now we check for the semester field as well
        const { file, subjectId, session, year, semester } = formData;
        if (!file || !subjectId || !session || !year || !semester) {
            setError('Please fill out all fields and select a file.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const uploadData = new FormData();
            
            // Append the semester from our new form field
            uploadData.append('semester', semester);
            uploadData.append('year', year);
            uploadData.append('session', session);
            uploadData.append('subjectId', subjectId);
            uploadData.append('file', file);
            
            await uploadPaper(uploadData);
            setSuccessMessage(`Paper "${file.name}" uploaded successfully!`);
            e.target.reset();
            setFormData(p => ({...p, file: null, session: '', subjectId: '', semester: ''}));

        } catch (err) {
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="container mx-auto px-6 py-8">
                <Link to="/dashboard" className="mb-6 inline-block text-blue-600 hover:underline font-semibold">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload New Question Paper</h1>
                
                <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md space-y-6 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                            <select id="department" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mt-1" required>
                                <option value="">Select Department</option>
                                {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                            <select id="course" value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)} disabled={!selectedDept} className="w-full p-2 border border-gray-300 rounded-md mt-1 disabled:bg-gray-200" required>
                                <option value="">Select Course</option>
                                {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">Subject</label>
                        <select id="subjectId" name="subjectId" value={formData.subjectId} onChange={handleFormChange} disabled={!selectedCourse} className="w-full p-2 border border-gray-300 rounded-md mt-1 disabled:bg-gray-200" required>
                            <option value="">Select Subject</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name} (Sem {subject.semester})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* --- THIS IS THE NEW SEMESTER FIELD --- */}
                        <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Semester</label>
                            <input type="number" name="semester" id="semester" value={formData.semester} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" placeholder="e.g., 3" required/>
                        </div>
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                            <input type="number" name="year" id="year" value={formData.year} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" required/>
                        </div>
                         <div>
                            <label htmlFor="session" className="block text-sm font-medium text-gray-700">Session</label>
                            <input type="text" name="session" id="session" value={formData.session} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" placeholder="e.g., Nov/Dec" required/>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">Question Paper File (PDF only)</label>
                        <input type="file" name="file" id="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-md mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept=".pdf" required/>
                    </div>

                    {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                    {successMessage && <p className="text-sm text-center text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}

                    <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? 'Uploading...' : 'Upload Paper'}
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default UploadPage;