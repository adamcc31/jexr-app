'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";

import NavbarDark from "../../../../components/navbarCandidate";
import Footer from "../../../../components/footer";
import ScrollTop from "../../../../components/scrollTop";

import { FiLayout, FiMapPin, FiUserCheck, FiClock, FiMonitor, FiBriefcase, FiBook, FiDollarSign, FiArrowRight, FiBookmark, FiArrowUpRight, FiAlertCircle } from "../../../../assets/icons/vander";
import { useJob, useJobs } from "@/hooks/useJobs";
import type { Job, JobWithCompany } from "@/types/employer";

interface PageProps {
    params: Promise<{ id: string }>;
}

// Loading skeleton component
function JobDetailSkeleton() {
    return (
        <section className="bg-half d-table w-100">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow rounded p-4 sticky-bar">
                            <div className="placeholder-glow">
                                <div className="avatar avatar-medium rounded-pill bg-secondary placeholder" style={{ width: 110, height: 110 }}></div>
                                <div className="mt-4">
                                    <div className="placeholder col-8 mb-3"></div>
                                    <div className="placeholder col-12"></div>
                                    <div className="placeholder col-10"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-6">
                        <div className="placeholder-glow">
                            <div className="placeholder col-4 mb-4"></div>
                            <div className="row">
                                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                    <div key={i} className="col-md-4 mb-3">
                                        <div className="placeholder col-12" style={{ height: 60 }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <div className="placeholder col-12 mb-2"></div>
                                <div className="placeholder col-10 mb-2"></div>
                                <div className="placeholder col-8"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Error state component
function JobDetailError({ message }: { message: string }) {
    return (
        <section className="bg-half d-table w-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card border-0 shadow rounded p-5 text-center">
                            <FiAlertCircle className="text-danger mb-3" style={{ fontSize: '3rem' }} />
                            <h4 className="text-danger">Error Loading Job</h4>
                            <p className="text-muted mb-4">{message}</p>
                            <Link href="/candidate/jobs" className="btn btn-primary">
                                Browse All Jobs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Not found state component
function JobNotFound() {
    return (
        <section className="bg-half d-table w-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card border-0 shadow rounded p-5 text-center">
                            <FiAlertCircle className="text-warning mb-3" style={{ fontSize: '3rem' }} />
                            <h4>Job Not Found</h4>
                            <p className="text-muted mb-4">This job listing is no longer available or has been removed.</p>
                            <Link href="/candidate/jobs" className="btn btn-primary">
                                Browse All Jobs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

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
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Related job card component
function RelatedJobCard({ job }: { job: JobWithCompany }) {
    return (
        <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
            <div className="job-post job-type-three rounded shadow bg-white p-4">
                <div className="d-flex justify-content-between">
                    <div>
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
                        <Link href={`/candidate/companies/${job.company_id}`} className="h5 company text-dark d-block mt-2">
                            {job.company_name}
                        </Link>
                    </div>
                    <ul className="list-unstyled align-items-center mb-0">
                        <li className="list-inline-item"><Link href="#" className="like"><i className="mdi mdi-heart align-middle fs-3"></i></Link></li>
                        <li className="list-inline-item"><Link href="" className="btn btn-icon btn-sm btn-soft-primary"><FiBookmark className="icons" /></Link></li>
                        <li className="list-inline-item"><Link href="" className="btn btn-icon btn-sm btn-soft-primary"><FiArrowUpRight className="icons" /></Link></li>
                    </ul>
                </div>

                <div className="mt-2">
                    <Link href={`/candidate/jobs/${job.id}`} className="text-dark title h5">{job.title}</Link>
                    <p className="text-muted mt-2">{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</p>

                    <ul className="list-unstyled mb-0">
                        {job.employment_type && (
                            <li className="d-inline-block me-1"><span className="badge bg-primary">{job.employment_type}</span></li>
                        )}
                        <li className="d-inline-block me-1"><span className="badge bg-primary">{formatSalary(job.salary_min, job.salary_max)}</span></li>
                        <li className="d-inline-block me-1"><span className="badge bg-primary"><i className="mdi mdi-map-marker me-1"></i>{job.location}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

// Main job detail content component
function JobDetailContent({ job, relatedJobs }: { job: JobWithCompany; relatedJobs: JobWithCompany[] }) {
    const isActive = job.company_status === 'active';

    return (
        <>
            {/* Hero Header Section */}
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'center' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <div className="mb-4">
                                    {job.company_logo_url ? (
                                        <Image
                                            src={job.company_logo_url}
                                            width={80}
                                            height={80}
                                            className="avatar avatar-md-md p-2 rounded-pill shadow bg-white"
                                            alt={job.company_name}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="avatar avatar-md-md p-3 rounded-pill shadow bg-white d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                            <i className="mdi mdi-domain text-primary" style={{ fontSize: 32 }}></i>
                                        </div>
                                    )}
                                </div>
                                <h1 className="heading fw-bold text-white mb-3">{job.title}</h1>
                                <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                                    <span className="badge bg-white text-dark px-3 py-2 rounded-pill">
                                        <FiMapPin className="me-1" /> {job.location}
                                    </span>
                                    {job.employment_type && (
                                        <span className="badge bg-primary px-3 py-2 rounded-pill">
                                            {job.employment_type}
                                        </span>
                                    )}
                                    {job.job_type && (
                                        <span className="badge bg-success px-3 py-2 rounded-pill">
                                            {job.job_type}
                                        </span>
                                    )}
                                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                                        <FiDollarSign className="me-1" /> {formatSalary(job.salary_min, job.salary_max)}
                                    </span>
                                </div>
                                <p className="text-white-50 mt-3 mb-0">
                                    <FiClock className="me-1" /> Posted on {formatDate(job.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                                <li className="breadcrumb-item"><Link href="/candidate/jobs">Jobs</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{job.title}</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>

            {/* Wave shape divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Main Content Section */}
            <section className="section pt-0">
                <div className="container">
                    <div className="row g-4">
                        {/* Sidebar - Company Info */}
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow rounded p-4 sticky-bar" style={{ marginTop: '-100px' }}>
                                {job.company_logo_url ? (
                                    <Image
                                        src={job.company_logo_url}
                                        width={110}
                                        height={110}
                                        className="avatar avatar-medium p-2 rounded-pill shadow bg-white"
                                        alt={job.company_name}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="avatar avatar-medium p-4 rounded-pill shadow bg-white d-flex align-items-center justify-content-center" style={{ width: 110, height: 110 }}>
                                        <i className="mdi mdi-domain text-primary" style={{ fontSize: 42 }}></i>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <h4 className="title mb-3">{job.title}</h4>
                                    <p className="para-desc text-muted">{job.description.substring(0, 150)}...</p>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-inline-flex align-items-center text-muted me-2">
                                            <FiLayout className="fea icon-sm text-primary me-1" />
                                            <Link href={`/candidate/companies/${job.company_id}`} className="text-muted">
                                                {job.company_name}
                                            </Link>
                                        </li>
                                        <li className="d-inline-flex align-items-center text-muted">
                                            <FiMapPin className="fea icon-sm text-primary me-1" />{job.location}
                                        </li>
                                    </ul>

                                    {/* Apply Button - Prominent in sidebar */}
                                    <div className="mt-4">
                                        {isActive ? (
                                            <Link href={`/candidate/jobs/${job.id}/apply`} className="btn btn-primary w-100">
                                                <i className="mdi mdi-send me-2"></i>Apply Now
                                            </Link>
                                        ) : (
                                            <button className="btn btn-secondary w-100" disabled>
                                                Applications Closed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-8 col-md-6">
                            {/* Job Information Widgets */}
                            <div className="sidebar border-0">
                                <h5 className="mb-0">Job Information:</h5>

                                <ul className="list-unstyled mb-0 mt-4">
                                    {/* Employment Type */}
                                    {job.employment_type && (
                                        <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                            <div className="d-flex widget align-items-center">
                                                <FiUserCheck className="fea icon-ex-md me-3" />
                                                <div className="flex-1">
                                                    <h6 className="widget-title mb-0">Employee Type:</h6>
                                                    <small className="text-primary mb-0">{job.employment_type}</small>
                                                </div>
                                            </div>
                                        </li>
                                    )}

                                    {/* Location */}
                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiMapPin className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Location:</h6>
                                                <small className="text-primary mb-0">{job.location}</small>
                                            </div>
                                        </div>
                                    </li>

                                    {/* Date Posted */}
                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiClock className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Date posted:</h6>
                                                <small className="text-primary mb-0">{formatDate(job.created_at)}</small>
                                            </div>
                                        </div>
                                    </li>

                                    {/* Job Type */}
                                    {job.job_type && (
                                        <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                            <div className="d-flex widget align-items-center">
                                                <FiMonitor className="fea icon-ex-md me-3" />
                                                <div className="flex-1">
                                                    <h6 className="widget-title mb-0">Job Type:</h6>
                                                    <small className="text-primary mb-0">{job.job_type}</small>
                                                </div>
                                            </div>
                                        </li>
                                    )}

                                    {/* Japanese Language Level */}
                                    {job.experience_level && (
                                        <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                            <div className="d-flex widget align-items-center">
                                                <FiBriefcase className="fea icon-ex-md me-3" />
                                                <div className="flex-1">
                                                    <h6 className="widget-title mb-0">Japanese Level:</h6>
                                                    <small className="text-primary mb-0">{job.experience_level}</small>
                                                </div>
                                            </div>
                                        </li>
                                    )}

                                    {/* Salary */}
                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiDollarSign className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Salary:</h6>
                                                <small className="text-primary mb-0">{formatSalary(job.salary_min, job.salary_max)}</small>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Job Description */}
                            <div className="mt-4">
                                <h5>Job Description:</h5>
                                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
                            </div>

                            {/* Qualifications - Now styled like Job Description */}
                            {job.qualifications && (
                                <div className="mt-4">
                                    <h5>Qualifications:</h5>
                                    <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{job.qualifications}</p>
                                </div>
                            )}

                            {/* Apply Button - Secondary placement */}
                            <div className="mt-4 pt-2 border-top">
                                {isActive ? (
                                    <Link href={`/candidate/jobs/${job.id}/apply`} className="btn btn-outline-primary">
                                        Apply Now <i className="mdi mdi-send"></i>
                                    </Link>
                                ) : (
                                    <button className="btn btn-secondary" disabled>
                                        Applications Closed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Jobs Section */}
                {relatedJobs.length > 0 && (
                    <div className="container mt-100 mt-60">
                        <div className="row justify-content-center mb-4 pb-2">
                            <div className="col-12">
                                <div className="section-title text-center">
                                    <h4 className="title mb-3">Related Vacancies</h4>
                                    <p className="text-muted para-desc mx-auto mb-0">
                                        Explore other opportunities that might interest you.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {relatedJobs.map((relatedJob) => (
                                <RelatedJobCard key={relatedJob.id} job={relatedJob} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}

// Main page component
export default function JobDetailPage({ params }: PageProps) {
    const resolvedParams = React.use(params);
    const jobId = parseInt(resolvedParams.id, 10);

    const { data: job, isLoading, isError, error } = useJob(jobId);
    const { data: jobsData } = useJobs(1, 4);

    // Filter related jobs: active only, exclude current job, limit to 3
    const relatedJobs = React.useMemo(() => {
        if (!jobsData?.jobs) return [];
        return jobsData.jobs
            .filter(j => j.id !== jobId && j.company_status === 'active')
            .slice(0, 3);
    }, [jobsData, jobId]);

    // Check if job exists and is active (treat closed as not found for candidates)
    const isJobAvailable = job && job.company_status === 'active';

    return (
        <>
            <NavbarDark navClass="defaultscroll sticky" navLight={false} />

            {isLoading && <JobDetailSkeleton />}

            {isError && <JobDetailError message={error?.message || 'Failed to load job details'} />}

            {!isLoading && !isError && !isJobAvailable && <JobNotFound />}

            {!isLoading && !isError && isJobAvailable && (
                <JobDetailContent job={job} relatedJobs={relatedJobs} />
            )}

            <Footer top={true} />
            <ScrollTop />
        </>
    );
}
