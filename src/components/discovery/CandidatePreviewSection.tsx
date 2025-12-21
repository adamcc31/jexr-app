'use client';

/**
 * CandidatePreviewSection Component
 *
 * Displays anonymous candidate pool preview for employers.
 * Shows aggregated data only - NO personal identifying information.
 *
 * Privacy Rules:
 * - NO name, photo, contact, or company history
 * - Only language level, skills, and experience range
 */

import React from 'react';
import Link from 'next/link';
import { useCandidatePreviews } from '@/hooks/useDiscovery';
import type { CandidatePreview } from '@/types/job';
import { FiUsers, FiGlobe, FiAward, FiClock, FiLock, FiArrowRight } from 'react-icons/fi';

// Candidate Preview Card - Anonymous data only
function CandidatePreviewCard({ candidate }: { candidate: CandidatePreview }) {
    return (
        <div className="col-lg-4 col-md-6 col-12">
            <div className="card border-0 shadow rounded-3 h-100">
                <div className="card-body p-4">
                    {/* Anonymous Avatar */}
                    <div className="d-flex align-items-center mb-3">
                        <div
                            className="avatar avatar-md-md rounded-circle bg-soft-primary d-flex align-items-center justify-content-center"
                            style={{ width: 60, height: 60 }}
                        >
                            <FiUsers className="text-primary" style={{ fontSize: 28 }} />
                        </div>
                        <div className="ms-3">
                            <span className="badge bg-soft-success text-success mb-1">
                                Available
                            </span>
                            <p className="text-muted small mb-0">
                                <FiLock className="me-1" /> Identity Protected
                            </p>
                        </div>
                    </div>

                    {/* Language Level */}
                    <div className="d-flex align-items-center mb-2">
                        <FiGlobe className="text-primary me-2" />
                        <span className="text-dark fw-medium">Japanese Level:</span>
                        <span className="badge bg-primary ms-2">{candidate.language_level}</span>
                    </div>

                    {/* Experience */}
                    <div className="d-flex align-items-center mb-3">
                        <FiClock className="text-primary me-2" />
                        <span className="text-dark fw-medium">Experience:</span>
                        <span className="text-muted ms-2">{candidate.experience_range}</span>
                    </div>

                    {/* Skills */}
                    <div className="mb-0">
                        <div className="d-flex align-items-center mb-2">
                            <FiAward className="text-primary me-2" />
                            <span className="text-dark fw-medium">Skills:</span>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                            {candidate.skills.map((skill, index) => (
                                <span key={index} className="badge bg-soft-secondary text-secondary">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading skeleton
function CandidatePreviewSkeleton() {
    return (
        <div className="col-lg-4 col-md-6 col-12">
            <div className="card border-0 shadow rounded-3 h-100">
                <div className="card-body p-4 placeholder-glow">
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar avatar-md-md rounded-circle bg-secondary placeholder" style={{ width: 60, height: 60 }}></div>
                        <div className="ms-3">
                            <div className="placeholder col-8 mb-2" style={{ height: 16 }}></div>
                            <div className="placeholder col-6" style={{ height: 14 }}></div>
                        </div>
                    </div>
                    <div className="placeholder col-10 mb-2"></div>
                    <div className="placeholder col-8 mb-3"></div>
                    <div className="d-flex gap-1">
                        <span className="placeholder col-3"></span>
                        <span className="placeholder col-4"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CandidatePreviewSection() {
    const { data: candidates, isLoading, error } = useCandidatePreviews();

    return (
        <div className="container">
            <div className="row justify-content-center mb-4">
                <div className="col-12 text-center">
                    <h4 className="title mb-3">Candidate Pool Preview</h4>
                    <p className="text-muted para-desc mx-auto mb-0">
                        Discover qualified candidates ready to work in Japan.
                        <br />
                        <small className="text-primary">
                            <FiLock className="me-1" />
                            Candidate identities are protected until you connect.
                        </small>
                    </p>
                </div>
            </div>

            <div className="row g-4">
                {/* Loading State */}
                {isLoading && (
                    <>
                        <CandidatePreviewSkeleton />
                        <CandidatePreviewSkeleton />
                        <CandidatePreviewSkeleton />
                        <CandidatePreviewSkeleton />
                        <CandidatePreviewSkeleton />
                        <CandidatePreviewSkeleton />
                    </>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="col-12">
                        <div className="alert alert-warning text-center">
                            <i className="mdi mdi-alert-circle me-2"></i>
                            Unable to load candidate previews. Please try again later.
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && candidates?.length === 0 && (
                    <div className="col-12">
                        <div className="text-center py-5">
                            <FiUsers className="text-muted mb-3" style={{ fontSize: 48 }} />
                            <h5 className="text-muted">No candidates available</h5>
                            <p className="text-muted">Check back later for new candidates!</p>
                        </div>
                    </div>
                )}

                {/* Candidates Grid */}
                {!isLoading && !error && candidates?.map((candidate, index) => (
                    <CandidatePreviewCard key={index} candidate={candidate} />
                ))}
            </div>

            {/* CTA for Employers */}
            {!isLoading && !error && candidates && candidates.length > 0 && (
                <div className="row mt-4">
                    <div className="col-12 text-center">
                        <div className="p-4 bg-soft-primary rounded-3">
                            <h5 className="mb-3">Want to connect with these candidates?</h5>
                            <p className="text-muted mb-3">
                                Create an employer account to view full candidate profiles and start hiring.
                            </p>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Link href="/comingsoon" className="btn btn-primary">
                                    Sign Up as Employer <FiArrowRight className="ms-1" />
                                </Link>
                                <Link href="/auth/login" className="btn btn-outline-primary">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
