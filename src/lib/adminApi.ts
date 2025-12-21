/**
 * Admin API Client
 * 
 * Dedicated axios instance for admin API calls.
 * Extends the base API client with admin-specific configurations.
 */

import axios, { AxiosError, AxiosResponse } from 'axios';

// API base URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

/**
 * Get the admin token from the global window object
 * This is set by the AdminAuthProvider in the admin layout
 */
function getAdminToken(): string | null {
    if (typeof window !== 'undefined') {
        return (window as Window & { __ADMIN_TOKEN__?: string }).__ADMIN_TOKEN__ || null;
    }
    return null;
}

/**
 * Admin API Client Instance
 * 
 * Configured with:
 * - Base URL pointing to the API
 * - Credentials enabled for cookie-based auth
 * - JSON content type
 */
export const adminApiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Keep this for cookie support
});

/**
 * Request Interceptor
 * Adds Authorization header from the global token
 */
adminApiClient.interceptors.request.use(
    (config) => {
        const token = getAdminToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor for Admin API
 * Handles 401 (Unauthorized) and 403 (Forbidden) specifically for admin routes
 */
adminApiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Automatically unwrap the standard API response format: { success, message, data }
        // This ensures hooks receive the actual data object directly
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
            // Keep the original metadata if needed, but return the 'data' field as the main response data
            // We modify the response.data in place so axios consumers get the unwrapped data
            if (response.data.success && response.data.data !== undefined) {
                response.data = response.data.data;
            }
        }
        return response;
    },
    (error: AxiosError) => {
        const status = error.response?.status;

        if (status === 401) {
            // Unauthorized - session expired or invalid token
            console.warn('[Admin API] 401 Unauthorized - Session may be expired');
            // Redirect will be handled by the layout server component
        }

        if (status === 403) {
            // Forbidden - user is not an admin
            console.warn('[Admin API] 403 Forbidden - Admin access required');
            // The UI will show an appropriate error state
        }

        return Promise.reject(error);
    }
);

/**
 * Helper function to extract error message from API response
 */
export function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string; error?: string }>;

        // Try to get error message from response body
        if (axiosError.response?.data) {
            return (
                axiosError.response.data.message ||
                axiosError.response.data.error ||
                'An error occurred'
            );
        }

        // Fallback to status-based messages
        switch (axiosError.response?.status) {
            case 400:
                return 'Invalid request data';
            case 401:
                return 'Session expired. Please log in again.';
            case 403:
                return 'You do not have permission to perform this action';
            case 404:
                return 'Resource not found';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return axiosError.message || 'An unexpected error occurred';
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
}
