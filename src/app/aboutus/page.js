import React from "react";
import Link from "next/link";
import Image from "next/image";

import Navbar from "../components/navbar";
import About from "../components/aboutUs"
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import { servicesData, teamData } from "../data/data";
import { FiFacebook, FiInstagram, FiTwitter, FiHelpCircle } from "../assets/icons/vander"

export const metadata = {
    title: {
        absolute: 'About J Expert | Specialist Ex-Kenshusei Recruitment Partner',
    },
    description: 'J Expert is the specialized recruitment partner connecting Japanese companies with disciplined, culturally aligned Indonesian talent (Kenshusei).',
    alternates: {
        canonical: '/aboutus',
    },
}

import BreadcrumbSchema from "@/components/JsonLd/BreadcrumbSchema";

export default function AboutUs() {
    return (
        <>
            <BreadcrumbSchema items={[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/aboutus' }
            ]} />
            <Navbar navClass="defaultscroll sticky" navLight={true} />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 mb-50 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">About Us</h5>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">J EXPERT</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">About us</li>
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
                <About containerClass="container" />
                <br />
                <br />

                <div className="container mt-100 mt-60">
                    <div className="row justify-content-center">
                        <div className="col">
                            <div className="section-title text-center mb-4 pb-2">
                                <h4 className="title mb-3">Why Choose J Expert?</h4>
                                <p className="text-muted para-desc mb-0 mx-auto">
                                    We bridge Japanese Work Ethics with Indonesian Talent, helping companies hire disciplined, high-quality staff who align with Japanese expectations.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4 pt-2">
                        <div className="col-md-6 col-12">
                            <div className="d-flex">
                                <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1" />
                                <div className="flex-1">
                                    <h5 className="mt-0">Who is <span className="text-primary">J Expert</span>?</h5>
                                    <p className="answer text-muted mb-0">
                                        We are a specialized recruitment partner connecting Japanese companies in Indonesia with Japan-trained talent (Kenshuusei) who are highly disciplined and culturally aligned.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kolom 2: Screening Process */}
                        <div className="col-md-6 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                            <div className="d-flex">
                                <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1" />
                                <div className="flex-1">
                                    <h5 className="mt-0">How is the screening process?</h5>
                                    <p className="answer text-muted mb-0">
                                        We use a Japanese-Standard Screening Process. We assess more than skills; we evaluate discipline, cultural alignment, attitude, and the ability to follow detailed SOPs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kolom 3: Talent Source */}
                        <div className="col-md-6 col-12 mt-4 pt-2">
                            <div className="d-flex">
                                <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1" />
                                <div className="flex-1">
                                    <h5 className="mt-0">Where does the talent come from?</h5>
                                    <p className="answer text-muted mb-0">
                                        Backed by Exata Group, we have access to Indonesia's largest network of Kenshuusei returning from Japan—talent with proven work ethics and over 11 years of support history.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kolom 4: Services */}
                        <div className="col-md-6 col-12 mt-4 pt-2">
                            <div className="d-flex">
                                <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1" />
                                <div className="flex-1">
                                    <h5 className="mt-0">What services do you offer?</h5>
                                    <p className="answer text-muted mb-0">
                                        We provide End-to-end Recruitment for staff to managers, Kenshuusei Career Placement, Premium Talent Subscription, and Japan-standard Training & Development programs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-md-5 pt-md-3 mt-4 pt-2 justify-content-center">
                    <div className="col-12 text-center">
                        <div className="section-title">
                            <h4 className="title mb-4">Have Question ? Get in touch!</h4>
                            <p className="text-muted para-desc mx-auto">Start working with <span className="text-primary fw-bold">J Expert</span> that can provide everything <br /> you need to grow your business.</p>
                            <Link href="/contactus" className="btn btn-primary mt-3"><i className="uil uil-phone"></i> Contact us</Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <ScrollTop />
        </>

    )
}