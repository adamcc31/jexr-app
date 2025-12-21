/**
 * Admin Companies Hooks
 * 
 * TanStack Query hooks for company verification operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiClient } from '@/lib/adminApi';
import type {
    AdminCompany,
    AdminCompanyFilters,
    VerifyCompanyPayload,
    PaginatedResponse
} from '@/types/admin';

/**
 * Query key factory for admin companies
 */
export const adminCompaniesKeys = {
    all: ['admin', 'companies'] as const,
    list: (filters: AdminCompanyFilters) => ['admin', 'companies', 'list', filters] as const,
    detail: (id: number) => ['admin', 'companies', 'detail', id] as const,
};

/**
 * Fetches paginated list of companies
 */
async function fetchAdminCompanies(
    filters: AdminCompanyFilters
): Promise<PaginatedResponse<AdminCompany>> {
    const params = new URLSearchParams();

    if (filters.verificationStatus) params.append('verificationStatus', filters.verificationStatus);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.pageSize) params.append('pageSize', String(filters.pageSize));

    const { data } = await adminApiClient.get<PaginatedResponse<AdminCompany>>(
        `/admin/companies?${params.toString()}`
    );
    return data;
}

/**
 * Approves or rejects a company verification
 */
async function verifyCompany(payload: VerifyCompanyPayload): Promise<AdminCompany> {
    const { data } = await adminApiClient.patch<AdminCompany>(
        `/admin/companies/${payload.companyId}/verify`,
        { action: payload.action, reason: payload.reason }
    );
    return data;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook for fetching paginated list of companies
 * 
 * @param filters - Filter options (verificationStatus, search, pagination)
 */
export function useAdminCompanies(filters: AdminCompanyFilters = {}) {
    return useQuery({
        queryKey: adminCompaniesKeys.list(filters),
        queryFn: () => fetchAdminCompanies(filters),
        staleTime: 1000 * 60 * 1, // 1 minute
        placeholderData: (previousData) => previousData,
    });
}

/**
 * Hook for approving or rejecting a company
 * 
 * @example
 * ```tsx
 * const { mutate: verify, isPending } = useVerifyCompany();
 * 
 * const handleApprove = () => {
 *     verify({ companyId: company.id, action: 'approve' });
 * };
 * ```
 */
export function useVerifyCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: verifyCompany,
        onSuccess: (updatedCompany) => {
            // Invalidate all company queries
            queryClient.invalidateQueries({ queryKey: adminCompaniesKeys.all });

            // Update specific company in cache
            queryClient.setQueryData(
                adminCompaniesKeys.detail(updatedCompany.id),
                updatedCompany
            );
        },
    });
}
