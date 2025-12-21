'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";

/**
 * Employer dashboard sidebar navigation
 * Extracted from layout for reusability
 */

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const mainNavItems: NavItem[] = [
    { label: 'Overview', href: '/dashboard-employer', icon: 'mdi mdi-view-dashboard-outline' },
    { label: 'Manage Jobs', href: '/dashboard-employer/jobs', icon: 'mdi mdi-briefcase-outline' },
    { label: 'Applicants', href: '/dashboard-employer/candidates', icon: 'mdi mdi-account-group-outline' },
];

const settingsNavItems: NavItem[] = [
    { label: 'Company Profile', href: '/dashboard-employer/profile', icon: 'mdi mdi-account-cog-outline' },
];

export function EmployerSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard-employer') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className="bg-white border-end d-flex flex-column"
            style={{ width: '260px', flexShrink: 0 }}
        >
            {/* Logo */}
            <div className="p-4 border-bottom d-flex justify-content-center align-items-center">
                <Link href="/dashboard-employer" className="text-decoration-none">
                    <Image src="/images/employer.png" alt="J-Expert Employer" width={170} height={50} style={{ objectFit: "contain" }}
                    />
                </Link>
            </div>


            {/* Main Navigation */}
            <nav className="p-2 flex-grow-1">
                <ul className="nav flex-column gap-1">
                    {mainNavItems.map((item) => (
                        <li className="nav-item" key={item.href}>
                            <Link
                                href={item.href}
                                className={`nav-link px-3 py-2 rounded d-flex align-items-center ${isActive(item.href)
                                        ? 'bg-primary text-white'
                                        : 'text-dark'
                                    }`}
                            >
                                <i className={`${item.icon} me-2`}></i>
                                {item.label}
                            </Link>
                        </li>
                    ))}

                    {/* Settings Section */}
                    <li className="nav-item mt-4">
                        <div
                            className="px-3 text-uppercase text-muted fw-bold mb-2"
                            style={{ fontSize: '0.75rem' }}
                        >
                            Settings
                        </div>
                    </li>
                    {settingsNavItems.map((item) => (
                        <li className="nav-item" key={item.href}>
                            <Link
                                href={item.href}
                                className={`nav-link px-3 py-2 rounded d-flex align-items-center ${isActive(item.href)
                                        ? 'bg-primary text-white'
                                        : 'text-dark'
                                    }`}
                            >
                                <i className={`${item.icon} me-2`}></i>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-3 border-top">
                <small className="text-muted">© 2024 J-Expert</small>
            </div>
        </aside>
    );
}
