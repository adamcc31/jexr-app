"use client";
import React from "react";
import Link from "next/link";
import { FiCheckCircle, FiHeart, FiShield, FiUsers, FiArrowRight } from "react-icons/fi";

const solutions = [
    {
        icon: FiHeart,
        title: "Career Partner, Not Agent",
        description: "We don't just match CVs with job posts. We understand your journey, goals, and aspirations to find the perfect long-term career fit."
    },
    {
        icon: FiUsers,
        title: "Japanese Culture Experts",
        description: "Our team understands Japanese work culture deeply. We match you with companies that align with your professional values and standards."
    },
    {
        icon: FiShield,
        title: "100% FREE for Candidates",
        description: "Our service is completely free for candidates. No hidden fees, no salary deductions, no strings attached — ever."
    }
];

const benefits = [
    "Specialized matching for Japan-trained talents",
    "Direct connection to Japanese-standard companies",
    "Complete privacy and data protection",
    "Continuous career support and guidance",
    "Long-term relationship focus"
];

export default function SolutionSection() {
    return (
        <section className="section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <span className="badge bg-soft-primary text-primary rounded-pill px-3 py-2 mb-3">
                            Our Approach
                        </span>
                        <h2 className="title mb-3">
                            J-Expert: Your <span className="text-primary">Career Center</span>
                        </h2>
                        <p className="text-muted para-desc mx-auto mb-0">
                            Finally, a place that understands what it means to work in Japan and
                            values the discipline, skills, and culture you've developed.
                        </p>
                    </div>
                </div>

                <div className="row mt-5">
                    {solutions.map((solution, index) => {
                        const Icon = solution.icon;
                        return (
                            <div className="col-lg-4 col-md-6 mt-4 pt-2" key={index}>
                                <div className="card border-0 shadow rounded h-100 text-center p-4">
                                    <div className="card-body">
                                        <div className="bg-soft-primary rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '80px', height: '80px' }}>
                                            <Icon className="text-primary" size={32} />
                                        </div>
                                        <h5 className="title mb-3">{solution.title}</h5>
                                        <p className="text-muted mb-0">{solution.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="row mt-5 pt-4 align-items-center">
                    <div className="col-lg-6">
                        <div className="card bg-primary text-white border-0 rounded-lg overflow-hidden">
                            <div className="card-body p-5">
                                <h4 className="text-white mb-4">What Makes Us Different</h4>
                                <ul className="list-unstyled mb-0">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-warning me-3 flex-shrink-0" size={20} />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 mt-4 mt-lg-0">
                        <div className="ps-lg-4">
                            <h4 className="mb-3">This Is <span className="text-primary">NOT</span> a Broker</h4>
                            <p className="text-muted mb-4">
                                Unlike traditional recruitment agencies that treat candidates as commodities,
                                J-Expert is designed as a <strong>career center</strong> where your growth,
                                safety, and long-term success are our primary focus.
                            </p>
                            <p className="text-muted mb-4">
                                We understand the unique challenges faced by those who have worked in Japan.
                                Your experience is valuable, and you deserve opportunities that recognize that.
                            </p>
                            <Link href="/signup" className="btn btn-outline-primary">
                                Join Our Career Center <FiArrowRight className="ms-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
