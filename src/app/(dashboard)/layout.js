import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AppProvidersWrapper from '@/components/dashboard-view/wrappers/AppProvidersWrapper';

// Global styles for dashboard
import '@/assets/dashboard-assets/scss/app.scss';

export default async function DashboardLayout({ children }) {
    // 1. Auth Guard - Check for auth token
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        redirect('/login');
    }

    // 2. Validate token with Backend
    try {
        const res = await fetch('http://localhost:8080/v1/auth/me', {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            // Token invalid or expired - redirect to login
            redirect('/login');
        }
    } catch (error) {
        // Backend unavailable - for development, allow access if token exists
        // In production, you may want to redirect to an error page instead
        console.warn('Backend unavailable for auth validation:', error.message);
        // Continue to render dashboard - token exists but couldn't validate
        // Remove this block and uncomment redirect below for strict mode:
        // redirect('/login');
    }

    // 3. Render Dashboard with Providers
    return (
        <AppProvidersWrapper>
            {children}
        </AppProvidersWrapper>
    );
}
