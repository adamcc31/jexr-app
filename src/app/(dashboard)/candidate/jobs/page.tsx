'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/navbarCandidate";
import ScrollTop from "../../../components/scrollTop";
import Footer from "../../../components/footer";
import JobFilterSidebar, { JobFilters, initialFilters, countActiveFilters } from "@/components/jobs/JobFilterSidebar";

import { useJobs } from "@/hooks/useJobs";
import type { JobWithCompany } from "@/types/employer";
import { FiClock, FiMapPin, FiBriefcase, FiMonitor, FiAward, FiDollarSign } from "react-icons/fi";

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

// Enhanced Job Card Component
function JobCard({ job }: { job: JobWithCompany }) {
    return (
        <div className="col-lg-6 col-12">
            <div className="job-post rounded shadow bg-white overflow-hidden transition-all" style={{ transition: 'all 0.2s ease' }}>
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <Link href={`/candidate/jobs/${job.id}`} className="text-dark title h5 d-block mb-2 text-decoration-none">
                                {job.title}
                            </Link>
                            <p className="text-muted d-flex align-items-center small mb-0">
                                <FiClock className="fea icon-sm text-primary me-1" />
                                Posted {formatDate(job.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Badges Row */}
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {job.employment_type && (
                            <span className="badge bg-soft-primary">
                                <FiBriefcase className="me-1" style={{ fontSize: 10 }} />
                                {job.employment_type}
                            </span>
                        )}
                        {job.job_type && (
                            <span className="badge bg-soft-info">
                                <FiMonitor className="me-1" style={{ fontSize: 10 }} />
                                {job.job_type}
                            </span>
                        )}
                        {job.experience_level && (
                            <span className="badge bg-soft-warning">
                                <FiAward className="me-1" style={{ fontSize: 10 }} />
                                {job.experience_level}
                            </span>
                        )}
                    </div>

                    {/* Salary */}
                    <div className="mt-3">
                        <span className="text-muted d-flex align-items-center small">
                            <FiDollarSign className="fea icon-sm text-primary me-1" />
                            {formatSalary(job.salary_min, job.salary_max)}
                        </span>
                    </div>
                </div>

                {/* Company Section */}
                <div className="d-flex align-items-center p-4 border-top bg-light">
                    {job.company_logo_url ? (
                        <Image
                            src={job.company_logo_url}
                            width={65}
                            height={65}
                            className="avatar avatar-small rounded shadow p-2 bg-white"
                            alt={job.company_name}
                            unoptimized
                        />
                    ) : (
                        <div className="avatar avatar-small rounded shadow p-3 bg-white d-flex align-items-center justify-content-center" style={{ width: 65, height: 65 }}>
                            <i className="mdi mdi-domain text-primary" style={{ fontSize: 28 }}></i>
                        </div>
                    )}

                    <div className="ms-3 flex-grow-1">
                        <Link href={`/candidate/companies/${job.company_id}`} className="h6 company text-dark mb-0 text-decoration-none">
                            {job.company_name}
                        </Link>
                        <span className="text-muted d-flex align-items-center mt-1 small">
                            <FiMapPin className="fea icon-sm me-1" />{job.location}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-column gap-2 ms-auto" style={{ minWidth: '120px' }}>
                        <Link
                            href={`/candidate/jobs/${job.id}/apply`}
                            className="btn btn-sm btn-primary w-100 py-1"
                            style={{ fontSize: '11px' }}
                        >
                            APPLY NOW
                        </Link>
                        <Link
                            href={`/candidate/jobs/${job.id}`}
                            className="btn btn-sm btn-soft-primary w-100 py-1"
                            style={{ fontSize: '11px' }}
                        >
                            SEE DETAILS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading skeleton
function JobCardSkeleton() {
    return (
        <div className="col-lg-6 col-12">
            <div className="job-post rounded shadow bg-white">
                <div className="p-4 placeholder-glow">
                    <div className="placeholder col-8 mb-3" style={{ height: 24 }}></div>
                    <div className="placeholder col-5 mb-2"></div>
                    <div className="d-flex gap-2 mt-3">
                        <div className="placeholder col-2" style={{ height: 24 }}></div>
                        <div className="placeholder col-2" style={{ height: 24 }}></div>
                    </div>
                    <div className="placeholder col-4 mt-3"></div>
                </div>
                <div className="d-flex align-items-center p-4 border-top placeholder-glow">
                    <div className="avatar avatar-small rounded bg-secondary placeholder" style={{ width: 65, height: 65 }}></div>
                    <div className="ms-3 flex-1">
                        <div className="placeholder col-6 mb-2"></div>
                        <div className="placeholder col-4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Empty filter results component
function EmptyFilterResults({ onClearFilters }: { onClearFilters: () => void }) {
    return (
        <div className="col-12">
            <div className="text-center py-5 bg-white rounded shadow">
                <div className="mb-4">
                    <FiBriefcase className="text-muted" style={{ fontSize: 64, opacity: 0.5 }} />
                </div>
                <h5 className="text-dark mb-2">No jobs match your filters</h5>
                <p className="text-muted mb-4">
                    Try adjusting your search criteria or clear all filters to see available jobs.
                </p>
                <button className="btn btn-primary" onClick={onClearFilters}>
                    Clear All Filters
                </button>
            </div>
        </div>
    );
}

// Page size options
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

export default function JobListPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<JobFilters>(initialFilters);

    // Fetch up to 100 jobs to allow proper client-side filtering and pagination
    const { data, isLoading, error } = useJobs(1, 100);

    // Handler for page size change - resets page to 1
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page when page size changes
    };

    // Count active filters
    const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

    // Filter jobs: first by active status, then by user filters
    const filteredJobs = useMemo(() => {
        if (!data?.jobs) return [];

        // First, filter only active jobs
        let jobs = data.jobs.filter(job => job.company_status === 'active');

        // Apply location filter (case-insensitive partial match)
        if (filters.location.trim()) {
            const locationQuery = filters.location.toLowerCase().trim();
            jobs = jobs.filter(job =>
                job.location.toLowerCase().includes(locationQuery)
            );
        }

        // Apply salary range filter (based on job's salary_min and salary_max)
        if (filters.salaryMin !== null) {
            jobs = jobs.filter(job => job.salary_max >= filters.salaryMin!);
        }
        if (filters.salaryMax !== null) {
            jobs = jobs.filter(job => job.salary_min <= filters.salaryMax!);
        }

        // Apply employment type filter
        if (filters.employmentTypes.length > 0) {
            jobs = jobs.filter(job =>
                job.employment_type &&
                filters.employmentTypes.some(type =>
                    job.employment_type?.toLowerCase() === type.toLowerCase()
                )
            );
        }

        // Apply job type filter
        if (filters.jobTypes.length > 0) {
            jobs = jobs.filter(job =>
                job.job_type &&
                filters.jobTypes.some(type =>
                    job.job_type?.toLowerCase() === type.toLowerCase()
                )
            );
        }

        // Apply experience level filter
        if (filters.experienceLevels.length > 0) {
            jobs = jobs.filter(job =>
                job.experience_level &&
                filters.experienceLevels.some(level =>
                    job.experience_level?.toLowerCase() === level.toLowerCase()
                )
            );
        }

        return jobs;
    }, [data, filters]);

    // Handler for filter changes - resets page to 1
    const handleFilterChange = (newFilters: JobFilters) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page when filters change
    };

    // Handler for clearing filters
    const handleClearFilters = () => {
        setFilters(initialFilters);
        setPage(1);
    };

    // Calculate pagination based on filtered results
    const totalFilteredJobs = filteredJobs.length;
    const totalPages = Math.ceil(totalFilteredJobs / pageSize);

    // Paginate filtered results
    const paginatedJobs = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredJobs.slice(start, start + pageSize);
    }, [filteredJobs, page, pageSize]);

    // Check if we have active filters but no results
    const hasFiltersButNoResults = activeFilterCount > 0 && totalFilteredJobs === 0 && !isLoading && !error;

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            {/* Hero Section */}
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Job Vacancies</h5>
                                {data && (
                                    <p className="text-white-50 mt-2 mb-0">
                                        {activeFilterCount > 0
                                            ? `${totalFilteredJobs} jobs matching your filters`
                                            : `${data.total} jobs available`
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <section className="section">
                <div className="container">
                    <div className="row">
                        {/* Filter Sidebar */}
                        <div className="col-lg-3 col-12">
                            <JobFilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                                isLoading={isLoading}
                                activeFilterCount={activeFilterCount}
                            />
                        </div>

                        {/* Job Listings */}
                        <div className="col-lg-9 col-12">
                            <div className="row g-4">
                                {/* Error State */}
                                {error && (
                                    <div className="col-12">
                                        <div className="alert alert-danger">
                                            <i className="mdi mdi-alert-circle me-2"></i>
                                            Failed to load jobs. Please try again later.
                                        </div>
                                    </div>
                                )}

                                {/* Loading State */}
                                {isLoading && (
                                    <>
                                        <JobCardSkeleton />
                                        <JobCardSkeleton />
                                        <JobCardSkeleton />
                                        <JobCardSkeleton />
                                    </>
                                )}

                                {/* Empty State with Active Filters */}
                                {hasFiltersButNoResults && (
                                    <EmptyFilterResults onClearFilters={handleClearFilters} />
                                )}

                                {/* Empty State (No Jobs) */}
                                {!isLoading && !error && !hasFiltersButNoResults && totalFilteredJobs === 0 && (
                                    <div className="col-12">
                                        <div className="text-center py-5">
                                            <FiBriefcase className="text-muted mb-3" style={{ fontSize: 48 }} />
                                            <h5 className="text-muted">No jobs available</h5>
                                            <p className="text-muted">Check back later for new opportunities!</p>
                                        </div>
                                    </div>
                                )}

                                {/* Jobs List */}
                                {!isLoading && !error && paginatedJobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {!isLoading && totalPages > 1 && (
                                <div className="row">
                                    <div className="col-12 mt-4 pt-2">
                                        <ul className="pagination justify-content-center mb-0">
                                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                                    disabled={page === 1}
                                                >
                                                    <i className="mdi mdi-chevron-left fs-6"></i>
                                                </button>
                                            </li>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                // Smart page number display
                                                let pageNum: number;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (page >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = page - 2 + i;
                                                }

                                                return (
                                                    <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                                                        <button className="page-link" onClick={() => setPage(pageNum)}>
                                                            {pageNum}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={page === totalPages}
                                                >
                                                    <i className="mdi mdi-chevron-right fs-6"></i>
                                                </button>
                                            </li>
                                        </ul>

                                        {/* Results count and Page Size Selector */}
                                        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-3">
                                            <p className="text-muted small mb-0">
                                                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalFilteredJobs)} of {totalFilteredJobs} jobs
                                            </p>

                                            {/* Per Page Selector */}
                                            <div className="d-flex align-items-center gap-2">
                                                <label htmlFor="pageSize" className="text-muted small mb-0">Per page:</label>
                                                <select
                                                    id="pageSize"
                                                    className="form-select form-select-sm"
                                                    style={{ width: 'auto' }}
                                                    value={pageSize}
                                                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                                >
                                                    {PAGE_SIZE_OPTIONS.map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
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
