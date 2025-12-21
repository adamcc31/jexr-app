'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * Employer dashboard header with user dropdown
 */

interface EmployerHeaderProps {
    title?: string;
}

export function EmployerHeader({ title = 'Employer Dashboard' }: EmployerHeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">{title}</h5>

            <div className="position-relative">
                <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                >
                    <i className="mdi mdi-account-circle"></i>
                    <span>Account</span>
                    <i className={`mdi mdi-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                </button>

                {dropdownOpen && (
                    <div
                        className="dropdown-menu show position-absolute end-0 mt-1 shadow-sm"
                        style={{ minWidth: '160px' }}
                    >
                        <Link
                            href="/dashboard-employer/profile"
                            className="dropdown-item d-flex align-items-center gap-2"
                        >
                            <i className="mdi mdi-account-cog-outline"></i>
                            Profile
                        </Link>
                        <hr className="dropdown-divider" />
                        <Link
                            href="/auth/logout"
                            className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        >
                            <i className="mdi mdi-logout"></i>
                            Logout
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
