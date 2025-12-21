'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Empty state component for when no data is available
 * Professional messaging without placeholder content
 */

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="text-center py-5">
            {icon && (
                <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}>
                    {icon}
                </div>
            )}
            <h5 className="text-dark fw-semibold">{title}</h5>
            <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                {description}
            </p>
            {actionLabel && actionHref && (
                <Link href={actionHref} className="btn btn-primary">
                    {actionLabel}
                </Link>
            )}
            {actionLabel && onAction && !actionHref && (
                <button onClick={onAction} className="btn btn-primary">
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
