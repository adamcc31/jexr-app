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
