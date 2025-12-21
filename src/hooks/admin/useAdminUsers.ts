/**
 * Admin Users Hooks
 * 
 * TanStack Query hooks for user management operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiClient, getApiErrorMessage } from '@/lib/adminApi';
import type {
    AdminUser,
    AdminUserFilters,
    DisableUserPayload,
    CreateUserPayload,
    UpdateUserPayload,
    PaginatedResponse
} from '@/types/admin';

/**
 * Query key factory for admin users
 */
export const adminUsersKeys = {
    all: ['admin', 'users'] as const,
    list: (filters: AdminUserFilters) => ['admin', 'users', 'list', filters] as const,
    detail: (id: string) => ['admin', 'users', 'detail', id] as const,
};

/**
 * Fetches paginated list of users with optional filters
 */
async function fetchAdminUsers(
    filters: AdminUserFilters
): Promise<PaginatedResponse<AdminUser>> {
    const params = new URLSearchParams();

    if (filters.role) params.append('role', filters.role);
    if (filters.isDisabled !== undefined) params.append('isDisabled', String(filters.isDisabled));
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.pageSize) params.append('pageSize', String(filters.pageSize));

    const { data } = await adminApiClient.get<PaginatedResponse<AdminUser>>(
        `/admin/users?${params.toString()}`
    );
    return data;
}

/**
 * Fetches a single user by ID
 */
async function fetchAdminUser(userId: string): Promise<AdminUser> {
    const { data } = await adminApiClient.get<AdminUser>(`/admin/users/${userId}`);
    return data;
}

/**
 * Disables or enables a user
 */
async function disableUser(payload: DisableUserPayload): Promise<AdminUser> {
    const { data } = await adminApiClient.patch<AdminUser>(
        `/admin/users/${payload.userId}/disable`,
        { disable: payload.disable }
    );
    return data;

}

/**
 * Creates a new user
 */
async function createUser(payload: CreateUserPayload): Promise<AdminUser> {
    const { data } = await adminApiClient.post<AdminUser>('/admin/users', payload);
    return data;
}

/**
 * Updates an existing user
 */
async function updateUser(payload: UpdateUserPayload): Promise<AdminUser> {
    const { userId, ...rest } = payload;
    const { data } = await adminApiClient.put<AdminUser>(`/admin/users/${userId}`, rest);
    return data;
}

/**
 * Deletes a user
 */
async function deleteUser(userId: string): Promise<void> {
    await adminApiClient.delete(`/admin/users/${userId}`);
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook for fetching paginated list of users
 * 
 * @param filters - Filter options (role, status, search, pagination)
 * 
 * @example
 * ```tsx
 * const [filters, setFilters] = useState({ role: 'candidate', page: 1 });
 * const { data, isLoading } = useAdminUsers(filters);
 * ```
 */
export function useAdminUsers(filters: AdminUserFilters = {}) {
    return useQuery({
        queryKey: adminUsersKeys.list(filters),
        queryFn: () => fetchAdminUsers(filters),
        staleTime: 1000 * 60 * 1, // 1 minute
        placeholderData: (previousData) => previousData, // Keep previous data while refetching
    });
}

/**
 * Hook for fetching a single user's details
 * 
 * @param userId - User ID to fetch
 * @param enabled - Whether to enable the query (default: true)
 */
export function useAdminUser(userId: string, enabled = true) {
    return useQuery({
        queryKey: adminUsersKeys.detail(userId),
        queryFn: () => fetchAdminUser(userId),
        enabled: enabled && !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook for enabling/disabling a user
 * 
 * Automatically invalidates the users list on success
 * 
 * @example
 * ```tsx
 * const { mutate: toggleUser, isPending } = useDisableUser();
 * 
 * const handleDisable = () => {
 *     toggleUser({ userId: user.id, disable: true });
 * };
 * ```
 */
export function useDisableUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: disableUser,
        onSuccess: (updatedUser) => {
            // Invalidate the list to trigger refetch
            queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });

            // Update the specific user in cache
            queryClient.setQueryData(
                adminUsersKeys.detail(updatedUser.id),
                updatedUser
            );
        },
    });

}

/**
 * Hook for creating a new user
 */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
        },
    });
}

/**
 * Hook for updating a user
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
            queryClient.setQueryData(
                adminUsersKeys.detail(updatedUser.id),
                updatedUser
            );
        },
    });
}

/**
 * Hook for deleting a user
 */
export function useDeleteUserMutation() { // Renamed to avoid name conflict with possible existing delete handlers
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
        },
    });
}
