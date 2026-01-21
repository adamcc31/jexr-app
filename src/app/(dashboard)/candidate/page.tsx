'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import NavbarDark from "../../components/navbarCandidate";
import Footer from "../../components/footer";
import { useJobs } from "@/hooks/useJobs";
import { useCandidateProfile } from "@/hooks/useCandidate";
import { useCandidateProfile as useFullCandidateProfile } from "@/hooks/useCandidateProfile";
import { useMyApplications } from "@/hooks/useApplications";
import { SkeletonCard, SkeletonStyles } from "@/components/employer";
import { ProfileCompletionModal } from "@/components/candidate/ProfileCompletionModal";
import { calculateDetailedCompletion, POPUP_DISMISSED_KEY } from "@/lib/profileCompletionUtils";
import type { JobWithCompany } from "@/types/employer";
import type { CandidateVerification, CandidateWithFullDetails } from "@/types/candidate";
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

function formatRelativeTime(dateString: string, t: (key: string, options?: Record<string, unknown>) => string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('common.today');
    if (diffDays === 1) return t('common.yesterday');
    if (diffDays < 7) return t('common.daysAgo', { count: diffDays });
    if (diffDays < 30) return t('common.weeksAgo', { count: Math.floor(diffDays / 7) });
    return formatDate(dateString);
}

// Calculate profile completion (ALL fields are MANDATORY except portfolio)
// Includes Identity/Verification fields AND Professional Profile fields
function calculateProfileCompletion(
    v: CandidateVerification | undefined,
    professionalProfile?: CandidateWithFullDetails | null
): { percentage: number; missing: string[] } {
    if (!v) return { percentage: 0, missing: ['Profile not started'] };

    // ALL MANDATORY fields (only portfolio_url is optional)
    const mandatoryFields = [
        // Personal Information
        { key: 'first_name', label: 'First Name', value: v.first_name },
        { key: 'last_name', label: 'Last Name', value: v.last_name },
        { key: 'profile_picture_url', label: 'Profile Picture', value: v.profile_picture_url },
        { key: 'occupation', label: 'Occupation', value: v.occupation },
        { key: 'phone', label: 'Phone', value: v.phone },
        { key: 'intro', label: 'Intro/Bio', value: v.intro },

        // Identity & Demographics
        { key: 'birth_date', label: 'Date of Birth', value: v.birth_date },
        { key: 'domicile_city', label: 'Domicile City', value: v.domicile_city },
        { key: 'marital_status', label: 'Marital Status', value: v.marital_status },
        { key: 'children_count', label: 'Children Count', value: v.children_count !== undefined && v.children_count !== null },

        // Japanese Experience & Language
        { key: 'japan_experience_duration', label: 'Japan Experience', value: v.japan_experience_duration && v.japan_experience_duration > 0 },
        { key: 'japanese_level', label: 'Japanese Level (JLPT)', value: v.japanese_level },
        { key: 'japanese_certificate_url', label: 'JLPT Certificate', value: v.japanese_certificate_url },
        { key: 'japanese_speaking_level', label: 'Japanese Speaking Level', value: v.japanese_speaking_level },

        // Documents
        { key: 'cv_url', label: 'CV/Resume Document', value: v.cv_url },

        // Core Competencies
        { key: 'main_job_fields', label: 'Main Job Fields', value: v.main_job_fields && v.main_job_fields.length > 0 },
        { key: 'golden_skill', label: 'Golden Skill', value: v.golden_skill },

        // Expectations & Availability
        { key: 'expected_salary', label: 'Expected Salary', value: v.expected_salary && v.expected_salary > 0 },
        { key: 'japan_return_date', label: 'Japan Return Date', value: v.japan_return_date },
        { key: 'available_start_date', label: 'Available Start Date', value: v.available_start_date },
        { key: 'preferred_locations', label: 'Preferred Locations', value: v.preferred_locations && v.preferred_locations.length > 0 },
        { key: 'preferred_industries', label: 'Preferred Industries', value: v.preferred_industries && v.preferred_industries.length > 0 },

        // Professional Profile fields
        { key: 'title', label: 'Professional Title', value: professionalProfile?.profile?.title },
        { key: 'bio', label: 'Professional Bio', value: professionalProfile?.profile?.bio },
        { key: 'highest_education', label: 'Education Level', value: professionalProfile?.profile?.highest_education },
        { key: 'work_experiences', label: 'Work Experience', value: (professionalProfile?.work_experiences?.length ?? 0) > 0 },
        { key: 'skills', label: 'Skills', value: (professionalProfile?.skill_ids?.length ?? 0) > 0 },
    ];

    const filled = mandatoryFields.filter(f => f.value).length;
    const missing = mandatoryFields.filter(f => !f.value).map(f => f.label);
    const percentage = Math.round((filled / mandatoryFields.length) * 100);

    return { percentage, missing };
}

