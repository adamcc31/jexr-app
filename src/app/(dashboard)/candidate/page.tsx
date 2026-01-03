'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";

import NavbarDark from "../../components/navbarCandidate";
import Footer from "../../components/footer";
import { useJobs } from "@/hooks/useJobs";
import { useCandidateProfile } from "@/hooks/useCandidate";
import { useMyApplications } from "@/hooks/useApplications";
import { SkeletonCard, SkeletonStyles } from "@/components/employer";
import type { JobWithCompany } from "@/types/employer";
import type { CandidateVerification } from "@/types/candidate";
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign } from "../../assets/icons/vander";

// Helper functions
function formatSalary(min: number, max: number): string {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
}

// Calculate profile completion (MANDATORY fields only)
// JLPT Certificate, Portfolio URL, Intro are OPTIONAL and do NOT affect completion
function calculateProfileCompletion(v: CandidateVerification | undefined): { percentage: number; missing: string[] } {
    if (!v) return { percentage: 0, missing: ['Profile not started'] };

    // MANDATORY fields for verification
    const mandatoryFields = [
        { key: 'first_name', label: 'First Name', value: v.first_name },
        { key: 'last_name', label: 'Last Name', value: v.last_name },
        { key: 'profile_picture_url', label: 'Profile Picture', value: v.profile_picture_url },
        { key: 'occupation', label: 'Occupation', value: v.occupation },
        { key: 'phone', label: 'Phone', value: v.phone },
        { key: 'birth_date', label: 'Date of Birth', value: v.birth_date },
        { key: 'domicile_city', label: 'Domicile City', value: v.domicile_city },
        { key: 'japan_experience_duration', label: 'Japan Experience', value: v.japan_experience_duration },
        { key: 'cv_url', label: 'CV/Resume Document', value: v.cv_url }, // MANDATORY
        // NOTE: japanese_level, japanese_certificate_url, portfolio_url, intro are OPTIONAL
    ];

    const filled = mandatoryFields.filter(f => f.value).length;
    const missing = mandatoryFields.filter(f => !f.value).map(f => f.label);
    const percentage = Math.round((filled / mandatoryFields.length) * 100);

    return { percentage, missing };
}

