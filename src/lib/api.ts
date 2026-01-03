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

// Request Interceptor - Add Authorization header and CSRF token
apiClient.interceptors.request.use(
    (config) => {
        // Get auth token from the non-HttpOnly api_token cookie
        const token = getCookie('api_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // === SECURITY: CSRF Protection ===
        // For state-changing requests, include the CSRF token from cookie
        // The backend validates that X-CSRF-Token header matches csrf_token cookie
        const method = config.method?.toUpperCase();
        if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            const csrfToken = getCookie('csrf_token');
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
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
            // 401 Unauthorized - Token expired or invalid
            console.warn('Unauthorized access - 401. Redirecting to login...');

            // Clear auth cookies (client-side)
            if (typeof document !== 'undefined') {
                document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'api_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

                // Redirect to login page (only on client-side)
                // Use window.location for hard redirect to clear app state
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login?expired=true';
                }
            }
        }

        return Promise.reject(error);
    }
);
