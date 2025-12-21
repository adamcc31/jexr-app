'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Navbar from '@/app/components/navbarCandidate';
import Footer from '@/app/components/footer';
import ScrollTop from '@/app/components/scrollTop';

import { useJob } from '@/hooks/useJobs';
import { useCandidateProfile } from '@/hooks/useCandidate';
import { useApplyToJob } from '@/hooks/useApplications';

interface JobApplyPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function JobApplyPage({ params }: JobApplyPageProps) {
    // Unwrap async params using React.use()
    const resolvedParams = use(params);
    const router = useRouter();
    const jobId = parseInt(resolvedParams.id, 10);

    // Fetch job details
    const { data: job, isLoading: isLoadingJob, error: jobError } = useJob(jobId);

    // Fetch candidate profile to check verification status and get CV
    const { data: profile, isLoading: isLoadingProfile } = useCandidateProfile();

    // Mutations
    const applyMutation = useApplyToJob();

    // Form state
    const [coverLetter, setCoverLetter] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Derived state
    const isVerified = profile?.verification?.status === 'VERIFIED';
    const isJobActive = job?.company_status === 'active';
    const isLoading = isLoadingJob || isLoadingProfile;
    const profileCvUrl = profile?.verification?.cv_url;
    const hasCvInProfile = !!profileCvUrl;
    const canSubmit = isVerified && isJobActive && hasCvInProfile && termsAccepted && !applyMutation.isPending;

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!hasCvInProfile) {
            setSubmitError('Please upload a CV in your profile before applying');
            return;
        }

        if (!termsAccepted) {
            setSubmitError('Please accept the terms and conditions');
            return;
        }

        try {
            // Submit application using CV from profile
            await applyMutation.mutateAsync({
                jobId,
                input: {
                    cv_url: profileCvUrl!,
                    cover_letter: coverLetter || undefined,
                },
            });

            setSubmitSuccess(true);

            // Redirect to success page after brief delay
            setTimeout(() => {
                router.push(`/candidate/jobs/${jobId}/apply/success`);
            }, 1000);
        } catch (error: unknown) {
            const errorMessage = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to submit application'
                : 'Failed to submit application';
            setSubmitError(errorMessage);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <>
                <Navbar navClass="defaultscroll sticky" navLight={true} />
                <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                    <div className="bg-overlay bg-gradient-overlay"></div>
                    <div className="container">
                        <div className="row mt-5 justify-content-center">
                            <div className="col-12 text-center">
                                <div className="spinner-border text-white" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer top={true} />
            </>
        );
    }

    // Error state
    if (jobError || !job) {
        return (
            <>
                <Navbar navClass="defaultscroll sticky" navLight={true} />
                <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                    <div className="bg-overlay bg-gradient-overlay"></div>
                    <div className="container">
                        <div className="row mt-5 justify-content-center">
                            <div className="col-12 text-center">
                                <h5 className="text-white">Job not found</h5>
                                <Link href="/candidate/jobs" className="btn btn-primary mt-3">
                                    Back to Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer top={true} />
            </>
        );
    }

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                {job.company_logo_url ? (
                                    <Image
                                        src={job.company_logo_url}
                                        width={65}
                                        height={65}
                                        className="avatar avatar-md-sm rounded-pill p-2 bg-white shadow"
                                        alt={job.company_name}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="avatar avatar-md-sm rounded-pill p-2 bg-white d-inline-flex align-items-center justify-content-center shadow" style={{ width: 65, height: 65 }}>
                                        <i className="mdi mdi-briefcase text-primary" style={{ fontSize: 28 }}></i>
                                    </div>
                                )}
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-3">
                                    {job.title}
                                </h5>
                                <p className="text-white-50 mt-2">
                                    <Link href={`/candidate/companies/${job.company_id}`} className="text-white-50">
                                        {job.company_name}
                                    </Link>
                                    <span className="mx-2">•</span>
                                    {job.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">J Expert</Link></li>
                                <li className="breadcrumb-item"><Link href="/candidate/jobs">Jobs</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Apply</li>
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

            <section className="section bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7 col-md-8">
                            {/* Verification Warning */}
                            {!isVerified && (
                                <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                                    <i className="mdi mdi-alert-circle me-2" style={{ fontSize: 24 }}></i>
                                    <div>
                                        <strong>Profile Not Verified</strong>
                                        <p className="mb-0 small">
                                            Complete and verify your profile before applying to jobs.
                                            <Link href="/candidate/profile" className="ms-1">Go to Profile</Link>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* CV Missing Warning */}
                            {isVerified && !hasCvInProfile && (
                                <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                                    <i className="mdi mdi-file-document-outline me-2" style={{ fontSize: 24 }}></i>
                                    <div>
                                        <strong>CV Not Uploaded</strong>
                                        <p className="mb-0 small">
                                            Please upload your CV in your profile before applying.
                                            <Link href="/candidate/profile" className="ms-1">Go to Profile</Link>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Job Not Active Warning */}
                            {!isJobActive && (
                                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                    <i className="mdi mdi-close-circle me-2" style={{ fontSize: 24 }}></i>
                                    <div>
                                        <strong>Job Closed</strong>
                                        <p className="mb-0 small">This job is no longer accepting applications.</p>
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {submitSuccess && (
                                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                                    <i className="mdi mdi-check-circle me-2" style={{ fontSize: 24 }}></i>
                                    <div>
                                        <strong>Application Submitted!</strong>
                                        <p className="mb-0 small">Redirecting to jobs page...</p>
                                    </div>
                                </div>
                            )}

                            <div className="card border-0">
                                <form className="rounded shadow p-4" onSubmit={handleSubmit}>
                                    {/* Job Details Card */}
                                    <div className="bg-light rounded p-3 mb-4">
                                        <h6 className="mb-2">Applying for:</h6>
                                        <h5 className="text-primary mb-1">{job.title}</h5>
                                        <p className="text-muted mb-0 small">
                                            <i className="mdi mdi-domain me-1"></i>
                                            <Link href={`/candidate/companies/${job.company_id}`} className="text-muted">
                                                {job.company_name}
                                            </Link>
                                            <span className="mx-2">•</span>
                                            <i className="mdi mdi-map-marker me-1"></i>
                                            {job.location}
                                            {job.employment_type && (
                                                <span className="ms-3">
                                                    <i className="mdi mdi-briefcase me-1"></i>
                                                    {job.employment_type}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Your CV from Profile */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Your CV / Resume
                                        </label>
                                        {hasCvInProfile ? (
                                            <div className="bg-light rounded p-3 d-flex align-items-center">
                                                <i className="mdi mdi-file-document text-primary me-3" style={{ fontSize: 32 }}></i>
                                                <div className="flex-grow-1">
                                                    <p className="mb-0 fw-medium">CV from your profile</p>
                                                    <small className="text-muted">
                                                        This CV will be sent with your application
                                                    </small>
                                                </div>
                                                <a
                                                    href={profileCvUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="mdi mdi-eye me-1"></i>
                                                    Preview
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="bg-light rounded p-3 text-center">
                                                <i className="mdi mdi-file-document-outline text-muted" style={{ fontSize: 32 }}></i>
                                                <p className="text-muted small mb-2">No CV found in your profile</p>
                                                <Link href="/candidate/profile" className="btn btn-sm btn-primary">
                                                    Upload CV
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cover Letter */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Cover Letter <span className="text-muted">(optional)</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            placeholder="Tell the employer why you're a great fit for this position..."
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                            disabled={!isVerified || !isJobActive}
                                        ></textarea>
                                    </div>

                                    {/* Screening Questions Placeholder - Future Feature */}
                                    <div className="mb-4">
                                        <div className="bg-light border border-dashed rounded p-4 text-center">
                                            <i className="mdi mdi-help-circle-outline text-muted" style={{ fontSize: 32 }}></i>
                                            <p className="text-muted mb-0 mt-2">
                                                <strong>Screening Questions</strong>
                                            </p>
                                            <small className="text-muted">
                                                Additional questions from the employer will appear here.
                                            </small>
                                            {/* 
                                                TODO: Future Feature - Dynamic Screening Questions
                                                - Fetch job-specific screening questions from API
                                                - Render question components based on question type
                                                - Collect and validate answers
                                                - Include answers in application submission
                                            */}
                                        </div>
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="termsCheck"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                disabled={!isVerified || !isJobActive}
                                            />
                                            <label className="form-check-label" htmlFor="termsCheck">
                                                I accept the <Link href="/terms" className="text-primary">Terms and Conditions</Link>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {submitError && (
                                        <div className="alert alert-danger py-2 mb-3">
                                            <small>{submitError}</small>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="row">
                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={!canSubmit}
                                            >
                                                {applyMutation.isPending ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    'Apply Now'
                                                )}
                                            </button>
                                            {!isVerified && (
                                                <p className="text-center text-muted small mt-2">
                                                    Profile verification required to apply
                                                </p>
                                            )}
                                            {isVerified && !hasCvInProfile && (
                                                <p className="text-center text-muted small mt-2">
                                                    CV upload required to apply
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </form>
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
