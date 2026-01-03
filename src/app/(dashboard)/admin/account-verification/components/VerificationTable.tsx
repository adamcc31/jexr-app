'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VerificationFilter, VerificationStatus } from '@/lib/api/verification';
import { useAdminVerifications, useApproveVerification, useRejectVerification } from '@/hooks/admin';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

export default function VerificationTable() {
    const [filter, setFilter] = useState<VerificationFilter>({
        page: 1,
        limit: 10,
        role: '',
        status: ''
    });

    // TanStack Query hooks
    const { data, isLoading, error } = useAdminVerifications(filter);
    const approveVerification = useApproveVerification();
    const rejectVerification = useRejectVerification();

    const verifications = data?.data || [];
    const total = data?.total || 0;
    const page = data?.page || 1;
    const pageSize = data?.pageSize || 10;

    const handleFilterChange = (key: keyof VerificationFilter, value: string) => {
        setFilter(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilter(prev => ({ ...prev, page: newPage }));
    };

    const handleQuickApprove = async (id: number) => {
        if (!confirm('Are you sure you want to approve this verification?')) return;
        approveVerification.mutate(id);
    };

    const handleQuickReject = async (id: number) => {
        const reason = prompt('Reason for rejection (optional):');
        if (reason === null) return; // Cancelled
        rejectVerification.mutate({ id, notes: reason });
    };

    const getStatusBadge = (status: VerificationStatus) => {
        switch (status) {
            case 'VERIFIED':
                return <span className="badge bg-success text-white">Verified</span>;
            case 'REJECTED':
                return <span className="badge bg-danger text-white">Rejected</span>;
            case 'SUBMITTED':
                return <span className="badge bg-primary text-white">Submitted</span>;
            case 'PENDING':
            default:
                return <span className="badge bg-warning text-dark">Pending</span>;
        }
    };

    const getDisplayName = (v: typeof verifications[0]) => {
        if (v.first_name && v.last_name) {
            return `${v.first_name} ${v.last_name}`;
        }
        return v.user_profile?.name || v.user_email || 'Unknown';
    };

    const isProcessing = approveVerification.isPending || rejectVerification.isPending;

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Verification Requests</h5>
                <div className="d-flex gap-2">
                    <select
                        className="form-select form-select-sm"
                        value={filter.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="EMPLOYER">Employer</option>
                        <option value="CANDIDATE">Candidate</option>
                    </select>
                    <select
                        className="form-select form-select-sm"
                        value={filter.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th style={{ width: '50px' }}></th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Submitted At</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td><div className="placeholder-glow"><span className="placeholder rounded-circle" style={{ width: 40, height: 40, display: 'block' }}></span></div></td>
                                    <td><div className="placeholder-glow"><span className="placeholder col-8"></span></div></td>
                                    <td><div className="placeholder-glow"><span className="placeholder col-6"></span></div></td>
                                    <td><div className="placeholder-glow"><span className="placeholder col-6"></span></div></td>
                                    <td><div className="placeholder-glow"><span className="placeholder col-4"></span></div></td>
                                    <td><div className="placeholder-glow"><span className="placeholder col-4"></span></div></td>
                                </tr>
                            ))
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-danger">
                                    Failed to load verifications. Please try again.
                                </td>
                            </tr>
                        ) : verifications.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-5">
                                    <div className="text-muted">
                                        <IconifyIcon icon="solar:document-text-linear" width={48} className="mb-3 opacity-50" />
                                        <p className="mb-0">No verification requests found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            verifications.map(v => (
                                <tr key={v.id}>
                                    {/* Profile Picture */}
                                    <td>
                                        <div
                                            className="rounded-circle overflow-hidden bg-light d-flex align-items-center justify-content-center"
                                            style={{ width: 40, height: 40 }}
                                        >
                                            {v.profile_picture_url ? (
                                                <Image
                                                    src={v.profile_picture_url}
                                                    alt={getDisplayName(v)}
                                                    width={40}
                                                    height={40}
                                                    className="object-fit-cover"
                                                    style={{ width: 40, height: 40 }}
                                                />
                                            ) : (
                                                <IconifyIcon icon="solar:user-circle-bold" width={24} className="text-muted" />
                                            )}
                                        </div>
                                    </td>
                                    {/* User Info */}
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="fw-medium">{getDisplayName(v)}</span>
                                            <small className="text-muted">{v.user_email}</small>
                                            {v.user_profile?.company_name && (
                                                <small className="text-primary">{v.user_profile.company_name}</small>
                                            )}
                                        </div>
                                    </td>
                                    {/* Role */}
                                    <td>
                                        {v.role === 'EMPLOYER' ? (
                                            <span className="badge bg-info text-white">Employer</span>
                                        ) : (
                                            <span className="badge bg-secondary text-white">Candidate</span>
                                        )}
                                    </td>
                                    {/* Submitted Date */}
                                    <td>
                                        {v.submitted_at && new Date(v.submitted_at).getFullYear() > 1970
                                            ? new Date(v.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                            : <span className="text-muted">-</span>
                                        }
                                    </td>
                                    {/* Status */}
                                    <td>{getStatusBadge(v.status)}</td>
                                    {/* Actions */}
                                    <td>
                                        <div className="d-flex gap-1">
                                            {/* See Detail button - always visible */}
                                            <Link
                                                href={`/admin/account-verification/${v.id}`}
                                                className="btn btn-sm btn-outline-primary"
                                                title="See Detail"
                                            >
                                                <IconifyIcon icon="solar:eye-bold" width={16} className="me-1" />
                                                Detail
                                            </Link>
                                            {/* Quick Approve/Reject for PENDING or SUBMITTED status */}
                                            {(v.status === 'PENDING' || v.status === 'SUBMITTED') && (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => handleQuickApprove(v.id)}
                                                        disabled={isProcessing}
                                                        title="Approve"
                                                    >
                                                        <IconifyIcon icon="solar:check-circle-bold" width={16} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleQuickReject(v.id)}
                                                        disabled={isProcessing}
                                                        title="Reject"
                                                    >
                                                        <IconifyIcon icon="solar:close-circle-bold" width={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                <small className="text-muted">
                    Showing {verifications.length} of {total} verification{total !== 1 ? 's' : ''}
                </small>
                <nav>
                    <ul className="pagination mb-0 pagination-sm">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page - 1)}>Previous</button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link">Page {page} of {Math.ceil(total / pageSize) || 1}</span>
                        </li>
                        <li className={`page-item ${page * pageSize >= total ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
