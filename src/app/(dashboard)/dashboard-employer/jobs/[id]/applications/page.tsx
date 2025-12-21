'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useJob } from '@/hooks/useJobs';
import { useJobApplications } from '@/hooks/useApplications';
import { getStatusVariant, getStatusLabel, formatApplicationDate } from '@/types/application';

interface JobApplicationsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function JobApplicationsPage({ params }: JobApplicationsPageProps) {
    // Unwrap async params using React.use()
    const resolvedParams = use(params);
    const jobId = parseInt(resolvedParams.id, 10);

    // Fetch job details
    const { data: job, isLoading: isLoadingJob } = useJob(jobId);

    // Fetch applications
    const { data: applications, isLoading: isLoadingApplications } = useJobApplications(jobId);

    const isLoading = isLoadingJob || isLoadingApplications;

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="placeholder-glow">
                                    <span className="placeholder col-6 mb-3"></span>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <tbody>
                                                {[1, 2, 3].map((i) => (
                                                    <tr key={i}>
                                                        <td><span className="placeholder col-8"></span></td>
                                                        <td><span className="placeholder col-6"></span></td>
                                                        <td><span className="placeholder col-4"></span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-1">
                                    <li className="breadcrumb-item">
                                        <Link href="/dashboard-employer">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link href="/dashboard-employer/jobs">Jobs</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Applications</li>
                                </ol>
                            </nav>
                            <h4 className="mb-0">
                                Applications for: {job?.title || 'Job'}
                            </h4>
                            <p className="text-muted small mb-0">
                                {applications?.length || 0} application(s) received
                            </p>
                        </div>
                        <Link href="/dashboard-employer/jobs" className="btn btn-outline-primary">
                            <i className="mdi mdi-arrow-left me-1"></i>
                            Back to Jobs
                        </Link>
                    </div>

                    {/* Applications Table */}
                    <div className="card">
                        <div className="card-body">
                            {applications && applications.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">Candidate</th>
                                                <th scope="col">Applied Date</th>
                                                <th scope="col">Status</th>
                                                <th scope="col" className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map((app) => (
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
                                                                <h6 className="mb-0">
                                                                    {app.candidate_name || 'Unknown Candidate'}
                                                                </h6>
                                                                {app.verification_status && (
                                                                    <small className="text-success">
                                                                        <i className="mdi mdi-check-circle me-1"></i>
                                                                        Verified
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="text-muted">
                                                            {formatApplicationDate(app.created_at)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${getStatusVariant(app.status)}`}>
                                                            {getStatusLabel(app.status)}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <Link
                                                            href={`/dashboard-employer/applications/${app.id}`}
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            <i className="mdi mdi-eye me-1"></i>
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <div className="mb-3">
                                        <i className="mdi mdi-file-document-outline text-muted" style={{ fontSize: 48 }}></i>
                                    </div>
                                    <h5 className="text-muted">No Applications Yet</h5>
                                    <p className="text-muted small mb-0">
                                        Applications will appear here when candidates apply for this job.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
