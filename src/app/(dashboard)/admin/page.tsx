'use client';

/**
 * Admin Overview Dashboard Page
 * 
 * Main dashboard showing key metrics and system status.
 * Displays: Total users, companies, jobs, applications, system health.
 */

import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';
import { LoadingState, ErrorState } from '@/components/admin';
import { useAdminStats } from '@/hooks/admin';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    iconColor: string;
    subtitle?: string;
}

/**
 * StatCard - Individual metric card for dashboard
 */
function StatCard({ title, value, icon, iconColor, subtitle }: StatCardProps) {
    return (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3">
                <div
                    className={`rounded-3 d-flex align-items-center justify-content-center`}
                    style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: `${iconColor}20`,
                    }}
                >
                    <IconifyIcon
                        icon={icon}
                        width={28}
                        height={28}
                        style={{ color: iconColor }}
                    />
                </div>
                <div>
                    <p className="text-muted mb-1 small">{title}</p>
                    <h3 className="mb-0 fw-bold">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                    {subtitle && (
                        <small className="text-muted">{subtitle}</small>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}

/**
 * RoleBreakdownCard - Shows user breakdown by role
 */
function RoleBreakdownCard({
    admin,
    employer,
    candidate
}: {
    admin: number;
    employer: number;
    candidate: number;
}) {
    const total = admin + employer + candidate;

    return (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
                <h6 className="mb-0 fw-semibold">Users by Role</h6>
            </Card.Header>
            <Card.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary rounded-circle" style={{ width: '10px', height: '10px' }} />
                            <span className="text-muted">Admins</span>
                        </div>
                        <span className="fw-semibold">{admin}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-info rounded-circle" style={{ width: '10px', height: '10px' }} />
                            <span className="text-muted">Employers</span>
                        </div>
                        <span className="fw-semibold">{employer}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-secondary rounded-circle" style={{ width: '10px', height: '10px' }} />
                            <span className="text-muted">Candidates</span>
                        </div>
                        <span className="fw-semibold">{candidate}</span>
                    </div>
                </div>

                {/* Progress bar visualization */}
                <div className="progress mt-4" style={{ height: '8px' }}>
                    <div
                        className="progress-bar bg-primary"
                        style={{ width: `${(admin / total) * 100}%` }}
                    />
                    <div
                        className="progress-bar bg-info"
                        style={{ width: `${(employer / total) * 100}%` }}
                    />
                    <div
                        className="progress-bar bg-secondary"
                        style={{ width: `${(candidate / total) * 100}%` }}
                    />
                </div>
            </Card.Body>
        </Card>
    );
}

/**
 * SystemHealthCard - Shows system health status
 */
function SystemHealthCard({
    status,
    lastChecked
}: {
    status: 'healthy' | 'degraded' | 'down';
    lastChecked: string;
}) {
    const statusConfig = {
        healthy: { color: '#28a745', label: 'All Systems Operational', icon: 'solar:verified-check-bold' },
        degraded: { color: '#ffc107', label: 'Degraded Performance', icon: 'solar:danger-triangle-bold' },
        down: { color: '#dc3545', label: 'System Down', icon: 'solar:close-circle-bold' },
    };

    const config = statusConfig[status];

    return (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
                <h6 className="mb-0 fw-semibold">System Health</h6>
            </Card.Header>
            <Card.Body className="text-center py-4">
                <IconifyIcon
                    icon={config.icon}
                    width={48}
                    height={48}
                    style={{ color: config.color }}
                    className="mb-3"
                />
                <h5 style={{ color: config.color }}>{config.label}</h5>
                <small className="text-muted">
                    Last checked: {new Date(lastChecked).toLocaleTimeString()}
                </small>
            </Card.Body>
        </Card>
    );
}

/**
 * AdminDashboardPage - Main admin overview page
 */
export default function AdminDashboardPage() {
    const { data: stats, isLoading, error, refetch } = useAdminStats();

    if (isLoading) {
        return <LoadingState message="Loading dashboard statistics..." size="lg" />;
    }

    if (error) {
        return (
            <ErrorState
                message="Failed to load dashboard statistics. Please try again."
                onRetry={refetch}
            />
        );
    }

    // Default values with deep null coalescing for nested properties
    const safeStats = {
        totalUsers: stats?.totalUsers ?? 0,
        usersByRole: {
            admin: stats?.usersByRole?.admin ?? 0,
            employer: stats?.usersByRole?.employer ?? 0,
            candidate: stats?.usersByRole?.candidate ?? 0,
        },
        totalCompanies: stats?.totalCompanies ?? 0,
        companiesByStatus: {
            pending: stats?.companiesByStatus?.pending ?? 0,
            verified: stats?.companiesByStatus?.verified ?? 0,
            rejected: stats?.companiesByStatus?.rejected ?? 0,
        },
        totalJobs: stats?.totalJobs ?? 0,
        activeJobs: stats?.activeJobs ?? 0,
        totalApplications: stats?.totalApplications ?? 0,
        systemHealth: {
            status: (stats?.systemHealth?.status ?? 'healthy') as 'healthy' | 'degraded' | 'down',
            lastChecked: stats?.systemHealth?.lastChecked ?? new Date().toISOString(),
        },
    };

    return (
        <div className="admin-dashboard">
            {/* Page Header */}
            <div className="mb-4">
                <h4 className="fw-bold mb-1">Admin Dashboard</h4>
                <p className="text-muted mb-0">Welcome to the admin control panel</p>
            </div>

            {/* Main Stats Row */}
            <Row className="g-4 mb-4">
                <Col xs={12} sm={6} xl={3}>
                    <StatCard
                        title="Total Users"
                        value={safeStats.totalUsers}
                        icon="solar:users-group-rounded-bold-duotone"
                        iconColor="#6366f1"
                    />
                </Col>
                <Col xs={12} sm={6} xl={3}>
                    <StatCard
                        title="Total Companies"
                        value={safeStats.totalCompanies}
                        icon="solar:buildings-2-bold-duotone"
                        iconColor="#0ea5e9"
                        subtitle={`${safeStats.companiesByStatus.pending} pending`}
                    />
                </Col>
                <Col xs={12} sm={6} xl={3}>
                    <StatCard
                        title="Total Jobs"
                        value={safeStats.totalJobs}
                        icon="solar:document-text-bold-duotone"
                        iconColor="#22c55e"
                        subtitle={`${safeStats.activeJobs} active`}
                    />
                </Col>
                <Col xs={12} sm={6} xl={3}>
                    <StatCard
                        title="Applications"
                        value={safeStats.totalApplications}
                        icon="solar:letter-bold-duotone"
                        iconColor="#f59e0b"
                    />
                </Col>
            </Row>

            {/* Secondary Row */}
            <Row className="g-4">
                <Col xs={12} md={6}>
                    <RoleBreakdownCard
                        admin={safeStats.usersByRole.admin}
                        employer={safeStats.usersByRole.employer}
                        candidate={safeStats.usersByRole.candidate}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <SystemHealthCard
                        status={safeStats.systemHealth.status}
                        lastChecked={safeStats.systemHealth.lastChecked}
                    />
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mt-4">
                <Col xs={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-transparent border-0">
                            <h6 className="mb-0 fw-semibold">Quick Actions</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex gap-3 flex-wrap">
                                <a href="/admin/users" className="btn btn-outline-primary">
                                    <IconifyIcon icon="solar:users-group-rounded-outline" className="me-2" />
                                    Manage Users
                                </a>
                                <a href="/admin/companies" className="btn btn-outline-info">
                                    <IconifyIcon icon="solar:buildings-2-outline" className="me-2" />
                                    Verify Companies
                                </a>
                                <a href="/admin/jobs" className="btn btn-outline-success">
                                    <IconifyIcon icon="solar:document-text-outline" className="me-2" />
                                    Moderate Jobs
                                </a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
