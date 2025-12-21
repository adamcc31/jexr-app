'use client';

import React from 'react';

/**
 * Error state component for API failures
 * Shows when backend is unavailable or request fails
 */

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    message = 'Something went wrong. Please try again.',
    onRetry
}: ErrorStateProps) {
    return (
        <div className="text-center py-5">
            <div className="mb-3 text-danger" style={{ fontSize: '3rem' }}>
                <i className="mdi mdi-alert-circle-outline"></i>
            </div>
            <h5 className="text-dark fw-semibold">Unable to Load Data</h5>
            <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                {message}
            </p>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-outline-primary">
                    <i className="mdi mdi-refresh me-1"></i>
                    Try Again
                </button>
            )}
        </div>
    );
}
