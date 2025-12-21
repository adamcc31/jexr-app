/**
 * Admin Verifications Hooks
 * 
 * TanStack Query hooks for verification management operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    verificationService,
    VerificationFilter,
    AccountVerification,
    VerificationDetailResponse,
    PaginatedResult
} from '@/lib/api/verification';
import { getApiErrorMessage } from '@/lib/adminApi';

/**
 * Query key factory for admin verifications
 */
export const adminVerificationsKeys = {
    all: ['admin', 'verifications'] as const,
    list: (filters: VerificationFilter) => ['admin', 'verifications', 'list', filters] as const,
    detail: (id: number) => ['admin', 'verifications', 'detail', id] as const,
};

/**
 * Fetches paginated list of verifications with optional filters
 */
async function fetchVerifications(filters: VerificationFilter): Promise<PaginatedResult<AccountVerification>> {
    return verificationService.getAll(filters);
}

/**
 * Fetches a single verification's details
 */
async function fetchVerificationDetail(id: number): Promise<VerificationDetailResponse> {
    return verificationService.getDetail(id);
}

/**
 * Approves a verification
 */
async function approveVerification(id: number): Promise<void> {
    return verificationService.verify(id, 'APPROVE');
}

/**
 * Rejects a verification with optional notes
 */
async function rejectVerification({ id, notes }: { id: number; notes?: string }): Promise<void> {
    return verificationService.verify(id, 'REJECT', notes);
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook for fetching paginated list of verifications
 * 
 * @param filters - Filter options (role, status, pagination)
 * 
 * @example
 * ```tsx
 * const [filters, setFilters] = useState({ status: 'SUBMITTED', page: 1 });
 * const { data, isLoading } = useAdminVerifications(filters);
 * ```
 */
export function useAdminVerifications(filters: VerificationFilter = {}) {
    return useQuery({
        queryKey: adminVerificationsKeys.list(filters),
        queryFn: () => fetchVerifications(filters),
        staleTime: 1000 * 60 * 1, // 1 minute
        placeholderData: (previousData) => previousData,
    });
}

/**
 * Hook for fetching a single verification's details with work experiences
 * 
 * @param id - Verification ID to fetch
 * @param enabled - Whether to enable the query (default: true)
 */
export function useAdminVerificationDetail(id: number, enabled = true) {
    return useQuery({
        queryKey: adminVerificationsKeys.detail(id),
        queryFn: () => fetchVerificationDetail(id),
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook for approving a verification
 * 
 * Automatically invalidates the verifications list on success
 * 
 * @example
 * ```tsx
 * const { mutate: approve, isPending } = useApproveVerification();
 * 
 * const handleApprove = () => {
 *     approve(verificationId, {
 *         onSuccess: () => router.push('/admin/account-verification')
 *     });
 * };
 * ```
 */
export function useApproveVerification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveVerification,
        onSuccess: (_, verificationId) => {
            // Invalidate the list to trigger refetch
            queryClient.invalidateQueries({ queryKey: adminVerificationsKeys.all });
            // Invalidate the specific detail
            queryClient.invalidateQueries({ queryKey: adminVerificationsKeys.detail(verificationId) });
        },
    });
}

/**
 * Hook for rejecting a verification with optional notes
 * 
 * @example
 * ```tsx
 * const { mutate: reject, isPending } = useRejectVerification();
 * 
 * const handleReject = (reason: string) => {
 *     reject({ id: verificationId, notes: reason }, {
 *         onSuccess: () => router.push('/admin/account-verification')
 *     });
 * };
 * ```
 */
export function useRejectVerification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectVerification,
        onSuccess: (_, { id }) => {
            // Invalidate the list to trigger refetch
            queryClient.invalidateQueries({ queryKey: adminVerificationsKeys.all });
            // Invalidate the specific detail
            queryClient.invalidateQueries({ queryKey: adminVerificationsKeys.detail(id) });
        },
    });
}

// Export error helper for consistency
export { getApiErrorMessage };
