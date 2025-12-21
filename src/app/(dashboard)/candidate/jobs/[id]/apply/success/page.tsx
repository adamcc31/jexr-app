'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Navbar from '@/app/components/navbarCandidate';
import Footer from '@/app/components/footer';
import ScrollTop from '@/app/components/scrollTop';

import { useJob, useJobs } from '@/hooks/useJobs';
import { FiMapPin, FiClock, FiDollarSign, FiCheckCircle } from '@/app/assets/icons/vander';
import type { Job, JobWithCompany } from '@/types/employer';

interface ApplicationSuccessPageProps {
    params: Promise<{
        id: string;
    }>;
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
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Job Card Component
function JobCard({ job }: { job: JobWithCompany }) {
    return (
        <div className="col-lg-6 col-12 mt-4 pt-2">
            <div className="job-post rounded shadow p-4">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
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
                        <div className="ms-3">
                            <Link href={`/candidate/jobs/${job.id}`} className="h5 title text-dark">
                                {job.title}
                            </Link>
                            <Link href={`/candidate/companies/${job.company_id}`} className="d-block text-muted small">
                                {job.company_name}
                            </Link>
                        </div>
                    </div>
                    {job.employment_type && (
                        <span className="badge bg-soft-primary rounded-pill">{job.employment_type}</span>
                    )}
                </div>
                <div className="mt-3">
                    <span className="text-muted d-block">
                        <FiMapPin className="fea icon-sm me-1" /> {job.location}
                    </span>
                    <span className="text-muted d-block mt-1">
                        <FiClock className="fea icon-sm me-1" /> Posted {formatDate(job.created_at)}
                    </span>
                    <span className="text-muted d-block mt-1">
                        <FiDollarSign className="fea icon-sm me-1" /> {formatSalary(job.salary_min, job.salary_max)}
                    </span>
                </div>
                <div className="mt-3">
                    <Link href={`/candidate/jobs/${job.id}`} className="btn btn-sm btn-primary me-1">View Details</Link>
                    <Link href={`/candidate/jobs/${job.id}/apply`} className="btn btn-sm btn-outline-primary">Apply Now</Link>
                </div>
            </div>
        </div>
    );
}

// Loading skeleton for job cards
function JobCardSkeleton() {
    return (
        <div className="col-lg-6 col-12 mt-4 pt-2">
            <div className="job-post rounded shadow p-4">
                <div className="placeholder-glow">
                    <div className="d-flex align-items-center">
                        <div className="avatar avatar-small rounded bg-secondary placeholder" style={{ width: 65, height: 65 }}></div>
                        <div className="ms-3 flex-1">
                            <div className="placeholder col-8 mb-2"></div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="placeholder col-6 mb-2"></div>
                        <div className="placeholder col-5 mb-2"></div>
                        <div className="placeholder col-7"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ApplicationSuccessPage({ params }: ApplicationSuccessPageProps) {
    // Unwrap async params using React.use()
    const resolvedParams = use(params);
    const jobId = parseInt(resolvedParams.id, 10);

    // Fetch the job that was applied to
    const { data: appliedJob } = useJob(jobId);

    // Fetch recommended jobs (excluding the one just applied to)
    const { data: jobsData, isLoading: isLoadingJobs } = useJobs(1, 5);

    // Filter out the applied job and get only active jobs
    const recommendedJobs = React.useMemo(() => {
        if (!jobsData?.jobs) return [];
        return jobsData.jobs
            .filter(job => job.id !== jobId && job.company_status === 'active')
            .slice(0, 4);
    }, [jobsData, jobId]);

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <div className="avatar avatar-md-sm rounded-pill p-2 bg-success d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                    <FiCheckCircle className="text-white" style={{ fontSize: 40 }} />
                                </div>
                                <h4 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-4">
                                    Application Submitted!
                                </h4>
                                <p className="text-white-50 mt-2 mb-0">
                                    Your application has been successfully sent.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">J Expert</Link></li>
                                <li className="breadcrumb-item"><Link href="/candidate/jobs">Jobs</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Application Submitted</li>
                            </ul>
                        </nav>
                    </div>
                </div>
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
                    {/* Success Message Card */}
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <div className="card border-0 shadow rounded">
                                <div className="card-body p-5 text-center">
                                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: 100, height: 100 }}>
                                        <i className="mdi mdi-check-circle text-success" style={{ fontSize: 48 }}></i>
                                    </div>

                                    <h4 className="text-dark mb-3">Thank You for Your Application!</h4>

                                    {appliedJob && (
                                        <div className="bg-light rounded p-3 mb-4">
                                            <p className="text-muted mb-1">You applied for:</p>
                                            <h5 className="text-primary mb-1">{appliedJob.title}</h5>
                                            <p className="text-muted mb-0 small">
                                                <i className="mdi mdi-domain me-1"></i>
                                                <Link href={`/candidate/companies/${appliedJob.company_id}`} className="text-muted">
                                                    {appliedJob.company_name}
                                                </Link>
                                                <span className="mx-2">•</span>
                                                <i className="mdi mdi-map-marker me-1"></i>
                                                {appliedJob.location}
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-muted mb-4">
                                        The employer will review your application and contact you if your qualifications match their requirements.
                                        You can track your application status in your dashboard.
                                    </p>

                                    <div className="d-flex justify-content-center gap-3">
                                        <Link href="/candidate" className="btn btn-primary">
                                            <i className="mdi mdi-view-dashboard me-1"></i>
                                            Go to Dashboard
                                        </Link>
                                        <Link href="/candidate/jobs" className="btn btn-outline-primary">
                                            <i className="mdi mdi-briefcase-search me-1"></i>
                                            Browse More Jobs
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Jobs Section */}
                    <div className="row mt-5 pt-4">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">
                                    <i className="mdi mdi-lightbulb-on-outline text-primary me-2"></i>
                                    Other Jobs You Might Like
                                </h5>
                                <Link href="/candidate/jobs" className="text-primary small">
                                    View All <i className="mdi mdi-arrow-right"></i>
                                </Link>
                            </div>

                            <div className="row">
                                {/* Loading State */}
                                {isLoadingJobs && (
                                    <>
                                        <JobCardSkeleton />
                                        <JobCardSkeleton />
                                        <JobCardSkeleton />
                                        <JobCardSkeleton />
                                    </>
                                )}

                                {/* Empty State */}
                                {!isLoadingJobs && recommendedJobs.length === 0 && (
                                    <div className="col-12">
                                        <div className="text-center text-muted py-5">
                                            <i className="mdi mdi-briefcase-outline" style={{ fontSize: 48 }}></i>
                                            <p className="mb-0 mt-3">No other job recommendations at the moment.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Jobs List */}
                                {!isLoadingJobs && recommendedJobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer top={true} />
            <ScrollTop />
        </>
    );
}
