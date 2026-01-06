'use client';

/**
 * Public Jobs Listing Page
 * 
 * Displays all active jobs for public access (no authentication required).
 * This page is optimized for SEO and user acquisition.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import { useActiveJobs } from '@/hooks/useDiscovery';
import type { JobWithCompany } from '@/types/employer';
import { FiClock, FiMapPin, FiDollarSign, FiBriefcase, FiSearch } from 'react-icons/fi';

// Helper to format salary
function formatSalary(min: number, max: number): string {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
}

// Helper to format date
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Job Card Component
function JobCard({ job }: { job: JobWithCompany }) {
    return (
        <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
            <div className="job-post rounded shadow bg-white h-100">
                <div className="p-4">
                    <Link href={`/jobs/${job.id}`} className="text-dark title h5">
                        {job.title}
                    </Link>

                    <p className="text-muted d-flex align-items-center small mt-3 mb-2">
                        <FiClock className="fea icon-sm text-primary me-1" />
                        Posted {formatDate(job.created_at)}
                    </p>

                    <ul className="list-unstyled mb-0">
                        {job.employment_type && (
                            <li className="mb-2">
                                <span className="badge bg-soft-primary">{job.employment_type}</span>
                            </li>
                        )}
                        <li>
                            <span className="text-muted d-flex align-items-center small">
                                <FiDollarSign className="fea icon-sm text-primary me-1" />
                                {formatSalary(job.salary_min, job.salary_max)}
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="d-flex align-items-center p-4 border-top">
                    {job.company_logo_url ? (
                        <Image
                            src={job.company_logo_url}
                            width={50}
                            height={50}
                            className="avatar avatar-small rounded shadow p-2 bg-white"
                            alt={job.company_name}
                            unoptimized
                        />
                    ) : (
                        <div
                            className="avatar avatar-small rounded shadow p-2 bg-white d-flex align-items-center justify-content-center"
                            style={{ width: 50, height: 50 }}
                        >
                            <i className="mdi mdi-domain text-primary" style={{ fontSize: 24 }}></i>
                        </div>
                    )}

                    <div className="ms-3">
                        <span className="h6 company text-dark d-block mb-0">
                            {job.company_name}
                        </span>
                        <span className="text-muted d-flex align-items-center small">
                            <FiMapPin className="fea icon-sm me-1" />{job.location}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading skeleton
function JobCardSkeleton() {
    return (
        <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
            <div className="job-post rounded shadow bg-white h-100">
                <div className="p-4 placeholder-glow">
                    <div className="placeholder col-8 mb-3" style={{ height: 20 }}></div>
                    <div className="placeholder col-5 mb-2"></div>
                    <div className="d-flex justify-content-between mt-3">
                        <div className="placeholder col-3"></div>
                        <div className="placeholder col-4"></div>
                    </div>
                </div>
                <div className="d-flex align-items-center p-4 border-top placeholder-glow">
                    <div className="avatar avatar-small rounded bg-secondary placeholder" style={{ width: 50, height: 50 }}></div>
                    <div className="ms-3 flex-1">
                        <div className="placeholder col-6 mb-2"></div>
                        <div className="placeholder col-4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PublicJobsPage() {
    const { data, isLoading, error } = useActiveJobs(50); // Fetch more for listing page

    // Filter only active jobs
    const jobs = React.useMemo(() => {
        if (!data?.jobs) return [];
        return data.jobs.filter(job => job.company_status === 'active');
    }, [data]);

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            {/* Hero Section */}
            <section
                className="bg-half-170 d-table w-100"
                style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}
            >
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h1 className="heading fw-bold text-white mb-3">
                                    Find Your Dream Job
                                </h1>
                                <p className="text-white-50 mb-0 mx-auto" style={{ maxWidth: '600px' }}>
                                    Discover high-paying opportunities for Ex-Kenshusei and Japan-trained talent in Indonesia
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item">
                                    <Link href="/">J Expert</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Jobs
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>

            {/* Shape Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Jobs Listing Section */}
            <section className="section">
                <div className="container">
                    {/* Results Header */}
                    <div className="row justify-content-between align-items-center mb-4">
                        <div className="col-12 col-md-6">
                            <h4 className="mb-0">
                                {!isLoading && !error && (
                                    <span>{jobs.length} Jobs Available</span>
                                )}
                            </h4>
                        </div>
                    </div>

                    <div className="row">
                        {/* Loading State */}
                        {isLoading && (
                            <>
                                <JobCardSkeleton />
                                <JobCardSkeleton />
                                <JobCardSkeleton />
                                <JobCardSkeleton />
                                <JobCardSkeleton />
                                <JobCardSkeleton />
                            </>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="col-12">
                                <div className="alert alert-warning text-center">
                                    <i className="mdi mdi-alert-circle me-2"></i>
                                    Unable to load jobs. Please try again later.
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && jobs.length === 0 && (
                            <div className="col-12">
                                <div className="text-center py-5">
                                    <FiBriefcase className="text-muted mb-3" style={{ fontSize: 48 }} />
                                    <h5 className="text-muted">No jobs available</h5>
                                    <p className="text-muted">Check back later for new opportunities!</p>
                                </div>
                            </div>
                        )}

                        {/* Jobs Grid */}
                        {!isLoading && !error && jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>

                    {/* CTA for Candidates */}
                    {!isLoading && !error && jobs.length > 0 && (
                        <div className="row mt-5">
                            <div className="col-12 text-center">
                                <div className="card border-0 shadow rounded p-4 bg-primary">
                                    <h4 className="text-white mb-3">Ready to Apply?</h4>
                                    <p className="text-white-50 mb-4">
                                        Create an account to start applying to jobs and track your applications.
                                    </p>
                                    <div>
                                        <Link href="/register" className="btn btn-light me-2">
                                            Create Account
                                        </Link>
                                        <Link href="/login" className="btn btn-outline-light">
                                            Sign In
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer top={undefined} />
            <ScrollTop />
        </>
    );
}
