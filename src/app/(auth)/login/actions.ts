'use server'

import { redirect } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        // Call the backend API
        // apiClient is configured with baseURL and withCredentials: true
        // The backend is expected to set the 'auth_token' cookie via Set-Cookie header

        // Note: When calling from a Server Action (Node.js environment), cookies
        // might not be automatically persisted from the Axios response to the Next.js response
        // if the backend and frontend are on different domains without proper proxying.
        // However, assuming same-domain or proper proxy: 

        const response = await apiClient.post('/auth/login', {
            email,
            password
        });

        // Check if the backend returned the user role in the response body
        // If it did, we might want to set a 'user_role' cookie for easy frontend access
        // (auth_token should be HttpOnly and handled by cookie jar)
        const { token, user } = response.data.data || response.data; // Handle potential wrapper

        const cookieStore = await cookies();

        if (token) {
            // HttpOnly cookie for server-side auth validation (layout.js checks)
            cookieStore.set('auth_token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            });

            // Non-HttpOnly cookie for client-side API calls
            // This allows React components to include the token in Authorization headers
            cookieStore.set('api_token', token, {
                httpOnly: false, // Accessible to client JS
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            });
        }

        const role = user?.role || 'candidate'; // Default to candidate if missing

        if (role) {
            cookieStore.set('user_role', role, { path: '/' });
        }

        // Success - redirect based on role
        // Return path to redirect to, let the client component handle the actual redirection
        // or redirect here if strictly server-side

        // Implementation choice: Redirect here
        if (role === 'admin') {
            redirect('/admin')
        } else if (role === 'candidate') {
            redirect('/candidate')
        } else {
            redirect('/dashboard-employer')
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            const message = error.response?.data?.message || 'Login failed';
            console.error('Login Error Details:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            return { error: message }
        }
        // Handle redirect error specifically (Next.js redirects throw an error)
        if ((error as any).message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error('Unexpected Login Error:', error);
        return { error: 'An unexpected error occurred' }
    }
}
