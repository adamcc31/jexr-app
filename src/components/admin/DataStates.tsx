'use client';

/**
 * Data State Components
 * 
 * Reusable components for loading, error, and empty states.
 * Used across all admin pages for consistent UX.
 */

import React from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

// ============================================================================
// Loading State
// ============================================================================

interface LoadingStateProps {
    /** Optional message to display */
    message?: string;
    /** Size of the loading area */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * LoadingState - Displays a centered spinner with optional message
 * 
 * @example
 * ```tsx
 * if (isLoading) return <LoadingState message="Loading users..." />;
 * ```
 */
export function LoadingState({
    message = 'Loading...',
    size = 'md'
}: LoadingStateProps) {
    const paddingClass = size === 'sm' ? 'py-3' : size === 'lg' ? 'py-5' : 'py-4';

    return (
        <div className={`text-center ${paddingClass}`}>
            <Spinner animation="border" variant="primary" className="mb-2" />
            <p className="text-muted mb-0">{message}</p>
        </div>
    );
}

// ============================================================================
// Error State
// ============================================================================

interface ErrorStateProps {
    /** Error message to display */
    message?: string;
    /** Callback for retry action */
    onRetry?: () => void;
}

/**
 * ErrorState - Displays an error message with optional retry button
 * 
 * @example
 * ```tsx
 * if (error) {
 *     return <ErrorState message={error.message} onRetry={refetch} />;
 * }
 * ```
 */
export function ErrorState({
    message = 'Something went wrong. Please try again.',
    onRetry
}: ErrorStateProps) {
    return (
        <Card className="border-danger border-opacity-25">
            <Card.Body className="text-center py-4">
                <IconifyIcon
                    icon="solar:danger-triangle-bold"
                    className="text-danger mb-2"
                    width={48}
                    height={48}
                />
                <p className="text-muted mb-3">{message}</p>
                {onRetry && (
                    <Button variant="outline-danger" size="sm" onClick={onRetry}>
                        <IconifyIcon icon="solar:refresh-bold" className="me-1" />
                        Retry
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

// ============================================================================
// Empty State
// ============================================================================

interface EmptyStateProps {
    /** Title for empty state */
    title?: string;
    /** Description message */
    message?: string;
    /** Optional icon name (Iconify) */
    icon?: string;
    /** Optional action button */
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * EmptyState - Displays a placeholder when no data is available
 * 
 * @example
 * ```tsx
 * if (users.length === 0) {
 *     return <EmptyState title="No users found" message="Try adjusting your filters" />;
 * }
 * ```
 */
export function EmptyState({
    title = 'No data found',
    message = 'There are no items to display.',
    icon = 'solar:box-minimalistic-line-duotone',
    action
}: EmptyStateProps) {
    return (
        <div className="text-center py-5">
            <IconifyIcon
                icon={icon}
                className="text-muted mb-3"
                width={64}
                height={64}
            />
            <h5 className="text-dark mb-2">{title}</h5>
            <p className="text-muted mb-0">{message}</p>
            {action && (
                <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={action.onClick}
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
