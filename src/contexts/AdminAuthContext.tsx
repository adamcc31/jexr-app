'use client';

/**
 * Admin Auth Context
 * 
 * Provides the auth token to client components in the admin dashboard.
 * The token is passed from the server layout after validation.
 */

import React, { createContext, useContext, useEffect } from 'react';

interface AdminAuthContextType {
    token: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({
    children,
    token
}: {
    children: React.ReactNode;
    token: string;
}) {
    // Set the token in a global variable that the admin API client can access
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as Window & { __ADMIN_TOKEN__?: string }).__ADMIN_TOKEN__ = token;
        }

        return () => {
            if (typeof window !== 'undefined') {
                delete (window as Window & { __ADMIN_TOKEN__?: string }).__ADMIN_TOKEN__;
            }
        };
    }, [token]);

    return (
        <AdminAuthContext.Provider value={{ token }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
}

/**
 * Get the admin token from the global window object
 * This is used by the admin API client
 */
export function getAdminToken(): string | null {
    if (typeof window !== 'undefined') {
        return (window as Window & { __ADMIN_TOKEN__?: string }).__ADMIN_TOKEN__ || null;
    }
    return null;
}
