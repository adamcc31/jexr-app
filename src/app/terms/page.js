import React from 'react';
import Link from 'next/link';

import Navbar from "../components/navbar";
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';

import { FiArrowRight } from "../assets/icons/vander"

export default function Terms() {
    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Terms of Service</h5>
                                <p className="text-white-50 para-desc mx-auto mb-0">Effective Date: January 1, 2025</p>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">J Expert</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Terms & Conditions</li>
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
                            <div className="card shadow border-0 rounded">
                                <div className="card-body">
                                    <h5 className="card-title">1. Introduction</h5>
                                    <p className="text-muted">Welcome to J Expert. These Terms of Service ("Terms") govern your use of our recruitment services and website. By accessing our platform or engaging our services to hire Indonesian talent or Kenshuusei (Japan-trained trainees), you agree to comply with these Terms. J Expert operates under the Exata Group, specializing in connecting Japanese companies in Indonesia with high-quality, disciplined talent.</p>

                                    <h5 className="card-title mt-4">2. Services Scope</h5>
                                    <p className="text-muted">J Expert provides recruitment and consultation services, including but not limited to:</p>
                                    <ul className="list-unstyled text-muted">
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Sourcing and screening of Japan-trained talent (Kenshuusei).</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />End-to-end recruitment for staff to managerial positions.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Consultation on Japanese work culture and SOP alignment.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Training programs focused on discipline and work ethics.</li>
                                    </ul>

                                    <h5 className="card-title mt-4">3. User Obligations</h5>
                                    <p className="text-muted">By using our services, you agree to:</p>
                                    <p className="text-muted">
                                        <b className="text-primary">Accurate Information:</b> Provide truthful and up-to-date information regarding your company's hiring needs and job descriptions.<br />
                                        <b className="text-primary">Fair Practice:</b> Treat all candidates referred by J Expert with respect and fairness, adhering to Indonesian labor laws.<br />
                                        <b className="text-primary">Confidentiality:</b> Maintain the confidentiality of candidate data (CVs, personal details) provided by J Expert and use it solely for recruitment purposes.
                                    </p>

                                    <h5 className="card-title mt-4">4. Limitations & Restrictions</h5>
                                    <p className="text-muted">You are specifically restricted from:</p>
                                    <ul className="list-unstyled text-muted">
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Redistributing candidate data to third parties without consent.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Bypassing J Expert to hire presented candidates directly to avoid service fees.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Using our platform to post misleading or fraudulent job vacancies.</li>
                                        <li className="mt-2"><FiArrowRight className="fea icon-sm me-2" />Engaging in discriminatory hiring practices.</li>
                                    </ul>

                                    <h5 className="card-title mt-4">5. Fees and Payment</h5>
                                    <p className="text-muted">Service fees for successful placements or subscription packages (Premium Talent Subscription) are outlined in a separate Service Agreement signed by the client. Payment terms are strictly 30 days from the invoice date unless stated otherwise.</p>

                                    <div className="mt-4 pt-2 border-top">
                                        <p className="text-muted mb-3">By clicking "Accept", you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
                                        <Link href="#" className="btn btn-primary mt-2 me-2">Accept Terms</Link>
                                        <Link href="#" className="btn btn-outline-primary mt-2">Decline</Link>
                                    </div>
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