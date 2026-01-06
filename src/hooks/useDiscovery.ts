/**
 * Discovery Page Hooks
 *
 * TanStack Query hooks for the job discovery page.
 * Handles job categories, active jobs, and anonymous candidate previews.
 */

import { useQuery } from '@tanstack/react-query';
import {
    fetchJobCategories,
    fetchCandidatePreviews,
    fetchActiveJobs,
} from '@/lib/employer-api';
import { fetchPublicActiveJobs, fetchPublicJobDetails } from '@/lib/public-api';
import type { JobCategory, CandidatePreview } from '@/types/job';
import type { JobListResponse, JobWithCompany } from '@/types/employer';

/**
 * Check if user is authenticated via user_role cookie
 * This cookie is non-HttpOnly, set during login in actions.ts
 * 
 * SECURITY: We use user_role instead of api_token because:
 * - api_token should be HttpOnly (not readable by JS)
 * - user_role is intentionally non-HttpOnly for frontend state
 */
function isAuthenticated(): boolean {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes('user_role=');
}

// Query Keys - include auth state to prevent cache collision
export const discoveryQueryKeys = {
    categories: ['discovery', 'categories'] as const,
    candidatePreviews: ['discovery', 'candidatePreviews'] as const,
    // IMPORTANT: Key includes authenticated boolean to prevent cache collision
    // When user logs in, key changes, triggering fresh fetch with auth data
    activeJobs: (limit: number, authenticated: boolean) =>
        ['discovery', 'activeJobs', limit, authenticated] as const,
};

// ============================================================================
// Job Categories Hook
// ============================================================================

/**
 * Fetch job categories with job counts.
 * Used to display category-based navigation.
 */
export function useJobCategories() {
    return useQuery<JobCategory[], Error>({
        queryKey: discoveryQueryKeys.categories,
        queryFn: fetchJobCategories,
        staleTime: 1000 * 60 * 10, // 10 minutes - categories don't change often
    });
}

// ============================================================================
// Candidate Preview Hook
// ============================================================================

/**
 * Fetch anonymous candidate previews.
 * Used to show employer what kind of candidates are available.
 * 
 * NOTE: This data is intentionally anonymized - no personal info.
 */
export function useCandidatePreviews() {
    return useQuery<CandidatePreview[], Error>({
        queryKey: discoveryQueryKeys.candidatePreviews,
        queryFn: fetchCandidatePreviews,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// ============================================================================
// Active Jobs Hook (Auth-Aware)
// ============================================================================

/**
 * Fetch active jobs for the discovery page.
 * 
 * AUTH-AWARE IMPLEMENTATION:
 * - Logged-in users: Uses authenticated API (can see "Applied" status)
 * - Guest users: Uses public API (server-side active filter)
 * 
 * CACHE BEHAVIOR:
 * - Query key includes auth state to prevent stale data on login/logout
 */
export function useActiveJobs(limit = 12) {
    const authenticated = isAuthenticated();

    return useQuery<JobListResponse, Error>({
        // Key includes auth state - when user logs in, cache is invalidated
        queryKey: discoveryQueryKeys.activeJobs(limit, authenticated),
        queryFn: async () => {
            if (authenticated) {
                // Authenticated users get full data (Applied status, etc.)
                return fetchActiveJobs(limit);
            }
            // Guests use public endpoint with server-side active filter
            return fetchPublicActiveJobs(limit);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// ============================================================================
// Public Job Detail Hook
// ============================================================================

/**
 * Fetch single job details for public access.
 * Uses public API - no authentication required.
 */
export function usePublicJob(id: number) {
    return useQuery<JobWithCompany, Error>({
        queryKey: ['discovery', 'publicJob', id] as const,
        queryFn: () => fetchPublicJobDetails(id),
        enabled: id > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}


