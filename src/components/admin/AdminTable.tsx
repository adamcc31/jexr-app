'use client';

/**
 * AdminTable Component
 * 
 * Wrapper around the existing ReactTable component with admin-specific styling.
 * Provides consistent table experience across all admin pages.
 */

import React from 'react';
import { Card } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import ReactTable from '@/components/dashboard-view/Table';
import { LoadingState, ErrorState, EmptyState } from './DataStates';

interface AdminTableProps<T> {
    /** Table columns configuration */
    columns: ColumnDef<T, unknown>[];
    /** Data array to display */
    data: T[];
    /** Whether data is loading */
    isLoading?: boolean;
    /** Error object if fetch failed */
    error?: Error | null;
    /** Callback for retry on error */
    onRetry?: () => void;
    /** Page size (default: 10) */
    pageSize?: number;
    /** Whether to show pagination (default: true) */
    showPagination?: boolean;
    /** Custom empty state message */
    emptyMessage?: string;
    /** Custom empty state title */
    emptyTitle?: string;
    /** Card title (optional) */
    title?: string;
    /** Right side header content */
    headerActions?: React.ReactNode;
}

/**
 * AdminTable - A complete admin table with loading, error, and empty states
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useAdminUsers();
 * 
 * <AdminTable
 *     title="User Management"
 *     columns={columns}
 *     data={data?.data ?? []}
 *     isLoading={isLoading}
 *     error={error}
 *     onRetry={refetch}
 *     headerActions={<RoleFilter />}
 * />
 * ```
 */
export function AdminTable<T>({
    columns,
    data,
    isLoading = false,
    error = null,
    onRetry,
    pageSize = 10,
    showPagination = true,
    emptyMessage = 'No items to display',
    emptyTitle = 'No data found',
    title,
    headerActions,
}: AdminTableProps<T>) {
    return (
        <Card>
            {/* Header with title and actions */}
            {(title || headerActions) && (
                <Card.Header className="d-flex justify-content-between align-items-center">
                    {title && <h5 className="card-title mb-0">{title}</h5>}
                    {headerActions && (
                        <div className="d-flex gap-2 align-items-center">
                            {headerActions}
                        </div>
                    )}
                </Card.Header>
            )}

            <Card.Body className="p-0">
                {/* Loading State */}
                {isLoading && <LoadingState message="Loading data..." size="lg" />}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="p-3">
                        <ErrorState message={error.message} onRetry={onRetry} />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && data.length === 0 && (
                    <EmptyState title={emptyTitle} message={emptyMessage} />
                )}

                {/* Table */}
                {!isLoading && !error && data.length > 0 && (
                    <ReactTable
                        options={{}}
                        columns={columns}
                        data={data}
                        pageSize={pageSize}
                        showPagination={showPagination}
                        rowsPerPageList={[5, 10, 25, 50]}
                        tableClass="table-hover mb-0"
                        theadClass="table-light"
                    />
                )}
            </Card.Body>
        </Card>
    );
}

export default AdminTable;