// Job Card Component
function JobCard({ job, t }: { job: JobWithCompany; t: (key: string, options?: Record<string, unknown>) => string }) {
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
                            <FiClock className="me-1" style={{ width: 14 }} /> {t('index.posted', { date: formatDate(job.created_at) })}
                        </span>
                    </div>
                    <div className="mt-3 pt-3 border-top">
                        <Link href={`/candidate/jobs/${job.id}`} className="btn btn-sm btn-primary me-2">{t('common.viewDetails')}</Link>
                        <Link href={`/candidate/jobs/${job.id}/apply`} className="btn btn-sm btn-outline-primary">{t('common.applyNow')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CandidateDashboard() {
    const { t } = useTranslation('candidate');
    const router = useRouter();
    const { data: jobsData, isLoading: isLoadingJobs, error: jobsError } = useJobs(1, 4);
    const { data: profileData, isLoading: isLoadingProfile } = useCandidateProfile();
    const { profile: professionalProfile, loading: isLoadingProfessional } = useFullCandidateProfile();
    const { data: applications, isLoading: isLoadingApplications } = useMyApplications();

    // Profile completion modal state
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    const recentJobs = React.useMemo(() => {
        if (!jobsData?.jobs) return [];
        return jobsData.jobs.filter(job => job.company_status === 'active').slice(0, 4);
    }, [jobsData]);

    const totalJobs = jobsData?.total || 0;
    const verification = profileData?.verification;
    const isAnyProfileLoading = isLoadingProfile || isLoadingProfessional;
    const { percentage, missing } = calculateProfileCompletion(verification, professionalProfile);

    // Calculate detailed completion for modal
    const detailedCompletion = React.useMemo(() => {
        return calculateDetailedCompletion(verification, professionalProfile);
    }, [verification, professionalProfile]);

    // Show completion modal if profile is incomplete
    useEffect(() => {
        if (isAnyProfileLoading) return;

        // Check if popup was already dismissed this session
        const dismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY);
        if (dismissed) return;

        // Show modal if profile is not complete
        if (!detailedCompletion.isComplete && detailedCompletion.percentage < 100) {
            // Delay slightly to let the page render first
            const timer = setTimeout(() => {
                setShowCompletionModal(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [detailedCompletion, isAnyProfileLoading]);

    // Handle navigation to settings from modal
    const handleNavigateToSettings = (tab: 'identity' | 'professional') => {
        setShowCompletionModal(false);
        sessionStorage.setItem(POPUP_DISMISSED_KEY, 'true');
        router.push(`/candidate/settings?tab=${tab}`);
    };

    // Handle modal dismiss
    const handleDismissModal = () => {
        setShowCompletionModal(false);
        sessionStorage.setItem(POPUP_DISMISSED_KEY, 'true');
    };

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
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark" style={{ whiteSpace: 'pre-line' }}>{t('index.heroTitle')}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">{t('index.breadcrumbHome')}</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{t('index.breadcrumbDashboard')}</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <SkeletonStyles />

                    {/* Incomplete Profile Warning Banner */}
                    {!isAnyProfileLoading && percentage < 100 && (
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center" role="alert">
                                    <i className="mdi mdi-alert-circle-outline text-danger me-3 fs-4"></i>
                                    <div className="flex-grow-1">
                                        <strong>{t('index.profileIncomplete')}</strong>
                                        <p className="mb-0 small">
                                            {t('index.profileIncompleteDesc', { percentage })}
                                            {missing.length > 0 && (
                                                <span className="d-block text-muted">
                                                    {t('index.missing')}: {missing.slice(0, 3).join(', ')}{missing.length > 3 && ` ${t('index.more', { count: missing.length - 3 })}`}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <Link href="/candidate/settings" className="btn btn-danger btn-sm ms-3">
                                        <i className="mdi mdi-pencil me-1"></i> {t('common.completeProfile')}
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
                                            {isAnyProfileLoading ? (
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
                                                {isAnyProfileLoading ? (
                                                    <span className="placeholder col-8"></span>
                                                ) : (
                                                    verification?.first_name && verification?.last_name
                                                        ? `${verification.first_name} ${verification.last_name}`
                                                        : t('common.completeProfile')
                                                )}
                                            </h5>
                                            {verification?.occupation && (
                                                <p className="text-muted mb-2">{verification.occupation}</p>
                                            )}
                                            {/* Verification Badge */}
                                            {verification?.status === 'VERIFIED' ? (
                                                <span className="badge bg-success-subtle text-success">
                                                    <i className="mdi mdi-check-circle me-1"></i> {t('common.verified')}
                                                </span>
                                            ) : verification?.status === 'SUBMITTED' ? (
                                                <span className="badge bg-warning-subtle text-warning">
                                                    <i className="mdi mdi-clock-outline me-1"></i> {t('common.underReview')}
                                                </span>
                                            ) : verification?.status === 'REJECTED' ? (
                                                <span className="badge bg-danger-subtle text-danger">
                                                    <i className="mdi mdi-close-circle me-1"></i> {t('common.rejected')}
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary-subtle text-secondary">
                                                    <i className="mdi mdi-alert-circle-outline me-1"></i> {t('common.notVerified')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="col-lg-4 col-md-3 mt-3 mt-md-0">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <small className="text-muted">{t('index.profileCompletion')}</small>
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
                                                    {t('index.missing')}: {missing.slice(0, 2).join(', ')}{missing.length > 2 && ` ${t('index.more', { count: missing.length - 2 })}`}
                                                </small>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-lg-2 col-md-2 text-md-end mt-3 mt-lg-0">
                                            <Link href="/candidate/settings" className="btn btn-primary btn-sm">
                                                <i className="mdi mdi-pencil me-1"></i> {t('common.edit')}
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
                                                    {t('index.availableJobs')}
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
                                                    {t('index.applications')}
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
                                                    {t('index.accepted')}
                                                </h6>
                                                <h4 className="mb-0 fw-bold text-success">{applicationStats.accepted}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-md-3 mb-3">
                            {isAnyProfileLoading ? (
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
                                                    {t('index.cvStatus')}
                                                </h6>
                                                <p className="mb-0 small fw-semibold">
                                                    {verification?.cv_url ? t('common.uploaded') : t('common.notUploaded')}
                                                </p>
                                                {verification?.updated_at && (
                                                    <small className="text-muted">{formatRelativeTime(verification.updated_at, t)}</small>
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
                                            <h6 className="mb-0 fw-semibold">{t('index.yourApplications')}</h6>
                                            <small className="text-muted">{t('index.totalApplications', { count: applications.length })}</small>
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
                                                            <h6 className="mb-0 fw-semibold">{app.job_title || t('index.jobApplication')}</h6>
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
                                                                    <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>{t('index.applied')}</small>
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
                                                                    <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>{t('index.review')}</small>
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
                                                                        {isRejected ? t('common.rejected') : t('index.accepted')}
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
                            <h6 className="mb-0 fw-semibold">{t('index.recentJobs')}</h6>
                            <Link href="/candidate/jobs" className="btn btn-sm btn-outline-primary">
                                {t('common.viewAll')}
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
                                    <h6 className="mt-3">{t('index.failedToLoadJobs')}</h6>
                                    <p className="text-muted small">{t('index.tryAgainLater')}</p>
                                </div>
                            )}

                            {/* Empty */}
                            {!isLoadingJobs && !jobsError && recentJobs.length === 0 && (
                                <div className="text-center py-5">
                                    <i className="mdi mdi-briefcase-remove-outline text-muted" style={{ fontSize: 48 }}></i>
                                    <h6 className="mt-3 text-dark">{t('index.noJobsAvailable')}</h6>
                                    <p className="text-muted small">{t('index.checkBackLater')}</p>
                                </div>
                            )}

                            {/* Jobs */}
                            {!isLoadingJobs && !jobsError && recentJobs.length > 0 && (
                                <div className="row">
                                    {recentJobs.map((job) => (
                                        <JobCard key={job.id} job={job} t={t} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer top={true} />

            {/* Profile Completion Modal */}
            <ProfileCompletionModal
                show={showCompletionModal}
                onClose={handleDismissModal}
                onNavigate={handleNavigateToSettings}
                percentage={detailedCompletion.percentage}
                missingIdentity={detailedCompletion.missingIdentity}
                missingProfessional={detailedCompletion.missingProfessional}
            />
        </>
    )
}
