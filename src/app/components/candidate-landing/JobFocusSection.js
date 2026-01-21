"use client";
import React from "react";
import Link from "next/link";
import { FiBookOpen, FiMessageSquare, FiFileText, FiBriefcase, FiArrowRight } from "react-icons/fi";

const jobCategories = [
    {
        icon: FiBookOpen,
        title: "Japanese Teacher",
        titleJp: "日本語教師 (Sensei)",
        description: "Share your language skills and cultural knowledge with eager learners in educational institutions.",
        positions: ["LPK Instructor", "Corporate Language Trainer", "School Teacher"]
    },
    {
        icon: FiMessageSquare,
        title: "Japanese Translator",
        titleJp: "通訳・翻訳者",
        description: "Bridge communication gaps between Indonesian and Japanese teams in business settings.",
        positions: ["Document Translator", "Interpreter", "Localization Specialist"]
    },
    {
        icon: FiFileText,
        title: "Japanese Admin",
        titleJp: "事務担当者",
        description: "Handle documentation, correspondence, and administrative tasks in Japanese work environments.",
        positions: ["Administrative Assistant", "Document Controller", "Secretary"]
    },
    {
        icon: FiBriefcase,
        title: "Other Roles",
        titleJp: "その他の職種",
        description: "Various positions in Japanese companies that value Japan-trained Indonesian professionals.",
        positions: ["Quality Control", "Production Staff", "Customer Service"]
    }
];

export default function JobFocusSection() {
    return (
        <section className="section bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <span className="badge bg-soft-primary text-primary rounded-pill px-3 py-2 mb-3">
                            Career Opportunities
                        </span>
                        <h2 className="title mb-3">
                            Positions We <span className="text-primary">Specialize In</span>
                        </h2>
                        <p className="text-muted para-desc mx-auto mb-0">
                            We focus on roles where your Japanese language skills and
                            cultural understanding truly shine and are valued.
                        </p>
                    </div>
                </div>

                <div className="row mt-5">
                    {jobCategories.map((job, index) => {
                        const Icon = job.icon;
                        return (
                            <div className="col-lg-6 col-md-6 mt-4 pt-2" key={index}>
                                <div className="card border-0 shadow rounded h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex">
                                            <div className="bg-soft-primary rounded p-3 me-3 flex-shrink-0">
                                                <Icon className="text-primary" size={28} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="title mb-1">{job.title}</h5>
                                                <small className="text-primary fw-medium">{job.titleJp}</small>
                                                <p className="text-muted mt-2 mb-3">{job.description}</p>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {job.positions.map((position, idx) => (
                                                        <span key={idx} className="badge bg-soft-secondary text-secondary rounded-pill px-2 py-1">
                                                            {position}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <Link href="/job-categories" className="btn btn-primary btn-lg px-4">
                            View All Job Openings <FiArrowRight className="ms-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
