'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";

import Navbar from "../../../../components/navbarCandidate";
import Footer from "../../../../components/footer";
import ScrollTop from "../../../../components/scrollTop";

import { useCompanyProfile, useCompanyJobs } from "@/hooks/useCompany";
import type { Job } from "@/types/employer";

import { FiMapPin, FiClock, FiDollarSign, FiExternalLink } from "../../../../assets/icons/vander";

// ============================================================================
// Props
// ============================================================================

interface CompanyProfileClientProps {
    companyId: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date for display (e.g., "5 Days ago")
 */
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 Day ago';
    return `${diffDays} Days ago`;
}

/**
 * Format salary for display (e.g., "15k - 25k")
 */
function formatSalary(min: number, max: number): string {
    const formatK = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num;
    return `${formatK(min)} - ${formatK(max)}`;
}

/**
 * Scroll to vacancies section
 */
function scrollToVacancies(): void {
    const element = document.getElementById('vacancies-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================================================
// Skeleton Components
// ============================================================================

function CompanyHeaderSkeleton() {
    return (
        <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-4">
            <div className="d-flex align-items-center">
                <div
                    className="avatar avatar-md-md rounded shadow bg-light"
                    style={{ width: 80, height: 80 }}
                />
                <div className="ms-3">
                    <div className="bg-light rounded" style={{ width: 200, height: 24, marginBottom: 8 }} />
                    <div className="bg-light rounded" style={{ width: 120, height: 16 }} />
                </div>
            </div>
            <div className="mt-4 mt-md-0">
                <div className="bg-light rounded" style={{ width: 140, height: 36 }} />
            </div>
        </div>
    );
}

function ContentSkeleton() {
    return (
        <div className="row g-4">
            <div className="col-lg-8 col-md-7 col-12">
                {/* Story skeleton */}
                <div className="bg-light rounded mb-3" style={{ width: 150, height: 28 }} />
                <div className="bg-light rounded mb-2" style={{ width: '100%', height: 16 }} />
                <div className="bg-light rounded mb-2" style={{ width: '90%', height: 16 }} />
                <div className="bg-light rounded mb-4" style={{ width: '80%', height: 16 }} />

                {/* Vacancies skeleton */}
                <div className="bg-light rounded mb-4 mt-5" style={{ width: 120, height: 28 }} />
                <div className="row g-4">
                    {[1, 2].map((i) => (
                        <div className="col-lg-6 col-12" key={i}>
                            <div className="bg-light rounded" style={{ height: 200 }} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-lg-4 col-md-5 col-12">
                <div className="bg-light rounded" style={{ height: 300 }} />
            </div>
        </div>
    );
}

// ============================================================================
// Job Card Component
// ============================================================================

interface JobCardProps {
    job: Job;
    companyName: string;
    logoUrl: string | null;
}

function JobCard({ job, companyName, logoUrl }: JobCardProps) {
    return (
        <div className="col-lg-6 col-12">
            <div className="job-post rounded shadow bg-white">
                <div className="p-4">
                    <Link href={`/candidate/jobs/${job.id}`} className="text-dark title h5">
                        {job.title}
                    </Link>

                    <p className="text-muted d-flex align-items-center small mt-3">
                        <FiClock className="fea icon-sm text-primary me-1" />
                        Posted {formatDate(job.created_at)}
                    </p>

                    <ul className="list-unstyled d-flex justify-content-between align-items-center mb-0 mt-3">
                        <li className="list-inline-item">
                            <span className="badge bg-soft-primary">{job.employment_type || 'Full Time'}</span>
                        </li>
                        <li className="list-inline-item">
                            <span className="text-muted d-flex align-items-center small">
                                <FiDollarSign className="fea icon-sm text-primary me-1" />
                                {formatSalary(job.salary_min, job.salary_max)}/mo
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="d-flex align-items-center p-4 border-top">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            width={65}
                            height={65}
                            className="avatar avatar-small rounded shadow p-2 bg-white"
                            alt={companyName}
                        />
                    ) : (
                        <div
                            className="avatar avatar-small rounded shadow bg-light d-flex align-items-center justify-content-center p-2"
                            style={{ width: 65, height: 65 }}
                        >
                            <span className="h6 text-muted mb-0">
                                {companyName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}

                    <div className="ms-3">
                        <h6>{companyName}</h6>
                        {job.location && (
                            <span className="text-muted d-flex align-items-center">
                                <FiMapPin className="fea icon-sm me-1" />{job.location}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Gallery Component
// ============================================================================

interface GalleryProps {
    images: string[];
}

function Gallery({ images }: GalleryProps) {
    if (images.length === 0) return null;

    // Single image: full width
    if (images.length === 1) {
        return (
            <div className="row g-4 mt-4">
                <div className="col-12">
                    <Image
                        src={images[0]}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }}
                        className="rounded shadow img-fluid"
                        alt="Company gallery"
                    />
                </div>
            </div>
        );
    }

    // Two images: side by side
    if (images.length === 2) {
        return (
            <div className="row g-4 mt-4">
                {images.map((img, idx) => (
                    <div className="col-6" key={idx}>
                        <Image
                            src={img}
                            width={0}
                            height={0}
                            sizes="50vw"
                            style={{ width: '100%', height: 'auto' }}
                            className="rounded shadow img-fluid"
                            alt={`Company gallery ${idx + 1}`}
                        />
                    </div>
                ))}
            </div>
        );
    }

    // Three images: one large on top, two smaller below
    return (
        <div className="row g-4 mt-4">
            <div className="col-12">
                <Image
                    src={images[0]}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="rounded shadow img-fluid"
                    alt="Company gallery 1"
                />
            </div>
            <div className="col-6">
                <Image
                    src={images[1]}
                    width={0}
                    height={0}
                    sizes="50vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="rounded shadow img-fluid"
                    alt="Company gallery 2"
                />
            </div>
            <div className="col-6">
                <Image
                    src={images[2]}
                    width={0}
                    height={0}
                    sizes="50vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="rounded shadow img-fluid"
                    alt="Company gallery 3"
                />
            </div>
        </div>
    );
}

// ============================================================================
// Main Client Component
// ============================================================================

export default function CompanyProfileClient({ companyId }: CompanyProfileClientProps) {
    const id = parseInt(companyId);

    const {
        data: profile,
        isLoading: isProfileLoading,
        error: profileError
    } = useCompanyProfile(id);

    const {
        data: jobs = [],
        isLoading: isJobsLoading
    } = useCompanyJobs(id);

    const isLoading = isProfileLoading || isJobsLoading;

    // Loading state with skeleton
    if (isLoading) {
        return (
            <>
                <Navbar navClass="defaultscroll sticky" navLight={true} />
                <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg4.jpg')", backgroundPosition: 'center' }}>
                    <div className="bg-overlay bg-gradient-overlay-2"></div>
                </section>
                <div className="position-relative">
                    <div className="shape overflow-hidden text-white">
                        <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                        </svg>
                    </div>
                </div>
                <section className="section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 mt-4">
                                <div className="features-absolute">
                                    <CompanyHeaderSkeleton />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <ContentSkeleton />
                    </div>
                </section>
                <Footer top={true} />
            </>
        );
    }

    // Error state
    if (profileError || !profile) {
        return (
            <>
                <Navbar navClass="defaultscroll sticky" navLight={true} />
                <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg4.jpg')", backgroundPosition: 'center' }}>
                    <div className="bg-overlay bg-gradient-overlay-2"></div>
                </section>
                <div className="container py-5">
                    <div className="text-center" style={{ minHeight: '300px' }}>
                        <h4 className="text-muted">Company not found</h4>
                        <p className="text-muted">The company you are looking for does not exist or has been removed.</p>
                        <Link href="/candidate/jobs" className="btn btn-primary mt-4">Browse Jobs</Link>
                    </div>
                </div>
                <Footer top={true} />
            </>
        );
    }

    const hasCompanyStory = profile.company_story && profile.company_story.trim() !== '';

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg4.jpg')", backgroundPosition: 'center' }}>
                <div className="bg-overlay bg-gradient-overlay-2"></div>
            </section>
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 mt-4">
                            <div className="features-absolute">
                                {/* Company Header */}
                                <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-4">
                                    <div className="d-flex align-items-center">
                                        {profile.logo_url ? (
                                            <Image
                                                src={profile.logo_url}
                                                width={80}
                                                height={80}
                                                className="avatar avatar-md-md rounded shadow p-3 bg-white"
                                                alt={profile.company_name}
                                                style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                            />
                                        ) : (
                                            <div
                                                className="avatar avatar-md-md rounded shadow bg-light d-flex align-items-center justify-content-center"
                                                style={{ width: 80, height: 80 }}
                                            >
                                                <span className="h4 text-muted mb-0">
                                                    {profile.company_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}

                                        <div className="ms-3">
                                            <h5>{profile.company_name}</h5>
                                            {profile.location && (
                                                <span className="text-muted d-flex align-items-center">
                                                    <FiMapPin className="fea icon-sm me-1" />{profile.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 mt-md-0">
                                        <button
                                            onClick={scrollToVacancies}
                                            className="btn btn-sm btn-primary"
                                        >
                                            View Open Positions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row g-4">
                        {/* Main Content Column */}
                        <div className="col-lg-8 col-md-7 col-12">
                            {/* Company Story */}
                            {hasCompanyStory && (
                                <>
                                    <h4 className="mb-4">Company Story:</h4>
                                    <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                        {profile.company_story}
                                    </div>
                                </>
                            )}

                            {/* Gallery - rendered via transformed data */}
                            <Gallery images={profile.galleryImages} />

                            {/* Vacancies */}
                            <h4 className="my-4" id="vacancies-section">Vacancies:</h4>
                            {jobs.length > 0 ? (
                                <div className="row g-4">
                                    {jobs.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            companyName={profile.company_name}
                                            logoUrl={profile.logo_url}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 bg-light rounded">
                                    <p className="text-muted mb-0">This company currently has no open positions</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Company Details (Conditional based on details_hidden) */}
                        <div className="col-lg-4 col-md-5 col-12">
                            {!profile.details_hidden && (
                                <div className="card bg-white p-4 rounded shadow sticky-bar">
                                    <h5 className="mb-3">Company Details</h5>

                                    {profile.founded && (
                                        <div className="d-flex align-items-center justify-content-between mt-2">
                                            <span className="text-muted fw-medium">Founded:</span>
                                            <span>{profile.founded}</span>
                                        </div>
                                    )}

                                    {profile.founder && (
                                        <div className="d-flex align-items-center justify-content-between mt-2">
                                            <span className="text-muted fw-medium">Founder:</span>
                                            <span>{profile.founder}</span>
                                        </div>
                                    )}

                                    {profile.headquarters && (
                                        <div className="d-flex align-items-center justify-content-between mt-2">
                                            <span className="text-muted fw-medium">Headquarters:</span>
                                            <span>{profile.headquarters}</span>
                                        </div>
                                    )}

                                    {profile.employee_count && (
                                        <div className="d-flex align-items-center justify-content-between mt-2">
                                            <span className="text-muted fw-medium">Employees:</span>
                                            <span>{profile.employee_count}</span>
                                        </div>
                                    )}

                                    {profile.website && (
                                        <div className="d-flex align-items-center justify-content-between mt-2">
                                            <span className="text-muted fw-medium">Website:</span>
                                            <a
                                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary d-flex align-items-center"
                                            >
                                                {profile.website.replace(/^https?:\/\//, '')}
                                                <FiExternalLink className="fea icon-sm ms-1" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer top={true} />
            <ScrollTop />
        </>
    );
}
