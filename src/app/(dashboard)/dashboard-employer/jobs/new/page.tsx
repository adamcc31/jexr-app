'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateJob } from '@/hooks/useJobs';
import type { CreateJobInput } from '@/types/employer';

// Options for select fields
const EMPLOYMENT_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const JOB_TYPE_OPTIONS = ['Onsite', 'Remote', 'Hybrid'];
const JAPANESE_LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'];

/**
 * Create New Job Page
 * Form for employers to post new job listings
 */
export default function NewJobPage() {
    const router = useRouter();
    const createMutation = useCreateJob();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateJobInput>({
        defaultValues: {
            title: '',
            description: '',
            location: '',
            salary_min: 0,
            salary_max: 0,
            employment_type: '',
            job_type: '',
            experience_level: '',
            qualifications: '',
        }
    });

    const onSubmit = async (data: CreateJobInput) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                router.push('/dashboard-employer/jobs');
            },
        });
    };

    return (
        <div className="container-fluid">
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="mb-1 fw-bold">Post New Job</h2>
                <p className="text-muted mb-0">Fill in the details to create a new job posting</p>
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
                                {createMutation.isError && (
                                    <div className="alert alert-danger mb-4">
                                        <i className="mdi mdi-alert-circle me-2"></i>
                                        {createMutation.error?.message || 'Failed to create job. Please try again.'}
                                    </div>
                                )}

                                {/* Submit Buttons */}
                                <div className="d-flex gap-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting || createMutation.isPending}
                                    >
                                        {(isSubmitting || createMutation.isPending) ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="mdi mdi-check me-1"></i>
                                                Publish Job
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

                {/* Tips Sidebar */}
                <div className="col-lg-4">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <h6 className="fw-semibold mb-3">
                                <i className="mdi mdi-lightbulb-outline me-2 text-warning"></i>
                                Tips for a Great Job Post
                            </h6>
                            <ul className="mb-0 ps-3 text-muted small">
                                <li className="mb-2">
                                    Use a clear, specific job title that candidates will search for
                                </li>
                                <li className="mb-2">
                                    Include key responsibilities and requirements in the description
                                </li>
                                <li className="mb-2">
                                    Be transparent about salary range to attract qualified candidates
                                </li>
                                <li>
                                    Specify if the position is remote, hybrid, or on-site
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
