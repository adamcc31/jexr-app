'use client';

/**
 * Job Moderation Page
 * 
 * Admin page for moderating job postings.
 * Features:
 * - List all job postings
 * - Filter by status (Active/Hidden/Flagged)
 * - Hide/unhide jobs
 * - Flag suspicious jobs
 */

import React, { useState, useMemo } from 'react';
import { Form, Button, Modal, Badge } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { AdminTable, StatusBadge, ConfirmationModal } from '@/components/admin';
import { useAdminJobs, useHideJob, useFlagJob } from '@/hooks/admin';
import type { AdminJob, JobModerationStatus, AdminJobFilters } from '@/types/admin';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

/**
 * FlagReasonModal - Modal for entering flag reason
 */
function FlagReasonModal({
    show,
    onClose,
    onConfirm,
    isLoading,
    jobTitle,
}: {
    show: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
    jobTitle: string;
}) {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onConfirm(reason);
        setReason('');
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fs-5">Flag Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted mb-3">
                    Flag <strong>"{jobTitle}"</strong> as suspicious.
                    This will alert administrators for review.
                </p>
                <Form.Group>
                    <Form.Label>Reason for Flagging</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="E.g., Suspicious salary, fake company, etc."
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-top-0">
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    variant="warning"
                    onClick={handleSubmit}
                    disabled={isLoading || !reason.trim()}
                >
                    {isLoading ? 'Flagging...' : 'Flag Job'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

/**
 * JobModerationPage - Main job moderation page
 */
export default function JobModerationPage() {
    // =========================================================================
    // State
    // =========================================================================
    const [filters, setFilters] = useState<AdminJobFilters>({
        page: 1,
        pageSize: 10,
    });

    const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
    const [showHideModal, setShowHideModal] = useState(false);
    const [showFlagModal, setShowFlagModal] = useState(false);

    // =========================================================================
    // Data Fetching
    // =========================================================================
    const {
        data: jobsData,
        isLoading,
        error,
        refetch
    } = useAdminJobs(filters);

    const { mutate: hideJob, isPending: isHiding } = useHideJob();
    const { mutate: flagJob, isPending: isFlagging } = useFlagJob();

    // =========================================================================
    // Handlers
    // =========================================================================
    const handleStatusFilter = (status: string) => {
        setFilters(prev => ({
            ...prev,
            status: status === 'all' ? undefined : status as JobModerationStatus,
            page: 1,
        }));
    };

    const handleToggleHide = (job: AdminJob) => {
        setSelectedJob(job);
        setShowHideModal(true);
    };

    const handleFlag = (job: AdminJob) => {
        setSelectedJob(job);
        setShowFlagModal(true);
    };

    const confirmHide = () => {
        if (!selectedJob) return;

        const shouldHide = selectedJob.status !== 'hidden';

        hideJob(
            { jobId: selectedJob.id, hide: shouldHide },
            {
                onSuccess: () => {
                    setShowHideModal(false);
                    setSelectedJob(null);
                },
            }
        );
    };

    const confirmFlag = (reason: string) => {
        if (!selectedJob) return;

        flagJob(
            { jobId: selectedJob.id, flag: true, reason },
            {
                onSuccess: () => {
                    setShowFlagModal(false);
                    setSelectedJob(null);
                },
            }
        );
    };

    // =========================================================================
    // Table Columns
    // =========================================================================
    const columns = useMemo<ColumnDef<AdminJob, unknown>[]>(() => [
        {
            accessorKey: 'title',
            header: 'Job Title',
            cell: ({ row }) => (
                <div>
                    <div className="fw-medium">{row.original.title}</div>
                    <small className="text-muted">{row.original.companyName}</small>
                </div>
            ),
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ getValue }) => (
                <span className="text-muted">{getValue() as string}</span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <div className="d-flex gap-1 align-items-center">
                    <StatusBadge status={row.original.status} />
                    {row.original.isFlagged && (
                        <Badge bg="warning" className="ms-1">
                            <IconifyIcon icon="solar:flag-bold" width={12} height={12} className="me-1" />
                            Flagged
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Posted',
            cell: ({ getValue }) => (
                <span className="text-muted">
                    {new Date(getValue() as string).toLocaleDateString()}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const job = row.original;
                const isHidden = job.status === 'hidden';

                return (
                    <div className="d-flex gap-1">
                        <Button
                            variant={isHidden ? 'success' : 'secondary'}
                            size="sm"
                            onClick={() => handleToggleHide(job)}
                            title={isHidden ? 'Unhide' : 'Hide'}
                        >
                            <IconifyIcon
                                icon={isHidden ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                width={16}
                                height={16}
                            />
                        </Button>
                        {!job.isFlagged && (
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleFlag(job)}
                                title="Flag as Suspicious"
                            >
                                <IconifyIcon icon="solar:flag-bold" width={16} height={16} />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ], []);

    // =========================================================================
    // Render
    // =========================================================================
    return (
        <div className="job-moderation-page">
            {/* Page Header */}
            <div className="mb-4">
                <h4 className="fw-bold mb-1">Job Moderation</h4>
                <p className="text-muted mb-0">
                    Review and moderate job postings
                </p>
            </div>

            {/* Table with Filters */}
            <AdminTable<AdminJob>
                title="All Jobs"
                columns={columns}
                data={jobsData?.data ?? []}
                isLoading={isLoading}
                error={error as Error | null}
                onRetry={refetch}
                pageSize={filters.pageSize}
                showPagination={true}
                emptyTitle="No jobs found"
                emptyMessage="There are no jobs matching your filters."
                headerActions={
                    <>
                        {/* Status Filter */}
                        <Form.Select
                            size="sm"
                            value={filters.status || 'all'}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="hidden">Hidden</option>
                            <option value="flagged">Flagged</option>
                        </Form.Select>

                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => refetch()}
                            title="Refresh"
                        >
                            <IconifyIcon icon="solar:refresh-bold" width={16} height={16} />
                        </Button>
                    </>
                }
            />

            {/* Hide/Unhide Confirmation Modal */}
            <ConfirmationModal
                show={showHideModal}
                onClose={() => {
                    setShowHideModal(false);
                    setSelectedJob(null);
                }}
                onConfirm={confirmHide}
                title={selectedJob?.status === 'hidden' ? 'Unhide Job' : 'Hide Job'}
                message={
                    selectedJob?.status === 'hidden'
                        ? `Are you sure you want to make "${selectedJob?.title}" visible again?`
                        : `Are you sure you want to hide "${selectedJob?.title}"? It will no longer be visible to candidates.`
                }
                confirmText={selectedJob?.status === 'hidden' ? 'Unhide' : 'Hide'}
                variant={selectedJob?.status === 'hidden' ? 'primary' : 'warning'}
                isLoading={isHiding}
            />

            {/* Flag Modal with Reason */}
            <FlagReasonModal
                show={showFlagModal}
                onClose={() => {
                    setShowFlagModal(false);
                    setSelectedJob(null);
                }}
                onConfirm={confirmFlag}
                isLoading={isFlagging}
                jobTitle={selectedJob?.title ?? ''}
            />
        </div>
    );
}
