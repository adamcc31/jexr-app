'use client';

import React from 'react';

/**
 * Skeleton building blocks for loading states
 * Uses CSS animations for shimmer effect
 */

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
};

/**
 * Base skeleton element
 */
export function Skeleton({ className = '', style }: SkeletonProps) {
    return (
        <div
            className={`rounded ${className}`}
            style={{ ...shimmerStyle, ...style }}
        />
    );
}

/**
 * Skeleton for stat cards on dashboard
 */
export function SkeletonCard() {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <Skeleton className="mb-2" style={{ height: '14px', width: '60%' }} />
                <Skeleton style={{ height: '32px', width: '40%' }} />
            </div>
        </div>
    );
}

/**
 * Skeleton for table rows
 */
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="py-3">
                    <Skeleton style={{ height: '20px', width: i === 0 ? '80%' : '60%' }} />
                </td>
            ))}
        </tr>
    );
}

/**
 * Multiple skeleton rows for table loading
 */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonTableRow key={i} columns={columns} />
            ))}
        </>
    );
}

// Add shimmer animation via style tag
export function SkeletonStyles() {
    return (
        <style jsx global>{`
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `}</style>
    );
}
