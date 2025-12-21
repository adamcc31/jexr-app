/**
 * Candidate Profile Types
 *
 * TypeScript interfaces for candidate profile display.
 * These types align with the backend verification data structure.
 */

// ============================================================================
// Verification Status
// ============================================================================

/**
 * Possible verification statuses for a candidate profile.
 *
 * Display Rules:
 * - VERIFIED → Profile displays normally
 * - SUBMITTED → Profile displays with "Under Review" banner
 * - PENDING / empty data → "Profile not completed" message
 * - REJECTED → Profile displays with rejection notice
 */
export type VerificationStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

// ============================================================================
// Japan Work Experience
// ============================================================================

/**
 * Represents a single work experience entry in Japan.
 */
export interface JapanWorkExperience {
    id?: number;
    company_name: string;
    job_title: string;
    start_date: string;
    end_date?: string | null;
    description?: string;
}

// ============================================================================
// Account Verification (Candidate Profile)
// ============================================================================

/**
 * Candidate verification data from the backend.
 */
export interface CandidateVerification {
    id: number;
    user_id: string;
    status: VerificationStatus;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
    occupation: string;
    phone: string;
    website_url: string;
    intro: string;
    japan_experience_duration: number;
    japanese_certificate_url: string;
    cv_url?: string;
    japanese_level?: string;
    created_at?: string;
    updated_at?: string;
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

// ============================================================================
// Candidate Profile Response
// ============================================================================

/**
 * Complete candidate profile response from the API.
 * Contains verification data and work experiences.
 */
export interface CandidateProfileResponse {
    verification: CandidateVerification;
    experiences: JapanWorkExperience[];
    email?: string; // From user account
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format japan experience duration from months to human-readable format.
 * @example formatExperienceDuration(27) → "2 years 3 months"
 */
export function formatExperienceDuration(months: number): string {
    if (!months || months <= 0) return 'No experience';

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const parts: string[] = [];
    if (years > 0) {
        parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }
    if (remainingMonths > 0) {
        parts.push(`${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`);
    }

    return parts.join(' ');
}

/**
 * Format date to human-readable format (e.g., "Jan 2022").
 */
export function formatExperienceDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Present';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Format date range for work experience (e.g., "Jan 2022 – Mar 2024").
 */
export function formatDateRange(startDate: string, endDate?: string | null): string {
    const start = formatExperienceDate(startDate);
    const end = formatExperienceDate(endDate);
    return `${start} – ${end}`;
}
