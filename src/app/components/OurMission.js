"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function OurMission() {
    return (
        <section className="section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6 order-2 order-md-1 mt-4 mt-sm-0 pt-2 pt-sm-0">
                        <div className="position-relative">
                            <Image
                                src="/images/work/pab.jpg"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                                className="rounded img-fluid shadow-lg"
                                alt="Our Mission"
                            />
                            <div className="img-overlay bg-overlay"></div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 order-1 order-md-2">
                        <div className="section-title ms-lg-5">
                            <h4 className="title mb-3">Our Mission: <br /> Empowering Japanese Companies with Top Talent</h4>
                            <p className="text-muted">We are dedicated to bridging the gap between Indonesian talent and Japanese corporate needs. Our mission is to ensure seamless integration and long-term success for both employers and employees.</p>

                            <ul className="list-unstyled text-muted">
                                <li className="mb-1">
                                    <span className="text-primary h5 me-2">
                                        <FiCheckCircle className="align-middle" />
                                    </span>
                                    Trusted recruitment partner for Japanese companies
                                </li>
                                <li className="mb-1">
                                    <span className="text-primary h5 me-2">
                                        <FiCheckCircle className="align-middle" />
                                    </span>
                                    Disciplined, high-quality talent aligned with Japanese work culture
                                </li>
                                <li className="mb-1">
                                    <span className="text-primary h5 me-2">
                                        <FiCheckCircle className="align-middle" />
                                    </span>
                                    Largest career hub for Kenshuusei in Indonesia
                                </li>
                            </ul>

                            <div className="mt-4">
                                <Link href="#" className="btn btn-primary">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
