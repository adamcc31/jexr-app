'use client';

import React from "react";
import Link from "next/link";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import CandidatePreviewSection from "@/components/discovery/CandidatePreviewSection";

export default function CandidatePool() {
    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            {/* Hero Section */}
            <section
                className="bg-half-170 d-table w-100"
                style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}
            >
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                                    Candidate Pool
                                </h5>
                                <p className="text-white-50 mt-2 mb-0">
                                    Discover qualified candidates ready to work in Japan
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item">
                                    <Link href="/">J Expert</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Candidate Pool
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>

            {/* Shape Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Candidate Pool Section */}
            <section className="section">
                <CandidatePreviewSection />
            </section>

            <Footer top={undefined} />
            <ScrollTop />
        </>
    );
}
