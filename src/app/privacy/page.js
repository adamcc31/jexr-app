import React from "react";
import Link from "next/link";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import { FiArrowRight } from "../assets/icons/vander"

export default function Privacy() {
    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Privacy Policy</h5>
                                <p className="text-white-50 para-desc mx-auto mb-0">Last Updated: January 2025</p>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">J Expert</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Privacy</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            <div className="card shadow rounded border-0">
                                <div className="card-body">
                                    <h5 className="card-title">1. Overview</h5>
                                    <p className="text-muted">At J Expert Recruitment (part of Exata Group), we value the privacy of our candidates and corporate clients. This Privacy Policy explains how we collect, use, and protect your personal information when you use our recruitment services or visit our website. By submitting your CV or company details, you consent to the practices described in this policy.</p>
                                    <p className="text-muted">We are committed to managing data in accordance with Indonesian regulations and standard Japanese business ethics regarding information confidentiality.</p>

                                    <h5 className="card-title mt-4">2. Information We Collect</h5>
                                    <p className="text-muted">We collect information necessary to facilitate the recruitment process, including:</p>
                                    <ul className="list-unstyled text-muted mt-3">
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" /><strong>Personal Identification:</strong> Name, contact details, date of birth.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" /><strong>Professional Data:</strong> CV/Resume, work history, Kenshuusei certification, and educational background.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" /><strong>Corporate Data:</strong> Company hiring requirements, job descriptions, and organizational details (for clients).</li>
                                    </ul>

                                    <h5 className="card-title mt-4">3. How We Use Your Information</h5>
                                    <p className="text-muted">We use the collected data strictly for recruitment and placement purposes, such as:</p>
                                    <ul className="list-unstyled text-muted mt-3">
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Matching candidates with suitable Japanese companies in Indonesia.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Verifying work history and Kenshuusei program completion.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Communicating interview schedules and screening results.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Providing training and development program updates.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Internal database management for Exata Group network.</li>
                                    </ul>

                                    <h5 className="card-title mt-4">4. Data Sharing & Disclosure</h5>
                                    <p className="text-muted">We respect your data privacy. However, to provide our services, we may share your information with:</p>
                                    <p className="text-muted">
                                        <b className="text-primary">Potential Employers:</b> CVs and profiles are shared with Japanese companies looking for talent.<br />
                                        <b className="text-primary">Exata Group Affiliates:</b> For administrative and internal matching purposes.<br />
                                        <b className="text-primary">Legal Authorities:</b> If required by law to comply with valid legal processes.
                                    </p>
                                    <p className="text-muted">We do <strong className="text-danger">not</strong> sell your personal data to third-party marketing agencies.</p>

                                    <h5 className="card-title mt-4">5. Data Security</h5>
                                    <p className="text-muted">We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Access to candidate databases is restricted to authorized J Expert Recruitment consultants only.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <ScrollTop />
        </>
    )
}