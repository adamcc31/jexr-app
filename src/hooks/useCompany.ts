/**
 * Company Profile Hooks
 * 
 * TanStack Query hooks for fetching company profile and jobs data.
 * Used by candidate-facing company profile page.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchPublicCompanyProfile, fetchCompanyJobs } from '@/lib/employer-api';
import type { PublicCompanyProfile, Job } from '@/types/employer';

// ============================================================================
// Query Keys
// ============================================================================

export const companyQueryKeys = {
    all: ['company'] as const,
    profile: (id: number) => ['company', 'profile', id] as const,
    jobs: (id: number) => ['company', 'jobs', id] as const,
};

// ============================================================================
// Derived Types
// ============================================================================

/**
 * Extended company profile with transformed gallery data
 */
export interface CompanyProfileWithGallery extends PublicCompanyProfile {
    /** Array of available gallery image URLs (filtered from nulls) */
    galleryImages: string[];
}

// ============================================================================
// Data Transformations
// ============================================================================

/**
 * Transform company profile to include filtered gallery array
 * This avoids hardcoded null checks in JSX
 */
function transformCompanyProfile(profile: PublicCompanyProfile): CompanyProfileWithGallery {
    const galleryImages: string[] = [];

    if (profile.gallery_image_1) galleryImages.push(profile.gallery_image_1);
    if (profile.gallery_image_2) galleryImages.push(profile.gallery_image_2);
    if (profile.gallery_image_3) galleryImages.push(profile.gallery_image_3);

    return {
        ...profile,
        galleryImages,
    };
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch company profile by ID
 * Returns profile with transformed gallery data
 */
export function useCompanyProfile(id: number) {
    return useQuery<CompanyProfileWithGallery, Error>({
        queryKey: companyQueryKeys.profile(id),
        queryFn: async () => {
            const profile = await fetchPublicCompanyProfile(id);
            return transformCompanyProfile(profile);
        },
        enabled: id > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Fetch active jobs for a company
 * Returns array of jobs posted by the company
 */
export function useCompanyJobs(id: number) {
    return useQuery<Job[], Error>({
        queryKey: companyQueryKeys.jobs(id),
        queryFn: () => fetchCompanyJobs(id),
        enabled: id > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
