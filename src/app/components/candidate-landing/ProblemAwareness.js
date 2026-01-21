"use client";
import React from "react";
import { FiAlertCircle, FiTrendingDown, FiFrown, FiXCircle } from "react-icons/fi";

const problems = [
    {
        icon: FiXCircle,
        title: "Cultural Mismatch",
        description: "Working in local companies that don't understand or appreciate Japanese work culture and values you've developed.",
        color: "danger"
    },
    {
        icon: FiFrown,
        title: "Underutilized Experience",
        description: "Your valuable Japan training and expertise go unrecognized, forcing you into roles that don't match your capabilities.",
        color: "warning"
    },
    {
        icon: FiAlertCircle,
        title: "Wrong Work Environment",
        description: "Struggling to adapt back to work environments that lack the structure, discipline, and professionalism you're used to.",
        color: "info"
    },
    {
        icon: FiTrendingDown,
        title: "Career Stagnation",
        description: "Without proper guidance, your career path becomes unclear, leading to opportunities that don't align with your long-term goals.",
        color: "secondary"
    }
];

export default function ProblemAwareness() {
    return (
        <section className="section bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <span className="badge bg-soft-danger text-danger rounded-pill px-3 py-2 mb-3">
                            Common Challenges
                        </span>
                        <h2 className="title mb-3">
                            The Struggles of <span className="text-primary">Japan-Ready Talents</span>
                        </h2>
                        <p className="text-muted para-desc mx-auto mb-0">
                            After returning from Japan, many talented professionals face challenges
                            finding the right career path that values their unique experience.
                        </p>
                    </div>
                </div>

                <div className="row mt-5">
                    {problems.map((problem, index) => {
                        const Icon = problem.icon;
                        return (
                            <div className="col-lg-6 col-md-6 mt-4 pt-2" key={index}>
                                <div className="card border-0 shadow rounded h-100 hover-shadow-lg transition-all">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-start">
                                            <div className={`bg-soft-${problem.color} rounded-circle p-3 me-3`}>
                                                <Icon className={`text-${problem.color} h4 mb-0`} size={24} />
                                            </div>
                                            <div>
                                                <h5 className="title mb-2">{problem.title}</h5>
                                                <p className="text-muted mb-0">{problem.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="row mt-5 pt-3">
                    <div className="col-12 text-center">
                        <div className="alert alert-primary border-0 rounded-lg py-4" role="alert">
                            <p className="mb-0 fw-medium">
                                <strong>Sound familiar?</strong> You're not alone. That's exactly why
                                J-Expert exists — to bridge your Japan experience with the right career opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
