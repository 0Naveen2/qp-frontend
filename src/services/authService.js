// The backend server's base URL for authentication
const API_URL = 'https://qp-backend-sg1x.onrender.com/auth';

/**
 * Sends a login request to the backend.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - A promise that resolves to the login data.
 */
export const login = async (username, password) => {
    // Corrected to call /login (the base URL already has /auth)
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(errorData.error || 'Invalid username or password');
    }
    return response.json();
};

/**
 * Sends a signup request to the backend.
 * @param {object} userData - The new user's data { username, password, email }.
 */
export const signup = async (userData) => {
    // Corrected to call /signup (the base URL already has /auth)
    const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Signup failed.' }));
        throw new Error(errorData.error || 'An unexpected error occurred.');
    }
    return response.json();
};