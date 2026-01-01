import React from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AppProvidersWrapper from '@/components/dashboard-view/wrappers/AppProvidersWrapper';

// Global styles for dashboard
import '@/assets/dashboard-assets/scss/app.scss';

export default async function DashboardLayout({ children }) {
    // 1. Auth Guard - Check for auth token
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    const userRole = cookieStore.get('user_role')?.value;

    if (!token) {
        redirect('/login');
    }

    // 2. Validate token with Backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';
    let authValid = false;

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            // Token invalid or expired - redirect to login
            redirect('/login');
        }
        authValid = true;
    } catch (error) {
        // Backend unavailable - for development, allow access if token exists
        console.warn('Backend unavailable for auth validation:', error.message);
        authValid = true; // Allow in development
    }

    // 3. Onboarding Guard - Check if candidate needs onboarding
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const isOnboardingPage = pathname.includes('/onboarding');

    if (authValid && userRole === 'candidate' && !isOnboardingPage) {
        try {
            const onboardingRes = await fetch(`${API_URL}/onboarding/status`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
                cache: 'no-store',
            });

            if (onboardingRes.ok) {
                const onboardingData = await onboardingRes.json();
                if (!onboardingData.data?.completed) {
                    redirect('/candidate/onboarding');
                }
            }
        } catch (error) {
            // If onboarding check fails, allow access (don't block user)
            console.warn('Onboarding status check failed:', error.message);
        }
    }

    // 4. Render Dashboard with Providers
    return (
        <AppProvidersWrapper>
            {children}
        </AppProvidersWrapper>
    );
}
