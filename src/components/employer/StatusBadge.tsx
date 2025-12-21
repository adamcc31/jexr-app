'use client';

import React from 'react';

/**
 * Status badge components
 * Job status derived ONLY from backend company_status field
 */

interface JobStatusBadgeProps {
    status: 'active' | 'closed';
}

/**
 * Display job status badge based on backend company_status field
 * Only shows values that exist in the database: 'active' or 'closed'
 */
export function JobStatusBadge({ status }: JobStatusBadgeProps) {
    const config = {
        active: {
            className: 'bg-success-subtle text-success',
            label: 'Active',
        },
        closed: {
            className: 'bg-secondary-subtle text-secondary',
            label: 'Closed',
        },
    };

    const { className, label } = config[status] || config.closed;

    return (
        <span className={`badge ${className}`}>
            {label}
        </span>
    );
}
