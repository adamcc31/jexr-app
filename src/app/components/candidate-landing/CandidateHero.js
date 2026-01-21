"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiShield, FiHeart, FiAward } from "react-icons/fi";

export default function CandidateHero() {
    return (
        <section className="bg-half-260 d-table w-100 position-relative overflow-hidden">
            {/* Background Image */}
            <Image
                src="/images/hero/bg.jpg"
                alt="Japan-Ready Career Center"
                fill
                priority
                quality={80}
                sizes="100vw"
                style={{ objectFit: 'cover', zIndex: -2 }}
            />
            <div className="bg-overlay bg-primary-gradient-overlay" style={{ zIndex: -1 }}></div>

            <div className="container position-relative" style={{ zIndex: 1 }}>
                <div className="row mt-5 justify-content-center">
                    <div className="col-lg-10">
                        <div className="title-heading text-center">
                            {/* Badge */}
                            <span className="badge bg-soft-light text-light rounded-pill px-3 py-2 mb-3">
                                <FiShield className="me-1" /> 100% FREE Service for Candidates
                            </span>

                            {/* Main Headline */}
                            <h1 className="heading text-white fw-bold mb-4">
                                Career Center for<br />
                                Japan-Standard Companies
                            </h1>

                            {/* Value Proposition */}
                            <p className="para-desc text-white-50 mx-auto mb-4" style={{ fontSize: '1.1rem' }}>
                                Your journey after Japan deserves a partner who truly understands.
                                We connect former Kenshusei and Japan-trained professionals with
                                Japanese companies in Indonesia that value your experience and culture.
                            </p>

                            {/* Trust Points */}
                            <div className="row justify-content-center mb-4">
                                <div className="col-auto">
                                    <div className="d-flex align-items-center text-white-50">
                                        <FiHeart className="text-warning me-2" />
                                        <small>Career Partner, Not Broker</small>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="d-flex align-items-center text-white-50">
                                        <FiAward className="text-warning me-2" />
                                        <small>Japan Culture Specialists</small>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="d-flex align-items-center text-white-50">
                                        <FiShield className="text-warning me-2" />
                                        <small>Your Data is Safe</small>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="mt-4">
                                <Link href="/signup" className="btn btn-warning btn-lg px-5 py-3 fw-semibold shadow-lg">
                                    Register & Complete Your Profile
                                    <FiArrowRight className="ms-2" />
                                </Link>
                                <p className="text-white-50 mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
                                    <FiShield className="me-1" /> Your personal information is protected and never shared without consent
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
