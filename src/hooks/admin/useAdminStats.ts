/**
 * Admin Stats Hook
 * 
 * TanStack Query hook for fetching dashboard statistics.
 */

import { useQuery } from '@tanstack/react-query';
import { adminApiClient, getApiErrorMessage } from '@/lib/adminApi';
import type { AdminStats } from '@/types/admin';

/**
 * Query key factory for admin stats
 */
export const adminStatsKeys = {
    all: ['admin', 'stats'] as const,
};

/**
 * Fetches admin dashboard statistics
 */
async function fetchAdminStats(): Promise<AdminStats> {
    const { data } = await adminApiClient.get<AdminStats>('/admin/stats');
    return data;
}

/**
 * Hook for fetching admin dashboard statistics
 * 
 * @returns Query result with stats data, loading, and error states
 * 
 * @example
 * ```tsx
 * const { data: stats, isLoading, error } = useAdminStats();
 * 
 * if (isLoading) return <LoadingState />;
 * if (error) return <ErrorState message={error.message} />;
 * 
 * return <StatsCard total={stats.totalUsers} />;
 * ```
 */
export function useAdminStats() {
    return useQuery({
        queryKey: adminStatsKeys.all,
        queryFn: fetchAdminStats,
        staleTime: 1000 * 60 * 2, // 2 minutes - stats can be slightly stale
        retry: 1,
        // Transform error for better UX
        meta: {
            errorMessage: 'Failed to load dashboard statistics',
        },
    });
}
