/**
 * Job Discovery Types
 *
 * TypeScript interfaces for job categories and candidate previews.
 * Used by the discovery page for both employers and candidates.
 */

// ============================================================================
// Job Category Types
// ============================================================================

/**
 * Job category derived from jobs table.
 * Used for category-based job exploration.
 */
export interface JobCategory {
    id: string;
    title: string;
    job_count: number;
}

/**
 * API response for job categories endpoint.
 */
export interface JobCategoriesResponse {
    categories: JobCategory[];
}

// ============================================================================
// Anonymous Candidate Preview Types
// ============================================================================

/**
 * Anonymous candidate preview for employer discovery.
 * 
 * IMPORTANT: This type intentionally excludes all personal identifying information.
 * - NO name, photo, contact, or company history
 * - Only aggregated/anonymized data for privacy protection
 */
export interface CandidatePreview {
    /** Japanese language level (e.g., "N1", "N2", "N3", "N4", "N5") */
    language_level: string;
    /** Skill tags (e.g., ["Welding", "Assembly", "CNC"]) */
    skills: string[];
    /** Experience range (e.g., "1–3 years", "3–5 years", "5+ years") */
    experience_range: string;
}

/**
 * API response for candidate preview endpoint.
 */
export interface CandidatePreviewResponse {
    candidates: CandidatePreview[];
}

// ============================================================================
// Mock Data (Fallback when backend endpoints are not available)
// ============================================================================

/**
 * Mock job categories for fallback when API is unavailable.
 * These should be replaced with real API data in production.
 */
export const MOCK_JOB_CATEGORIES: JobCategory[] = [
    { id: 'manufacturing', title: 'Manufacturing', job_count: 45 },
    { id: 'caregiving', title: 'Caregiving', job_count: 32 },
    { id: 'construction', title: 'Construction', job_count: 28 },
    { id: 'hospitality', title: 'Hospitality', job_count: 24 },
    { id: 'food-processing', title: 'Food Processing', job_count: 18 },
    { id: 'agriculture', title: 'Agriculture', job_count: 15 },
    { id: 'cleaning-services', title: 'Cleaning Services', job_count: 12 },
    { id: 'logistics', title: 'Logistics', job_count: 10 },
    { id: 'building-maintenance', title: 'Building Maintenance', job_count: 8 },
    { id: 'automotive', title: 'Automotive', job_count: 6 },
];

/**
 * Mock candidate previews for fallback when API is unavailable.
 * These represent anonymized candidate profiles.
 */
export const MOCK_CANDIDATE_PREVIEWS: CandidatePreview[] = [
    { language_level: 'N2', skills: ['Welding', 'Assembly'], experience_range: '3–5 years' },
    { language_level: 'N3', skills: ['Caregiving', 'First Aid'], experience_range: '1–3 years' },
    { language_level: 'N2', skills: ['CNC Operation', 'Quality Control'], experience_range: '5+ years' },
    { language_level: 'N4', skills: ['Food Processing', 'HACCP'], experience_range: '1–3 years' },
    { language_level: 'N3', skills: ['Construction', 'Scaffolding'], experience_range: '3–5 years' },
    { language_level: 'N2', skills: ['Hotel Service', 'Customer Care'], experience_range: '3–5 years' },
];
