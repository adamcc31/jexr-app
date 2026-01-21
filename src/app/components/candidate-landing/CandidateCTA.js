"use client";
import React from "react";
import Link from "next/link";
import { FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";

const reassurances = [
    "Your data is 100% protected and never shared without your consent",
    "Our service is always FREE for candidates — no hidden fees ever",
    "Complete honesty in your profile leads to better career matches",
    "We're here to support you, not exploit you"
];

export default function CandidateCTA() {
    return (
        <section className="section bg-primary position-relative overflow-hidden" style={{ backgroundImage: "url('/images/bg2.png')", backgroundPosition: 'center' }}>
            <div className="container position-relative" style={{ zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card bg-white border-0 shadow-lg rounded-lg overflow-hidden">
                            <div className="row g-0">
                                {/* Left Side - Content */}
                                <div className="col-lg-7 order-2 order-lg-1">
                                    <div className="card-body p-5">
                                        <span className="badge bg-soft-primary text-primary rounded-pill px-3 py-2 mb-3">
                                            <FiShield className="me-1" /> Safe & Trusted
                                        </span>

                                        <h3 className="title mb-3">
                                            Ready to Find Your<br />
                                            <span className="text-primary">Dream Career?</span>
                                        </h3>

                                        <p className="text-muted mb-4">
                                            Join hundreds of Japan-trained professionals who have found
                                            their ideal career path through J-Expert. Your journey to a
                                            fulfilling career in Japanese-standard companies starts here.
                                        </p>

                                        <ul className="list-unstyled mb-4">
                                            {reassurances.map((item, index) => (
                                                <li key={index} className="mb-2 d-flex align-items-start">
                                                    <FiCheckCircle className="text-success me-2 mt-1 flex-shrink-0" />
                                                    <span className="text-muted">{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-4">
                                            <Link href="/signup" className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow">
                                                Register & Complete Your Profile
                                                <FiArrowRight className="ms-2" />
                                            </Link>
                                        </div>

                                        <p className="text-muted small mt-3 mb-0">
                                            <em>
                                                Tip: Complete and honest profiles get matched faster
                                                with the best opportunities.
                                            </em>
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side - Visual Element */}
                                <div className="col-lg-5 order-1 order-lg-2 bg-soft-primary">
                                    <div className="d-flex flex-column justify-content-center align-items-center h-100 p-5 text-center">
                                        <div className="mb-4">
                                            <div className="bg-primary rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: '120px', height: '120px' }}>
                                                <FiShield className="text-white" size={48} />
                                            </div>
                                        </div>
                                        <h4 className="text-primary mb-2">100% FREE</h4>
                                        <p className="text-muted mb-4">
                                            No registration fees.<br />
                                            No salary deductions.<br />
                                            No hidden charges.
                                        </p>
                                        <div className="d-flex flex-column gap-2">
                                            <span className="badge bg-white text-primary px-3 py-2 shadow-sm">
                                                Data Privacy Guaranteed
                                            </span>
                                            <span className="badge bg-white text-primary px-3 py-2 shadow-sm">
                                                Career Support Included
                                            </span>
                                            <span className="badge bg-white text-primary px-3 py-2 shadow-sm">
                                                Long-term Partnership
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
