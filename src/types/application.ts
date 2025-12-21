/**
 * Application Types
 *
 * TypeScript interfaces for job application data.
 * These types align with the backend domain/application.go
 */

// ============================================================================
// Application Status
// ============================================================================

/**
 * Possible statuses for an application.
 * Flow: applied → reviewed → accepted / rejected
 */
export type ApplicationStatus = 'applied' | 'reviewed' | 'accepted' | 'rejected';

// ============================================================================
// Application Types
// ============================================================================

/**
 * Application entity matching backend domain.Application struct
 */
export interface Application {
    id: number;
    job_id: number;
    candidate_user_id: string;
    account_verification_id?: number;
    cv_url: string;
    cover_letter?: string;
    status: ApplicationStatus;
    created_at: string;
    updated_at: string;
    // Joined data from list queries
    candidate_name?: string;
    candidate_photo?: string;
    verification_status?: string;
    job_title?: string;
}

/**
 * Payload for applying to a job
 */
export interface ApplyToJobInput {
    cv_url: string;
    cover_letter?: string;
}

/**
 * Payload for updating application status
 */
export interface UpdateApplicationStatusInput {
    status: 'reviewed' | 'accepted' | 'rejected';
}

// ============================================================================
// Application Detail Response
// ============================================================================

/**
 * Japan Work Experience (matches candidate types)
 */
export interface JapanWorkExperience {
    id?: number;
    company_name: string;
    job_title: string;
    start_date: string;
    end_date?: string | null;
    description?: string;
}

/**
 * Candidate Verification for application detail
 */
export interface CandidateVerificationDetail {
    id: number;
    user_id: string;
    status: string;
    first_name?: string;
    last_name?: string;
    profile_picture_url?: string;
    occupation?: string;
    phone?: string;
    website_url?: string;
    intro?: string;
    japan_experience_duration?: number;
    japanese_certificate_url?: string;
    cv_url?: string;
    japanese_level?: string;
    // HR Candidate Data - Identity & Demographics
    birth_date?: string;
    domicile_city?: string;
    marital_status?: string;
    children_count?: number;
    // HR Candidate Data - Core Competencies
    main_job_fields?: string[];
    golden_skill?: string;
    japanese_speaking_level?: string;
    // HR Candidate Data - Expectations & Availability
    expected_salary?: number;
    japan_return_date?: string;
    available_start_date?: string;
    preferred_locations?: string[];
    preferred_industries?: string[];
    // HR Candidate Data - Documents
    supporting_certificates_url?: string;
}

/**
 * Full application detail response from API
 */
export interface ApplicationDetailResponse {
    application: Application;
    verification?: CandidateVerificationDetail;
    experiences?: JapanWorkExperience[];
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get status badge variant based on application status
 */
export function getStatusVariant(status: ApplicationStatus): 'primary' | 'warning' | 'success' | 'danger' {
    switch (status) {
        case 'applied':
            return 'primary';
        case 'reviewed':
            return 'warning';
        case 'accepted':
            return 'success';
        case 'rejected':
            return 'danger';
        default:
            return 'primary';
    }
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: ApplicationStatus): string {
    switch (status) {
        case 'applied':
            return 'Applied';
        case 'reviewed':
            return 'Under Review';
        case 'accepted':
            return 'Accepted';
        case 'rejected':
            return 'Rejected';
        default:
            return status;
    }
}

/**
 * Format application date
 */
export function formatApplicationDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
