'use client';

import React from 'react';
import { SecurityDashboardProvider } from '@/contexts/SecurityDashboardContext';
import '../globals.css';

// Security Dashboard Layout - COMPLETELY ISOLATED from main app
// Uses separate auth, separate session, no shared state
export default function SecurityDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>Security Operations Center</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content="Internal Security Monitoring" />
            </head>
            <body className="security-dashboard-body">
                <SecurityDashboardProvider>
                    <div className="security-dashboard-wrapper">
                        {children}
                    </div>
                </SecurityDashboardProvider>
                <style jsx global>{`
          .security-dashboard-body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            min-height: 100vh;
            color: #e0e0e0;
          }
          .security-dashboard-wrapper {
            min-height: 100vh;
          }
          /* Security-specific color scheme */
          :root {
            --sec-primary: #00d4ff;
            --sec-secondary: #7c3aed;
            --sec-success: #10b981;
            --sec-warning: #f59e0b;
            --sec-danger: #ef4444;
            --sec-critical: #dc2626;
            --sec-bg-dark: #0f0f23;
            --sec-bg-card: rgba(255, 255, 255, 0.05);
            --sec-border: rgba(255, 255, 255, 0.1);
            --sec-text: #e0e0e0;
            --sec-text-muted: #9ca3af;
          }
        `}</style>
            </body>
        </html>
    );
}