// Job Card Component
function JobCard({ job }: { job: JobWithCompany }) {
    return (
        <div className="col-lg-6 col-12 mt-4 pt-2">
            <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            {job.company_logo_url ? (
                                <Image
                                    src={job.company_logo_url}
                                    width={50}
                                    height={50}
                                    className="rounded shadow-sm bg-white"
                                    alt={job.company_name}
                                    unoptimized
                                />
                            ) : (
                                <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                                    <i className="mdi mdi-domain text-primary fs-5"></i>
                                </div>
                            )}
                            <div className="ms-3">
                                <Link href={`/candidate/jobs/${job.id}`} className="h6 mb-0 text-dark text-decoration-none">
                                    {job.title}
                                </Link>
                                <Link href={`/candidate/companies/${job.company_id}`} className="d-block text-muted small text-decoration-none">
                                    {job.company_name}
                                </Link>
                            </div>
                        </div>
                        {job.employment_type && (
                            <span className="badge bg-primary-subtle text-primary">{job.employment_type}</span>
                        )}
                    </div>
                    <div className="mt-3">
                        <span className="text-muted small d-block">
                            <FiMapPin className="me-1" style={{ width: 14 }} /> {job.location}
                        </span>
                        <span className="text-muted small d-block mt-1">
                            <FiDollarSign className="me-1" style={{ width: 14 }} /> {formatSalary(job.salary_min, job.salary_max)}
                        </span>
                        <span className="text-muted small d-block mt-1">
                            <FiClock className="me-1" style={{ width: 14 }} /> Posted {formatDate(job.created_at)}
                        </span>
                    </div>
                    <div className="mt-3 pt-3 border-top">
                        <Link href={`/candidate/jobs/${job.id}`} className="btn btn-sm btn-primary me-2">View Details</Link>
                        <Link href={`/candidate/jobs/${job.id}/apply`} className="btn btn-sm btn-outline-primary">Apply Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CandidateDashboard() {
    const { data: jobsData, isLoading: isLoadingJobs, error: jobsError } = useJobs(1, 4);
    const { data: profileData, isLoading: isLoadingProfile } = useCandidateProfile();
    const { data: applications, isLoading: isLoadingApplications } = useMyApplications();

    const recentJobs = React.useMemo(() => {
        if (!jobsData?.jobs) return [];
        return jobsData.jobs.filter(job => job.company_status === 'active').slice(0, 4);
    }, [jobsData]);

    const totalJobs = jobsData?.total || 0;
    const verification = profileData?.verification;
    const { percentage, missing } = calculateProfileCompletion(verification);

    // Application stats
    const applicationStats = React.useMemo(() => {
        if (!applications || !Array.isArray(applications)) {
            return { total: 0, applied: 0, reviewed: 0, accepted: 0, rejected: 0 };
        }
        return {
            total: applications.length,
            applied: applications.filter((a: { status: string }) => a.status === 'applied').length,
            reviewed: applications.filter((a: { status: string }) => a.status === 'reviewed').length,
            accepted: applications.filter((a: { status: string }) => a.status === 'accepted').length,
            rejected: applications.filter((a: { status: string }) => a.status === 'rejected').length,
        };
    }, [applications]);

    return (
        <>
            <NavbarDark navClass="defaultscroll sticky" navLight={false} />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">WELCOME TO <br /> J EXPERT RECRUITMENT <br /> CANDIDATE DASHBOARD</h5>
                            </div>
                        </div>
                    </div>
                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">HOME</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <SkeletonStyles />

                    {/* Incomplete Profile Warning Banner */}
                    {!isLoadingProfile && percentage < 100 && (
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center" role="alert">
                                    <i className="mdi mdi-alert-circle-outline text-danger me-3 fs-4"></i>
                                    <div className="flex-grow-1">
                                        <strong>Profile Incomplete</strong>
                                        <p className="mb-0 small">
                                            Your profile is {percentage}% complete. Complete all mandatory fields to become verified and apply for jobs.
                                            {missing.length > 0 && (
                                                <span className="d-block text-muted">
                                                    Missing: {missing.slice(0, 3).join(', ')}{missing.length > 3 && ` +${missing.length - 3} more`}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <Link href="/candidate/settings" className="btn btn-danger btn-sm ms-3">
                                        <i className="mdi mdi-pencil me-1"></i> Complete Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Summary Card */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    <div className="row align-items-center">
                                        {/* Profile Picture */}
                                        <div className="col-lg-2 col-md-3 text-center mb-3 mb-md-0">
                                            {isLoadingProfile ? (
                                                <div className="placeholder-glow">
                                                    <div className="rounded-circle bg-secondary placeholder mx-auto" style={{ width: 80, height: 80 }}></div>
                                                </div>
                                            ) : verification?.profile_picture_url ? (
                                                <Image
                                                    src={verification.profile_picture_url}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-circle shadow-sm"
                                                    alt="Profile"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center mx-auto" style={{ width: 80, height: 80 }}>
                                                    <i className="mdi mdi-account text-primary" style={{ fontSize: 36 }}></i>
                                                </div>
                                            )}
                                        </div>

                                        {/* Name & Verification */}
                                        <div className="col-lg-4 col-md-4">
                                            <h5 className="mb-1 fw-bold">
                                                {isLoadingProfile ? (
                                                    <span className="placeholder col-8"></span>
                                                ) : (
                                                    verification?.first_name && verification?.last_name
                                                        ? `${verification.first_name} ${verification.last_name}`
                                                        : 'Complete Your Profile'
                                                )}
                                            </h5>
                                            {verification?.occupation && (
                                                <p className="text-muted mb-2">{verification.occupation}</p>
                                            )}
                                            {/* Verification Badge */}
                                            {verification?.status === 'VERIFIED' ? (
                                                <span className="badge bg-success-subtle text-success">
                                                    <i className="mdi mdi-check-circle me-1"></i> Verified
                                                </span>
                                            ) : verification?.status === 'SUBMITTED' ? (
                                                <span className="badge bg-warning-subtle text-warning">
                                                    <i className="mdi mdi-clock-outline me-1"></i> Under Review
                                                </span>
                                            ) : verification?.status === 'REJECTED' ? (
                                                <span className="badge bg-danger-subtle text-danger">
                                                    <i className="mdi mdi-close-circle me-1"></i> Rejected
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary-subtle text-secondary">
                                                    <i className="mdi mdi-alert-circle-outline me-1"></i> Not Verified
                                                </span>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="col-lg-4 col-md-3 mt-3 mt-md-0">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <small className="text-muted">Profile Completion</small>
                                                <small className={`fw-bold ${percentage === 100 ? 'text-success' : percentage >= 70 ? 'text-warning' : 'text-danger'}`}>
                                                    {percentage}%
                                                </small>
                                            </div>
                                            <div className="progress" style={{ height: 6 }}>
                                                <div
                                                    className={`progress-bar ${percentage === 100 ? 'bg-success' : percentage >= 70 ? 'bg-warning' : 'bg-danger'}`}
                                                    role="progressbar"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            {percentage < 100 && missing.length > 0 && (
                                                <small className="text-muted d-block mt-1">
                                                    Missing: {missing.slice(0, 2).join(', ')}{missing.length > 2 && ` +${missing.length - 2}`}
                                                </small>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-lg-2 col-md-2 text-md-end mt-3 mt-lg-0">
                                            <Link href="/candidate/settings" className="btn btn-primary btn-sm">
                                                <i className="mdi mdi-pencil me-1"></i> Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards - Same style as employer dashboard */}
                    <div className="row mb-4">
                        <div className="col-md-3 mb-3">
                            {isLoadingJobs ? (
                                <SkeletonCard />
                            ) : (
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-primary-subtle p-3 me-3">
                                                <i className="mdi mdi-briefcase-outline text-primary fs-4"></i>
                                            </div>
                                            <div>
                                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>
                                                    Available Jobs
                                                </h6>
                                                <h4 className="mb-0 fw-bold">{totalJobs}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-md-3 mb-3">
                            {isLoadingApplications ? (
                                <SkeletonCard />
                            ) : (
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-info-subtle p-3 me-3">
                                                <i className="mdi mdi-file-document-outline text-info fs-4"></i>
                                            </div>
                                            <div>
                                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>
                                                    Applications
                                                </h6>
                                                <h4 className="mb-0 fw-bold">{applicationStats.total}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-md-3 mb-3">
                            {isLoadingApplications ? (
                                <SkeletonCard />
                            ) : (
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-success-subtle p-3 me-3">
                                                <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
                                            </div>
                                            <div>
                                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>
                                                    Accepted
                                                </h6>
                                                <h4 className="mb-0 fw-bold text-success">{applicationStats.accepted}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-md-3 mb-3">
                            {isLoadingProfile ? (
                                <SkeletonCard />
                            ) : (
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className={`rounded-circle ${verification?.cv_url ? 'bg-success-subtle' : 'bg-warning-subtle'} p-3 me-3`}>
                                                <i className={`mdi mdi-file-account-outline ${verification?.cv_url ? 'text-success' : 'text-warning'} fs-4`}></i>
                                            </div>
                                            <div>
                                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>
                                                    CV Status
                                                </h6>
                                                <p className="mb-0 small fw-semibold">
                                                    {verification?.cv_url ? 'Uploaded' : 'Not Uploaded'}
                                                </p>
                                                {verification?.updated_at && (
                                                    <small className="text-muted">{formatRelativeTime(verification.updated_at)}</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Your Submitted Applications - LinkedIn style */}
                    {!isLoadingApplications && applications && Array.isArray(applications) && applications.length > 0 && (
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card shadow-sm border-0">
                                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0 fw-semibold">Your Submitted Applications</h6>
                                            <small className="text-muted">{applications.length} TOTAL APPLICATIONS</small>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        {applications.slice(0, 5).map((app: { id: number; job_title?: string; status: string }) => {
                                            // Define stages: applied → reviewed → accepted
                                            const stages = ['applied', 'reviewed', 'accepted'];
                                            const currentIndex = stages.indexOf(app.status);
                                            const isRejected = app.status === 'rejected';

                                            return (
                                                <div key={app.id} className="border-bottom p-3">
                                                    <div className="row align-items-center">
                                                        {/* Job Title */}
                                                        <div className="col-lg-4 col-md-4 mb-3 mb-md-0">
                                                            <h6 className="mb-0 fw-semibold">{app.job_title || 'Job Application'}</h6>
                                                        </div>

                                                        {/* Progress Tracker */}
                                                        <div className="col-lg-8 col-md-8">
                                                            <div className="d-flex align-items-center justify-content-between position-relative">
                                                                {/* Connecting Line */}
                                                                <div
                                                                    className="position-absolute"
                                                                    style={{
                                                                        top: '50%',
                                                                        left: '10%',
                                                                        right: '10%',
                                                                        height: 3,
                                                                        backgroundColor: '#e9ecef',
                                                                        transform: 'translateY(-50%)',
                                                                        zIndex: 1
                                                                    }}
                                                                ></div>

                                                                {/* Applied */}
                                                                <div className="text-center position-relative" style={{ zIndex: 2, flex: 1 }}>
                                                                    <div
                                                                        className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${isRejected ? 'bg-danger' : 'bg-primary'
                                                                            }`}
                                                                        style={{ width: 24, height: 24 }}
                                                                    >
                                                                        <i className="mdi mdi-check text-white" style={{ fontSize: 14 }}></i>
                                                                    </div>
                                                                    <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>Applied</small>
                                                                </div>

                                                                {/* Reviewed */}
                                                                <div className="text-center position-relative" style={{ zIndex: 2, flex: 1 }}>
                                                                    <div
                                                                        className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${isRejected ? 'bg-danger' :
                                                                            currentIndex >= 1 ? 'bg-primary' : 'bg-light border'
                                                                            }`}
                                                                        style={{ width: 24, height: 24 }}
                                                                    >
                                                                        {currentIndex >= 1 && !isRejected && (
                                                                            <i className="mdi mdi-check text-white" style={{ fontSize: 14 }}></i>
                                                                        )}
                                                                        {isRejected && (
                                                                            <i className="mdi mdi-close text-white" style={{ fontSize: 14 }}></i>
                                                                        )}
                                                                    </div>
                                                                    <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>Review</small>
                                                                </div>

                                                                {/* Accepted */}
                                                                <div className="text-center position-relative" style={{ zIndex: 2, flex: 1 }}>
                                                                    <div
                                                                        className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${isRejected ? 'bg-danger' :
                                                                            currentIndex >= 2 ? 'bg-success' : 'bg-light border'
                                                                            }`}
                                                                        style={{ width: 24, height: 24 }}
                                                                    >
                                                                        {currentIndex >= 2 && !isRejected && (
                                                                            <i className="mdi mdi-check text-white" style={{ fontSize: 14 }}></i>
                                                                        )}
                                                                        {isRejected && (
                                                                            <i className="mdi mdi-close text-white" style={{ fontSize: 14 }}></i>
                                                                        )}
                                                                    </div>
                                                                    <small className={`d-block mt-1 ${isRejected ? 'text-danger' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                                                                        {isRejected ? 'Rejected' : 'Accepted'}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Jobs */}
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                            <h6 className="mb-0 fw-semibold">Recent Jobs</h6>
                            <Link href="/candidate/jobs" className="btn btn-sm btn-outline-primary">
                                View All
                            </Link>
                        </div>
                        <div className="card-body">
                            {/* Loading */}
                            {isLoadingJobs && (
                                <div className="row">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="col-lg-6 col-12 mt-4 pt-2">
                                            <SkeletonCard />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Error */}
                            {jobsError && (
                                <div className="text-center py-5">
                                    <i className="mdi mdi-alert-circle-outline text-danger" style={{ fontSize: 48 }}></i>
                                    <h6 className="mt-3">Failed to load jobs</h6>
                                    <p className="text-muted small">Please try again later.</p>
                                </div>
                            )}

                            {/* Empty */}
                            {!isLoadingJobs && !jobsError && recentJobs.length === 0 && (
                                <div className="text-center py-5">
                                    <i className="mdi mdi-briefcase-remove-outline text-muted" style={{ fontSize: 48 }}></i>
                                    <h6 className="mt-3 text-dark">No jobs available</h6>
                                    <p className="text-muted small">Check back later for new opportunities!</p>
                                </div>
                            )}

                            {/* Jobs */}
                            {!isLoadingJobs && !jobsError && recentJobs.length > 0 && (
                                <div className="row">
                                    {recentJobs.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer top={true} />
        </>
    )
}
