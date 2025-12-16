"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

export default function ClientCTA() {
    return (
        <section className="section bg-primary" style={{ backgroundImage: "url('/images/bg2.png')", backgroundPosition: 'center' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-lg border-0 rounded overflow-hidden">
                            <div className="row g-0">
                                <div className="col-md-5 order-2 order-md-1">
                                    <div className="position-relative h-100 w-100">
                                        <Image
                                            src="/images/hero/bg.jpg"
                                            fill
                                            className="object-fit-cover"
                                            alt="Client CTA"
                                        />
                                    </div>
                                </div>

                                <div className="col-md-7 order-1 order-md-2 bg-white">
                                    <div className="card-body p-5">
                                        <h4 className="title mb-3">Ready to Build a Strong, <br /> Japan-Ready Team?</h4>
                                        <p className="text-muted">
                                            J Expert is your trusted partner in finding disciplined, high-quality talent aligned with Japanese work culture. We understand your needs and deliver results.
                                        </p>

                                        <div className="row">
                                            <div className="col-12">
                                                <ul className="list-unstyled text-muted mt-3">
                                                    <li className="mb-2 d-flex align-items-center"><FiCheckCircle className="text-primary me-2" /> Disciplined & Trained Talent</li>
                                                    <li className="mb-2 d-flex align-items-center"><FiCheckCircle className="text-primary me-2" /> Proven Reliability & Performance</li>
                                                    <li className="mb-2 d-flex align-items-center"><FiCheckCircle className="text-primary me-2" /> Strong Cultural Alignment</li>
                                                    <li className="mb-2 d-flex align-items-center"><FiCheckCircle className="text-primary me-2" /> Long-term Loyalty & Commitment</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <Link href="#" className="btn btn-primary me-2 mt-2">
                                                Get in Touch <FiArrowRight className="align-middle ms-1" />
                                            </Link>
                                            <Link href="#" className="btn btn-outline-primary mt-2">
                                                Book Consultation
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
