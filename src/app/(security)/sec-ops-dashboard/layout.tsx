'use client';

import React from 'react';
import { SecurityDashboardProvider } from '@/contexts/SecurityDashboardContext';

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
                {/* Google Fonts - Inter for UI, JetBrains Mono for code */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="security-dashboard-body">
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
                <style jsx global>{`
                    /* ====================================
                       SOC DASHBOARD - DESIGN SYSTEM
                       ==================================== */
                    
                    :root {
                        /* Background Colors */
                        --sec-bg-primary: #0B0F14;
                        --sec-bg-secondary: #0E1117;
                        --sec-bg-elevated: #161B22;
                        --sec-bg-card: rgba(14, 17, 23, 0.8);
                        
                        /* Accent Colors */
                        --sec-accent-primary: #00B4FF;
                        --sec-accent-secondary: #1DA1F2;
                        --sec-accent-tertiary: #7C3AED;
                        
                        /* Status Colors */
                        --sec-status-critical: #FF4D4F;
                        --sec-status-high: #EF4444;
                        --sec-status-warning: #FAAD14;
                        --sec-status-info: #3B82F6;
                        --sec-status-success: #52C41A;
                        --sec-status-neutral: #6B7280;
                        
                        /* Text Colors */
                        --sec-text-primary: #E6EDF3;
                        --sec-text-secondary: #8B949E;
                        --sec-text-muted: #6E7681;
                        
                        /* Border */
                        --sec-border: rgba(255, 255, 255, 0.08);
                        --sec-border-hover: rgba(255, 255, 255, 0.15);
                        
                        /* Glow Effects */
                        --sec-glow-primary: rgba(0, 180, 255, 0.4);
                        --sec-glow-critical: rgba(255, 77, 79, 0.4);
                        --sec-glow-success: rgba(82, 196, 26, 0.4);
                        
                        /* Legacy variables for compatibility */
                        --sec-primary: #00B4FF;
                        --sec-secondary: #7c3aed;
                        --sec-success: #52C41A;
                        --sec-warning: #FAAD14;
                        --sec-danger: #EF4444;
                        --sec-critical: #FF4D4F;
                        --sec-bg-dark: #0B0F14;
                        --sec-text: #E6EDF3;
                        
                        /* Fonts */
                        --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Consolas', monospace;
                        
                        /* Spacing */
                        --sidebar-width: 240px;
                        --sidebar-collapsed: 70px;
                        --header-height: 70px;
                    }

                    /* ====================================
                       BASE STYLES
                       ==================================== */
                    
                    * {
                        box-sizing: border-box;
                    }

                    .security-dashboard-body {
                        margin: 0;
                        padding: 0;
                        font-family: var(--font-primary);
                        background: var(--sec-bg-primary);
                        min-height: 100vh;
                        color: var(--sec-text-primary);
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }

                    .security-dashboard-wrapper {
                        min-height: 100vh;
                        position: relative;
                        overflow-x: hidden;
                    }

                    /* ====================================
                       ANIMATED GRID BACKGROUND
                       ==================================== */
                    
                    .grid-background {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        pointer-events: none;
                        z-index: 0;
                        overflow: hidden;
                    }

                    .grid-pattern {
                        position: absolute;
                        inset: 0;
                        background-image: 
                            linear-gradient(rgba(0, 180, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 180, 255, 0.03) 1px, transparent 1px);
                        background-size: 50px 50px;
                        mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
                        -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
                    }

                    .grid-glow {
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(
                            ellipse at 30% 20%,
                            rgba(0, 180, 255, 0.08) 0%,
                            transparent 40%
                        ),
                        radial-gradient(
                            ellipse at 70% 80%,
                            rgba(124, 58, 237, 0.06) 0%,
                            transparent 40%
                        );
                        animation: glow-shift 20s ease-in-out infinite alternate;
                    }

                    @keyframes glow-shift {
                        0% {
                            transform: translate(0, 0) rotate(0deg);
                        }
                        100% {
                            transform: translate(-5%, -5%) rotate(3deg);
                        }
                    }

                    /* ====================================
                       TYPOGRAPHY
                       ==================================== */
                    
                    h1, h2, h3, h4, h5, h6 {
                        margin: 0;
                        line-height: 1.3;
                        color: var(--sec-text-primary);
                    }

                    h1 { font-size: 28px; font-weight: 700; }
                    h2 { font-size: 20px; font-weight: 600; }
                    h3 { font-size: 16px; font-weight: 600; }
                    h4 { font-size: 14px; font-weight: 600; }

                    code, pre, .mono {
                        font-family: var(--font-mono);
                    }

                    /* ====================================
                       SCROLLBAR
                       ==================================== */
                    
                    ::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }

                    ::-webkit-scrollbar-track {
                        background: var(--sec-bg-secondary);
                    }

                    ::-webkit-scrollbar-thumb {
                        background: var(--sec-border);
                        border-radius: 4px;
                    }

                    ::-webkit-scrollbar-thumb:hover {
                        background: var(--sec-border-hover);
                    }

                    /* ====================================
                       COMMON UTILITY CLASSES
                       ==================================== */
                    
                    .text-critical { color: var(--sec-status-critical); }
                    .text-high { color: var(--sec-status-high); }
                    .text-warning { color: var(--sec-status-warning); }
                    .text-info { color: var(--sec-status-info); }
                    .text-success { color: var(--sec-status-success); }
                    .text-muted { color: var(--sec-text-muted); }
                    .text-secondary { color: var(--sec-text-secondary); }

                    .bg-critical { background: rgba(255, 77, 79, 0.15); }
                    .bg-high { background: rgba(239, 68, 68, 0.15); }
                    .bg-warning { background: rgba(250, 173, 20, 0.15); }
                    .bg-info { background: rgba(59, 130, 246, 0.15); }
                    .bg-success { background: rgba(82, 196, 26, 0.15); }

                    /* ====================================
                       SELECTION
                       ==================================== */
                    
                    ::selection {
                        background: rgba(0, 180, 255, 0.3);
                        color: white;
                    }

                    /* ====================================
                       FOCUS STATES
                       ==================================== */
                    
                    :focus-visible {
                        outline: 2px solid var(--sec-accent-primary);
                        outline-offset: 2px;
                    }

                    button:focus-visible,
                    input:focus-visible,
                    select:focus-visible,
                    textarea:focus-visible {
                        outline: none;
                        box-shadow: 0 0 0 2px var(--sec-bg-primary), 0 0 0 4px var(--sec-accent-primary);
                    }
                `}</style>
            </body>
        </html>
    );
}
