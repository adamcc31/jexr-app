/**
 * Candidate Profile Hooks
 *
 * TanStack Query hooks for candidate profile data.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCandidateProfile } from '@/lib/candidate-api';
import { fetchJobs } from '@/lib/employer-api';
import type { CandidateProfileResponse } from '@/types/candidate';
import type { JobListResponse } from '@/types/employer';

// ============================================================================
// Query Keys
// ============================================================================

export const candidateQueryKeys = {
    profile: ['candidate', 'profile'] as const,
    recommendedJobs: ['candidate', 'recommendedJobs'] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch current user's candidate profile.
 * Includes verification data and work experiences.
 */
export function useCandidateProfile() {
    return useQuery<CandidateProfileResponse | null, Error>({
        queryKey: candidateQueryKeys.profile,
        queryFn: async () => {
            try {
                return await fetchCandidateProfile();
            } catch (error: unknown) {
                // Handle 404 gracefully - return null for missing profile
                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response?: { status?: number } };
                    if (axiosError.response?.status === 404) {
                        return null;
                    }
                }
                throw error;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Fetch recommended jobs for the candidate.
 * Returns active jobs from companies with active status.
 */
export function useRecommendedJobs(limit: number = 3) {
    return useQuery<JobListResponse, Error>({
        queryKey: [...candidateQueryKeys.recommendedJobs, limit],
        queryFn: () => fetchJobs(1, limit),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
