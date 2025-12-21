'use client';

/**
 * AvailableJobsSection Component
 *
 * Displays the latest active jobs for candidates to discover.
 * Shows job cards with title, company, location, and salary.
 * Includes loading, error, and empty states.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useActiveJobs } from '@/hooks/useDiscovery';
import type { JobWithCompany } from '@/types/employer';
import { FiClock, FiMapPin, FiDollarSign, FiBriefcase, FiArrowRight } from 'react-icons/fi';

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
        <div className="col-lg-4 col-md-6 col-12">
            <div className="job-post rounded shadow bg-white h-100">
                <div className="p-4">
                    <Link href={`/candidate/jobs/${job.id}`} className="text-dark title h5">
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
        <div className="col-lg-4 col-md-6 col-12">
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

export default function AvailableJobsSection() {
    const { data, isLoading, error } = useActiveJobs(12);

    // Filter only active jobs
    const jobs = React.useMemo(() => {
        if (!data?.jobs) return [];
        return data.jobs.filter(job => job.company_status === 'active').slice(0, 12);
    }, [data]);

    return (
        <div className="container">
            <div className="row justify-content-center mb-4">
                <div className="col-12 text-center">
                    <h4 className="title mb-3">Available Jobs</h4>
                    <p className="text-muted para-desc mx-auto mb-0">
                        Latest job opportunities from verified employers
                    </p>
                </div>
            </div>

            <div className="row g-4">
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

            {/* View All Button */}
            {!isLoading && !error && jobs.length > 0 && (
                <div className="row mt-4">
                    <div className="col-12 text-center">
                        <Link href="/candidate/jobs" className="btn btn-primary">
                            View All Jobs <FiArrowRight className="ms-1" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
