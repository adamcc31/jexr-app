'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminVerificationDetail, useApproveVerification, useRejectVerification } from '@/hooks/admin';
import {
    JapanWorkExperience,
    VerificationStatus,
    WorkExperience,
    Skill,
    CandidateCertificate,
    CandidateProfile,
    CandidateDetail,
    OnboardingData
} from '@/lib/api/verification';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';
import RejectModal from '../components/RejectModal';

interface VerificationDetailPageProps {
    id: number;
}

// Constants for onboarding display
const INTEREST_LABELS: Record<string, string> = {
    teacher: 'Teaching',
    translator: 'Translation',
    admin: 'Administrative',
    none: 'No special interest'
};

const COMPANY_PREF_LABELS: Record<string, string> = {
    pma: '100% Japanese (PMA)',
    joint_venture: 'Joint Venture',
    local: '100% Indonesian (Local)'
};

export default function VerificationDetailPage({ id }: VerificationDetailPageProps) {
    const router = useRouter();
    const [showRejectModal, setShowRejectModal] = useState(false);

    const { data, isLoading, error } = useAdminVerificationDetail(id);
    const approveVerification = useApproveVerification();
    const rejectVerification = useRejectVerification();

    const verification = data?.verification;
    const experiences = data?.experiences || [];
    const candidateProfile = data?.candidate_profile;
    const candidateDetails = data?.candidate_details;
    const workExperiences = data?.work_experiences || [];
    const skills = data?.skills || [];
    const certificates = data?.certificates || [];
    const onboardingData = data?.onboarding_data;

    const handleApprove = async () => {
        if (!confirm('Are you sure you want to approve this verification?')) return;

        approveVerification.mutate(id, {
            onSuccess: () => {
                router.push('/admin/account-verification');
            }
        });
    };

    const handleReject = (reason: string) => {
        rejectVerification.mutate(
            { id, notes: reason },
            {
                onSuccess: () => {
                    setShowRejectModal(false);
                    router.push('/admin/account-verification');
                }
            }
        );
    };

    const getStatusBadge = (status: VerificationStatus) => {
        switch (status) {
            case 'VERIFIED':
                return <span className="badge bg-success px-3 py-2 fs-6">Verified</span>;
            case 'REJECTED':
                return <span className="badge bg-danger px-3 py-2 fs-6">Rejected</span>;
            case 'SUBMITTED':
                return <span className="badge bg-info px-3 py-2 fs-6">Submitted</span>;
            case 'PENDING':
            default:
                return <span className="badge bg-warning px-3 py-2 fs-6">Pending</span>;
        }
    };

    const formatDuration = (months?: number) => {
        if (!months) return 'Not specified';
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
        if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
        return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    };

    const formatWorkPeriod = (exp: JapanWorkExperience | WorkExperience) => {
        const start = formatDate(exp.start_date);
        const end = exp.end_date ? formatDate(exp.end_date) : 'Present';
        return `${start} - ${end}`;
    };

    // Calculate data completeness
    const getDataCompleteness = () => {
        const sections = [
            { name: 'Profile Overview', complete: !!(verification?.first_name && verification?.last_name) },
            { name: 'Identity & Demographics', complete: !!(verification?.birth_date && verification?.domicile_city) },
            { name: 'Education & Career', complete: !!(candidateProfile?.highest_education) },
            { name: 'Work Experience', complete: experiences.length > 0 || workExperiences.length > 0 },
            { name: 'Skills & Expertise', complete: skills.length > 0 },
            { name: 'Soft Skills', complete: !!(candidateDetails?.soft_skills_description) },
            { name: 'Documents', complete: !!(verification?.cv_url) },
            { name: 'Onboarding', complete: !!(onboardingData?.completed_at) },
        ];
        const completedCount = sections.filter(s => s.complete).length;
        const percentage = Math.round((completedCount / sections.length) * 100);
        return { sections, completedCount, total: sections.length, percentage };
    };

    const completeness = getDataCompleteness();

    if (isLoading) {
        return (
            <div className="container-fluid">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading verification details...</p>
                </div>
            </div>
        );
    }

    if (error || !verification) {
        return (
            <div className="container-fluid">
                <div className="text-center py-5">
                    <IconifyIcon icon="solar:danger-triangle-bold" width={48} className="text-danger mb-3" />
                    <h5>Failed to load verification</h5>
                    <p className="text-muted">The verification record could not be found or an error occurred.</p>
                    <Link href="/admin/account-verification" className="btn btn-primary mt-3">
                        Back to List
                    </Link>
                </div>
            </div>
        );
    }

    const isSubmitted = verification.status === 'SUBMITTED';
    const isProcessing = approveVerification.isPending || rejectVerification.isPending;

    return (
        <div className="container-fluid px-0">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Link href="/admin/account-verification" className="btn btn-light">
                        <IconifyIcon icon="solar:arrow-left-linear" width={20} />
                    </Link>
                    <div>
                        <h1 className="h3 mb-0">Verification Review</h1>
                        <p className="text-muted mb-0">Review candidate verification details</p>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    {getStatusBadge(verification.status)}
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column - Main Info */}
                <div className="col-lg-8">
                    {/* Profile Overview Card */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:user-circle-bold" width={20} className="me-2" />
                                Profile Overview
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-start gap-4">
                                {/* Profile Picture */}
                                <div
                                    className="rounded-circle overflow-hidden bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ width: 120, height: 120, cursor: verification.profile_picture_url ? 'pointer' : 'default' }}
                                    onClick={() => {
                                        if (verification.profile_picture_url) {
                                            window.open(verification.profile_picture_url, '_blank');
                                        }
                                    }}
                                    title={verification.profile_picture_url ? 'Click to view full image' : undefined}
                                >
                                    {verification.profile_picture_url ? (
                                        <Image
                                            src={verification.profile_picture_url}
                                            alt="Profile"
                                            width={120}
                                            height={120}
                                            className="object-fit-cover"
                                            style={{ width: 120, height: 120 }}
                                        />
                                    ) : (
                                        <IconifyIcon icon="solar:user-circle-bold" width={60} className="text-muted" />
                                    )}
                                </div>
                                {/* Profile Info */}
                                <div className="flex-grow-1">
                                    <h4 className="mb-2">
                                        {verification.first_name && verification.last_name
                                            ? `${verification.first_name} ${verification.last_name}`
                                            : 'Name not provided'}
                                    </h4>
                                    <p className="text-muted mb-3">{verification.occupation || 'No occupation specified'}</p>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center gap-2">
                                                <IconifyIcon icon="solar:letter-bold" width={16} className="text-muted" />
                                                <span className="text-muted small">Email:</span>
                                                <span>{verification.user_email || 'Not provided'}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center gap-2">
                                                <IconifyIcon icon="solar:phone-bold" width={16} className="text-muted" />
                                                <span className="text-muted small">Phone:</span>
                                                <span>{verification.phone || 'Not provided'}</span>
                                            </div>
                                        </div>
                                        {verification.website_url && (
                                            <div className="col-12">
                                                <div className="d-flex align-items-center gap-2">
                                                    <IconifyIcon icon="solar:link-bold" width={16} className="text-muted" />
                                                    <span className="text-muted small">Website:</span>
                                                    <a href={verification.website_url} target="_blank" rel="noopener noreferrer">
                                                        {verification.website_url}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Details Card */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:document-text-bold" width={20} className="me-2" />
                                Personal Details
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-4">
                                <h6 className="text-muted small mb-2">Introduction</h6>
                                <p className="mb-0">{verification.intro || 'No introduction provided.'}</p>
                            </div>
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Japan Experience</h6>
                                    <p className="mb-0 fs-5">{formatDuration(verification.japan_experience_duration)}</p>
                                </div>
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Japanese Level</h6>
                                    <p className="mb-0 fs-5">{verification.japanese_level || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Identity & Demographics Card */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:user-id-bold" width={20} className="me-2" />
                                Identity & Demographics
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Date of Birth</h6>
                                    <p className="mb-0">{verification.birth_date ? new Date(verification.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}</p>
                                </div>
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Domicile City</h6>
                                    <p className="mb-0">{verification.domicile_city || 'Not specified'}</p>
                                </div>
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Marital Status</h6>
                                    <p className="mb-0">{verification.marital_status || 'Not specified'}</p>
                                </div>
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Number of Children</h6>
                                    <p className="mb-0">{verification.children_count !== undefined ? verification.children_count : 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Education & Career Goals Card - NEW */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:graduation-cap-bold" width={20} className="me-2" />
                                Education & Career Goals
                            </h5>
                        </div>
                        <div className="card-body">
                            {candidateProfile ? (
                                <div className="row g-4">
                                    <div className="col-sm-6">
                                        <h6 className="text-muted small mb-2">Highest Education</h6>
                                        <p className="mb-0">{candidateProfile.highest_education || 'Not specified'}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <h6 className="text-muted small mb-2">Major Field</h6>
                                        <p className="mb-0">{candidateProfile.major_field || 'Not specified'}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <h6 className="text-muted small mb-2">Desired Job Position</h6>
                                        <p className="mb-0">
                                            {candidateProfile.desired_job_position || candidateProfile.desired_job_position_other || 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="col-sm-6">
                                        <h6 className="text-muted small mb-2">Preferred Work Environment</h6>
                                        <p className="mb-0">{candidateProfile.preferred_work_environment || 'Not specified'}</p>
                                    </div>
                                    <div className="col-12">
                                        <h6 className="text-muted small mb-2">Career Goals (3 Years)</h6>
                                        <p className="mb-0">{candidateProfile.career_goals_3y || 'Not specified'}</p>
                                    </div>
                                    {candidateProfile.main_concerns_returning && candidateProfile.main_concerns_returning.length > 0 && (
                                        <div className="col-12">
                                            <h6 className="text-muted small mb-2">Main Concerns Returning to Indonesia</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {candidateProfile.main_concerns_returning.map((concern, idx) => (
                                                    <span key={idx} className="badge bg-secondary text-white px-3 py-2">{concern}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {candidateProfile.special_message && (
                                        <div className="col-12">
                                            <h6 className="text-muted small mb-2">Special Message</h6>
                                            <p className="mb-0 fst-italic">"{candidateProfile.special_message}"</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <IconifyIcon icon="solar:graduation-cap-linear" width={32} className="mb-2 opacity-50" />
                                    <p className="mb-0">No education & career data provided</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills & Expertise Card - NEW */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:widget-bold" width={20} className="me-2" />
                                Skills & Expertise
                            </h5>
                        </div>
                        <div className="card-body">
                            {skills.length > 0 ? (
                                <div>
                                    {/* Group skills by category */}
                                    {['COMPUTER', 'LANGUAGE', 'TECHNICAL'].map(category => {
                                        const categorySkills = skills.filter(s => s.category === category);
                                        if (categorySkills.length === 0) return null;
                                        return (
                                            <div key={category} className="mb-3">
                                                <h6 className="text-muted small mb-2">{category} Skills</h6>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {categorySkills.map(skill => (
                                                        <span key={skill.id} className={`badge px-3 py-2 ${category === 'COMPUTER' ? 'bg-primary' :
                                                                category === 'LANGUAGE' ? 'bg-info' : 'bg-success'
                                                            } text-white`}>
                                                            {skill.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {candidateProfile?.skills_other && (
                                        <div className="mt-3">
                                            <h6 className="text-muted small mb-2">Other Skills</h6>
                                            <p className="mb-0">{candidateProfile.skills_other}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <IconifyIcon icon="solar:widget-linear" width={32} className="mb-2 opacity-50" />
                                    <p className="mb-0">No skills data provided</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Soft Skills & Achievements Card - NEW */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:star-bold" width={20} className="me-2" />
                                Soft Skills & Achievements
                            </h5>
                        </div>
                        <div className="card-body">
                            {candidateDetails ? (
                                <div className="row g-4">
                                    {candidateDetails.soft_skills_description && (
                                        <div className="col-12">
                                            <h6 className="text-muted small mb-2">Soft Skills Description</h6>
                                            <p className="mb-0">{candidateDetails.soft_skills_description}</p>
                                        </div>
                                    )}
                                    {candidateDetails.applied_work_values && (
                                        <div className="col-12">
                                            <h6 className="text-muted small mb-2">Applied Work Values</h6>
                                            <p className="mb-0">{candidateDetails.applied_work_values}</p>
                                        </div>
                                    )}
                                    {candidateDetails.major_achievements && (
                                        <div className="col-12">
                                            <h6 className="text-muted small mb-2">Major Achievements</h6>
                                            <p className="mb-0">{candidateDetails.major_achievements}</p>
                                        </div>
                                    )}
                                    {!candidateDetails.soft_skills_description && !candidateDetails.applied_work_values && !candidateDetails.major_achievements && (
                                        <div className="col-12 text-center py-4 text-muted">
                                            <p className="mb-0">No soft skills details provided</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <IconifyIcon icon="solar:star-linear" width={32} className="mb-2 opacity-50" />
                                    <p className="mb-0">No soft skills data provided</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Core Competencies Card */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:medal-star-bold" width={20} className="me-2" />
                                Core Competencies
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-12">
                                    <h6 className="text-muted small mb-2">Main Job Fields</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {verification.main_job_fields && verification.main_job_fields.length > 0 ? (
                                            verification.main_job_fields.map((field, idx) => (
                                                <span key={idx} className="badge bg-primary text-white px-3 py-2">{field}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted">Not specified</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Golden Skill</h6>
                                    <p className="mb-0">{verification.golden_skill || 'Not specified'}</p>
                                </div>
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Japanese Speaking Level</h6>
                                    <p className="mb-0">{verification.japanese_speaking_level || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expectations & Availability Card */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:calendar-bold" width={20} className="me-2" />
                                Expectations & Availability
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Expected Salary (Netto)</h6>
                                    <p className="mb-0 fs-5">
                                        {verification.expected_salary
                                            ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(verification.expected_salary)
                                            : 'Not specified'}
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Japan Return Date</h6>
                                    <p className="mb-0">{verification.japan_return_date ? new Date(verification.japan_return_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Not specified'}</p>
                                </div>
                                <div className="col-sm-6">
                                    <h6 className="text-muted small mb-2">Available Start Date</h6>
                                    <p className="mb-0">{verification.available_start_date ? new Date(verification.available_start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Not specified'}</p>
                                </div>
                                <div className="col-12">
                                    <h6 className="text-muted small mb-2">Preferred Locations</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {verification.preferred_locations && verification.preferred_locations.length > 0 ? (
                                            verification.preferred_locations.map((loc, idx) => (
                                                <span key={idx} className="badge bg-info text-white px-3 py-2">{loc}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted">Not specified</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <h6 className="text-muted small mb-2">Preferred Industries</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {verification.preferred_industries && verification.preferred_industries.length > 0 ? (
                                            verification.preferred_industries.map((ind, idx) => (
                                                <span key={idx} className="badge bg-success text-white px-3 py-2">{ind}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted">Not specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Complete Work History Card - NEW */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:case-bold" width={20} className="me-2" />
                                Complete Work History
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Unified Work Experiences */}
                            {workExperiences.length > 0 && (
                                <div className="mb-4">
                                    <h6 className="text-muted small mb-3 d-flex align-items-center gap-2">
                                        <IconifyIcon icon="solar:globe-bold" width={16} />
                                        All Work Experience
                                    </h6>
                                    <div className="d-flex flex-column gap-4">
                                        {workExperiences.map((exp) => (
                                            <div key={exp.id} className={`border-start border-3 ps-3 ${exp.experience_type === 'OVERSEAS' ? 'border-primary' : 'border-success'
                                                }`}>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <h6 className="mb-0">{exp.job_title}</h6>
                                                    <span className={`badge ${exp.experience_type === 'OVERSEAS' ? 'bg-primary' : 'bg-success'
                                                        } text-white`}>
                                                        {exp.country_code} ({exp.experience_type})
                                                    </span>
                                                </div>
                                                <p className="text-primary mb-1">{exp.company_name}</p>
                                                <p className="text-muted small mb-2">{formatWorkPeriod(exp)}</p>
                                                {exp.description && (
                                                    <p className="mb-0 text-muted">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Legacy Japan Work Experience */}
                            {experiences.length > 0 && (
                                <div>
                                    <h6 className="text-muted small mb-3 d-flex align-items-center gap-2">
                                        <IconifyIcon icon="twemoji:flag-japan" width={16} />
                                        Japan Work Experience (Identity Form)
                                    </h6>
                                    <div className="d-flex flex-column gap-4">
                                        {experiences.map((exp) => (
                                            <div key={exp.id} className="border-start border-3 border-danger ps-3">
                                                <h6 className="mb-1">{exp.job_title}</h6>
                                                <p className="text-primary mb-1">{exp.company_name}</p>
                                                <p className="text-muted small mb-2">{formatWorkPeriod(exp)}</p>
                                                {exp.description && (
                                                    <p className="mb-0 text-muted">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {workExperiences.length === 0 && experiences.length === 0 && (
                                <div className="text-center py-4 text-muted">
                                    <IconifyIcon icon="solar:case-linear" width={32} className="mb-2 opacity-50" />
                                    <p className="mb-0">No work experience provided</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Documents & Actions */}
                <div className="col-lg-4">
                    {/* Data Completeness Card - NEW */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:chart-2-bold" width={20} className="me-2" />
                                Data Completeness
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="progress flex-grow-1" style={{ height: 8 }}>
                                    <div
                                        className={`progress-bar ${completeness.percentage >= 80 ? 'bg-success' :
                                                completeness.percentage >= 50 ? 'bg-warning' : 'bg-danger'
                                            }`}
                                        style={{ width: `${completeness.percentage}%` }}
                                    />
                                </div>
                                <span className="fw-bold">{completeness.percentage}%</span>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                {completeness.sections.map((section, idx) => (
                                    <div key={idx} className="d-flex align-items-center gap-2">
                                        <IconifyIcon
                                            icon={section.complete ? "solar:check-circle-bold" : "solar:close-circle-bold"}
                                            width={16}
                                            className={section.complete ? "text-success" : "text-danger"}
                                        />
                                        <span className={section.complete ? "" : "text-muted"}>{section.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Documents Card */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:folder-bold" width={20} className="me-2" />
                                Uploaded Documents
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex flex-column gap-3">
                                {/* Japanese Certificate */}
                                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                                    <div className="d-flex align-items-center gap-2">
                                        <IconifyIcon icon="solar:diploma-bold" width={24} className="text-primary" />
                                        <span>Japanese Certificate</span>
                                    </div>
                                    {verification.japanese_certificate_url ? (
                                        <a
                                            href={verification.japanese_certificate_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-primary"
                                        >
                                            <IconifyIcon icon="solar:eye-bold" width={16} className="me-1" />
                                            View
                                        </a>
                                    ) : (
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary">Not uploaded</span>
                                    )}
                                </div>

                                {/* CV/Resume */}
                                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                                    <div className="d-flex align-items-center gap-2">
                                        <IconifyIcon icon="solar:file-text-bold" width={24} className="text-info" />
                                        <span>CV / Resume</span>
                                    </div>
                                    {verification.cv_url ? (
                                        <a
                                            href={verification.cv_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-info"
                                        >
                                            <IconifyIcon icon="solar:eye-bold" width={16} className="me-1" />
                                            View
                                        </a>
                                    ) : (
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary">Not uploaded</span>
                                    )}
                                </div>

                                {/* Profile Picture */}
                                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                                    <div className="d-flex align-items-center gap-2">
                                        <IconifyIcon icon="solar:camera-bold" width={24} className="text-success" />
                                        <span>Profile Picture</span>
                                    </div>
                                    {verification.profile_picture_url ? (
                                        <a
                                            href={verification.profile_picture_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-success"
                                        >
                                            <IconifyIcon icon="solar:eye-bold" width={16} className="me-1" />
                                            View
                                        </a>
                                    ) : (
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary">Not uploaded</span>
                                    )}
                                </div>

                                {/* English Certificates - NEW */}
                                {certificates.length > 0 && (
                                    <div className="mt-3 pt-3 border-top">
                                        <h6 className="text-muted small mb-3">English Certificates</h6>
                                        <div className="d-flex flex-column gap-2">
                                            {certificates.map((cert) => (
                                                <div key={cert.id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <IconifyIcon icon="solar:document-bold" width={20} className="text-warning" />
                                                        <div>
                                                            <span className="small d-block">{cert.certificate_type}</span>
                                                            {cert.score_total && (
                                                                <span className="text-muted small">Score: {cert.score_total}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={cert.document_file_path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-warning"
                                                    >
                                                        <IconifyIcon icon="solar:eye-bold" width={14} className="me-1" />
                                                        View
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Supporting Certificates */}
                                {verification.supporting_certificates_url && verification.supporting_certificates_url.length > 0 && (
                                    <div className="mt-3 pt-3 border-top">
                                        <h6 className="text-muted small mb-3">Supporting Certificates</h6>
                                        <div className="d-flex flex-column gap-2">
                                            {verification.supporting_certificates_url.map((url, idx) => (
                                                <div key={idx} className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <IconifyIcon icon="solar:document-bold" width={20} className="text-secondary" />
                                                        <span className="small">Certificate {idx + 1}</span>
                                                    </div>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-secondary"
                                                    >
                                                        <IconifyIcon icon="solar:eye-bold" width={14} className="me-1" />
                                                        View
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Onboarding Info Card - NEW */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:checklist-bold" width={20} className="me-2" />
                                Onboarding Information
                            </h5>
                        </div>
                        <div className="card-body">
                            {onboardingData ? (
                                <div className="d-flex flex-column gap-3">
                                    {/* LPK */}
                                    <div>
                                        <small className="text-muted">LPK Training Center</small>
                                        <p className="mb-0">
                                            {onboardingData.lpk_name ||
                                                onboardingData.lpk_selection?.other_name ||
                                                (onboardingData.lpk_selection?.none ? 'Did not attend LPK' : 'Not specified')}
                                        </p>
                                    </div>

                                    {/* Interests */}
                                    {onboardingData.interests && onboardingData.interests.length > 0 && (
                                        <div>
                                            <small className="text-muted">Special Interests</small>
                                            <div className="d-flex flex-wrap gap-1 mt-1">
                                                {onboardingData.interests.map((key, idx) => (
                                                    <span key={idx} className="badge bg-info text-white px-2 py-1">
                                                        {INTEREST_LABELS[key] || key}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Company Preferences */}
                                    {onboardingData.company_preferences && onboardingData.company_preferences.length > 0 && (
                                        <div>
                                            <small className="text-muted">Company Type Preferences</small>
                                            <div className="d-flex flex-wrap gap-1 mt-1">
                                                {onboardingData.company_preferences.map((key, idx) => (
                                                    <span key={idx} className="badge bg-primary text-white px-2 py-1">
                                                        {COMPANY_PREF_LABELS[key] || key}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Completion Status */}
                                    <div>
                                        <small className="text-muted">Onboarding Status</small>
                                        <p className="mb-0">
                                            {onboardingData.completed_at ? (
                                                <span className="badge bg-success">
                                                    Completed {new Date(onboardingData.completed_at).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning">Not completed</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <IconifyIcon icon="solar:checklist-linear" width={32} className="mb-2 opacity-50" />
                                    <p className="mb-0">No onboarding data</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Verification Info Card */}
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <IconifyIcon icon="solar:info-circle-bold" width={20} className="me-2" />
                                Verification Info
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <small className="text-muted">Status</small>
                                    <div>{getStatusBadge(verification.status)}</div>
                                </div>
                                <div>
                                    <small className="text-muted">Submitted At</small>
                                    <p className="mb-0">{new Date(verification.submitted_at).toLocaleString()}</p>
                                </div>
                                {verification.verified_at && (
                                    <div>
                                        <small className="text-muted">
                                            {verification.status === 'VERIFIED' ? 'Verified At' : 'Rejected At'}
                                        </small>
                                        <p className="mb-0">{new Date(verification.verified_at).toLocaleString()}</p>
                                    </div>
                                )}
                                {verification.notes && (
                                    <div>
                                        <small className="text-muted">Notes</small>
                                        <p className="mb-0">{verification.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons (Only for SUBMITTED status) */}
                    {isSubmitted && (
                        <div className="card">
                            <div className="card-header bg-white">
                                <h5 className="card-title mb-0">
                                    <IconifyIcon icon="solar:shield-check-bold" width={20} className="me-2" />
                                    Actions
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-success btn-lg"
                                        onClick={handleApprove}
                                        disabled={isProcessing}
                                    >
                                        {approveVerification.isPending ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Approving...
                                            </>
                                        ) : (
                                            <>
                                                <IconifyIcon icon="solar:check-circle-bold" width={20} className="me-2" />
                                                Approve Verification
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-lg"
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={isProcessing}
                                    >
                                        <IconifyIcon icon="solar:close-circle-bold" width={20} className="me-2" />
                                        Reject Verification
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            <RejectModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                isLoading={rejectVerification.isPending}
            />
        </div>
    );
}
