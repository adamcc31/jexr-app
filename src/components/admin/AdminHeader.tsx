'use client';

/**
 * Admin Header Component
 * 
 * Top header bar for admin dashboard with user info and actions.
 */

import React from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

interface AdminHeaderProps {
    /** Current page title */
    title?: string;
    /** User email for display */
    userEmail?: string;
}

/**
 * AdminHeader - Top navigation bar for admin dashboard
 * 
 * Features:
 * - Page title display
 * - User dropdown menu
 * - Notification indicator (placeholder)
 */
export function AdminHeader({ title, userEmail = 'admin@example.com' }: AdminHeaderProps) {
    return (
        <header
            className="admin-header bg-white border-bottom px-4 py-3"
            style={{ position: 'sticky', top: 0, zIndex: 100 }}
        >
            <div className="d-flex justify-content-between align-items-center">
                {/* Left: Page Title */}
                <div className="d-flex align-items-center">
                    {title && (
                        <h4 className="mb-0 fw-semibold text-dark">{title}</h4>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="d-flex align-items-center gap-3">
                    {/* Notifications */}
                    <button
                        className="btn btn-light position-relative rounded-circle p-2"
                        style={{ width: '40px', height: '40px' }}
                    >
                        <IconifyIcon
                            icon="solar:bell-bold-duotone"
                            width={20}
                            height={20}
                            className="text-dark"
                        />
                        <Badge
                            bg="danger"
                            className="position-absolute top-0 start-100 translate-middle rounded-pill"
                            style={{ fontSize: '0.6rem' }}
                        >
                            3
                        </Badge>
                    </button>

                    {/* User Dropdown */}
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="light"
                            id="admin-user-dropdown"
                            className="d-flex align-items-center gap-2 rounded-pill px-3"
                        >
                            <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}
                            >
                                {userEmail.charAt(0).toUpperCase()}
                            </div>
                            <span className="d-none d-md-inline text-dark">
                                {userEmail}
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Header>Admin Account</Dropdown.Header>
                            <Dropdown.Item href="/admin/settings">
                                <IconifyIcon icon="solar:settings-outline" className="me-2" />
                                Settings
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="/auth/logout" className="text-danger">
                                <IconifyIcon icon="solar:logout-2-outline" className="me-2" />
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;
