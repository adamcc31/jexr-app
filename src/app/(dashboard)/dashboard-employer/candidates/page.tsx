'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEmployerJobs } from '@/hooks/useJobs';
import { useJobApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { getStatusVariant, getStatusLabel, formatApplicationDate } from '@/types/application';
import type { Application, ApplicationStatus } from '@/types/application';
import type { Job } from '@/types/employer';

// Component to fetch and display applications for a single job
function JobApplicationsList({
    job,
    statusFilter,
    onStatusUpdate,
    isUpdating
}: {
    job: Job;
    statusFilter: string;
    onStatusUpdate: (appId: number, status: 'reviewed' | 'accepted' | 'rejected') => void;
    isUpdating: boolean;
}) {
    const { data: applications, isLoading } = useJobApplications(job.id);

    // Filter by status if selected
    const filteredApplications = useMemo(() => {
        if (!applications) return [];
        if (statusFilter === 'all') return applications;
        return applications.filter(app => app.status === statusFilter);
    }, [applications, statusFilter]);

    if (isLoading) {
        return (
            <>
                {[1, 2].map(i => (
                    <tr key={`loading-${job.id}-${i}`}>
                        <td colSpan={5}>
                            <div className="placeholder-glow">
                                <span className="placeholder col-12"></span>
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        );
    }

    if (filteredApplications.length === 0) {
        return null;
    }

    return (
        <>
            {filteredApplications.map((app) => (
                <tr key={app.id}>
                    <td>
                        <div className="d-flex align-items-center">
                            <div className="avatar avatar-sm me-3">
                                {app.candidate_photo ? (
                                    <Image
                                        src={app.candidate_photo}
                                        alt={app.candidate_name || 'Candidate'}
                                        width={40}
                                        height={40}
                                        className="rounded-circle"
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                        style={{ width: 40, height: 40 }}
                                    >
                                        <i className="mdi mdi-account text-primary"></i>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h6 className="mb-0">{app.candidate_name || 'Unknown Candidate'}</h6>
                                {app.verification_status === 'VERIFIED' && (
                                    <small className="text-success">
                                        <i className="mdi mdi-check-circle me-1"></i>Verified
                                    </small>
                                )}
                            </div>
                        </div>
                    </td>
                    <td>
                        <Link href={`/dashboard-employer/jobs/${job.id}`} className="text-primary text-decoration-none">
                            {job.title}
                        </Link>
                        <small className="text-muted d-block">{job.location}</small>
                    </td>
                    <td className="text-muted">
                        {formatApplicationDate(app.created_at)}
                    </td>
                    <td>
                        <span className={`badge bg-${getStatusVariant(app.status)}`}>
                            {getStatusLabel(app.status)}
                        </span>
                    </td>
                    <td>
                        <div className="d-flex gap-2">
                            <Link
                                href={`/dashboard-employer/applications/${app.id}`}
                                className="btn btn-sm btn-primary"
                            >
                                <i className="mdi mdi-eye"></i>
                            </Link>
                            {/* Quick actions dropdown */}
                            {(app.status === 'applied' || app.status === 'reviewed') && (
                                <div className="dropdown">
                                    <button
                                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        disabled={isUpdating}
                                    >
                                        <i className="mdi mdi-dots-vertical"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        {app.status === 'applied' && (
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => onStatusUpdate(app.id, 'reviewed')}
                                                >
                                                    <i className="mdi mdi-eye-check me-2 text-warning"></i>
                                                    Mark as Reviewed
                                                </button>
                                            </li>
                                        )}
                                        <li>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => onStatusUpdate(app.id, 'accepted')}
                                            >
                                                <i className="mdi mdi-check-circle me-2 text-success"></i>
                                                Accept
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => onStatusUpdate(app.id, 'rejected')}
                                            >
                                                <i className="mdi mdi-close-circle me-2 text-danger"></i>
                                                Reject
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}

export default function CandidatesPage() {
    // Filters
    const [jobFilter, setJobFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Fetch employer's jobs
    const { data: jobsData, isLoading: isLoadingJobs } = useEmployerJobs(1, 100);

    // Status update mutation
    const updateStatusMutation = useUpdateApplicationStatus();

    // Active jobs only
    const jobs = useMemo(() => {
        if (!jobsData?.jobs) return [];
        return jobsData.jobs;
    }, [jobsData]);

    // Filter jobs if job filter is applied
    const filteredJobs = useMemo(() => {
        if (jobFilter === 'all') return jobs;
        return jobs.filter(job => job.id === parseInt(jobFilter));
    }, [jobs, jobFilter]);

    // Handle status update
    const handleStatusUpdate = (appId: number, status: 'reviewed' | 'accepted' | 'rejected') => {
        updateStatusMutation.mutate({ id: appId, input: { status } });
    };

    // Loading state
    if (isLoadingJobs) {
        return (
            <div className="container-fluid">
                <div className="mb-4">
                    <h2 className="mb-1 fw-bold">Applicants</h2>
                    <p className="text-muted mb-0">View and manage candidates who applied to your jobs</p>
                </div>
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="placeholder-glow">
                            <span className="placeholder col-12 mb-3" style={{ height: 50 }}></span>
                            <span className="placeholder col-12 mb-2" style={{ height: 60 }}></span>
                            <span className="placeholder col-12 mb-2" style={{ height: 60 }}></span>
                            <span className="placeholder col-12" style={{ height: 60 }}></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1 fw-bold">Applicants</h2>
                    <p className="text-muted mb-0">View and manage candidates who applied to your jobs</p>
                </div>
                <Link href="/dashboard-employer/job-post" className="btn btn-primary">
                    <i className="mdi mdi-plus me-1"></i>
                    Post a Job
                </Link>
            </div>

            {/* Filters */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body py-3">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4">
                            <label className="form-label small mb-1">Filter by Job</label>
                            <select
                                className="form-select form-select-sm"
                                value={jobFilter}
                                onChange={(e) => setJobFilter(e.target.value)}
                            >
                                <option value="all">All Jobs</option>
                                {jobs.map(job => (
                                    <option key={job.id} value={job.id}>
                                        {job.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small mb-1">Filter by Status</label>
                            <select
                                className="form-select form-select-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="applied">Applied</option>
                                <option value="reviewed">Under Review</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            {(jobFilter !== 'all' || statusFilter !== 'all') && (
                                <button
                                    className="btn btn-sm btn-outline-secondary mt-auto"
                                    onClick={() => {
                                        setJobFilter('all');
                                        setStatusFilter('all');
                                    }}
                                >
                                    <i className="mdi mdi-filter-remove me-1"></i>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    {jobs.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <i className="mdi mdi-briefcase-outline text-muted" style={{ fontSize: 48 }}></i>
                            </div>
                            <h5 className="text-muted">No Jobs Posted Yet</h5>
                            <p className="text-muted small mb-3">
                                Post a job to start receiving applications from candidates.
                            </p>
                            <Link href="/dashboard-employer/job-post" className="btn btn-primary">
                                <i className="mdi mdi-plus me-1"></i>
                                Post Your First Job
                            </Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Candidate</th>
                                        <th scope="col">Applied For</th>
                                        <th scope="col">Applied Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" style={{ width: '120px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredJobs.map(job => (
                                        <JobApplicationsList
                                            key={job.id}
                                            job={job}
                                            statusFilter={statusFilter}
                                            onStatusUpdate={handleStatusUpdate}
                                            isUpdating={updateStatusMutation.isPending}
                                        />
                                    ))}
                                </tbody>
                            </table>

                            {/* Empty state for no applications */}
                            <div id="no-applications-check" className="d-none">
                                {/* This is checked via JS to show empty state when all jobs have no applications */}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Legend */}
            <div className="card border-0 bg-light mt-4">
                <div className="card-body">
                    <h6 className="fw-semibold mb-3">
                        <i className="mdi mdi-information-outline me-2 text-primary"></i>
                        Application Status Guide
                    </h6>
                    <div className="d-flex flex-wrap gap-4">
                        <div className="d-flex align-items-center">
                            <span className="badge bg-primary me-2">Applied</span>
                            <small className="text-muted">New application, not yet reviewed</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="badge bg-warning me-2">Under Review</span>
                            <small className="text-muted">Application is being reviewed</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="badge bg-success me-2">Accepted</span>
                            <small className="text-muted">Candidate has been accepted</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="badge bg-danger me-2">Rejected</span>
                            <small className="text-muted">Application was not successful</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
