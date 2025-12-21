'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import Script from "next/script";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check if redirected from forgot-password with unregistered email
    const redirectedEmail = searchParams.get('email') || '';
    const notRegisteredError = searchParams.get('error') === 'not_registered';

    const [formData, setFormData] = useState({
        name: '',
        email: redirectedEmail, // Pre-fill email if coming from forgot-password
        password: '',
        role: 'candidate' // Default role
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showNotRegisteredAlert, setShowNotRegisteredAlert] = useState(notRegisteredError);
    const [captchaToken, setCaptchaToken] = useState('');
    const turnstileRef = useRef(null);
    const widgetId = useRef(null);

    // Your Cloudflare Turnstile Site Key
    // IMPORTANT: Ensure localhost is added to allowed domains in Cloudflare Dashboard
    const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAACD7A8OrYrY_DkF-';

    useEffect(() => {
        // If script is already loaded (e.g. from navigating between pages), render immediately
        if (window.turnstile) {
            renderTurnstile();
        }

        // Cleanup on unmount
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaToken) {
            setError("Please complete the security check.");
            return;
        }

        setLoading(true);

        try {
            // Note: 'name' is not yet handled by backend Register, but we can pass it if we update backend.
            // Sending standard fields for now.
            const res = await apiClient.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                role: formData.role,
                captchaToken: captchaToken
            });

            // Check if auto-login (depends on Supabase config)
            if (res.data?.data?.token) {
                router.push('/dashboard'); // Or wherever
            } else {
                // Email verification required
                router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            // Reset captcha on failure
            if (window.turnstile && widgetId.current) {
                window.turnstile.reset(widgetId.current);
                setCaptchaToken('');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-home d-flex align-items-center" style={{ backgroundImage: "url('/images/hero/bg3.jpg')", backgroundPosition: 'center' }}>
            <div className="bg-overlay bg-linear-gradient-2"></div>
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
                                <Link href="/"><Image src="/images/logo-dark.png" width={120} height={30} className="mb-4 d-block mx-auto" alt="" /></Link>
                                <h6 className="mb-3 text-uppercase fw-semibold">Register your account</h6>

                                {/* Notification for users redirected from forgot-password */}
                                {showNotRegisteredAlert && (
                                    <div className="alert alert-info py-2 small d-flex align-items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 me-2 mt-1">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        <div>
                                            <strong>Email not registered!</strong>
                                            <p className="mb-0 mt-1">The email address you entered is not registered. Please create an account first.</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-close ms-auto"
                                            aria-label="Close"
                                            onClick={() => setShowNotRegisteredAlert(false)}
                                        ></button>
                                    </div>
                                )}

                                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your Name</label>
                                    <input
                                        name="name"
                                        id="name"
                                        type="text"
                                        className="form-control"
                                        placeholder="Calvin Carlo"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your Email</label>
                                    <input
                                        name="email"
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        placeholder="example@website.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold" htmlFor="loginpass">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        className="form-control"
                                        id="loginpass"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" required />
                                    <label className="form-label form-check-label text-muted" htmlFor="flexCheckDefault">I Accept <Link href="#" className="text-primary">Terms And Condition</Link></label>
                                </div>

                                {/* Turnstile Widget */}
                                <div className="mb-3 d-flex justify-content-center" style={{ minHeight: '65px' }}>
                                    <div ref={turnstileRef}></div>
                                </div>

                                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                                    {loading ? 'Registering...' : 'Register'}
                                </button>

                                <div className="col-12 text-center mt-3">
                                    <span><span className="text-muted small me-2">Already have an account ? </span> <Link href="/login" className="text-dark fw-semibold small">Sign in</Link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Wrap with Suspense for useSearchParams
export default function Signup() {
    return (
        <Suspense fallback={
            <div className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }>
            <SignupForm />
        </Suspense>
    );
}
