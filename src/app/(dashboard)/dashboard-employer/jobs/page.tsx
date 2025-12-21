'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEmployerJobs, useCloseJob, useDeleteJob } from '@/hooks/useJobs';
import {
    SkeletonTable,
    SkeletonStyles,
    JobStatusBadge,
    EmptyState,
    ErrorState
} from '@/components/employer';

/**
 * Jobs Management Page
 * Lists all jobs with actions to edit, close, or create new
 */
export default function JobsPage() {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, error, refetch } = useEmployerJobs(page, pageSize);
    const closeMutation = useCloseJob();
    const deleteMutation = useDeleteJob();

    const jobs = data?.jobs || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

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

    // Handle close job
    const handleCloseJob = (id: number) => {
        if (confirm('Are you sure you want to close this job? It will no longer be visible to candidates.')) {
            closeMutation.mutate(id);
        }
    };

    // Handle delete job
    const handleDeleteJob = (id: number, title: string) => {
        if (confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="container-fluid">
            <SkeletonStyles />

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1 fw-bold">Manage Jobs</h2>
                    <p className="text-muted mb-0">View and manage all your job postings</p>
                </div>
                <Link href="/dashboard-employer/jobs/new" className="btn btn-primary">
                    <i className="mdi mdi-plus me-1"></i>
                    Post New Job
                </Link>
            </div>

            {/* Jobs Table Card */}
            <div className="card shadow-sm border-0">
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
                                        <th className="border-bottom-0 text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <SkeletonTable rows={5} columns={6} />
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
                                        <th className="border-bottom-0 text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id}>
                                            <td className="ps-4">
                                                <span className="fw-semibold">{job.title}</span>
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
                                            <td className="text-end pe-4">
                                                <div className="btn-group btn-group-sm">
                                                    <Link
                                                        href={`/candidate/jobs/${job.id}`}
                                                        className="btn btn-outline-info"
                                                        title="View Job Ad"
                                                        target="_blank"
                                                    >
                                                        <i className="mdi mdi-eye-outline"></i>
                                                    </Link>
                                                    <Link
                                                        href={`/dashboard-employer/jobs/${job.id}`}
                                                        className="btn btn-outline-primary"
                                                        title="Edit Job"
                                                    >
                                                        <i className="mdi mdi-pencil-outline"></i>
                                                    </Link>
                                                    {job.company_status === 'active' && (
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => handleCloseJob(job.id)}
                                                            disabled={closeMutation.isPending}
                                                            title="Close Job"
                                                        >
                                                            <i className="mdi mdi-archive-outline"></i>
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDeleteJob(job.id, job.title)}
                                                        disabled={deleteMutation.isPending}
                                                        title="Delete Job"
                                                    >
                                                        <i className="mdi mdi-trash-can-outline"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && !error && totalPages > 1 && (
                    <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} jobs
                        </small>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                    >
                                        <i className="mdi mdi-chevron-left"></i>
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                    >
                                        <i className="mdi mdi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
