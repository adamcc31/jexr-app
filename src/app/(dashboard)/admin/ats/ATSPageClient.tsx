'use client';

/**
 * ATS Page Client Component
 *
 * The main Applicant Tracking System page with:
 * - Smart Filters (collapsible panel)
 * - Active Filter Chips
 * - Candidate Table with sorting and pagination
 * - Export Modal (Local Enhanced Version)
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';
import {
    FilterPanel,
    CandidateTable,
    ActiveFilters,
} from '@/components/admin/ats';
import ExportModalLocal from './components/ExportModalLocal';
import {
    useATSCandidates,
    useATSFilterOptions,
    fetchATSCandidates,
} from '@/hooks/admin/useATSCandidates';
import { verificationService } from '@/lib/api/verification';
import type { ATSFilter, ATSCandidate } from '@/types/ats';

// Default filter state
const DEFAULT_FILTER: ATSFilter = {
    page: 1,
    page_size: 20,
    sort_by: 'verified_at',
    sort_order: 'desc',
};

// Helper to generate unique code
const generateUniqueCode = (name: string, id: number) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const initials = cleanName.length >= 3 ? cleanName.substring(0, 3) : cleanName.padEnd(3, 'X');
    return `${initials}${id.toString()}`;
};

// Helper for CSV escaping
const escapeCSV = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

// Helper to clean skill name (remove garbage/mojibake in parentheses)
const cleanSkillName = (name: string) => {
    // Removes " (xxxxx)" where xxxxx contains non-ASCII or even just content in parens if that's the pattern
    // The user examples: "Welding (æº¶æŽ¥)", "Japanese (æ—¥æœ¬èªž)"
    // We will aggressively remove anything in parentheses affecting the end of the string.
    return name.replace(/\s*\(.*\).*$/, '').trim();
};

export default function ATSPageClient() {
    const router = useRouter();

    // Filter state (for UI editing)
    const [filterDraft, setFilterDraft] = useState<ATSFilter>(DEFAULT_FILTER);

    // Applied filter (triggers API call)
    const [appliedFilter, setAppliedFilter] = useState<ATSFilter>(DEFAULT_FILTER);

    // Export modal state
    const [showExportModal, setShowExportModal] = useState(false);
    const [isExportingDirect, setIsExportingDirect] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    // Fetch data
    const { data: candidates, isLoading: candidatesLoading } = useATSCandidates(appliedFilter);
    const { data: filterOptions, isLoading: optionsLoading } = useATSFilterOptions();

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
                if (key === 'verified_at_start') newFilter.verified_at_end = undefined;
                if (key === 'verified_at_end') newFilter.verified_at_start = undefined;
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

    // Handle enhanced export
    // Fetches all candidates matching filter, then details for each, then generates CSV
    const handleExportEnhanced = useCallback(
        async (columns: string[], format: 'xlsx' | 'csv') => {
            setIsExportingDirect(true);
            setExportError(null);

            try {
                // 1. Fetch all candidates (pagination loop)
                let allCandidates: ATSCandidate[] = [];
                let page = 1;
                let totalPages = 1;
                const BATCH_SIZE = 100; // conservative batch size

                // Fetch first page to get total pages
                // Use a loop to get all pages
                // Safety limit: 10000 candidates (100 pages)
                const MAX_PAGES = 100;

                do {
                    const response = await fetchATSCandidates({
                        ...appliedFilter,
                        page,
                        page_size: BATCH_SIZE
                    });

                    if (response.data && response.data.length > 0) {
                        allCandidates = [...allCandidates, ...response.data];
                    }

                    totalPages = response.totalPages;
                    page++;

                } while (page <= totalPages && page <= MAX_PAGES);

                if (allCandidates.length === 0) {
                    throw new Error('No candidates found to export.');
                }

                // 2. Fetch details and enrich data
                const enrichedRows = [];

                // Fetch details in parallel chunks to speed up
                const CHUNK_SIZE = 5;
                for (let i = 0; i < allCandidates.length; i += CHUNK_SIZE) {
                    const chunk = allCandidates.slice(i, i + CHUNK_SIZE);
                    const chunkPromises = chunk.map(async (candidate) => {
                        let detail = null;
                        let onboarding_data = undefined;
                        let skills = undefined;

                        try {
                            // Fetch verification detail for critical fields
                            const detailResponse = await verificationService.getDetail(candidate.verification_id);
                            detail = detailResponse.verification;
                            // Assign to outer variables
                            onboarding_data = detailResponse.onboarding_data;
                            skills = detailResponse.skills;
                        } catch (err) {
                            console.error(`Failed to fetch details for candidate ${candidate.verification_id}`, err);
                        }

                        // Enrich data
                        const row: Record<string, string | number | null | undefined> = {};

                        // Default candidate fields
                        row.full_name = candidate.full_name;
                        row.age = candidate.age;
                        row.gender = candidate.gender;
                        row.domicile_city = candidate.domicile_city;
                        row.marital_status = candidate.marital_status;
                        row.japanese_level = candidate.japanese_level;
                        row.lpk_training_name = candidate.lpk_training_name;
                        row.english_cert_type = candidate.english_cert_type;
                        row.english_score = candidate.english_score;
                        row.highest_education = candidate.highest_education;
                        row.major_field = candidate.major_field;
                        row.last_position = candidate.last_position;
                        row.expected_salary = candidate.expected_salary;
                        row.available_start_date = candidate.available_start_date;
                        row.verification_status = candidate.verification_status;
                        row.verified_at = candidate.verified_at;
                        row.total_experience_months = candidate.total_experience_months;

                        // Enhanced fields from Detail
                        if (detail) {
                            row.email = detail.user_email;
                            row.phone = detail.phone;
                            row.japan_experience_months = detail.japan_experience_duration; // Fix bug: use detail duration
                            row.unique_code = generateUniqueCode(candidate.full_name, candidate.verification_id);

                            // Competencies
                            row.main_job_fields = detail.main_job_fields?.join(', ');
                            row.golden_skill = detail.golden_skill;

                            // Work
                            row.preferred_industries = detail.preferred_industries?.join(', ');
                        } else {
                            // Fallback if detail fetch fails
                            row.japan_experience_months = candidate.japan_experience_months;
                            row.unique_code = generateUniqueCode(candidate.full_name, candidate.verification_id);
                        }

                        // Onboarding Data
                        if (onboarding_data) {
                            row.special_interest = onboarding_data.interests?.join(', ');
                            row.company_preference = onboarding_data.company_preferences?.join(', ');
                        }

                        // Skills (Fix: Use names instead of IDs, and clean garbage data)
                        if (skills && skills.length > 0) {
                            row.skills = skills.map((s: any) => cleanSkillName(s.name)).join(', ');
                        } else if (candidate.skills) {
                            // Fallback to candidate list skills if detail/skills missing
                            row.skills = candidate.skills.map(s => cleanSkillName(s)).join(', ');
                        }

                        return row;
                    });

                    const chunkResults = await Promise.all(chunkPromises);
                    enrichedRows.push(...chunkResults);
                }

                // 3. Generate CSV
                // Map columns to data keys
                // Note: 'unique_code', 'email', 'phone' are handled.
                // Others map directly to keys used above.

                // Header row
                const headerRow = columns.map(colKey => {
                    if (colKey === 'unique_code') return 'Unique Code';
                    if (colKey === 'email') return 'Email';
                    if (colKey === 'phone') return 'Phone';
                    // Find label in filter options or use key
                    return colKey.replace(/_/g, ' ').toUpperCase();
                }).join(',');

                // Data rows
                const dataRows = enrichedRows.map(row => {
                    return columns.map(colKey => {
                        return escapeCSV(row[colKey]);
                    }).join(',');
                });

                const csvContent = [headerRow, ...dataRows].join('\n');

                // 4. Download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `ats_export_enhanced_${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setShowExportModal(false);

            } catch (err: any) {
                console.error('Export failed:', err);
                setExportError(err.message || 'Export failed. Please try again.');
            } finally {
                setIsExportingDirect(false);
            }
        },
        [appliedFilter]
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
                    disabled={!candidates?.total || isExportingDirect}
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

            {/* Export Modal - Local Enhanced Version */}
            <ExportModalLocal
                show={showExportModal}
                onHide={() => {
                    setShowExportModal(false);
                    setExportError(null);
                }}
                totalCandidates={candidates?.total || 0}
                onExport={handleExportEnhanced}
                isExporting={isExportingDirect}
                error={exportError}
            />
        </Container>
    );
}
