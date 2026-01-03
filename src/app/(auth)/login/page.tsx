'use client'

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { login } from "./actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

const initialState = {
    error: '',
}

// Separate component that uses useSearchParams
function LoginForm() {
    const [state, action, isPending] = useActionState(login, initialState);
    const searchParams = useSearchParams();
    const isExpired = searchParams.get('expired') === 'true';

    return (
        <form action={action}>
            <Link href="/"><Image src='/images/logo-dark.png' width={120} height={30} className="mb-4 d-block mx-auto" alt="" /></Link>
            <h6 className="mb-3 text-uppercase fw-semibold">Please sign in</h6>

            {isExpired && (
                <div className="alert alert-warning small py-2 d-flex align-items-center">
                    <i className="mdi mdi-clock-alert-outline me-2"></i>
                    Your session has expired. Please sign in again.
                </div>
            )}

            {state.error && (
                <div className="alert alert-danger small py-2">
                    {state.error}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label fw-semibold">Your Email</label>
                <input name="email" id="email" type="email" className="form-control" placeholder="example@website.com" required />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="loginpass">Password</label>
                <input name="password" type="password" className="form-control" id="loginpass" placeholder="Password" required />
            </div>

            <div className="d-flex justify-content-between">
                <div className="mb-3">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        <label className="form-label form-check-label text-muted" htmlFor="flexCheckDefault">Remember me</label>
                    </div>
                </div>
                <span className="forgot-pass text-muted small mb-0"><Link href="/reset-password" className="text-muted">Forgot password ?</Link></span>
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="col-12 text-center mt-3">
                <span><span className="text-muted me-2 small">Dont have an account ?</span> <Link href="/signup" className="text-dark fw-semibold small">Sign Up</Link></span>
            </div>
        </form>
    );
}

export default function LoginPage() {
    return (
        <section className="bg-home d-flex align-items-center" style={{ backgroundImage: "url('/images/hero/bg3.jpg')", backgroundPosition: 'center' }}>
            <div className="bg-overlay bg-linear-gradient-2"></div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="p-4 bg-white rounded shadow-md mx-auto w-100" style={{ maxWidth: '400px' }}>
                            <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
                                <LoginForm />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
