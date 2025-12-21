/**
 * Admin Jobs Hooks
 * 
 * TanStack Query hooks for job moderation operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiClient } from '@/lib/adminApi';
import type {
    AdminJob,
    AdminJobFilters,
    HideJobPayload,
    FlagJobPayload,
    PaginatedResponse
} from '@/types/admin';

/**
 * Query key factory for admin jobs
 */
export const adminJobsKeys = {
    all: ['admin', 'jobs'] as const,
    list: (filters: AdminJobFilters) => ['admin', 'jobs', 'list', filters] as const,
    detail: (id: number) => ['admin', 'jobs', 'detail', id] as const,
};

/**
 * Fetches paginated list of jobs for moderation
 */
async function fetchAdminJobs(
    filters: AdminJobFilters
): Promise<PaginatedResponse<AdminJob>> {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.isFlagged !== undefined) params.append('isFlagged', String(filters.isFlagged));
    if (filters.companyId) params.append('companyId', String(filters.companyId));
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.pageSize) params.append('pageSize', String(filters.pageSize));

    const { data } = await adminApiClient.get<PaginatedResponse<AdminJob>>(
        `/admin/jobs?${params.toString()}`
    );
    return data;
}

/**
 * Hides or unhides a job posting
 */
async function hideJob(payload: HideJobPayload): Promise<AdminJob> {
    const { data } = await adminApiClient.patch<AdminJob>(
        `/admin/jobs/${payload.jobId}/hide`,
        { hide: payload.hide, reason: payload.reason }
    );
    return data;
}

/**
 * Flags or unflags a job as suspicious
 */
async function flagJob(payload: FlagJobPayload): Promise<AdminJob> {
    const { data } = await adminApiClient.patch<AdminJob>(
        `/admin/jobs/${payload.jobId}/flag`,
        { flag: payload.flag, reason: payload.reason }
    );
    return data;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook for fetching paginated list of jobs for moderation
 * 
 * @param filters - Filter options (status, isFlagged, companyId, search, pagination)
 */
export function useAdminJobs(filters: AdminJobFilters = {}) {
    return useQuery({
        queryKey: adminJobsKeys.list(filters),
        queryFn: () => fetchAdminJobs(filters),
        staleTime: 1000 * 60 * 1, // 1 minute
        placeholderData: (previousData) => previousData,
    });
}

/**
 * Hook for hiding/unhiding a job
 * 
 * @example
 * ```tsx
 * const { mutate: toggleHide, isPending } = useHideJob();
 * 
 * const handleHide = () => {
 *     toggleHide({ jobId: job.id, hide: true, reason: 'Violates terms' });
 * };
 * ```
 */
export function useHideJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: hideJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminJobsKeys.all });
        },
    });
}

/**
 * Hook for flagging/unflagging a job as suspicious
 * 
 * @example
 * ```tsx
 * const { mutate: toggleFlag, isPending } = useFlagJob();
 * 
 * const handleFlag = () => {
 *     toggleFlag({ jobId: job.id, flag: true, reason: 'Suspicious salary' });
 * };
 * ```
 */
export function useFlagJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: flagJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminJobsKeys.all });
        },
    });
}
