'use client';

import React from 'react';
import Link from 'next/link';
import { useEmployerJobs } from '@/hooks/useJobs';
import { computeEmployerStats } from '@/types/employer';
import {
    SkeletonCard,
    SkeletonTable,
    SkeletonStyles,
    JobStatusBadge,
    EmptyState,
    ErrorState
} from '@/components/employer';

/**
 * Employer Dashboard Overview
 * Shows stats computed from jobs data and recent job listings
 */
export default function EmployerDashboard() {
    const { data, isLoading, error, refetch } = useEmployerJobs();

    // Compute stats from jobs array
    const jobs = data?.jobs || [];
    const stats = computeEmployerStats(jobs);

    // Format salary for display
    const formatSalary = (min: number, max: number) => {
        const format = (n: number) =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(n);
        return `${format(min)} - ${format(max)}`;
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="container-fluid">
            <SkeletonStyles />

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1 fw-bold">Overview</h2>
                    <p className="text-muted mb-0">Welcome to your employer dashboard</p>
                </div>
                <Link href="/dashboard-employer/jobs/new" className="btn btn-primary">
                    <i className="mdi mdi-plus me-1"></i>
                    Post New Job
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    {isLoading ? (
                        <SkeletonCard />
                    ) : (
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-primary-subtle p-3 me-3">
                                        <i className="mdi mdi-briefcase-outline text-primary fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem' }}>
                                            Total Jobs
                                        </h6>
                                        <h3 className="mb-0 fw-bold">{stats.totalJobs}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-4 mb-3">
                    {isLoading ? (
                        <SkeletonCard />
                    ) : (
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-success-subtle p-3 me-3">
                                        <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem' }}>
                                            Active Jobs
                                        </h6>
                                        <h3 className="mb-0 fw-bold text-success">{stats.activeJobs}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-4 mb-3">
                    {isLoading ? (
                        <SkeletonCard />
                    ) : (
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-secondary-subtle p-3 me-3">
                                        <i className="mdi mdi-archive-outline text-secondary fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem' }}>
                                            Closed Jobs
                                        </h6>
                                        <h3 className="mb-0 fw-bold text-secondary">{stats.closedJobs}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Jobs Table */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-semibold">Recent Jobs</h5>
                    <Link href="/dashboard-employer/jobs" className="btn btn-sm btn-outline-primary">
                        View All
                    </Link>
                </div>
                <div className="card-body p-0">
                    {/* Error State */}
                    {error && (
                        <ErrorState
                            message={error.message || 'Failed to load jobs. The backend may be unavailable.'}
                            onRetry={() => refetch()}
                        />
                    )}

                    {/* Loading State */}
                    {isLoading && !error && (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-bottom-0 ps-4">Job Title</th>
                                        <th className="border-bottom-0">Location</th>
                                        <th className="border-bottom-0">Salary Range</th>
                                        <th className="border-bottom-0">Status</th>
                                        <th className="border-bottom-0">Posted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <SkeletonTable rows={5} columns={5} />
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && jobs.length === 0 && (
                        <EmptyState
                            icon={<i className="mdi mdi-briefcase-remove-outline"></i>}
                            title="No jobs posted yet"
                            description="Create your first job posting to start receiving applications from qualified candidates."
                            actionLabel="Post Your First Job"
                            actionHref="/dashboard-employer/jobs/new"
                        />
                    )}

                    {/* Jobs Table */}
                    {!isLoading && !error && jobs.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-bottom-0 ps-4">Job Title</th>
                                        <th className="border-bottom-0">Location</th>
                                        <th className="border-bottom-0">Salary Range</th>
                                        <th className="border-bottom-0">Status</th>
                                        <th className="border-bottom-0">Posted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.slice(0, 5).map((job) => (
                                        <tr key={job.id}>
                                            <td className="ps-4">
                                                <Link
                                                    href={`/dashboard-employer/jobs/${job.id}`}
                                                    className="fw-semibold text-dark text-decoration-none"
                                                >
                                                    {job.title}
                                                </Link>
                                            </td>
                                            <td className="text-muted">{job.location}</td>
                                            <td className="text-muted">
                                                {formatSalary(job.salary_min, job.salary_max)}
                                            </td>
                                            <td>
                                                <JobStatusBadge status={job.company_status} />
                                            </td>
                                            <td className="text-muted">
                                                {formatDate(job.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
