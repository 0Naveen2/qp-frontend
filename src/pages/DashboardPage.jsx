import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header';
import { getDepartments, getCoursesByDepartment, getSubjectsByCourseAndSemester, getPapersBySubject, downloadPaper, deletePaper } from '../services/paperService';

function DashboardPage({ onLogout }) {
    const user = JSON.parse(localStorage.getItem('user'));

    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [papers, setPapers] = useState([]);

    const [selectedDept, setSelectedDept] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

    useEffect(() => {
        getDepartments().then(setDepartments).catch(() => setError('Could not load departments.'));
    }, []);

    const handleDeptChange = async (deptId) => {
        setSelectedDept(deptId);
        setCourses([]); setSelectedCourse('');
        setSubjects([]); setSelectedSubject('');
        setPapers([]); setSelectedSemester('');
        if (!deptId) return;
        try { setCourses(await getCoursesByDepartment(deptId)); } catch (e) { setError('Could not load courses.'); }
    };
    
    const handleCourseChange = (courseId) => {
        setSelectedCourse(courseId);
        setSubjects([]); setSelectedSubject('');
        setPapers([]); setSelectedSemester('');
    };

    const handleSemesterChange = async (semester) => {
        setSelectedSemester(semester);
        setSubjects([]); setSelectedSubject('');
        setPapers([]);
        if (!semester || !selectedCourse) return;
        try { setSubjects(await getSubjectsByCourseAndSemester(selectedCourse, semester)); } catch(e) { setError('Could not load subjects for this semester.'); }
    };

    const handleSubjectChange = async (subjectId) => {
        setSelectedSubject(subjectId);
        setPapers([]);
        if (!subjectId) return;
        setLoading(true);
        setError(''); 
        setSuccessMessage('');
        try { setPapers(await getPapersBySubject(subjectId)); } catch (e) { setError('Could not load papers.'); } finally { setLoading(false); }
    };

    const handleDownload = async (paperId, originalName) => {
        try { await downloadPaper(paperId, originalName); } catch (e) { setError('Download failed.'); }
    };
    
    const handleDeletePaper = async (paperId) => {
        if (window.confirm('Are you sure you want to delete this paper?')) {
            setError('');
            setSuccessMessage('');
            try {
                await deletePaper(paperId);
                setSuccessMessage('Paper deleted successfully!');
                handleSubjectChange(selectedSubject);
            } catch (err) {
                setError(err.message || 'Failed to delete paper.');
            }
        }
    };
    
    const canDelete = (paper) => {
        if (user.role === 'ADMIN') {
            return true;
        }
        if (user.username === paper.uploadedBy.username) {
            const uploadTime = new Date(paper.uploadedAt);
            const currentTime = new Date();
            const minutesDifference = (currentTime - uploadTime) / (1000 * 60);
            return minutesDifference <= 60;
        }
        return false;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header user={user} onLogout={onLogout} />
            <main className="container mx-auto px-4 sm:px-6 py-8">
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <Link 
                        to="/upload" 
                        className="px-5 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow hover:shadow-lg transition-all duration-200 ease-in-out"
                    >
                        Upload New Paper
                    </Link>
                </div>
                
                {/* --- Filter Card --- */}
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Find Previous Year Papers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                            <select id="department" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Department</option>
                                {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-gray-600 mb-1">Course</label>
                            <select id="course" value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)} disabled={!selectedDept} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                                <option value="">Select Course</option>
                                {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-gray-600 mb-1">Semester</label>
                            <select id="semester" value={selectedSemester} onChange={(e) => handleSemesterChange(e.target.value)} disabled={!selectedCourse} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                                <option value="">Select Semester</option>
                                {semesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                            <select id="subject" value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)} disabled={!selectedSemester} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                                <option value="">Select Subject</option>
                                {subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-md mb-6">{error}</div>}
                {successMessage && <div className="text-center text-green-600 bg-green-100 p-3 rounded-md mb-6">{successMessage}</div>}

                {/* --- Available Papers Section --- */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Papers</h2>
                    {loading ? ( <p className="text-center text-gray-500 py-8">Loading papers...</p> ) 
                    : papers.length > 0 ? (
                        <div className="space-y-4">
                            {papers.map(paper => (
                                <div key={paper.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-500 transition-all duration-200">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="font-semibold text-lg text-blue-700">{paper.originalName}</p>
                                        <p className="text-sm text-gray-500">Uploaded by: {paper.uploadedBy.username}</p>
                                        <p className="text-sm text-gray-500">Year: {paper.year} | Session: {paper.session}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => handleDownload(paper.id, paper.originalName)} className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm">
                                            Download
                                        </button>
                                        {canDelete(paper) && (
                                            <button onClick={() => handleDeletePaper(paper.id)} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm">
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
                            <p className="text-gray-500">
                                Please make a selection to see available papers.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default DashboardPage;