'use client';
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { submitContactForm } from "@/lib/contact-api";

import { contactData } from "../data/data";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

export default function ContactUs() {
    const form = useRef();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const sendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const formData = {
            name: form.current.user_name.value,
            email: form.current.user_email.value,
            subject: form.current.subject.value,
            message: form.current.message.value,
        };

        try {
            const response = await submitContactForm(formData);
            setStatus({ type: 'success', message: response.message });
            e.target.reset();
        } catch (error) {
            console.error('Contact form error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
            setStatus({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: "url('/images/hero/bg.jpg')", backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <p className="text-white-50 para-desc mx-auto mb-0">Get in touch !</p>
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Contact us</h5>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item"><Link href="/">J Expert</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Contact us</li>
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

            <section className="section pb-0">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <Image src="/images/svg/contact.svg" width={0} height={0} sizes="100vw" style={{ width: '100%', height: "auto" }} className="img-fluid" alt="Contact illustration" />
                        </div>

                        <div className="col-md-6">
                            <div className="p-4 rounded shadow ms-lg-5">
                                <h4>Get in touch !</h4>
                                {/* Form Logic Integration */}
                                <form className="mt-4" ref={form} onSubmit={sendEmail}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Your Name <span className="text-danger">*</span></label>
                                                <input name="user_name" id="name" type="text" className="form-control" placeholder="Name :" required />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Your Email <span className="text-danger">*</span></label>
                                                <input name="user_email" id="email" type="email" className="form-control" placeholder="Email :" required />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Subject</label>
                                                <input name="subject" id="subject" className="form-control" placeholder="Subject :" required />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Comments <span className="text-danger">*</span></label>
                                                <textarea name="message" id="comments" rows="4" className="form-control" placeholder="Message :" required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-grid">
                                                <button type="submit" id="submit" name="send" className="btn btn-primary" disabled={loading}>
                                                    {loading ? 'Sending...' : 'Send Message'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Status Message */}
                                    {status.message && (
                                        <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3 mb-0`} role="alert">
                                            {status.message}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <br />

                <div className="container mt-100 mt-60">
                    <div className="row g-4">
                        {contactData.map((item, index) => {
                            let Icon = item.icon
                            return (
                                <div className="col-md-4" key={index}>
                                    <div className="position-relative features text-center mx-lg-4 px-md-1">
                                        <div className="feature-icon bg-soft-primary rounded shadow mx-auto position-relative overflow-hidden d-flex justify-content-center align-items-center">
                                            <Icon className="fea icon-ex-md" />
                                        </div>

                                        <div className="mt-4">
                                            <h5 className="mb-3">{item.title}</h5>
                                            <p className="text-muted">{item.desc}</p>
                                            <Link href={item.link} className="text-primary">{item.link}</Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <br />
                <br />

                <div className="container-fluid mt-100 mt-60">
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="card map border-0">
                                <div className="card-body p-0">
                                    {/* Google Maps Embed Updated to valid HTTPS */}
                                    <iframe
                                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBxfTB3KPUcU_xC2r_sBD0BAOvxgYfLgaE&q=Exata+Indonesia"
                                        title="J Expert Operational Office"
                                        width="100%"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
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