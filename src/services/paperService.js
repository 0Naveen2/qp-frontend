// The main backend server's base URL
const API_BASE_URL = 'https://qp-backend-sg1x.onrender.com';

// A helper function to get the authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return { 'Authorization': `Bearer ${token}` };
};

// A helper for API calls that expect JSON
const getJsonHeaders = () => {
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';
    return headers;
};


export const getDepartments = async () => {
    const response = await fetch(`${API_BASE_URL}/departments`, { headers: getJsonHeaders() });
    if (!response.ok) throw new Error('Failed to fetch departments');
    return response.json();
};

export const getCoursesByDepartment = async (departmentId) => {
    const response = await fetch(`${API_BASE_URL}/courses/department/${departmentId}`, { headers: getJsonHeaders() });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
};

export const getSubjectsByCourseAndSemester = async (courseId, semester) => {
    const response = await fetch(`${API_BASE_URL}/subjects/course/${courseId}/semester/${semester}`, { headers: getJsonHeaders() });
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return response.json();
};

export const getSubjectsByCourse = async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/subjects/course/${courseId}`, { headers: getJsonHeaders() });
    if (!response.ok) throw new Error('Failed to fetch subjects for the selected course');
    return response.json();
};

export const getPapersBySubject = async (subjectId) => {
    const response = await fetch(`${API_BASE_URL}/papers/subject/${subjectId}`, { headers: getJsonHeaders() });
    if (!response.ok) throw new Error('Failed to fetch question papers');
    return response.json();
};

export const downloadPaper = async (paperId, originalName) => {
    const response = await fetch(`${API_BASE_URL}/papers/download/${paperId}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Download failed.');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};

export const uploadPaper = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/papers/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'File upload failed.' }));
        throw new Error(errorData.error || 'Upload failed.');
    }
    return response.json();
};

export const addDepartment = async (departmentData) => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(departmentData),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add department.' }));
        throw new Error(errorData.error || 'An unexpected error occurred.');
    }
    return response.json();
};

export const deleteDepartment = async (departmentId) => {
    const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete department.');
    }
    return { success: true };
};

export const addCourse = async (departmentId, courseData) => {
    const response = await fetch(`${API_BASE_URL}/courses/department/${departmentId}`, {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(courseData),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add course.' }));
        throw new Error(errorData.error || 'An unexpected error occurred.');
    }
    return response.json();
};

export const deleteCourse = async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete course.');
    }
    return { success: true };
};

export const addSubject = async (courseId, subjectData) => {
    const response = await fetch(`${API_BASE_URL}/subjects/course/${courseId}`, {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(subjectData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add subject.' }));
        throw new Error(errorData.error || 'An unexpected error occurred.');
    }
    return response.json();
};

export const deleteSubject = async (subjectId) => {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete subject.');
    }
    return { success: true };
};

export const deletePaper = async (paperId) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete paper.' }));
        throw new Error(errorData.error || 'An unexpected error occurred.');
    }
    return { success: true };
};

export const createUserByAdmin = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create user.');
    }
    return response.json();
};