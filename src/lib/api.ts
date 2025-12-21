import axios from 'axios';

// Backend API URL
// In development, this often defaults to localhost:8080/api or similar
// Use NEXT_PUBLIC_API_URL env variable in production
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

/**
 * Helper to get cookie value by name (client-side only)
 */
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Still send cookies for CORS
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - Add Authorization header
apiClient.interceptors.request.use(
    (config) => {
        // Get token from the non-HttpOnly api_token cookie
        const token = getCookie('api_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Defines what happens when a response error occurs
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // 401 Unauthorized
            // We do NOT redirect here because the Server Auth Guard handles protection.
            // Instead, we log it or surface it so the UI can show a "Session Expired" message if needed.
            console.warn('Unauthorized access - 401. Session might be expired.');
        }

        return Promise.reject(error);
    }
);
