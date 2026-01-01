/**
 * Candidate API Service Layer
 *
 * API functions for fetching candidate profile data.
 * Uses apiClient from lib/api.ts for consistent request handling.
 */

import { apiClient } from './api';
import type { CandidateProfileResponse } from '@/types/candidate';
import type { ApiResponse, Application, ApplyToJobInput } from '@/types/application';

// ============================================================================
// Candidate Profile API Functions
// ============================================================================

/**
 * Fetch the current user's candidate profile (verification + experiences).
 * GET /v1/candidates/me/verification
 */
export async function fetchCandidateProfile(): Promise<CandidateProfileResponse> {
    const response = await apiClient.get<{ data: CandidateProfileResponse }>('/candidates/me/verification');
    return response.data.data;
}

// ============================================================================
// Application API Functions
// ============================================================================

/**
 * Apply to a job.
 * POST /v1/candidates/jobs/:jobId/apply
 */
export async function applyToJob(jobId: number, input: ApplyToJobInput): Promise<Application> {
    const response = await apiClient.post<ApiResponse<Application>>(`/candidates/jobs/${jobId}/apply`, input);
    return response.data.data;
}

/**
 * Get all applications submitted by the current candidate.
 * GET /v1/candidates/applications
 */
export async function fetchMyApplications(): Promise<Application[]> {
    const response = await apiClient.get<ApiResponse<Application[]>>('/candidates/applications');
    return response.data.data || [];
}

/**
 * Upload a file (CV, certificate, etc.).
 * POST /v1/upload
 */
export async function uploadFile(file: File, bucket: 'CV' | 'JLPT' | 'Profile_Picture' = 'CV'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(`/upload?bucket=${bucket}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data.url;
}

// ============================================================================
// Onboarding API Functions
// ============================================================================

import type { OnboardingStatus, LPK, OnboardingSubmitData } from '@/types/onboarding';

/**
 * Get onboarding completion status for the current user.
 * GET /v1/onboarding/status
 */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
    const response = await apiClient.get<{ data: OnboardingStatus }>('/onboarding/status');
    return response.data.data;
}

/**
 * Search LPK training centers for autocomplete.
 * GET /v1/onboarding/lpk/search?q=<query>
 */
export async function searchLPK(query: string): Promise<LPK[]> {
    if (!query || query.length < 2) {
        return [];
    }
    const response = await apiClient.get<{ data: LPK[] }>('/onboarding/lpk/search', {
        params: { q: query },
    });
    return response.data.data || [];
}

/**
 * Submit onboarding wizard data and mark as complete.
 * POST /v1/onboarding/complete
 */
export async function submitOnboarding(data: OnboardingSubmitData): Promise<void> {
    await apiClient.post('/onboarding/complete', data);
}

