'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";

export default function ResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');

    const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAACD7A8OrYrY_DkF-';

    const turnstileRef = useRef(null);
    const widgetId = useRef(null);

    useEffect(() => {
        // If script is already loaded, render immediately
        if (window.turnstile) {
            renderTurnstile();
        }

        return () => {
            if (widgetId.current && window.turnstile) {
                window.turnstile.remove(widgetId.current);
                widgetId.current = null;
            }
        };
    }, []);

    const renderTurnstile = () => {
        if (window.turnstile && turnstileRef.current && !widgetId.current) {
            try {
                widgetId.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: SITE_KEY,
                    callback: function (token) {
                        setCaptchaToken(token);
                    },
                    "expired-callback": function () {
                        setCaptchaToken('');
                    }
                });
            } catch (e) {
                console.error("Turnstile render error:", e);
            }
        }
    };

    const resetCaptcha = () => {
        if (window.turnstile && widgetId.current) {
            window.turnstile.reset(widgetId.current);
            setCaptchaToken('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaToken) {
            setError('Please complete the security check.');
            return;
        }

        setLoading(true);

        try {
            await apiClient.post('/auth/forgot-password', {
                email,
                captchaToken
            });
            setSuccess(true);
        } catch (err) {
            const statusCode = err.response?.status;
            const message = err.response?.data?.message || 'Failed to send reset email. Please try again.';

            // If 404 - email not registered, redirect to signup
            if (statusCode === 404) {
                router.push(`/signup?email=${encodeURIComponent(email)}&error=not_registered`);
                return;
            }

            setError(message);
            resetCaptcha();
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <section className="bg-home d-flex align-items-center" style={{ backgroundImage: "url('/images/hero/bg3.jpg')", backgroundPosition: 'center' }}>
                <div className="bg-overlay bg-linear-gradient-2"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-5 col-12">
                            <div className="p-4 bg-white rounded shadow-md mx-auto w-100" style={{ maxWidth: '400px' }}>
                                <div className="text-center">
                                    <Link href="/"><Image src='/images/logo-dark.png' width={120} height={30} className="mb-4 d-block mx-auto" alt="" /></Link>

                                    <div className="mb-4">
                                        <div className="avatar avatar-lg-lg bg-soft-success rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                        </div>
                                    </div>

                                    <h5 className="fw-bold mb-3">Check Your Email</h5>
                                    <p className="text-muted mb-4">
                                        We've sent a password reset link to <strong>{email}</strong>
                                    </p>

                                    <div className="alert alert-light border py-2 px-3 text-start small">
                                        <strong>Note:</strong> Check your spam folder if you don't see the email in your inbox.
                                    </div>

                                    <Link href="/login" className="btn btn-primary w-100 mt-3">
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-home d-flex align-items-center" style={{ backgroundImage: "url('/images/hero/bg3.jpg')", backgroundPosition: 'center' }}>
            <div className="bg-overlay bg-linear-gradient-2"></div>

            {/* Turnstile Script */}
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                strategy="afterInteractive"
                onLoad={() => {
                    renderTurnstile();
                }}
            />

            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="p-4 bg-white rounded shadow-md mx-auto w-100" style={{ maxWidth: '400px' }}>
                            <form onSubmit={handleSubmit}>
                                <Link href="/"><Image src='/images/logo-dark.png' width={120} height={30} className="mb-4 d-block mx-auto" alt="" /></Link>
                                <h6 className="mb-2 text-uppercase fw-semibold">Reset your password</h6>

                                <p className="text-muted small">Please enter your email address. You will receive a link to create a new password via email.</p>

                                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your Email</label>
                                    <input
                                        name="email"
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        placeholder="example@website.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Turnstile Widget */}
                                <div className="mb-3 d-flex justify-content-center" style={{ minHeight: '65px' }}>
                                    <div ref={turnstileRef}></div>
                                </div>

                                <button className="btn btn-primary w-100" type="submit" disabled={loading || !captchaToken}>
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>

                                <div className="col-12 text-center mt-3">
                                    <span><span className="text-muted small me-2">Remember your password ? </span> <Link href="/login" className="text-dark fw-semibold small">Sign in</Link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}