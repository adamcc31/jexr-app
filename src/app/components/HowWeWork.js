"use client";
import React from "react";
import { FiSearch, FiCheckSquare, FiTarget, FiUserCheck, FiLifeBuoy } from "react-icons/fi";

export default function HowWeWork() {
    const steps = [
        {
            icon: FiSearch,
            title: "Understanding Your Requirements",
            desc: "We deeply analyze your company culture, expectations, and specific hiring needs to ensure a perfect alignment."
        },
        {
            icon: FiCheckSquare,
            title: "Japanese-Standard Screening",
            desc: "Candidates are shortlisted based on three pillars: technical competence, strong work ethic, and cultural fit."
        },
        {
            icon: FiTarget,
            title: "Precise Matching",
            desc: "We align candidate profiles with your company's long-term goals to ensure sustainable and effective placements."
        },
        {
            icon: FiUserCheck,
            title: "Final Interview & Placement",
            desc: "We facilitate the interviewing process and handle all coordination to ensure a smooth onboarding experience."
        },
        {
            icon: FiLifeBuoy,
            title: "Post-Hiring Support",
            desc: "Our commitment continues with support during the first weeks to ensure smooth adaptation and integration."
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="title mb-3">How We Work</h4>
                            <p className="text-muted para-desc mx-auto mb-0">
                                A structured, step-by-step process ensuring quality, compliance, and long-term success.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
                                <div className="card border-0 text-center features feature-primary feature-clean">
                                    <div className="icons text-center mx-auto">
                                        <Icon className="d-block rounded h3 mb-0" />
                                    </div>
                                    <div className="content mt-4">
                                        <h5 className="title text-dark">{index + 1}. {step.title}</h5>
                                        <p className="text-muted mb-0 mt-3">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
