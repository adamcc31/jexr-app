/**
 * Public API Client
 * 
 * API client for public endpoints that don't require authentication.
 * Used for guest access to job listings and other public data.
 */

import axios from 'axios';
import type { JobListResponse, ApiResponse } from '@/types/employer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

/**
 * Public API client - NO auth headers
 * Use this for endpoints that should work without login
 */
export const publicApiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetch active jobs for public access (no authentication required)
 * Uses dedicated /jobs/public endpoint with server-side active filter
 * 
 * SECURITY: The server enforces the 'active' filter - cannot be bypassed
 */
export async function fetchPublicActiveJobs(limit = 12): Promise<JobListResponse> {
    const response = await publicApiClient.get<ApiResponse<JobListResponse>>(
        '/jobs/public',
        { params: { page: 1, page_size: limit } }
    );
    return response.data.data;
}
