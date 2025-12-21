'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import ScrollTop from "../../../components/scrollTop";

import { useCreateJob } from "@/hooks/useJobs";
import type { CreateJobInput } from "@/types/employer";

// Options for select fields
const EMPLOYMENT_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const JOB_TYPE_OPTIONS = ['Onsite', 'Remote', 'Hybrid'];
const JAPANESE_LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'];

interface FormState extends CreateJobInput {
    title: string;
    description: string;
    salary_min: number;
    salary_max: number;
    location: string;
    employment_type: string;
    job_type: string;
    experience_level: string;
    qualifications: string;
}

const initialFormState: FormState = {
    title: '',
    description: '',
    salary_min: 0,
    salary_max: 0,
    location: '',
    employment_type: '',
    job_type: '',
    experience_level: '',
    qualifications: '',
};

export default function JobPost() {
    const router = useRouter();
    const createJobMutation = useCreateJob();
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation: salary_max must be >= salary_min
        if (formData.salary_max < formData.salary_min) {
            setError('Maximum salary must be greater than or equal to minimum salary');
            return;
        }

        // Validation: required fields
        if (!formData.title || !formData.description || !formData.location) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.salary_min <= 0 || formData.salary_max <= 0) {
            setError('Salary values must be greater than 0');
            return;
        }

        try {
            const payload: CreateJobInput = {
                title: formData.title,
                description: formData.description,
                salary_min: formData.salary_min,
                salary_max: formData.salary_max,
                location: formData.location,
                employment_type: formData.employment_type || undefined,
                job_type: formData.job_type || undefined,
                experience_level: formData.experience_level || undefined,
                qualifications: formData.qualifications || undefined,
            };

            await createJobMutation.mutateAsync(payload);
            router.push('/dashboard-employer/jobs');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create job');
        }
    };

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Create a Job Post</h5>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">J Expert</Link></li>
                                <li className="breadcrumb-item"><Link href="/dashboard-employer/jobs">Jobs</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Job Post</li>
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
                        <div className="col-xl-7 col-lg-8">
                            <div className="card border-0">
                                <form className="rounded shadow p-4" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="alert alert-danger mb-4" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    {createJobMutation.isSuccess && (
                                        <div className="alert alert-success mb-4" role="alert">
                                            Job created successfully! Redirecting...
                                        </div>
                                    )}

                                    <div className="row">
                                        <h5 className="mb-3">Job Details:</h5>
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Job Title <span className="text-danger">*</span></label>
                                                <input
                                                    name="title"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g. Senior Software Engineer"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Description <span className="text-danger">*</span></label>
                                                <textarea
                                                    name="description"
                                                    rows={4}
                                                    className="form-control"
                                                    placeholder="Describe the job responsibilities, requirements, and benefits..."
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Employment Type:</label>
                                                <select
                                                    className="form-control form-select"
                                                    name="employment_type"
                                                    value={formData.employment_type}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select employment type</option>
                                                    {EMPLOYMENT_TYPE_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Job Type:</label>
                                                <select
                                                    className="form-control form-select"
                                                    name="job_type"
                                                    value={formData.job_type}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select job type</option>
                                                    {JOB_TYPE_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Minimum Salary <span className="text-danger">*</span></label>
                                                <div className="input-group">
                                                    <span className="input-group-text border">$</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="1"
                                                        placeholder="Min salary"
                                                        name="salary_min"
                                                        value={formData.salary_min || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Maximum Salary <span className="text-danger">*</span></label>
                                                <div className="input-group">
                                                    <span className="input-group-text border">$</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="1"
                                                        placeholder="Max salary"
                                                        name="salary_max"
                                                        value={formData.salary_max || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <h5 className="mb-3">Skill & Experience:</h5>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Japanese Language Level:</label>
                                                <select
                                                    className="form-control form-select"
                                                    name="experience_level"
                                                    value={formData.experience_level}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Japanese level</option>
                                                    {JAPANESE_LEVEL_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Qualifications:</label>
                                                <textarea
                                                    name="qualifications"
                                                    rows={3}
                                                    className="form-control"
                                                    placeholder="Required qualifications, certifications, or skills..."
                                                    value={formData.qualifications}
                                                    onChange={handleChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <h5 className="mb-3">Location:</h5>
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Location <span className="text-danger">*</span></label>
                                                <input
                                                    name="location"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g. Jakarta, Indonesia"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={createJobMutation.isPending}
                                            >
                                                {createJobMutation.isPending ? 'Creating...' : 'Post Job'}
                                            </button>
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
    )
}
