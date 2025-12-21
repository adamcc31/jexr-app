'use client';

/**
 * StatusBadge Component
 * 
 * Reusable status indicator badge with color variants.
 * Used across admin pages for displaying user status, verification status, etc.
 */

import React from 'react';
import { Badge } from 'react-bootstrap';

export type BadgeVariant =
    | 'pending'
    | 'verified'
    | 'approved'
    | 'active'
    | 'rejected'
    | 'disabled'
    | 'hidden'
    | 'flagged'
    | 'admin'
    | 'employer'
    | 'candidate';

interface StatusBadgeProps {
    status: BadgeVariant | string;
    className?: string;
}

/**
 * Maps status to Bootstrap badge color variant
 */
function getVariant(status: string): string {
    const statusLower = status.toLowerCase();

    switch (statusLower) {
        // Success states
        case 'verified':
        case 'approved':
        case 'active':
        case 'enabled':
            return 'success';

        // Warning states
        case 'pending':
        case 'flagged':
            return 'warning';

        // Danger states
        case 'rejected':
        case 'disabled':
        case 'hidden':
            return 'danger';

        // Info states (roles)
        case 'admin':
            return 'primary';
        case 'employer':
            return 'info';
        case 'candidate':
            return 'secondary';

        default:
            return 'secondary';
    }
}

/**
 * Formats status text for display
 */
function formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

/**
 * StatusBadge - Displays a colored badge based on status type
 * 
 * @example
 * ```tsx
 * <StatusBadge status="verified" />
 * <StatusBadge status="pending" />
 * <StatusBadge status="admin" />
 * ```
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const variant = getVariant(status);
    const displayText = formatStatus(status);

    return (
        <Badge
            bg={variant}
            className={`fw-medium ${className}`}
            style={{ fontSize: '0.75rem' }}
        >
            {displayText}
        </Badge>
    );
}

export default StatusBadge;
