'use client';

/**
 * Admin Sidebar Navigation
 * 
 * Dedicated sidebar for admin dashboard with navigation links.
 * Highlights active route and provides consistent navigation experience.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const adminNavItems: NavItem[] = [
    {
        label: 'Overview',
        href: '/admin',
        icon: 'solar:chart-2-bold-duotone',
    },
    {
        label: 'User Management',
        href: '/admin/users',
        icon: 'solar:users-group-rounded-bold-duotone',
    },
    {
        label: 'Account Verification',
        href: '/admin/account-verification',
        icon: 'solar:shield-check-bold-duotone',
    },
    {
        label: 'Company Verification', // Keeping this as legacy/specific if needed, or remove? Prompt said "new admin-only tab named Account Verification".
        href: '/admin/companies',
        icon: 'solar:buildings-2-bold-duotone',
    },
    {
        label: 'Job Moderation',
        href: '/admin/jobs',
        icon: 'solar:document-text-bold-duotone',
    },
    {
        label: 'Employer Dashboard',
        href: '/dashboard-employer',
        icon: 'solar:buildings-2-bold-duotone',
    },
    {
        label: 'System Settings',
        href: '/admin/settings',
        icon: 'solar:settings-bold-duotone',
    },
];

/**
 * AdminSidebar - Side navigation for admin dashboard
 * 
 * Features:
 * - Active route highlighting
 * - Consistent icon sizing
 * - Responsive collapse on mobile
 */
export function AdminSidebar() {
    const pathname = usePathname();

    /**
     * Checks if the current path matches the nav item
     * Exact match for overview, prefix match for child routes
     */
    const isActive = (href: string): boolean => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <div
            className="sidebar d-flex flex-column shadow-sm"
            style={{
                width: '260px',
                minHeight: '100vh',
                position: 'sticky',
                top: 0,
                backgroundColor: '#3b82f6', // Light Blue / Biru Muda
                color: '#ffffff',
            }}
        >
            {/* Logo / Brand */}
            <div className="sidebar-header px-3 py-4 border-bottom border-white border-opacity-25">
                <Link href="/admin" className="d-flex align-items-center text-decoration-none">
                    <IconifyIcon
                        icon="solar:shield-user-bold-duotone"
                        width={32}
                        height={32}
                        className="text-white me-2"
                    />
                    <div>
                        <span className="fs-5 fw-bold text-white">Admin Panel</span>
                        <small className="d-block text-white text-opacity-75" style={{ fontSize: '0.7rem' }}>
                            Recruitment Agency
                        </small>
                    </div>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="sidebar-nav flex-grow-1 py-3">
                <ul className="nav flex-column">
                    {adminNavItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <li key={item.href} className="nav-item mb-1">
                                <Link
                                    href={item.href}
                                    className={`
                                        nav-link d-flex align-items-center px-3 py-2 mx-2 rounded
                                        ${active
                                            ? 'bg-white text-primary fw-bold'
                                            : 'text-white'
                                        }
                                    `}
                                    style={{
                                        transition: 'all 0.2s ease',
                                        opacity: active ? 1 : 0.9,
                                    }}
                                >
                                    <IconifyIcon
                                        icon={item.icon}
                                        width={20}
                                        height={20}
                                        className="me-3"
                                    />
                                    <span className="fw-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer px-3 py-3 border-top border-white border-opacity-25">
                <Link
                    href="/auth/logout"
                    className="d-flex align-items-center text-white text-decoration-none mb-3 px-2 py-2 rounded"
                    style={{ transition: 'background-color 0.2s' }}
                >
                    <IconifyIcon
                        icon="solar:logout-2-bold-duotone"
                        width={20}
                        height={20}
                        className="me-2"
                    />
                    <span className="fw-medium">Logout</span>
                </Link>

                <Link
                    href="/"
                    className="d-flex align-items-center text-white text-opacity-75 text-decoration-none small px-2"
                >
                    <IconifyIcon
                        icon="solar:arrow-left-bold"
                        width={16}
                        height={16}
                        className="me-2"
                    />
                    Back to Main Site
                </Link>
            </div>
        </div>
    );
}

export default AdminSidebar;
