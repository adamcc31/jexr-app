/**
 * ATS (Applicant Tracking System) Hooks
 *
 * TanStack Query hooks for ATS candidate search and export operations.
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApiClient } from '@/lib/adminApi';
import type {
    ATSFilter,
    ATSCandidateResponse,
    ATSFilterOptions,
} from '@/types/ats';

// ============================================================================
// API Functions
// ============================================================================

/**
 * Build query string from filter object
 */
function buildFilterParams(filter: ATSFilter): URLSearchParams {
    const params = new URLSearchParams();

    // Japanese Proficiency Group
    if (filter.japanese_levels?.length) {
        params.append('japanese_levels', filter.japanese_levels.join(','));
    }
    if (filter.japan_experience_min !== undefined) {
        params.append('japan_experience_min', filter.japan_experience_min.toString());
    }
    if (filter.japan_experience_max !== undefined) {
        params.append('japan_experience_max', filter.japan_experience_max.toString());
    }
    if (filter.has_lpk_training !== undefined) {
        params.append('has_lpk_training', filter.has_lpk_training.toString());
    }

    // Competency & Language Group
    if (filter.english_cert_types?.length) {
        params.append('english_cert_types', filter.english_cert_types.join(','));
    }
    if (filter.english_min_score !== undefined) {
        params.append('english_min_score', filter.english_min_score.toString());
    }
    if (filter.technical_skill_ids?.length) {
        params.append('technical_skill_ids', filter.technical_skill_ids.join(','));
    }
    if (filter.computer_skill_ids?.length) {
        params.append('computer_skill_ids', filter.computer_skill_ids.join(','));
    }

    // Logistics & Availability Group
    if (filter.age_min !== undefined) {
        params.append('age_min', filter.age_min.toString());
    }
    if (filter.age_max !== undefined) {
        params.append('age_max', filter.age_max.toString());
    }
    if (filter.genders?.length) {
        params.append('genders', filter.genders.join(','));
    }
    if (filter.domicile_cities?.length) {
        params.append('domicile_cities', filter.domicile_cities.join(','));
    }
    if (filter.expected_salary_min !== undefined) {
        params.append('expected_salary_min', filter.expected_salary_min.toString());
    }
    if (filter.expected_salary_max !== undefined) {
        params.append('expected_salary_max', filter.expected_salary_max.toString());
    }
    if (filter.available_start_before) {
        params.append('available_start_before', filter.available_start_before);
    }

    // Education & Experience Group
    if (filter.education_levels?.length) {
        params.append('education_levels', filter.education_levels.join(','));
    }
    if (filter.major_fields?.length) {
        params.append('major_fields', filter.major_fields.join(','));
    }
    if (filter.total_experience_min !== undefined) {
        params.append('total_experience_min', filter.total_experience_min.toString());
    }
    if (filter.total_experience_max !== undefined) {
        params.append('total_experience_max', filter.total_experience_max.toString());
    }

    // Pagination & Sorting
    params.append('page', (filter.page || 1).toString());
    params.append('page_size', (filter.page_size || 20).toString());
    if (filter.sort_by) {
        params.append('sort_by', filter.sort_by);
    }
    if (filter.sort_order) {
        params.append('sort_order', filter.sort_order);
    }

    return params;
}

/**
 * Fetch ATS candidates with filters
 */
async function fetchATSCandidates(filter: ATSFilter): Promise<ATSCandidateResponse> {
    const params = buildFilterParams(filter);
    const response = await adminApiClient.get<ATSCandidateResponse>(
        `/admin/ats/candidates?${params.toString()}`
    );
    return response.data;
}

/**
 * Fetch filter options
 */
async function fetchFilterOptions(): Promise<ATSFilterOptions> {
    const response = await adminApiClient.get<ATSFilterOptions>('/admin/ats/filter-options');
    return response.data;
}

/**
 * Export candidates to file
 */
async function exportCandidates(params: {
    filter: ATSFilter;
    columns: string[];
    format: 'xlsx' | 'csv';
}): Promise<Blob> {
    const queryParams = buildFilterParams(params.filter);
    queryParams.append('columns', params.columns.join(','));
    queryParams.append('format', params.format);

    const response = await adminApiClient.get(`/admin/ats/export?${queryParams.toString()}`, {
        responseType: 'blob',
    });
    return response.data;
}

// ============================================================================
// Query Keys
// ============================================================================

export const atsKeys = {
    all: ['ats'] as const,
    candidates: (filter: ATSFilter) => ['ats', 'candidates', filter] as const,
    filterOptions: ['ats', 'filter-options'] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook for fetching ATS candidates with filters
 *
 * @param filter - Filter parameters
 * @param enabled - Whether to enable the query
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useATSCandidates({
 *     japanese_levels: ['N1', 'N2'],
 *     age_min: 25,
 *     page: 1,
 *     page_size: 20
 * });
 * ```
 */
export function useATSCandidates(filter: ATSFilter = {}, enabled = true) {
    return useQuery({
        queryKey: atsKeys.candidates(filter),
        queryFn: () => fetchATSCandidates(filter),
        enabled,
        staleTime: 1000 * 60 * 2, // 2 minutes
        placeholderData: (previousData) => previousData,
    });
}

/**
 * Hook for fetching filter options
 *
 * @example
 * ```tsx
 * const { data: options, isLoading } = useATSFilterOptions();
 * // options.japanese_levels, options.computer_skills, etc.
 * ```
 */
export function useATSFilterOptions() {
    return useQuery({
        queryKey: atsKeys.filterOptions,
        queryFn: fetchFilterOptions,
        staleTime: 1000 * 60 * 60, // 1 hour (reference data rarely changes)
    });
}

/**
 * Hook for exporting candidates
 *
 * @example
 * ```tsx
 * const { mutate: exportData, isPending } = useATSExport();
 *
 * const handleExport = () => {
 *     exportData(
 *         { filter, columns: ['full_name', 'japanese_level'], format: 'xlsx' },
 *         {
 *             onSuccess: (blob) => {
 *                 // Trigger download
 *                 const url = URL.createObjectURL(blob);
 *                 const a = document.createElement('a');
 *                 a.href = url;
 *                 a.download = 'candidates.xlsx';
 *                 a.click();
 *             }
 *         }
 *     );
 * };
 * ```
 */
export function useATSExport() {
    return useMutation({
        mutationFn: exportCandidates,
    });
}
