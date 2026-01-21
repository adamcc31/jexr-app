"use client";
import React from "react";
import { FiCheckCircle, FiTarget, FiShield, FiUsers, FiTrendingUp, FiHeart, FiDollarSign } from "react-icons/fi";

const differentiators = [
    {
        icon: FiTarget,
        title: "Japan Talent Specialization",
        description: "We exclusively focus on Japan-trained Indonesian professionals. This is our expertise, not a side business."
    },
    {
        icon: FiCheckCircle,
        title: "Japanese-Standard Screening",
        description: "Our evaluation process mirrors Japanese company standards, ensuring genuine culture and skill alignment."
    },
    {
        icon: FiUsers,
        title: "Career Matching, Not CV Dumping",
        description: "We don't mass-send your CV. We carefully match you with companies where you'll truly thrive."
    },
    {
        icon: FiHeart,
        title: "End-to-End Candidate Support",
        description: "From registration to onboarding, we guide you through every step of your career journey."
    },
    {
        icon: FiTrendingUp,
        title: "Long-Term Career Focus",
        description: "We're invested in your career growth, not just in filling positions. Your success is our success."
    },
    {
        icon: FiDollarSign,
        title: "100% FREE for Candidates",
        description: "No fees, no salary cuts, no hidden charges — our service is always free for job seekers."
    }
];

export default function WhyDifferent() {
    return (
        <section className="section bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <span className="badge bg-soft-primary text-primary rounded-pill px-3 py-2 mb-3">
                            Our Commitment
                        </span>
                        <h2 className="title mb-3">
                            Why <span className="text-primary">J-Expert</span> Is Different
                        </h2>
                        <p className="text-muted para-desc mx-auto mb-0">
                            We're not just another recruitment agency. Here's what sets us apart
                            and makes us the right choice for your career.
                        </p>
                    </div>
                </div>

                <div className="row mt-5">
                    {differentiators.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div className="col-lg-4 col-md-6 mt-4 pt-2" key={index}>
                                <div className="d-flex align-items-start">
                                    <div className="bg-primary rounded-circle p-2 me-3 flex-shrink-0">
                                        <Icon className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h6 className="title mb-2">{item.title}</h6>
                                        <p className="text-muted small mb-0">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="row mt-5 pt-4">
                    <div className="col-12">
                        <div className="card bg-primary border-0 rounded-lg overflow-hidden">
                            <div className="card-body p-5 text-center">
                                <FiShield className="text-warning mb-3" size={48} />
                                <h4 className="text-white mb-3">Your Trust Is Our Foundation</h4>
                                <p className="text-white-50 mb-0 mx-auto" style={{ maxWidth: '600px' }}>
                                    We understand that submitting your personal data requires trust.
                                    That's why we treat every candidate's information with the utmost
                                    confidentiality and only share your profile with companies you've approved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
