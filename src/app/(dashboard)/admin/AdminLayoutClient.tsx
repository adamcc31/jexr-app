'use client';

/**
 * Admin Layout Client Component
 * 
 * Client-side wrapper for admin layout that handles the sidebar and header.
 * This component is used by the server layout after auth validation.
 */

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutClientProps {
    children: React.ReactNode;
    userEmail: string;
}

/**
 * AdminLayoutClient - Renders the admin layout structure
 * 
 * Layout structure:
 * - Fixed sidebar on the left (260px)
 * - Main content area that scrolls
 */
export default function AdminLayoutClient({
    children,
    userEmail
}: AdminLayoutClientProps) {
    return (
        <div className="admin-layout d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main
                className="admin-main flex-grow-1 bg-light"
                style={{
                    minWidth: 0, // Allows flex item to shrink below content size
                    overflowX: 'hidden',
                }}
            >
                {/* Content */}
                <div className="p-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
