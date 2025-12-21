'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useApplicationDetail, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { getStatusVariant, getStatusLabel, formatApplicationDate } from '@/types/application';
import { formatExperienceDuration, formatDateRange } from '@/types/candidate';
import type { ApplicationStatus } from '@/types/application';

interface ApplicationDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
    // Unwrap async params using React.use()
    const resolvedParams = use(params);
    const applicationId = parseInt(resolvedParams.id, 10);

    // Fetch application detail
    const { data, isLoading, error } = useApplicationDetail(applicationId);

    // Update status mutation
    const updateStatusMutation = useUpdateApplicationStatus();

    // Local state
    const [showStatusConfirm, setShowStatusConfirm] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<'reviewed' | 'accepted' | 'rejected' | null>(null);

    const application = data?.application;
    const verification = data?.verification;
    const experiences = data?.experiences || [];

    // Handle status update
    const handleStatusChange = (status: 'reviewed' | 'accepted' | 'rejected') => {
        setPendingStatus(status);
        setShowStatusConfirm(true);
    };

    const confirmStatusUpdate = async () => {
        if (!pendingStatus) return;

        try {
            await updateStatusMutation.mutateAsync({
                id: applicationId,
                input: { status: pendingStatus },
            });
            setShowStatusConfirm(false);
            setPendingStatus(null);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="placeholder-glow">
                                    <span className="placeholder col-4 mb-3"></span>
                                    <span className="placeholder col-8 mb-2"></span>
                                    <span className="placeholder col-6 mb-2"></span>
                                    <span className="placeholder col-10"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !application) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body text-center py-5">
                                <i className="mdi mdi-alert-circle text-danger" style={{ fontSize: 48 }}></i>
                                <h5 className="mt-3">Application Not Found</h5>
                                <Link href="/dashboard-employer/jobs" className="btn btn-primary mt-3">
                                    Back to Jobs
                                </Link>
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
                                    <li className="breadcrumb-item active">Application Review</li>
                                </ol>
                            </nav>
                            <h4 className="mb-0">Application Review</h4>
                        </div>
                        <Link
                            href={`/dashboard-employer/jobs/${application.job_id}/applications`}
                            className="btn btn-outline-primary"
                        >
                            <i className="mdi mdi-arrow-left me-1"></i>
                            Back to Applications
                        </Link>
                    </div>

                    <div className="row">
                        {/* Left Column - Candidate Profile */}
                        <div className="col-lg-8">
                            {/* Candidate Info Card */}
                            <div className="card mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">Candidate Profile</h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-start">
                                        <div className="me-4">
                                            {verification?.profile_picture_url ? (
                                                <Image
                                                    src={verification.profile_picture_url}
                                                    alt={`${verification.first_name} ${verification.last_name}`}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-circle"
                                                />
                                            ) : (
                                                <div
                                                    className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                                    style={{ width: 100, height: 100 }}
                                                >
                                                    <i className="mdi mdi-account text-primary" style={{ fontSize: 48 }}></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h4 className="mb-1">
                                                {verification?.first_name} {verification?.last_name}
                                            </h4>
                                            {verification?.occupation && (
                                                <p className="text-primary mb-2">{verification.occupation}</p>
                                            )}
                                            <div className="d-flex flex-wrap gap-3 text-muted small">
                                                {verification?.phone && (
                                                    <span>
                                                        <i className="mdi mdi-phone me-1"></i>
                                                        {verification.phone}
                                                    </span>
                                                )}
                                                {verification?.website_url && (
                                                    <a href={verification.website_url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                        <i className="mdi mdi-web me-1"></i>
                                                        Website
                                                    </a>
                                                )}
                                            </div>
                                            {verification?.status === 'VERIFIED' && (
                                                <span className="badge bg-success mt-2">
                                                    <i className="mdi mdi-check-circle me-1"></i>
                                                    Verified Profile
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* About / Intro */}
                                    {verification?.intro && (
                                        <div className="mt-4">
                                            <h6 className="text-muted mb-2">About</h6>
                                            <p className="mb-0">{verification.intro}</p>
                                        </div>
                                    )}

                                    {/* Japan Experience */}
                                    <div className="row mt-4">
                                        <div className="col-md-4">
                                            <div className="bg-light rounded p-3">
                                                <small className="text-muted d-block">Japan Experience</small>
                                                <strong>
                                                    {verification?.japan_experience_duration
                                                        ? formatExperienceDuration(verification.japan_experience_duration)
                                                        : 'Not specified'}
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="bg-light rounded p-3">
                                                <small className="text-muted d-block">Japanese Level</small>
                                                <strong>{verification?.japanese_level || 'Not specified'}</strong>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="bg-light rounded p-3">
                                                <small className="text-muted d-block">JLPT Certificate</small>
                                                {verification?.japanese_certificate_url ? (
                                                    <a
                                                        href={verification.japanese_certificate_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary"
                                                    >
                                                        <i className="mdi mdi-file-document me-1"></i>
                                                        View Certificate
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">Not uploaded</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Work Experience Card */}
                            <div className="card mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">Work Experience in Japan</h5>
                                </div>
                                <div className="card-body">
                                    {experiences.length > 0 ? (
                                        <div className="timeline">
                                            {experiences.map((exp, index) => (
                                                <div key={exp.id || index} className={`pb-4 ${index < experiences.length - 1 ? 'border-start ps-4 ms-2' : 'ps-4 ms-2'}`}>
                                                    <div className="position-relative">
                                                        <div
                                                            className="position-absolute bg-primary rounded-circle"
                                                            style={{ width: 12, height: 12, left: -28, top: 4 }}
                                                        ></div>
                                                        <h6 className="mb-1">{exp.job_title}</h6>
                                                        <p className="text-primary mb-1">{exp.company_name}</p>
                                                        <small className="text-muted d-block mb-2">
                                                            {formatDateRange(exp.start_date, exp.end_date)}
                                                        </small>
                                                        {exp.description && (
                                                            <p className="text-muted small mb-0">{exp.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">No work experience recorded.</p>
                                    )}
                                </div>
                            </div>

                            {/* Identity & Demographics Card */}
                            <div className="card mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">
                                        <i className="mdi mdi-account-details me-2 text-primary"></i>
                                        Identity & Demographics
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-3">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Date of Birth</small>
                                                <strong>
                                                    {verification?.birth_date
                                                        ? new Date(verification.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                        : 'Not specified'}
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Domicile City</small>
                                                <strong>{verification?.domicile_city || 'Not specified'}</strong>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Marital Status</small>
                                                <strong>{verification?.marital_status || 'Not specified'}</strong>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Children</small>
                                                <strong>
                                                    {verification?.marital_status === 'MARRIED'
                                                        ? (verification?.children_count ?? 0)
                                                        : 'N/A'}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Core Competencies Card */}
                            <div className="card mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">
                                        <i className="mdi mdi-cog me-2 text-warning"></i>
                                        Core Competencies
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Japanese Speaking Level</small>
                                                <strong>{verification?.japanese_speaking_level || 'Not specified'}</strong>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Golden Skill (Can Teach Others)</small>
                                                <strong>{verification?.golden_skill || 'Not specified'}</strong>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="bg-light rounded p-3">
                                                <small className="text-muted d-block mb-2">Main Job Fields</small>
                                                {verification?.main_job_fields && verification.main_job_fields.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {verification.main_job_fields.map((field: string) => (
                                                            <span key={field} className="badge bg-primary">
                                                                {field.replace(/_/g, ' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No job fields specified</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expectations & Availability Card */}
                            <div className="card mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">
                                        <i className="mdi mdi-calendar-check me-2 text-success"></i>
                                        Expectations & Availability
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Expected Salary (IDR/month)</small>
                                                <strong className="text-success">
                                                    {verification?.expected_salary
                                                        ? `Rp ${verification.expected_salary.toLocaleString('id-ID')}`
                                                        : 'Not specified'}
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Japan Return Date</small>
                                                <strong>
                                                    {verification?.japan_return_date
                                                        ? new Date(verification.japan_return_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                        : 'Not specified'}
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block">Available Start Date</small>
                                                <strong>
                                                    {verification?.available_start_date
                                                        ? new Date(verification.available_start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                        : 'Not specified'}
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block mb-2">Preferred Locations</small>
                                                {verification?.preferred_locations && verification.preferred_locations.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {verification.preferred_locations.map((loc: string) => (
                                                            <span key={loc} className="badge bg-success">
                                                                {loc.replace(/_/g, ' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No preferences specified</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="bg-light rounded p-3 h-100">
                                                <small className="text-muted d-block mb-2">Preferred Industries</small>
                                                {verification?.preferred_industries && verification.preferred_industries.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {verification.preferred_industries.map((ind: string) => (
                                                            <span key={ind} className="badge bg-warning text-dark">
                                                                {ind.replace(/_/g, ' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No preferences specified</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            {application.cover_letter && (
                                <div className="card mb-4">
                                    <div className="card-header bg-white py-3">
                                        <h5 className="mb-0">Cover Letter</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                            {application.cover_letter}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Application Actions */}
                        <div className="col-lg-4">
                            {/* Application Status Card */}
                            <div className="card mb-4 sticky-top" style={{ top: '1rem' }}>
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">Application</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <small className="text-muted d-block">Job Position</small>
                                        <strong>{application.job_title || 'Unknown Position'}</strong>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted d-block">Applied On</small>
                                        <strong>{formatApplicationDate(application.created_at)}</strong>
                                    </div>

                                    <div className="mb-4">
                                        <small className="text-muted d-block">Current Status</small>
                                        <span className={`badge bg-${getStatusVariant(application.status)} fs-6`}>
                                            {getStatusLabel(application.status)}
                                        </span>
                                    </div>

                                    {/* CV Download */}
                                    <div className="mb-4">
                                        <small className="text-muted d-block mb-2">CV / Resume</small>
                                        <a
                                            href={application.cv_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary w-100"
                                        >
                                            <i className="mdi mdi-download me-1"></i>
                                            Download CV
                                        </a>
                                    </div>

                                    <hr />

                                    {/* Status Update Actions */}
                                    <div>
                                        <small className="text-muted d-block mb-2">Update Status</small>
                                        <div className="d-grid gap-2">
                                            {application.status === 'applied' && (
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => handleStatusChange('reviewed')}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    <i className="mdi mdi-eye-check me-1"></i>
                                                    Mark as Reviewed
                                                </button>
                                            )}
                                            {(application.status === 'applied' || application.status === 'reviewed') && (
                                                <>
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => handleStatusChange('accepted')}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        <i className="mdi mdi-check-circle me-1"></i>
                                                        Accept Application
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleStatusChange('rejected')}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        <i className="mdi mdi-close-circle me-1"></i>
                                                        Reject Application
                                                    </button>
                                                </>
                                            )}
                                            {(application.status === 'accepted' || application.status === 'rejected') && (
                                                <p className="text-muted small mb-0 text-center">
                                                    This application has been {application.status}.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showStatusConfirm && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Status Update</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowStatusConfirm(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    Are you sure you want to mark this application as{' '}
                                    <strong className={`text-${pendingStatus === 'accepted' ? 'success' : pendingStatus === 'rejected' ? 'danger' : 'warning'}`}>
                                        {pendingStatus}
                                    </strong>?
                                </p>
                                {pendingStatus === 'rejected' && (
                                    <p className="text-muted small mb-0">
                                        This action will notify the candidate that their application was not successful.
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowStatusConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-${pendingStatus === 'accepted' ? 'success' : pendingStatus === 'rejected' ? 'danger' : 'warning'}`}
                                    onClick={confirmStatusUpdate}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    {updateStatusMutation.isPending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        'Confirm'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
