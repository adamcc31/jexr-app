import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AppProvidersWrapper from '@/components/dashboard-view/wrappers/AppProvidersWrapper';

// Global styles for dashboard
import '@/assets/dashboard-assets/scss/app.scss';

export default async function OnboardingLayout({ children }) {
    // Auth Guard - Require valid auth token
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        redirect('/login');
    }

    // Note: We intentionally do NOT call /auth/me or check onboarding status here.
    // The user is on the onboarding page - that's where they need to be.
    // This separation eliminates any possibility of guard-related redirect loops.

    return (
        <AppProvidersWrapper>
            {children}
        </AppProvidersWrapper>
    );
}
