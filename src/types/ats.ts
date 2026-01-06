/**
 * ATS (Applicant Tracking System) Types
 *
 * TypeScript interfaces for the ATS admin feature.
 * Used for filtering, listing, and exporting candidate data.
 */

// ============================================================================
// Filter Types
// ============================================================================

/**
 * ATS Filter parameters for searching candidates
 */
export interface ATSFilter {
    // Japanese Proficiency Group
    japanese_levels?: string[];
    japan_experience_min?: number;
    japan_experience_max?: number;
    has_lpk_training?: boolean;

    // Competency & Language Group
    english_cert_types?: string[];
    english_min_score?: number;
    technical_skill_ids?: number[];
    computer_skill_ids?: number[];

    // Logistics & Availability Group
    age_min?: number;
    age_max?: number;
    genders?: string[];
    domicile_cities?: string[];
    expected_salary_min?: number;
    expected_salary_max?: number;
    available_start_before?: string; // YYYY-MM-DD

    // Education & Experience Group
    education_levels?: string[];
    major_fields?: string[];
    total_experience_min?: number;
    total_experience_max?: number;

    // Pagination & Sorting
    page?: number;
    page_size?: number;
    sort_by?: 'verified_at' | 'japanese_level' | 'age' | 'expected_salary';
    sort_order?: 'asc' | 'desc';
}

// ============================================================================
// Candidate Types
// ============================================================================

/**
 * ATS Candidate result from search
 */
export interface ATSCandidate {
    user_id: string;
    verification_id: number;
    full_name: string;
    profile_picture_url?: string;

    // Demographics
    age?: number;
    gender?: 'MALE' | 'FEMALE';
    domicile_city?: string;
    marital_status?: 'SINGLE' | 'MARRIED' | 'DIVORCED';

    // Japanese Proficiency
    japanese_level?: string;
    japan_experience_months?: number;
    lpk_training_name?: string; // LPK name if has training, null otherwise

    // Competency
    english_cert_type?: string;
    english_score?: number;
    skills?: string[];

    // Education & Experience
    highest_education?: string;
    major_field?: string;
    total_experience_months?: number;
    last_position?: string;

    // Availability
    expected_salary?: number;
    available_start_date?: string;

    // Metadata
    verification_status: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
    verified_at?: string;
    submitted_at: string;
}

/**
 * Paginated response for ATS candidates
 */
export interface ATSCandidateResponse {
    data: ATSCandidate[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================================================
// Filter Options Types
// ============================================================================

/**
 * Skill option for filter dropdowns
 */
export interface SkillOption {
    id: number;
    name: string;
    category: string;
}

/**
 * Available filter options for the ATS UI
 */
export interface ATSFilterOptions {
    japanese_levels: string[];
    genders: string[];
    education_levels: string[];
    english_cert_types: string[];
    domicile_cities: string[];
    major_fields: string[];
    technical_skills: SkillOption[];
    computer_skills: SkillOption[];
}

// ============================================================================
// Export Types
// ============================================================================

/**
 * Export column definition
 */
export interface ExportColumn {
    key: string;
    label: string;
    defaultChecked: boolean;
    group: 'identity' | 'qualifications' | 'work' | 'optional';
}

/**
 * Available export columns
 */
export const EXPORT_COLUMNS: ExportColumn[] = [
    // Identity
    { key: 'full_name', label: 'Full Name', defaultChecked: true, group: 'identity' },
    { key: 'age', label: 'Age', defaultChecked: true, group: 'identity' },
    { key: 'gender', label: 'Gender', defaultChecked: false, group: 'identity' },
    { key: 'domicile_city', label: 'Domicile City', defaultChecked: false, group: 'identity' },
    { key: 'marital_status', label: 'Marital Status', defaultChecked: false, group: 'identity' },

    // Qualifications
    { key: 'japanese_level', label: 'JLPT Level', defaultChecked: true, group: 'qualifications' },
    { key: 'japan_experience_months', label: 'Japan Experience (Months)', defaultChecked: true, group: 'qualifications' },
    { key: 'lpk_training_name', label: 'LPK Training', defaultChecked: false, group: 'qualifications' },
    { key: 'english_cert_type', label: 'English Certification', defaultChecked: true, group: 'qualifications' },
    { key: 'english_score', label: 'English Score', defaultChecked: true, group: 'qualifications' },

    // Work
    { key: 'highest_education', label: 'Education', defaultChecked: false, group: 'work' },
    { key: 'major_field', label: 'Major Field', defaultChecked: false, group: 'work' },
    { key: 'total_experience_months', label: 'Total Experience (Months)', defaultChecked: true, group: 'work' },
    { key: 'last_position', label: 'Last Position', defaultChecked: true, group: 'work' },
    { key: 'expected_salary', label: 'Expected Salary (IDR)', defaultChecked: true, group: 'work' },
    { key: 'available_start_date', label: 'Available Start Date', defaultChecked: false, group: 'work' },

    // Optional
    { key: 'skills', label: 'Skills', defaultChecked: false, group: 'optional' },
    { key: 'verification_status', label: 'Verification Status', defaultChecked: false, group: 'optional' },
    { key: 'verified_at', label: 'Verified At', defaultChecked: false, group: 'optional' },
];

// ============================================================================
// Constants
// ============================================================================

export const JLPT_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5', 'NON_CERTIFIED'] as const;
export const GENDERS = ['MALE', 'FEMALE'] as const;
export const EDUCATION_LEVELS = ['HIGH_SCHOOL', 'DIPLOMA', 'BACHELOR', 'MASTER'] as const;
export const ENGLISH_CERT_TYPES = ['TOEFL', 'IELTS', 'TOEIC'] as const;

// Display labels for constants
export const JLPT_LABELS: Record<string, string> = {
    N1: 'JLPT N1',
    N2: 'JLPT N2',
    N3: 'JLPT N3',
    N4: 'JLPT N4',
    N5: 'JLPT N5',
    NON_CERTIFIED: 'Non-Certified',
};

export const GENDER_LABELS: Record<string, string> = {
    MALE: 'Male',
    FEMALE: 'Female',
};

export const EDUCATION_LABELS: Record<string, string> = {
    HIGH_SCHOOL: 'High School',
    DIPLOMA: 'Diploma',
    BACHELOR: 'Bachelor',
    MASTER: 'Master',
};
