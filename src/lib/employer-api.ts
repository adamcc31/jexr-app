/**
 * Employer API Service Layer
 * 
 * All employer-specific API calls isolated from React components.
 * Uses apiClient from lib/api.ts for consistent request handling.
 */

import { apiClient } from './api';
import type {
    Job,
    JobWithCompany,
    CreateJobInput,
    UpdateJobInput,
    ApiResponse,
    JobListResponse,
    CompanyProfile,
    PublicCompanyProfile,
    CompanyProfileInput
} from '@/types/employer';
import type {
    Application,
    ApplicationDetailResponse,
    UpdateApplicationStatusInput,
    ApiResponse as AppApiResponse
} from '@/types/application';

// ============================================================================
// Job API Functions
// ============================================================================

/**
 * Fetch all jobs with pagination (public list)
 * GET /v1/jobs
 */
export async function fetchJobs(page = 1, pageSize = 10): Promise<JobListResponse> {
    const response = await apiClient.get<ApiResponse<JobListResponse>>('/jobs', {
        params: { page, page_size: pageSize }
    });
    return response.data.data;
}

/**
 * Fetch employer's own jobs with pagination (employer dashboard)
 * GET /v1/employers/jobs
 */
export async function fetchEmployerJobs(page = 1, pageSize = 10): Promise<JobListResponse> {
    const response = await apiClient.get<ApiResponse<JobListResponse>>('/employers/jobs', {
        params: { page, page_size: pageSize }
    });
    return response.data.data;
}

/**
 * Fetch a single job by ID (with company profile data)
 * GET /v1/jobs/:id
 * Returns job with company_name, company_logo_url, company_website, industry
 */
export async function fetchJobById(id: number): Promise<JobWithCompany> {
    const response = await apiClient.get<ApiResponse<JobWithCompany>>(`/jobs/${id}`);
    return response.data.data;
}

/**
 * Create a new job
 * POST /v1/jobs
 */
export async function createJob(input: CreateJobInput): Promise<Job> {
    const response = await apiClient.post<ApiResponse<Job>>('/jobs', input);
    return response.data.data;
}

/**
 * Update an existing job
 * PUT /v1/jobs/:id
 * Note: Requires backend endpoint implementation
 */
export async function updateJob(id: number, input: UpdateJobInput): Promise<Job> {
    const response = await apiClient.put<ApiResponse<Job>>(`/jobs/${id}`, input);
    return response.data.data;
}

/**
 * Close a job (update company_status to 'closed')
 * PATCH /v1/jobs/:id/close
 * Note: Requires backend endpoint implementation
 */
export async function closeJob(id: number): Promise<Job> {
    const response = await apiClient.patch<ApiResponse<Job>>(`/jobs/${id}/close`);
    return response.data.data;
}

/**
 * Delete a job permanently
 * DELETE /v1/jobs/:id
 */
export async function deleteJob(id: number): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
}

// ============================================================================
// Application API Functions (Employer)
// ============================================================================

/**
 * Fetch all applications for a specific job
 * GET /v1/employers/jobs/:jobId/applications
 */
export async function fetchJobApplications(jobId: number): Promise<Application[]> {
    const response = await apiClient.get<AppApiResponse<Application[]>>(`/employers/jobs/${jobId}/applications`);
    return response.data.data || [];
}

/**
 * Fetch a single application detail with full candidate profile
 * GET /v1/employers/applications/:id
 */
export async function fetchApplicationDetail(id: number): Promise<ApplicationDetailResponse> {
    const response = await apiClient.get<AppApiResponse<ApplicationDetailResponse>>(`/employers/applications/${id}`);
    return response.data.data;
}

/**
 * Update application status
 * PATCH /v1/employers/applications/:id
 */
export async function updateApplicationStatus(id: number, input: UpdateApplicationStatusInput): Promise<void> {
    await apiClient.patch(`/employers/applications/${id}`, input);
}

// ============================================================================
// Company Profile API Functions
// ============================================================================

/**
 * Fetch employer's own company profile
 * GET /v1/employers/company-profile
 */
export async function fetchCompanyProfile(): Promise<CompanyProfile> {
    const response = await apiClient.get<ApiResponse<CompanyProfile>>('/employers/company-profile');
    return response.data.data;
}

/**
 * Create or update company profile
 * PUT /v1/employers/company-profile
 */
export async function updateCompanyProfile(input: CompanyProfileInput): Promise<CompanyProfile> {
    const response = await apiClient.put<ApiResponse<CompanyProfile>>('/employers/company-profile', input);
    return response.data.data;
}

/**
 * Fetch public company profile
 * GET /v1/companies/:id
 */
export async function fetchPublicCompanyProfile(id: number): Promise<PublicCompanyProfile> {
    const response = await apiClient.get<ApiResponse<PublicCompanyProfile>>(`/companies/${id}`);
    return response.data.data;
}

/**
 * Fetch jobs by company ID
 * GET /v1/jobs?company_id=:id
 * Note: This reuses the existing jobs endpoint with company filter
 */
export async function fetchCompanyJobs(companyId: number): Promise<Job[]> {
    const response = await apiClient.get<ApiResponse<JobListResponse>>('/jobs', {
        params: { company_id: companyId, page: 1, page_size: 100 }
    });
    return response.data.data.jobs || [];
}

// ============================================================================
// Job Categories API Functions
// ============================================================================

import type { JobCategory, CandidatePreview } from '@/types/job';
import { MOCK_JOB_CATEGORIES, MOCK_CANDIDATE_PREVIEWS } from '@/types/job';

/**
 * Fetch job categories with job counts
 * GET /v1/jobs/categories
 * Falls back to mock data if endpoint doesn't exist
 */
export async function fetchJobCategories(): Promise<JobCategory[]> {
    try {
        const response = await apiClient.get<ApiResponse<{ categories: JobCategory[] }>>('/jobs/categories');
        return response.data.data.categories || [];
    } catch {
        // Fallback to mock data if endpoint doesn't exist
        console.warn('Job categories endpoint not available, using mock data');
        return MOCK_JOB_CATEGORIES;
    }
}

/**
 * Fetch anonymous candidate previews for employer discovery
 * GET /v1/candidates/preview
 * Falls back to mock data if endpoint doesn't exist
 * 
 * NOTE: This endpoint MUST NOT return any personally identifying information.
 */
export async function fetchCandidatePreviews(): Promise<CandidatePreview[]> {
    try {
        const response = await apiClient.get<ApiResponse<{ candidates: CandidatePreview[] }>>('/candidates/preview');
        return response.data.data.candidates || [];
    } catch {
        // Fallback to mock data if endpoint doesn't exist
        console.warn('Candidate preview endpoint not available, using mock data');
        return MOCK_CANDIDATE_PREVIEWS;
    }
}

/**
 * Fetch active jobs for discovery page
 * GET /v1/jobs?status=active&limit=12
 */
export async function fetchActiveJobs(limit = 12): Promise<JobListResponse> {
    const response = await apiClient.get<ApiResponse<JobListResponse>>('/jobs', {
        params: { page: 1, page_size: limit, status: 'active' }
    });
    return response.data.data;
}

