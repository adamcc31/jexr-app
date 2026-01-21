"use client";
import React from "react";
import { FiUserPlus, FiFileText, FiSearch, FiTarget, FiUsers, FiCheckCircle } from "react-icons/fi";

const steps = [
    {
        icon: FiUserPlus,
        step: 1,
        title: "Register",
        description: "Create your free account in minutes"
    },
    {
        icon: FiFileText,
        step: 2,
        title: "Complete Profile",
        description: "Fill in your details and upload documents"
    },
    {
        icon: FiSearch,
        step: 3,
        title: "Screening",
        description: "Our team reviews your qualifications"
    },
    {
        icon: FiTarget,
        step: 4,
        title: "Career Matching",
        description: "We match you with ideal opportunities"
    },
    {
        icon: FiUsers,
        step: 5,
        title: "Interview",
        description: "We coordinate interviews with companies"
    },
    {
        icon: FiCheckCircle,
        step: 6,
        title: "Placement",
        description: "Onboarding support for your new role"
    }
];

export default function PlacementProcess() {
    return (
        <section className="section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <span className="badge bg-soft-primary text-primary rounded-pill px-3 py-2 mb-3">
                            How It Works
                        </span>
                        <h2 className="title mb-3">
                            Your <span className="text-primary">Career Journey</span> With Us
                        </h2>
                        <p className="text-muted para-desc mx-auto mb-0">
                            A simple, transparent process designed to find you the perfect
                            career match in Japanese-standard companies.
                        </p>
                    </div>
                </div>

                <div className="row mt-5">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isLast = index === steps.length - 1;
                        return (
                            <div className="col-lg-2 col-md-4 col-6 mt-4 pt-2 text-center" key={index}>
                                <div className="position-relative">
                                    {/* Step Number */}
                                    <div
                                        className="bg-primary rounded-circle d-inline-flex justify-content-center align-items-center mx-auto mb-3 position-relative"
                                        style={{ width: '80px', height: '80px' }}
                                    >
                                        <Icon className="text-white" size={28} />
                                        <span
                                            className="position-absolute bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center fw-bold"
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                top: '-5px',
                                                right: '-5px',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {step.step}
                                        </span>
                                    </div>

                                    {/* Connector Line (hidden on last item and mobile) */}
                                    {!isLast && (
                                        <div
                                            className="position-absolute d-none d-lg-block"
                                            style={{
                                                top: '40px',
                                                left: 'calc(50% + 45px)',
                                                width: 'calc(100% - 90px)',
                                                height: '2px',
                                                background: 'linear-gradient(90deg, #092955 0%, rgba(9, 41, 85, 0.3) 100%)'
                                            }}
                                        ></div>
                                    )}
                                </div>

                                <h6 className="title mb-1">{step.title}</h6>
                                <small className="text-muted">{step.description}</small>
                            </div>
                        );
                    })}
                </div>

                <div className="row mt-5 pt-3">
                    <div className="col-lg-8 mx-auto">
                        <div className="alert alert-light border shadow-sm rounded-lg py-4" role="alert">
                            <div className="d-flex align-items-center">
                                <FiCheckCircle className="text-success me-3 flex-shrink-0" size={32} />
                                <div>
                                    <h6 className="mb-1">Completely Transparent Process</h6>
                                    <p className="text-muted mb-0 small">
                                        You'll always know where you stand. No hidden steps, no surprise fees,
                                        no unwanted CV distributions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
