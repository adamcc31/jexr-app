'use client';

/**
 * ATS Candidate Table Component
 *
 * Displays paginated list of candidates with sorting and actions.
 */

import React from 'react';
import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';
import type { ATSCandidate, ATSCandidateResponse, ATSFilter } from '@/types/ats';
import { JLPT_LABELS, EDUCATION_LABELS } from '@/types/ats';

interface CandidateTableProps {
    data: ATSCandidateResponse | undefined;
    isLoading: boolean;
    filter: ATSFilter;
    onFilterChange: (filter: ATSFilter) => void;
    onViewCandidate: (candidate: ATSCandidate) => void;
}

// Format currency
function formatCurrency(value: number | undefined): string {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

// Format experience months to years/months
function formatExperience(months: number | undefined): string {
    if (!months) return '-';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths}mo`;
    if (remainingMonths === 0) return `${years}y`;
    return `${years}y ${remainingMonths}mo`;
}

// Get JLPT badge color
function getJLPTColor(level: string | undefined): string {
    switch (level) {
        case 'N1':
            return 'success';
        case 'N2':
            return 'primary';
        case 'N3':
            return 'info';
        case 'N4':
            return 'warning';
        case 'N5':
            return 'secondary';
        default:
            return 'light';
    }
}

export default function CandidateTable({
    data,
    isLoading,
    filter,
    onFilterChange,
    onViewCandidate,
}: CandidateTableProps) {
    // Handle sorting
    const handleSort = (column: ATSFilter['sort_by']) => {
        if (filter.sort_by === column) {
            // Toggle order
            onFilterChange({
                ...filter,
                sort_order: filter.sort_order === 'asc' ? 'desc' : 'asc',
            });
        } else {
            // New column, default desc
            onFilterChange({
                ...filter,
                sort_by: column,
                sort_order: 'desc',
            });
        }
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        onFilterChange({ ...filter, page });
    };

    // Sort icon
    const SortIcon = ({ column }: { column: ATSFilter['sort_by'] }) => {
        if (filter.sort_by !== column) {
            return <IconifyIcon icon="solar:sort-outline" className="ms-1 text-muted" width={14} />;
        }
        return filter.sort_order === 'asc' ? (
            <IconifyIcon icon="solar:alt-arrow-up-outline" className="ms-1" width={14} />
        ) : (
            <IconifyIcon icon="solar:alt-arrow-down-outline" className="ms-1" width={14} />
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading candidates...</p>
            </div>
        );
    }

    // Empty state
    if (!data?.data?.length) {
        return (
            <div className="text-center py-5">
                <IconifyIcon icon="solar:users-group-rounded-bold-duotone" width={64} className="text-muted mb-3" />
                <h5>No Candidates Found</h5>
                <p className="text-muted mb-0">Try adjusting your filters to see more results.</p>
            </div>
        );
    }

    const totalPages = data.totalPages || 1;
    const currentPage = data.page || 1;

    return (
        <>
            <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Candidate</th>
                            <th
                                onClick={() => handleSort('japanese_level')}
                                style={{ cursor: 'pointer' }}
                                className="text-nowrap"
                            >
                                JLPT <SortIcon column="japanese_level" />
                            </th>
                            <th
                                onClick={() => handleSort('age')}
                                style={{ cursor: 'pointer' }}
                                className="text-nowrap"
                            >
                                Age <SortIcon column="age" />
                            </th>
                            <th>Location</th>
                            <th>Experience</th>
                            <th
                                onClick={() => handleSort('expected_salary')}
                                style={{ cursor: 'pointer' }}
                                className="text-nowrap"
                            >
                                Salary <SortIcon column="expected_salary" />
                            </th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.map((candidate) => (
                            <tr key={candidate.user_id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                                            style={{ width: 40, height: 40, overflow: 'hidden' }}
                                        >
                                            {candidate.profile_picture_url ? (
                                                <img
                                                    src={candidate.profile_picture_url}
                                                    alt={candidate.full_name}
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            ) : (
                                                <IconifyIcon icon="solar:user-rounded-bold" width={20} className="text-muted" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="fw-medium">{candidate.full_name}</div>
                                            <small className="text-muted">
                                                {candidate.last_position || candidate.highest_education
                                                    ? EDUCATION_LABELS[candidate.highest_education || ''] || candidate.highest_education
                                                    : '-'}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <Badge bg={getJLPTColor(candidate.japanese_level)}>
                                        {candidate.japanese_level
                                            ? JLPT_LABELS[candidate.japanese_level] || candidate.japanese_level
                                            : 'N/A'}
                                    </Badge>
                                    {candidate.lpk_training_name && (
                                        <Badge bg="light" text="dark" className="ms-1" title={candidate.lpk_training_name}>
                                            LPK
                                        </Badge>
                                    )}
                                </td>
                                <td>{candidate.age || '-'}</td>
                                <td>{candidate.domicile_city || '-'}</td>
                                <td>
                                    <div>
                                        <strong>{formatExperience(candidate.total_experience_months)}</strong>
                                    </div>
                                    {candidate.japan_experience_months && candidate.japan_experience_months > 0 && (
                                        <small className="text-muted">
                                            (JP: {formatExperience(candidate.japan_experience_months)})
                                        </small>
                                    )}
                                </td>
                                <td>{formatCurrency(candidate.expected_salary)}</td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => onViewCandidate(candidate)}
                                        title="View Details"
                                    >
                                        <IconifyIcon icon="solar:eye-outline" width={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3 px-3 pb-3">
                <small className="text-muted">
                    Showing {(currentPage - 1) * (data.pageSize || 20) + 1}–
                    {Math.min(currentPage * (data.pageSize || 20), data.total)} of {data.total} candidates
                </small>

                <Pagination size="sm" className="mb-0">
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

                    {/* Show page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        return (
                            <Pagination.Item
                                key={pageNum}
                                active={pageNum === currentPage}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </Pagination.Item>
                        );
                    })}

                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage >= totalPages} />
                </Pagination>
            </div>
        </>
    );
}
