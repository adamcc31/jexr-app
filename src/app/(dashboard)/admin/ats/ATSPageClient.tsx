'use client';

/**
 * ATS Page Client Component
 *
 * The main Applicant Tracking System page with:
 * - Smart Filters (collapsible panel)
 * - Active Filter Chips
 * - Candidate Table with sorting and pagination
 * - Export Modal
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';
import {
    FilterPanel,
    CandidateTable,
    ExportModal,
    ActiveFilters,
} from '@/components/admin/ats';
import {
    useATSCandidates,
    useATSFilterOptions,
    useATSExport,
} from '@/hooks/admin/useATSCandidates';
import type { ATSFilter, ATSCandidate } from '@/types/ats';

// Default filter state
const DEFAULT_FILTER: ATSFilter = {
    page: 1,
    page_size: 20,
    sort_by: 'verified_at',
    sort_order: 'desc',
};

export default function ATSPageClient() {
    const router = useRouter();

    // Filter state (for UI editing)
    const [filterDraft, setFilterDraft] = useState<ATSFilter>(DEFAULT_FILTER);

    // Applied filter (triggers API call)
    const [appliedFilter, setAppliedFilter] = useState<ATSFilter>(DEFAULT_FILTER);

    // Export modal state
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    // Fetch data
    const { data: candidates, isLoading: candidatesLoading } = useATSCandidates(appliedFilter);
    const { data: filterOptions, isLoading: optionsLoading } = useATSFilterOptions();
    const { mutate: exportData, isPending: isExporting } = useATSExport();

    // Apply filters (from filter panel)
    const handleApplyFilters = useCallback(() => {
        setAppliedFilter({ ...filterDraft, page: 1 }); // Reset to page 1 when applying new filters
    }, [filterDraft]);

    // Clear all filters
    const handleClearFilters = useCallback(() => {
        setFilterDraft(DEFAULT_FILTER);
        setAppliedFilter(DEFAULT_FILTER);
    }, []);

    // Handle filter changes from table (pagination, sorting)
    const handleTableFilterChange = useCallback((newFilter: ATSFilter) => {
        setAppliedFilter(newFilter);
        setFilterDraft(newFilter);
    }, []);

    // Remove individual filter chip
    const handleRemoveFilter = useCallback(
        (key: keyof ATSFilter, value?: string | number) => {
            const newFilter = { ...appliedFilter };

            if (value !== undefined && Array.isArray(newFilter[key])) {
                // Remove from array
                const arr = newFilter[key] as (string | number)[];
                const filtered = arr.filter((v) => v !== value);
                // @ts-expect-error - dynamic assignment
                newFilter[key] = filtered.length > 0 ? filtered : undefined;
            } else {
                // Clear the field
                // @ts-expect-error - dynamic assignment
                newFilter[key] = undefined;

                // Also clear related fields (e.g., age_min/age_max)
                if (key === 'age_min') newFilter.age_max = undefined;
                if (key === 'age_max') newFilter.age_min = undefined;
                if (key === 'japan_experience_min') newFilter.japan_experience_max = undefined;
                if (key === 'japan_experience_max') newFilter.japan_experience_min = undefined;
                if (key === 'expected_salary_min') newFilter.expected_salary_max = undefined;
                if (key === 'expected_salary_max') newFilter.expected_salary_min = undefined;
                if (key === 'total_experience_min') newFilter.total_experience_max = undefined;
                if (key === 'total_experience_max') newFilter.total_experience_min = undefined;
            }

            setAppliedFilter(newFilter);
            setFilterDraft(newFilter);
        },
        [appliedFilter]
    );

    // View candidate details
    const handleViewCandidate = useCallback((candidate: ATSCandidate) => {
        // Navigate to verification detail page
        router.push(`/admin/account-verification/${candidate.verification_id}`);
    }, [router]);

    // Handle export
    const handleExport = useCallback(
        (columns: string[], format: 'xlsx' | 'csv') => {
            setExportError(null);
            exportData(
                { filter: appliedFilter, columns, format },
                {
                    onSuccess: (blob) => {
                        // Create download link
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `ats_candidates.${format}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        setShowExportModal(false);
                    },
                    onError: (error) => {
                        setExportError(error.message || 'Export failed. Please try again.');
                    },
                }
            );
        },
        [appliedFilter, exportData]
    );

    // Count active filters
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (appliedFilter.japanese_levels?.length) count += appliedFilter.japanese_levels.length;
        if (appliedFilter.japan_experience_min !== undefined || appliedFilter.japan_experience_max !== undefined) count++;
        if (appliedFilter.has_lpk_training !== undefined) count++;
        if (appliedFilter.english_cert_types?.length) count += appliedFilter.english_cert_types.length;
        if (appliedFilter.english_min_score !== undefined) count++;
        if (appliedFilter.technical_skill_ids?.length) count += appliedFilter.technical_skill_ids.length;
        if (appliedFilter.computer_skill_ids?.length) count += appliedFilter.computer_skill_ids.length;
        if (appliedFilter.age_min !== undefined || appliedFilter.age_max !== undefined) count++;
        if (appliedFilter.genders?.length) count += appliedFilter.genders.length;
        if (appliedFilter.domicile_cities?.length) count += appliedFilter.domicile_cities.length;
        if (appliedFilter.expected_salary_min !== undefined || appliedFilter.expected_salary_max !== undefined) count++;
        if (appliedFilter.available_start_before) count++;
        if (appliedFilter.education_levels?.length) count += appliedFilter.education_levels.length;
        if (appliedFilter.major_fields?.length) count += appliedFilter.major_fields.length;
        if (appliedFilter.total_experience_min !== undefined || appliedFilter.total_experience_max !== undefined) count++;
        return count;
    }, [appliedFilter]);

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1">
                        <IconifyIcon icon="solar:users-group-rounded-bold" className="me-2" />
                        Applicant Tracking System
                    </h4>
                    <p className="text-muted mb-0">
                        Search, filter, and export candidate data for recruitment operations.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowExportModal(true)}
                    disabled={!candidates?.total}
                >
                    <IconifyIcon icon="solar:download-linear" className="me-2" />
                    Export
                </Button>
            </div>

            <Row>
                {/* Filter Panel */}
                <Col lg={3}>
                    <FilterPanel
                        filter={filterDraft}
                        options={filterOptions}
                        optionsLoading={optionsLoading}
                        onFilterChange={setFilterDraft}
                        onApply={handleApplyFilters}
                        onClear={handleClearFilters}
                    />
                </Col>

                {/* Results */}
                <Col lg={9}>
                    {/* Active Filters */}
                    <ActiveFilters
                        filter={appliedFilter}
                        options={filterOptions}
                        onRemove={handleRemoveFilter}
                    />

                    {/* Results Card */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                            <div>
                                <h6 className="mb-0">
                                    Candidates
                                    {candidates?.total !== undefined && (
                                        <span className="text-muted fw-normal ms-2">
                                            ({candidates.total.toLocaleString()} found)
                                        </span>
                                    )}
                                </h6>
                            </div>
                            {activeFilterCount > 0 && (
                                <small className="text-muted">
                                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                                </small>
                            )}
                        </Card.Header>
                        <Card.Body className="p-0">
                            <CandidateTable
                                data={candidates}
                                isLoading={candidatesLoading}
                                filter={appliedFilter}
                                onFilterChange={handleTableFilterChange}
                                onViewCandidate={handleViewCandidate}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Export Modal */}
            <ExportModal
                show={showExportModal}
                onHide={() => {
                    setShowExportModal(false);
                    setExportError(null);
                }}
                totalCandidates={candidates?.total || 0}
                onExport={handleExport}
                isExporting={isExporting}
                error={exportError}
            />
        </Container>
    );
}
