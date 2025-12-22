'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api';

// Password validation requirements (same as signup)
const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
};

function validatePassword(password: string): string[] {
    const errors: string[] = [];

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        errors.push(`At least ${PASSWORD_REQUIREMENTS.minLength} characters`);
    }
    if (!PASSWORD_REQUIREMENTS.hasUppercase.test(password)) {
        errors.push('At least 1 uppercase letter');
    }
    if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
        errors.push('At least 1 number');
    }
    if (!PASSWORD_REQUIREMENTS.hasSpecialChar.test(password)) {
        errors.push('At least 1 special character (!@#$%^&*...)');
    }

    return errors;
}

function UpdatePasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    useEffect(() => {
        // Supabase redirects with tokens in the URL hash fragment
        // Format: #access_token=...&token_type=bearer&type=recovery
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            if (hash) {
                const params = new URLSearchParams(hash.substring(1));
                const token = params.get('access_token');
                const type = params.get('type');

                if (token && type === 'recovery') {
                    setAccessToken(token);
                } else if (!token) {
                    setError('Invalid or expired reset link. Please request a new one.');
                }
            } else {
                setError('Invalid reset link. Please request a new password reset.');
            }
        }
    }, []);

    // Validate password on change
    useEffect(() => {
        if (newPassword) {
            setPasswordErrors(validatePassword(newPassword));
        } else {
            setPasswordErrors([]);
        }
    }, [newPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate password strength
        const pwdErrors = validatePassword(newPassword);
        if (pwdErrors.length > 0) {
            setError('Please fix password requirements below.');
            return;
        }

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!accessToken) {
            setError('Invalid session. Please request a new password reset link.');
            return;
        }

        setLoading(true);

        try {
            await apiClient.post('/auth/reset-password', {
                access_token: accessToken,
                new_password: newPassword
            });
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isPasswordValid = passwordErrors.length === 0 && newPassword.length > 0;
    const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

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

                                    <h5 className="fw-bold mb-3">Password Reset Successful!</h5>
                                    <p className="text-muted mb-4">
                                        Your password has been reset successfully. Redirecting to login...
                                    </p>

                                    <Link href="/login" className="btn btn-primary w-100">
                                        Go to Login
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
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="p-4 bg-white rounded shadow-md mx-auto w-100" style={{ maxWidth: '400px' }}>
                            <form onSubmit={handleSubmit}>
                                <Link href="/"><Image src='/images/logo-dark.png' width={120} height={30} className="mb-4 d-block mx-auto" alt="" /></Link>
                                <h6 className="mb-2 text-uppercase fw-semibold">Set New Password</h6>

                                <p className="text-muted small mb-3">Create a strong password for your account.</p>

                                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">New Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${newPassword && (isPasswordValid ? 'is-valid' : 'is-invalid')}`}
                                        placeholder="Create a strong password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={!accessToken}
                                    />
                                    {/* Password requirements indicator */}
                                    {newPassword && passwordErrors.length > 0 && (
                                        <div className="mt-2">
                                            <small className="text-muted d-block mb-1">Password must contain:</small>
                                            <ul className="list-unstyled small mb-0">
                                                {[
                                                    { check: newPassword.length >= 8, text: 'At least 8 characters' },
                                                    { check: PASSWORD_REQUIREMENTS.hasUppercase.test(newPassword), text: 'At least 1 uppercase letter' },
                                                    { check: PASSWORD_REQUIREMENTS.hasNumber.test(newPassword), text: 'At least 1 number' },
                                                    { check: PASSWORD_REQUIREMENTS.hasSpecialChar.test(newPassword), text: 'At least 1 special character' },
                                                ].map((req, idx) => (
                                                    <li key={idx} className={req.check ? 'text-success' : 'text-danger'}>
                                                        {req.check ? '✓' : '✗'} {req.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Confirm Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${confirmPassword && (doPasswordsMatch ? 'is-valid' : 'is-invalid')}`}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={!accessToken}
                                    />
                                    {confirmPassword && !doPasswordsMatch && (
                                        <div className="invalid-feedback d-block">
                                            Passwords do not match
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                    disabled={loading || !accessToken || !isPasswordValid || !doPasswordsMatch}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>

                                <div className="col-12 text-center mt-3">
                                    <Link href="/reset-password" className="text-muted small">
                                        Request new reset link
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={
            <div className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }>
            <UpdatePasswordContent />
        </Suspense>
    );
}

