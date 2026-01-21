"use client";
import React from "react";
import { FiAward, FiGlobe, FiMessageCircle, FiHeart, FiBriefcase } from "react-icons/fi";

const qualifications = [
    {
        icon: FiGlobe,
        title: "Japanese Language Proficiency",
        description: "JLPT N5 to N1 certified or equivalent Japanese language ability",
        levels: ["N1", "N2", "N3", "N4", "N5"]
    },
    {
        icon: FiBriefcase,
        title: "Japan Work Experience",
        description: "Former Kenshusei, Tokutei Ginou, or professional work in Japan",
        tags: ["Kenshusei", "Tokutei Ginou", "Technical Intern", "Worker"]
    },
    {
        icon: FiMessageCircle,
        title: "Professional Communication",
        description: "Ability to communicate professionally in Japanese business contexts",
        tags: ["Business Japanese", "Keigo", "Written Communication"]
    },
    {
        icon: FiHeart,
        title: "Japanese Work Ethics",
        description: "Understanding and appreciation of Japanese work culture and values",
        tags: ["Discipline", "Teamwork", "Punctuality", "Dedication"]
    }
];

export default function QualificationSection() {
    return (
        <section className="section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <span className="badge bg-soft-success text-success rounded-pill px-3 py-2 mb-3">
                            <FiAward className="me-1" /> Ideal Candidates
                        </span>
                        <h2 className="title mb-3">
                            Are You a <span className="text-primary">Japan-Ready Talent?</span>
                        </h2>
                        <p className="text-muted para-desc mx-auto mb-0">
                            If you have these qualifications, J-Expert is the perfect
                            career partner to help you find opportunities that truly match your skills.
                        </p>
                    </div>
                </div>

                <div className="row mt-5">
                    {qualifications.map((qual, index) => {
                        const Icon = qual.icon;
                        return (
                            <div className="col-lg-6 mt-4 pt-2" key={index}>
                                <div className="card border-0 shadow-sm rounded h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-soft-primary rounded-circle p-3 me-3 flex-shrink-0">
                                                <Icon className="text-primary" size={24} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="title mb-2">{qual.title}</h5>
                                                <p className="text-muted small mb-3">{qual.description}</p>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {qual.levels ? (
                                                        qual.levels.map((level, idx) => (
                                                            <span key={idx} className="badge bg-primary rounded-pill px-3 py-2">
                                                                {level}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        qual.tags.map((tag, idx) => (
                                                            <span key={idx} className="badge bg-soft-primary text-primary rounded-pill px-2 py-1">
                                                                {tag}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="row mt-5 pt-3">
                    <div className="col-lg-8 mx-auto">
                        <div className="card bg-soft-primary border-0 rounded-lg">
                            <div className="card-body p-4 text-center">
                                <h5 className="text-primary mb-2">Not sure if you qualify?</h5>
                                <p className="text-muted mb-0">
                                    Don't worry! Register anyway and our team will help evaluate
                                    your profile and find the best opportunities for you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
