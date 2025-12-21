/**
 * Admin Layout
 * 
 * Server-side layout for admin dashboard with RBAC protection.
 * Validates JWT token AND ensures user has 'admin' role.
 * 
 * ARCHITECTURE DECISION:
 * - Auth validation happens on the server for security
 * - Role check is performed against the backend /auth/me endpoint
 * - Non-admin users are redirected to login/forbidden
 */

import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Import client components
import AdminLayoutClient from './AdminLayoutClient';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

// User type from backend response
interface UserResponse {
    id: string;
    email: string;
    role: 'admin' | 'employer' | 'candidate';
}

// Backend wraps responses in this format
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // =========================================================================
    // STEP 1: Get auth token from cookies
    // =========================================================================
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        // No token - redirect to login
        redirect('/login?error=unauthorized&redirect=/admin');
    }

    // =========================================================================
    // STEP 2: Validate token with backend and get user info
    // =========================================================================
    let user: UserResponse;

    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

        const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            cache: 'no-store', // Always validate fresh
        });

        if (!res.ok) {
            // Token invalid - redirect to login
            redirect('/login?error=session_expired&redirect=/admin');
        }

        // Backend returns wrapped response: { success, message, data: user }
        const response: ApiResponse<UserResponse> = await res.json();
        user = response.data;
    } catch (error) {
        // Network error or backend unavailable
        console.error('[Admin Layout] Failed to validate token:', error);
        redirect('/login?error=server_error&redirect=/admin');
    }

    // =========================================================================
    // STEP 3: RBAC - Check if user has admin role
    // =========================================================================
    if (user.role !== 'admin') {
        // User is authenticated but not an admin
        // Redirect to appropriate dashboard based on role
        console.warn(`[Admin Layout] Non-admin user (${user.role}) attempted to access admin panel`);

        switch (user.role) {
            case 'employer':
                redirect('/dashboard-employer');
            case 'candidate':
                redirect('/candidate');
            default:
                redirect('/login?error=forbidden');
        }
    }

    // =========================================================================
    // STEP 4: Render admin layout with sidebar
    // =========================================================================
    return (
        <AdminAuthProvider token={token.value}>
            <AdminLayoutClient userEmail={user.email}>
                {children}
            </AdminLayoutClient>
        </AdminAuthProvider>
    );
}
