'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'your email';

    return (
        <section className="bg-home d-flex align-items-center" style={{ backgroundImage: "url('/images/hero/bg3.jpg')", backgroundPosition: 'center' }}>
            <div className="bg-overlay bg-linear-gradient-2"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 col-md-6 col-12">
                        <div className="p-4 bg-white rounded shadow-md mx-auto" style={{ maxWidth: '450px' }}>
                            <div className="text-center">
                                <Link href="/">
                                    <Image src="/images/logo-dark.png" width={120} height={30} className="mb-4 d-block mx-auto" alt="Logo" />
                                </Link>

                                {/* Success Icon */}
                                <div className="mb-4">
                                    <div className="avatar avatar-lg-lg bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>

                                <h4 className="fw-bold mb-3">Check Your Email!</h4>

                                <p className="text-muted mb-4">
                                    We've sent a confirmation link to <strong>{email}</strong>.
                                    Please click the link in your email to verify your account.
                                </p>

                                <div className="alert alert-light border py-3 px-4 text-start" role="alert">
                                    <h6 className="fw-semibold mb-2">
                                        <i className="mdi mdi-information-outline me-1"></i>
                                        Didn't receive the email?
                                    </h6>
                                    <ul className="small text-muted mb-0 ps-3">
                                        <li>Check your spam or junk folder</li>
                                        <li>Make sure {email} is correct</li>
                                        <li>Wait a few minutes and try again</li>
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <Link href="/login" className="btn btn-primary w-100">
                                        Go to Login
                                    </Link>
                                </div>

                                <p className="text-muted small mt-3 mb-0">
                                    Need help? <Link href="/contact" className="text-primary">Contact Support</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
