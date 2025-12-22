'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Auth Callback Page
 * 
 * This page handles the redirect from Supabase email confirmation links.
 * When a user clicks the confirmation link in their email, Supabase redirects
 * them here with tokens in the URL hash fragment.
 * 
 * Flow:
 * 1. User clicks email confirmation link
 * 2. Supabase redirects to /auth/callback#access_token=...&type=signup
 * 3. This page detects the tokens and shows success message
 * 4. User can then proceed to login
 */
export default function AuthCallbackPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Parse the hash fragment from the URL
        // Supabase sends tokens in the format: #access_token=...&token_type=bearer&type=signup
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const accessToken = params.get('access_token');
        const type = params.get('type');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        if (error) {
            setStatus('error');
            setMessage(errorDescription || error || 'An error occurred during verification.');
            return;
        }

        if (accessToken && type === 'signup') {
            // Email confirmation successful
            setStatus('success');
            setMessage('Your email has been verified successfully!');
        } else if (accessToken && type === 'recovery') {
            // Password recovery - redirect to update password page
            router.push(`/auth/update-password#access_token=${accessToken}`);
        } else if (accessToken) {
            // Other auth type with token
            setStatus('success');
            setMessage('Authentication successful!');
        } else {
            // No token found - might be direct access
            setStatus('error');
            setMessage('Invalid or expired verification link. Please try again.');
        }
    }, [router]);

    return (
        <section className="bg-home d-flex align-items-center" style={{ backgroundImage: "url('/images/hero/bg3.jpg')", backgroundPosition: 'center' }}>
            <div className="bg-overlay bg-linear-gradient-2"></div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-6 col-12">
                        <div className="p-4 bg-white rounded shadow-md text-center">
                            <Link href="/">
                                <Image src="/images/logo-dark.png" width={120} height={30} className="mb-4 d-block mx-auto" alt="Logo" />
                            </Link>

                            {status === 'loading' && (
                                <>
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <h5 className="mb-2">Verifying your email...</h5>
                                    <p className="text-muted">Please wait while we confirm your account.</p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <div className="mb-3">
                                        <div className="rounded-circle bg-success-subtle d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <h5 className="mb-2 text-success">Email Verified!</h5>
                                    <p className="text-muted mb-4">{message}</p>
                                    <p className="text-muted small mb-4">You can now login to your account and start exploring opportunities.</p>
                                    <Link href="/login" className="btn btn-primary w-100">
                                        Go to Login
                                    </Link>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <div className="mb-3">
                                        <div className="rounded-circle bg-danger-subtle d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                        </div>
                                    </div>
                                    <h5 className="mb-2 text-danger">Verification Failed</h5>
                                    <p className="text-muted mb-4">{message}</p>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Link href="/signup" className="btn btn-outline-primary">
                                            Try Again
                                        </Link>
                                        <Link href="/login" className="btn btn-primary">
                                            Go to Login
                                        </Link>
                                    </div>
                                </>
                            )}

                            <p className="text-muted small mt-4 mb-0">
                                Need help? <Link href="/contactus" className="text-primary">Contact Support</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
