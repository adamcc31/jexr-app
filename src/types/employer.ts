/**
 * Employer API Types
 * 
 * TypeScript interfaces strictly matching Go backend domain models.
 * These types align EXACTLY with go-recruitment-backend/internal/domain/job.go
 */

// ============================================================================
// Job Types - Match domain/job.go exactly
// ============================================================================

/**
 * Job entity matching backend domain.Job struct
 * Fields match exactly: id, company_id, title, description, salary_min, 
 * salary_max, location, company_status, created_at, updated_at
 */
export interface Job {
    id: number;
    company_id: number;
    title: string;
    description: string;
    salary_min: number;
    salary_max: number;
    location: string;
    company_status: 'active' | 'closed';
    employment_type: string | null;
    job_type: string | null;
    experience_level: string | null;
    qualifications: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Job with company profile data - matches backend domain.JobWithCompany struct
 * Extends Job with company profile information for display to candidates
 */
export interface JobWithCompany extends Job {
    company_name: string;
    company_logo_url: string | null;
    company_website: string | null;
    industry: string | null;
}

/**
 * Payload for creating a new job
 * Matches CreateJobRequest in job_handler.go
 */
export interface CreateJobInput {
    title: string;
    description: string;
    salary_min: number;
    salary_max: number;
    location: string;
    employment_type?: string;
    job_type?: string;
    experience_level?: string;
    qualifications?: string;
}

/**
 * Payload for updating an existing job
 * Same fields as CreateJobInput
 */
export interface UpdateJobInput {
    title: string;
    description: string;
    salary_min: number;
    salary_max: number;
    location: string;
    employment_type?: string;
    job_type?: string;
    experience_level?: string;
    qualifications?: string;
}

// ============================================================================
// API Response Types - Match response/response.go
// ============================================================================

/**
 * Standard API response wrapper matching backend response.Success format
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Paginated list response for jobs endpoint
 * Now includes company profile data with each job
 */
export interface JobListResponse {
    jobs: JobWithCompany[];
    total: number;
    page: number;
    page_size: number;
}

// ============================================================================
// Employer Stats - Computed from jobs data (no backend endpoint)
// ============================================================================

/**
 * Employer dashboard statistics
 * Computed from job list, not a separate endpoint
 */
export interface EmployerStats {
    totalJobs: number;
    activeJobs: number;
    closedJobs: number;
}

/**
 * Compute stats from jobs array
 */
export function computeEmployerStats(jobs: Job[]): EmployerStats {
    return {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.company_status === 'active').length,
        closedJobs: jobs.filter(j => j.company_status === 'closed').length,
    };
}

// ============================================================================
// Company Profile Types - Match domain/company_profile.go
// ============================================================================

/**
 * Company profile entity for employer dashboard
 */
export interface CompanyProfile {
    id: number;
    user_id: string;
    company_name: string;
    logo_url: string | null;
    location: string | null;
    company_story: string | null;
    founded: string | null;
    founder: string | null;
    headquarters: string | null;
    employee_count: string | null;
    website: string | null;
    industry: string | null;
    description: string | null;
    hide_company_details: boolean;
    gallery_image_1: string | null;
    gallery_image_2: string | null;
    gallery_image_3: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Public company profile with conditional fields based on visibility
 */
export interface PublicCompanyProfile {
    id: number;
    company_name: string;
    logo_url: string | null;
    location: string | null;
    company_story: string | null;
    gallery_image_1: string | null;
    gallery_image_2: string | null;
    gallery_image_3: string | null;
    // Conditional fields - only present if viewer is verified or hide_company_details is false
    founded?: string | null;
    founder?: string | null;
    headquarters?: string | null;
    employee_count?: string | null;
    website?: string | null;
    // Flag indicating if details are hidden from this viewer
    details_hidden: boolean;
}

/**
 * Payload for creating/updating company profile
 */
export interface CompanyProfileInput {
    company_name: string;
    logo_url?: string | null;
    location?: string | null;
    company_story?: string | null;
    founded?: string | null;
    founder?: string | null;
    headquarters?: string | null;
    employee_count?: string | null;
    website?: string | null;
    industry?: string | null;
    description?: string | null;
    hide_company_details: boolean;
    gallery_image_1?: string | null;
    gallery_image_2?: string | null;
    gallery_image_3?: string | null;
}

