'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * Logout Page Component
 * 
 * This page clears the TanStack Query cache on the client side
 * before performing the server-side logout (cookie clearing).
 * 
 * This fixes the bug where a new user would see the previous user's cached data.
 */
export default function LogoutPage() {
    const queryClient = useQueryClient();
    const router = useRouter();

    useEffect(() => {
        // Clear all cached data immediately
        queryClient.clear();

        // Also remove any stale queries
        queryClient.removeQueries();

        // Clear API token cookie via client-side (accessible because httpOnly: false)
        document.cookie = 'api_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Now redirect to the server-side logout route which clears httpOnly cookies
        router.push('/api/auth/logout');
    }, [queryClient, router]);

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">Logging out...</p>
            </div>
        </div>
    );
}
