'use client';

/**
 * Company Verification Page
 * 
 * Admin page for verifying employer companies.
 * Features:
 * - List all companies with verification status
 * - Filter by status (Pending/Verified/Rejected)
 * - Approve or reject companies
 */

import React, { useState, useMemo } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { AdminTable, StatusBadge, ConfirmationModal } from '@/components/admin';
import { useAdminCompanies, useVerifyCompany } from '@/hooks/admin';
import type { AdminCompany, VerificationStatus, AdminCompanyFilters } from '@/types/admin';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

/**
 * RejectReasonModal - Modal for entering rejection reason
 */
function RejectReasonModal({
    show,
    onClose,
    onConfirm,
    isLoading,
    companyName,
}: {
    show: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
    companyName: string;
}) {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onConfirm(reason);
        setReason('');
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fs-5">Reject Company</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="warning" className="mb-3">
                    You are about to reject <strong>{companyName}</strong>.
                    Please provide a reason for the rejection.
                </Alert>
                <Form.Group>
                    <Form.Label>Rejection Reason</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-top-0">
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={handleSubmit}
                    disabled={isLoading || !reason.trim()}
                >
                    {isLoading ? 'Rejecting...' : 'Reject Company'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

/**
 * CompanyVerificationPage - Main company verification page
 */
export default function CompanyVerificationPage() {
    // =========================================================================
    // State
    // =========================================================================
    const [filters, setFilters] = useState<AdminCompanyFilters>({
        page: 1,
        pageSize: 10,
    });

    const [selectedCompany, setSelectedCompany] = useState<AdminCompany | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    // =========================================================================
    // Data Fetching
    // =========================================================================
    const {
        data: companiesData,
        isLoading,
        error,
        refetch
    } = useAdminCompanies(filters);

    const {
        mutate: verifyCompany,
        isPending: isVerifying
    } = useVerifyCompany();

    // =========================================================================
    // Handlers
    // =========================================================================
    const handleStatusFilter = (status: string) => {
        setFilters(prev => ({
            ...prev,
            verificationStatus: status === 'all' ? undefined : status as VerificationStatus,
            page: 1,
        }));
    };

    const handleApprove = (company: AdminCompany) => {
        setSelectedCompany(company);
        setShowApproveModal(true);
    };

    const handleReject = (company: AdminCompany) => {
        setSelectedCompany(company);
        setShowRejectModal(true);
    };

    const confirmApprove = () => {
        if (!selectedCompany) return;

        verifyCompany(
            { companyId: selectedCompany.id, action: 'approve' },
            {
                onSuccess: () => {
                    setShowApproveModal(false);
                    setSelectedCompany(null);
                },
            }
        );
    };

    const confirmReject = (reason: string) => {
        if (!selectedCompany) return;

        verifyCompany(
            { companyId: selectedCompany.id, action: 'reject', reason },
            {
                onSuccess: () => {
                    setShowRejectModal(false);
                    setSelectedCompany(null);
                },
            }
        );
    };

    // =========================================================================
    // Table Columns
    // =========================================================================
    const columns = useMemo<ColumnDef<AdminCompany, unknown>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Company',
            cell: ({ row }) => (
                <div>
                    <div className="fw-medium">{row.original.name}</div>
                    <small className="text-muted">{row.original.email}</small>
                </div>
            ),
        },
        {
            accessorKey: 'employerEmail',
            header: 'Employer',
            cell: ({ getValue }) => (
                <span className="text-muted">{getValue() as string}</span>
            ),
        },
        {
            accessorKey: 'verificationStatus',
            header: 'Status',
            cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
        },
        {
            accessorKey: 'createdAt',
            header: 'Submitted',
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
                const company = row.original;
                const isPending = company.verificationStatus === 'pending';

                return (
                    <div className="d-flex gap-1">
                        {isPending && (
                            <>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleApprove(company)}
                                    title="Approve"
                                >
                                    <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} />
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleReject(company)}
                                    title="Reject"
                                >
                                    <IconifyIcon icon="solar:close-circle-bold" width={16} height={16} />
                                </Button>
                            </>
                        )}
                        {!isPending && (
                            <span className="text-muted small">
                                {company.verificationStatus === 'verified' ? 'Approved' : 'Rejected'}
                            </span>
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
        <div className="company-verification-page">
            {/* Page Header */}
            <div className="mb-4">
                <h4 className="fw-bold mb-1">Company Verification</h4>
                <p className="text-muted mb-0">
                    Review and verify employer companies
                </p>
            </div>

            {/* Table with Filters */}
            <AdminTable<AdminCompany>
                title="All Companies"
                columns={columns}
                data={companiesData?.data ?? []}
                isLoading={isLoading}
                error={error as Error | null}
                onRetry={refetch}
                pageSize={filters.pageSize}
                showPagination={true}
                emptyTitle="No companies found"
                emptyMessage="There are no companies matching your filters."
                headerActions={
                    <>
                        {/* Status Filter */}
                        <Form.Select
                            size="sm"
                            value={filters.verificationStatus || 'all'}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
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

            {/* Approve Confirmation Modal */}
            <ConfirmationModal
                show={showApproveModal}
                onClose={() => {
                    setShowApproveModal(false);
                    setSelectedCompany(null);
                }}
                onConfirm={confirmApprove}
                title="Approve Company"
                message={`Are you sure you want to approve ${selectedCompany?.name}? This company will be able to post jobs.`}
                confirmText="Approve"
                variant="primary"
                isLoading={isVerifying}
            />

            {/* Reject Modal with Reason */}
            <RejectReasonModal
                show={showRejectModal}
                onClose={() => {
                    setShowRejectModal(false);
                    setSelectedCompany(null);
                }}
                onConfirm={confirmReject}
                isLoading={isVerifying}
                companyName={selectedCompany?.name ?? ''}
            />
        </div>
    );
}
