'use client';

import React from 'react';
import { SecurityDashboardProvider } from '@/contexts/SecurityDashboardContext';

// Client wrapper that provides the security context and styling
export default function SecurityDashboardWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SecurityDashboardProvider>
            <div className="security-dashboard-wrapper">
                {/* Animated Grid Background */}
                <div className="grid-background" aria-hidden="true">
                    <div className="grid-pattern" />
                    <div className="grid-glow" />
                </div>

                {children}
            </div>
        </SecurityDashboardProvider>
    );
}
