'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";

import NavbarDark from "../../../components/navbarCandidate";
import Footer from "../../../components/footer";
import ScrollTop from "../../../components/scrollTop";

import { useCandidateProfile, useRecommendedJobs } from "@/hooks/useCandidate";
import type { JapanWorkExperience, VerificationStatus } from "@/types/candidate";
import { formatExperienceDuration, formatDateRange } from "@/types/candidate";
import type { Job } from "@/types/employer";

import {
    FiMail,
    FiPhone,
    FiGlobe,
    FiBriefcase,
    FiClock,
    FiFileText,
    FiMapPin,
    FiAlertCircle,
    FiExternalLink,
    FiAward,
    FiDownload,
    FiCheckCircle,
    FiCalendar,
} from "../../../assets/icons/vander";

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_AVATAR = "/images/team/01.jpg";
const DEFAULT_COVER = "/images/hero/bg5.jpg";

// ============================================================================
// Loading Skeleton Components
// ============================================================================

function ProfileHeaderSkeleton() {
    return (
        <div className="position-relative">
            <div className="candidate-cover">
                <div className="bg-secondary" style={{ width: '100%', height: '250px' }} />
            </div>
            <div className="candidate-profile d-flex align-items-end justify-content-between mx-2">
                <div className="d-flex align-items-end">
                    <div className="rounded-pill bg-secondary" style={{ width: 110, height: 110 }} />
                    <div className="ms-2 placeholder-glow">
                        <div className="placeholder col-6 mb-2" style={{ width: 150, height: 20 }} />
                        <div className="placeholder col-4" style={{ width: 100, height: 16 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContentSkeleton() {
    return (
        <div className="placeholder-glow">
            <div className="placeholder col-12 mb-2" style={{ height: 20 }} />
            <div className="placeholder col-10 mb-2" style={{ height: 20 }} />
            <div className="placeholder col-8" style={{ height: 20 }} />
        </div>
    );
}

function SidebarSkeleton() {
    return (
        <div className="card bg-light p-4 rounded shadow sticky-bar">
            <div className="placeholder-glow">
                <div className="placeholder col-6 mb-3" style={{ height: 24 }} />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="d-flex justify-content-between mt-3">
                        <div className="placeholder col-4" style={{ height: 16 }} />
                        <div className="placeholder col-5" style={{ height: 16 }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function JobCardSkeleton() {
    return (
        <div className="col-lg-6 col-md-6 col-12 mt-4 pt-2">
            <div className="job-post rounded shadow p-4 placeholder-glow">
                <div className="d-flex align-items-center">
                    <div className="bg-secondary rounded" style={{ width: 65, height: 65 }} />
                    <div className="ms-3 flex-1">
                        <div className="placeholder col-8 mb-2" style={{ height: 20 }} />
                        <div className="placeholder col-4" style={{ height: 16 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Status Banner Components
// ============================================================================

interface StatusBannerProps {
    status: VerificationStatus | undefined;
}

function StatusBanner({ status }: StatusBannerProps) {
    if (!status) return null;

    switch (status) {
        case 'SUBMITTED':
            return (
                <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                    <FiClock className="me-2" />
                    <span>Your profile is currently <strong>under review</strong>. We will notify you once it has been verified.</span>
                </div>
            );
        case 'REJECTED':
            return (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <FiAlertCircle className="me-2" />
                    <span>Your profile verification was <strong>rejected</strong>. Please update your information and resubmit.</span>
                </div>
            );
        case 'PENDING':
            return (
                <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                    <FiAlertCircle className="me-2" />
                    <span>Your profile is <strong>incomplete</strong>. Please <Link href="/candidate/settings">complete your profile</Link> to submit for verification.</span>
                </div>
            );
        default:
            return null; // VERIFIED - show normally
    }
}

// ============================================================================
// Profile Not Found / Empty States
// ============================================================================

function ProfileNotFound() {
    return (
        <div className="text-center py-5">
            <FiAlertCircle className="fea icon-lg text-muted mb-3" />
            <h5>Profile Not Found</h5>
            <p className="text-muted">Your profile data could not be found. Please complete your profile setup.</p>
            <Link href="/candidate/settings" className="btn btn-primary mt-3">
                Complete Profile
            </Link>
        </div>
    );
}

function ProfileNotCompleted() {
    return (
        <div className="text-center py-5">
            <FiBriefcase className="fea icon-lg text-muted mb-3" />
            <h5>Profile Not Completed</h5>
            <p className="text-muted">You haven&apos;t completed your profile yet. Please fill in your details to be visible to employers.</p>
            <Link href="/candidate/settings" className="btn btn-primary mt-3">
                Complete Profile
            </Link>
        </div>
    );
}

function ErrorState({ message }: { message?: string }) {
    return (
        <div className="text-center py-5">
            <FiAlertCircle className="fea icon-lg text-danger mb-3" />
            <h5>Error Loading Profile</h5>
            <p className="text-muted">{message || 'Failed to load profile data. Please try again later.'}</p>
        </div>
    );
}

// ============================================================================
// Experience Section
// ============================================================================

interface ExperienceItemProps {
    experience: JapanWorkExperience;
}

function ExperienceItem({ experience, isLast }: ExperienceItemProps & { isLast?: boolean }) {
    return (
        <div className="position-relative ps-4 pb-4" style={{ borderLeft: isLast ? 'none' : '2px solid #e9ecef' }}>
            {/* Timeline dot */}
            <div
                className="position-absolute bg-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{
                    width: 12,
                    height: 12,
                    left: -7,
                    top: 6,
                    border: '2px solid #fff',
                    boxShadow: '0 0 0 3px rgba(47, 85, 212, 0.2)',
                }}
            />

            {/* Experience Card */}
            <div className="card border-0 shadow-sm ms-2">
                <div className="card-body p-3">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h6 className="mb-1 text-dark fw-semibold">{experience.job_title}</h6>
                            <p className="mb-0 text-primary fw-medium">{experience.company_name}</p>
                        </div>
                        <span className="badge bg-soft-primary text-primary rounded-pill px-3 py-2">
                            <FiCalendar className="me-1" style={{ fontSize: 11 }} />
                            {formatDateRange(experience.start_date, experience.end_date)}
                        </span>
                    </div>

                    {/* Description */}
                    {experience.description && (
                        <p className="text-muted mb-0 mt-2 small" style={{ lineHeight: 1.6 }}>
                            {experience.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function ExperienceSection({ experiences }: { experiences: JapanWorkExperience[] }) {
    // Sort by start_date descending (most recent first)
    const sortedExperiences = [...experiences].sort((a, b) => {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    });

    return (
        <div className="mt-4">
            <div className="d-flex align-items-center mb-4">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                    <FiBriefcase className="text-white" style={{ fontSize: 18 }} />
                </div>
                <div>
                    <h5 className="mb-0">Japan Work Experience</h5>
                    <small className="text-muted">{sortedExperiences.length} position{sortedExperiences.length !== 1 ? 's' : ''}</small>
                </div>
            </div>

            {sortedExperiences.length === 0 ? (
                <div className="card border-0 bg-light">
                    <div className="card-body text-center py-4">
                        <FiBriefcase className="text-muted mb-2" style={{ fontSize: 32 }} />
                        <p className="text-muted mb-0">No Japan work experience provided</p>
                    </div>
                </div>
            ) : (
                <div className="ps-2">
                    {sortedExperiences.map((exp, index) => (
                        <ExperienceItem
                            key={exp.id || index}
                            experience={exp}
                            isLast={index === sortedExperiences.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Job Card Component
// ============================================================================

function JobCard({ job }: { job: Job }) {
    return (
        <div className="col-lg-6 col-md-6 col-12 mt-4 pt-2">
            <div className="job-post rounded shadow p-4">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <Image
                            src="/images/company/circle-logo.png"
                            width={65}
                            height={65}
                            className="avatar avatar-small rounded shadow p-3 bg-white"
                            alt=""
                        />
                        <div className="ms-3">
                            <Link href={`/candidate/jobs/${job.id}`} className="h5 title text-dark">
                                {job.title}
                            </Link>
                        </div>
                    </div>
                    {job.employment_type && (
                        <span className="badge bg-soft-primary rounded-pill">{job.employment_type}</span>
                    )}
                </div>
                <div className="mt-2">
                    <span className="text-muted d-block">
                        <FiMapPin className="fea icon-sm me-1" /> {job.location}
                    </span>
                </div>
                <div className="mt-3">
                    <Link href={`/candidate/jobs/${job.id}`} className="btn btn-sm btn-primary">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Recommended Jobs Section
// ============================================================================

function RecommendedJobsSection() {
    const { data, isLoading, error } = useRecommendedJobs(3);

    // Filter only active jobs from active companies
    const activeJobs = React.useMemo(() => {
        if (!data?.jobs) return [];
        return data.jobs.filter(job => job.company_status === 'active').slice(0, 3);
    }, [data]);

    return (
        <div className="container mt-100 mt-60">
            <div className="row justify-content-center mb-4 pb-2">
                <div className="col-12">
                    <div className="section-title text-center">
                        <h4 className="title mb-3">Recommended Jobs</h4>
                        <p className="text-muted para-desc mx-auto mb-0">
                            Explore available job opportunities that match your profile.
                        </p>
                    </div>
                </div>
            </div>

            <div className="row">
                {isLoading && (
                    <>
                        <JobCardSkeleton />
                        <JobCardSkeleton />
                        <JobCardSkeleton />
                    </>
                )}

                {error && (
                    <div className="col-12">
                        <p className="text-muted text-center">Unable to load job recommendations.</p>
                    </div>
                )}

                {!isLoading && !error && activeJobs.length === 0 && (
                    <div className="col-12">
                        <p className="text-muted text-center fst-italic">No job recommendations available at the moment.</p>
                    </div>
                )}

                {!isLoading && !error && activeJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {activeJobs.length > 0 && (
                <div className="mt-4 text-center">
                    <Link href="/candidate/jobs" className="btn btn-primary">
                        See All Jobs
                    </Link>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Sidebar Component
// ============================================================================

interface SidebarProps {
    email?: string;
    phone?: string;
    website?: string;
    japanExperienceDuration?: number;
    japaneseCertificateUrl?: string;
    japaneseLevel?: string;
    verificationStatus?: VerificationStatus;
    cvUrl?: string;
}

function PersonalDetailSidebar({
    email,
    phone,
    website,
    japanExperienceDuration,
    japaneseCertificateUrl,
    japaneseLevel,
    verificationStatus,
    cvUrl,
}: SidebarProps) {
    // Helper to get status badge styling
    const getStatusBadge = (status?: VerificationStatus) => {
        switch (status) {
            case 'VERIFIED':
                return { bg: 'bg-success', text: 'Verified', icon: FiCheckCircle };
            case 'SUBMITTED':
                return { bg: 'bg-info', text: 'Under Review', icon: FiClock };
            case 'REJECTED':
                return { bg: 'bg-danger', text: 'Rejected', icon: FiAlertCircle };
            case 'PENDING':
            default:
                return { bg: 'bg-warning', text: 'Pending', icon: FiAlertCircle };
        }
    };

    const statusInfo = getStatusBadge(verificationStatus);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="card bg-light p-4 rounded shadow sticky-bar">
            <h5 className="mb-0">Personal Detail:</h5>
            <div className="mt-3">
                {/* Verification Status */}
                <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="d-inline-flex align-items-center text-muted fw-medium">
                        <FiCheckCircle className="fea icon-sm me-2" /> Status:
                    </span>
                    <span className={`badge ${statusInfo.bg} d-inline-flex align-items-center`}>
                        <StatusIcon className="me-1" style={{ fontSize: 11 }} />
                        {statusInfo.text}
                    </span>
                </div>

                {email && (
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <span className="d-inline-flex align-items-center text-muted fw-medium">
                            <FiMail className="fea icon-sm me-2" /> Email:
                        </span>
                        <span className="fw-medium" style={{ fontSize: 13, wordBreak: 'break-all' }}>{email}</span>
                    </div>
                )}

                {phone && (
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <span className="d-inline-flex align-items-center text-muted fw-medium">
                            <FiPhone className="fea icon-sm me-2" /> Phone:
                        </span>
                        <span className="fw-medium">{phone}</span>
                    </div>
                )}

                {website && (
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <span className="d-inline-flex align-items-center text-muted fw-medium">
                            <FiGlobe className="fea icon-sm me-2" /> Website:
                        </span>
                        <a href={website} target="_blank" rel="noopener noreferrer" className="fw-medium text-primary">
                            Visit <FiExternalLink className="ms-1" style={{ fontSize: 12 }} />
                        </a>
                    </div>
                )}

                {japanExperienceDuration !== undefined && japanExperienceDuration > 0 && (
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <span className="d-inline-flex align-items-center text-muted fw-medium">
                            <FiBriefcase className="fea icon-sm me-2" /> Japan Exp:
                        </span>
                        <span className="fw-medium">{formatExperienceDuration(japanExperienceDuration)}</span>
                    </div>
                )}

                {/* Japanese Language Level */}
                {japaneseLevel && (
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <span className="d-inline-flex align-items-center text-muted fw-medium">
                            <FiAward className="fea icon-sm me-2" /> Japanese:
                        </span>
                        <span className="badge bg-soft-primary text-primary px-3">{japaneseLevel}</span>
                    </div>
                )}

                {/* Japanese Certificate */}
                {japaneseCertificateUrl && (
                    <div className="p-3 rounded shadow bg-white mt-4">
                        <div className="d-flex align-items-center mb-2">
                            <FiFileText className="fea icon-md text-primary" />
                            <h6 className="mb-0 ms-2">JLPT Certificate</h6>
                        </div>
                        <a
                            href={japaneseCertificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm w-100"
                        >
                            <FiExternalLink className="fea icon-sm me-1" /> View Certificate
                        </a>
                    </div>
                )}

                {/* CV Download */}
                {cvUrl && (
                    <div className="p-3 rounded shadow bg-white mt-3">
                        <div className="d-flex align-items-center mb-2">
                            <FiFileText className="fea icon-md text-success" />
                            <h6 className="mb-0 ms-2">CV / Resume</h6>
                        </div>
                        <a
                            href={cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm w-100"
                        >
                            <FiDownload className="fea icon-sm me-1" /> View CV
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CandidateProfile() {
    const { data: profileData, isLoading, error } = useCandidateProfile();

    // Loading state
    if (isLoading) {
        return (
            <>
                <NavbarDark navClass="defaultscroll sticky" navLight={false} />
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <ProfileHeaderSkeleton />
                            </div>
                        </div>
                    </div>
                    <div className="container mt-4">
                        <div className="row g-4">
                            <div className="col-lg-8 col-md-7 col-12">
                                <ContentSkeleton />
                            </div>
                            <div className="col-lg-4 col-md-5 col-12">
                                <SidebarSkeleton />
                            </div>
                        </div>
                    </div>
                </section>
                <Footer top={true} />
                <ScrollTop />
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <NavbarDark navClass="defaultscroll sticky" navLight={false} />
                <section className="section">
                    <div className="container">
                        <ErrorState message={error.message} />
                    </div>
                </section>
                <Footer top={true} />
                <ScrollTop />
            </>
        );
    }

    // Profile not found
    if (!profileData) {
        return (
            <>
                <NavbarDark navClass="defaultscroll sticky" navLight={false} />
                <section className="section">
                    <div className="container">
                        <ProfileNotFound />
                    </div>
                </section>
                <Footer top={true} />
                <ScrollTop />
            </>
        );
    }

    const { verification, experiences, email } = profileData;

    // Profile incomplete (PENDING status without data)
    if (!verification || (verification.status === 'PENDING' && !verification.first_name)) {
        return (
            <>
                <NavbarDark navClass="defaultscroll sticky" navLight={false} />
                <section className="section">
                    <div className="container">
                        <ProfileNotCompleted />
                    </div>
                </section>
                <Footer top={true} />
                <ScrollTop />
            </>
        );
    }

    const fullName = `${verification.first_name || ''} ${verification.last_name || ''}`.trim() || 'Candidate';
    const profilePicture = verification.profile_picture_url || DEFAULT_AVATAR;

    return (
        <>
            <NavbarDark navClass="defaultscroll sticky" navLight={false} />
            <section className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="position-relative">
                                <div className="candidate-cover">
                                    <Image
                                        src={DEFAULT_COVER}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                                        className="img-fluid rounded shadow"
                                        alt=""
                                    />
                                </div>
                                <div className="candidate-profile d-flex align-items-end justify-content-between mx-2">
                                    <div className="d-flex align-items-end">
                                        <Image
                                            src={profilePicture}
                                            width={110}
                                            height={110}
                                            className="rounded-pill shadow border border-3 avatar avatar-medium"
                                            alt={fullName}
                                            style={{ objectFit: 'cover' }}
                                        />

                                        <div className="ms-2">
                                            <h5 className="mb-0">{fullName}</h5>
                                            {verification.occupation && (
                                                <p className="text-muted mb-0">{verification.occupation}</p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Settings button removed - read-only page */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mt-4">
                    {/* Status Banner */}
                    <StatusBanner status={verification.status} />

                    <div className="row g-4">
                        <div className="col-lg-8 col-md-7 col-12">
                            {/* Introduction Section */}
                            {verification.intro && (
                                <>
                                    <h5 className="mb-4">Introduction:</h5>
                                    <p className="text-muted">{verification.intro}</p>
                                </>
                            )}

                            {/* Japan Work Experience Section */}
                            <ExperienceSection experiences={experiences || []} />
                        </div>

                        <div className="col-lg-4 col-md-5 col-12">
                            <PersonalDetailSidebar
                                email={email}
                                phone={verification.phone}
                                website={verification.website_url}
                                japanExperienceDuration={verification.japan_experience_duration}
                                japaneseCertificateUrl={verification.japanese_certificate_url}
                                japaneseLevel={verification.japanese_level}
                                verificationStatus={verification.status}
                                cvUrl={verification.cv_url}
                            />
                        </div>
                    </div>
                </div>

                {/* Recommended Jobs Section */}
                <RecommendedJobsSection />
            </section>
            <Footer top={true} />
            <ScrollTop />
        </>
    );
}
