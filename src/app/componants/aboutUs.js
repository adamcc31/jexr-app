'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


export default function AboutUs({ containerClass }) {
    return (
        <>
            <div className={containerClass}>
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6 col-md-6 mb-5 mt-0">
                        <div className="about-left">
                            <div className="position-relative shadow rounded img-one">
                                <Image src='/images/img/az01.jpg' width={0} height={0} sizes='100vw' style={{ width: '100%', height: 'auto' }} className="img-fluid rounded" alt="" />
                            </div>

                            <div className="img-two shadow rounded p-2 bg-white">
                                <Image src='/images/about/ab02.jpg' width={0} height={0} sizes='100vw' style={{ width: '100%', height: 'auto' }} className="img-fluid rounded" alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6">
                        <div className="section-title ms-lg-5">
                            <h1 className="title mb-3">ABOUT J EXPERT</h1>
                            <h4 className="title mb-3">Specialized Recruitment <br /> for Japanese Companies.</h4>
                            <p className="text-muted para-desc mb-10">Japanese companies in Indonesia often face a unique challenge: <br /> <strong>finding talent who truly understands Japanese discipline, quality, and work culture.</strong></p>
                            <p className="text-muted para-desc mb-10"><strong>J Expert Recruitment</strong> was created to solve that gap.</p>
                            <p className="text-muted para-desc mb-0">We help Japanese companies hire Indonesian talent who are:</p>

                            <ul className="list-unstyled text-muted mb-10 mt-3">
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>Trained in Japan (Kenshuusei)</li>
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>Highly disciplined and reliable</li>
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>Experienced with Japanese SOPs and work ethics</li>
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>or Professional candidates who can quickly adapt</li>
                            </ul>

                            <p className="text-muted para-desc mb-0"><strong>We understand Japanese companies.</strong></p>
                            <p className="text-muted para-desc mb-0"><strong>We understand Indonesian talent.</strong></p>
                            <p className="text-muted para-desc mb-0"><strong>And we bring them together.</strong></p>

                            <div className="mt-4">
                                <Link href="/aboutus" className="btn btn-primary">About Us <i className="mdi mdi-arrow-right align-middle"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}