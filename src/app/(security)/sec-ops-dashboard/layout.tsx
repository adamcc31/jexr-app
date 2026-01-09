import React from 'react';
import SecurityDashboardWrapper from './components/SecurityDashboardWrapper';
import './security-dashboard.css';

// Security Dashboard Layout - Server Component
// Uses separate auth, separate session, no shared state with main app
export default function SecurityDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>Security Operations Center</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content="Internal Security Monitoring" />
                {/* Google Fonts - Inter for UI, JetBrains Mono for code */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="security-dashboard-body" suppressHydrationWarning>
                <SecurityDashboardWrapper>
                    {children}
                </SecurityDashboardWrapper>
            </body>
        </html>
    );
}
