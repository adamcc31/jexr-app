'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useJob, useUpdateJob } from '@/hooks/useJobs';
import type { UpdateJobInput } from '@/types/employer';
import { SkeletonStyles, ErrorState } from '@/components/employer';

// Options for select fields
const EMPLOYMENT_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const JOB_TYPE_OPTIONS = ['Onsite', 'Remote', 'Hybrid'];
const JAPANESE_LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'];

/**
 * Edit Job Page
 * Form for employers to update existing job listings
 */
export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = Number(params.id);

    const { data: job, isLoading, error, refetch } = useJob(jobId);
    const updateMutation = useUpdateJob();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<UpdateJobInput>();

    // Populate form when job data loads
    useEffect(() => {
        if (job) {
            reset({
                title: job.title,
                description: job.description,
                location: job.location,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                employment_type: job.employment_type || '',
                job_type: job.job_type || '',
                experience_level: job.experience_level || '',
                qualifications: job.qualifications || '',
            });
        }
    }, [job, reset]);

    const onSubmit = async (data: UpdateJobInput) => {
        updateMutation.mutate(
            { id: jobId, input: data },
            {
                onSuccess: () => {
                    router.push('/dashboard-employer/jobs');
                },
            }
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container-fluid">
                <SkeletonStyles />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container-fluid">
                <ErrorState
                    message={error.message || 'Failed to load job details.'}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    // Job not found
    if (!job) {
        return (
            <div className="container-fluid">
                <ErrorState message="Job not found." />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="mb-1 fw-bold">Edit Job</h2>
                <p className="text-muted mb-0">Update the details of your job posting</p>
            </div>

            {/* Form Card */}
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Job Title */}
                                <div className="mb-4">
                                    <label htmlFor="title" className="form-label fw-semibold">
                                        Job Title <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        placeholder="e.g. Senior Frontend Developer"
                                        {...register('title', {
                                            required: 'Job title is required',
                                            minLength: { value: 3, message: 'Title must be at least 3 characters' }
                                        })}
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback">{errors.title.message}</div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label htmlFor="description" className="form-label fw-semibold">
                                        Job Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={6}
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        placeholder="Describe the job role, responsibilities, and requirements..."
                                        {...register('description', {
                                            required: 'Description is required',
                                            minLength: { value: 20, message: 'Description must be at least 20 characters' }
                                        })}
                                    />
                                    {errors.description && (
                                        <div className="invalid-feedback">{errors.description.message}</div>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="mb-4">
                                    <label htmlFor="location" className="form-label fw-semibold">
                                        Location <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                        placeholder="e.g. Jakarta, Indonesia or Remote"
                                        {...register('location', { required: 'Location is required' })}
                                    />
                                    {errors.location && (
                                        <div className="invalid-feedback">{errors.location.message}</div>
                                    )}
                                </div>

                                {/* Salary Range */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="salary_min" className="form-label fw-semibold">
                                            Minimum Salary (IDR) <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="salary_min"
                                            className={`form-control ${errors.salary_min ? 'is-invalid' : ''}`}
                                            placeholder="e.g. 10000000"
                                            {...register('salary_min', {
                                                required: 'Minimum salary is required',
                                                valueAsNumber: true,
                                                min: { value: 1, message: 'Must be greater than 0' }
                                            })}
                                        />
                                        {errors.salary_min && (
                                            <div className="invalid-feedback">{errors.salary_min.message}</div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="salary_max" className="form-label fw-semibold">
                                            Maximum Salary (IDR) <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="salary_max"
                                            className={`form-control ${errors.salary_max ? 'is-invalid' : ''}`}
                                            placeholder="e.g. 20000000"
                                            {...register('salary_max', {
                                                required: 'Maximum salary is required',
                                                valueAsNumber: true,
                                                min: { value: 1, message: 'Must be greater than 0' }
                                            })}
                                        />
                                        {errors.salary_max && (
                                            <div className="invalid-feedback">{errors.salary_max.message}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Employment Type & Job Type */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="employment_type" className="form-label fw-semibold">
                                            Employment Type
                                        </label>
                                        <select
                                            id="employment_type"
                                            className="form-control form-select"
                                            {...register('employment_type')}
                                        >
                                            <option value="">Select employment type</option>
                                            {EMPLOYMENT_TYPE_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="job_type" className="form-label fw-semibold">
                                            Job Type
                                        </label>
                                        <select
                                            id="job_type"
                                            className="form-control form-select"
                                            {...register('job_type')}
                                        >
                                            <option value="">Select job type</option>
                                            {JOB_TYPE_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Japanese Language Level */}
                                <div className="mb-4">
                                    <label htmlFor="experience_level" className="form-label fw-semibold">
                                        Japanese Language Level
                                    </label>
                                    <select
                                        id="experience_level"
                                        className="form-control form-select"
                                        {...register('experience_level')}
                                    >
                                        <option value="">Select Japanese level</option>
                                        {JAPANESE_LEVEL_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Qualifications */}
                                <div className="mb-4">
                                    <label htmlFor="qualifications" className="form-label fw-semibold">
                                        Qualifications
                                    </label>
                                    <textarea
                                        id="qualifications"
                                        rows={3}
                                        className="form-control"
                                        placeholder="Required qualifications, certifications, or skills..."
                                        {...register('qualifications')}
                                    />
                                </div>

                                {/* Error Message */}
                                {updateMutation.isError && (
                                    <div className="alert alert-danger mb-4">
                                        <i className="mdi mdi-alert-circle me-2"></i>
                                        {updateMutation.error?.message || 'Failed to update job. Please try again.'}
                                    </div>
                                )}

                                {/* Submit Buttons */}
                                <div className="d-flex gap-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting || updateMutation.isPending}
                                    >
                                        {(isSubmitting || updateMutation.isPending) ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="mdi mdi-check me-1"></i>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => router.back()}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Job Info Sidebar */}
                <div className="col-lg-4">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <h6 className="fw-semibold mb-3">
                                <i className="mdi mdi-information-outline me-2 text-primary"></i>
                                Job Information
                            </h6>
                            <dl className="mb-0 small">
                                <dt className="text-muted">Job ID</dt>
                                <dd className="mb-2">{job.id}</dd>
                                <dt className="text-muted">Status</dt>
                                <dd className="mb-2">
                                    <span className={`badge ${job.company_status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                        {job.company_status}
                                    </span>
                                </dd>
                                <dt className="text-muted">Created</dt>
                                <dd className="mb-0">
                                    {new Date(job.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
