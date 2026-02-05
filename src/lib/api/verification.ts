import { adminApiClient } from '../adminApi';

// Verification status type
export type VerificationStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

// Summary interface for list view
export interface AccountVerification {
    id: number;
    user_id: string;
    user_email?: string;
    role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
    status: VerificationStatus;
    submitted_at: string;
    verified_at?: string;
    verified_by?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    // Profile fields (may be included in list response)
    first_name?: string;
    last_name?: string;
    profile_picture_url?: string;
    occupation?: string;
    user_profile?: {
        name: string;
        company_name?: string;
    };
}

// Full detail interface for detail view
export interface AccountVerificationDetail extends AccountVerification {
    phone?: string;
    website_url?: string;
    intro?: string;
    japan_experience_duration?: number; // In months
    japanese_certificate_url?: string;
    cv_url?: string;
    japanese_level?: string; // N5, N4, N3, N2, N1

    // HR Candidate Data: Identity & Demographics
    birth_date?: string;
    gender?: string; // MALE, FEMALE
    domicile_city?: string;
    marital_status?: string; // SINGLE, MARRIED, DIVORCED
    children_count?: number;

    // HR Candidate Data: Physical Attributes (from migration 000022)
    height_cm?: number;
    weight_kg?: number;
    religion?: string;

    // HR Candidate Data: Core Competencies
    main_job_fields?: string[];
    golden_skill?: string;
    japanese_speaking_level?: string; // NATIVE, FLUENT, BASIC, PASSIVE

    // HR Candidate Data: JLPT Certificate (from migration 000022)
    jlpt_certificate_issue_year?: number;

    // Interview Willingness (from migration 000022)
    willing_to_interview_onsite?: boolean;

    // HR Candidate Data: Expectations & Availability
    expected_salary?: number; // Netto/THP in raw number
    japan_return_date?: string;
    available_start_date?: string;
    preferred_locations?: string[];
    preferred_industries?: string[];

    // HR Candidate Data: Supporting Documents
    supporting_certificates_url?: string[];
}

// Japan work experience record (legacy)
export interface JapanWorkExperience {
    id: number;
    account_verification_id: number;
    company_name: string;
    job_title: string;
    start_date: string;
    end_date?: string; // Nullable if currently working
    description?: string;
    created_at: string;
    updated_at: string;
}

// Candidate Profile (education, career goals)
export interface CandidateProfile {
    id: number;
    user_id: string;
    title?: string;
    bio?: string;
    highest_education?: string;
    major_field?: string;
    desired_job_position?: string;
    desired_job_position_other?: string;
    preferred_work_environment?: string;
    career_goals_3y?: string;
    main_concerns_returning?: string[];
    special_message?: string;
    skills_other?: string;
    resume_url?: string;
}

// Candidate Details (soft skills, achievements)
export interface CandidateDetail {
    user_id: string;
    soft_skills_description?: string;
    applied_work_values?: string;
    major_achievements?: string;
}

// Unified Work Experience (all countries)
export interface WorkExperience {
    id: number;
    user_id: string;
    country_code: string;
    experience_type: 'LOCAL' | 'OVERSEAS';
    company_name: string;
    job_title: string;
    start_date: string;
    end_date?: string;
    description?: string;
}

// Master Skill
export interface Skill {
    id: number;
    name: string;
    category: string;
}

// Candidate Certificate (English certifications)
export interface CandidateCertificate {
    id: number;
    user_id: string;
    certificate_type: 'TOEFL' | 'IELTS' | 'TOEIC' | 'OTHER';
    certificate_name?: string;
    score_total?: number;
    score_details?: Record<string, number>;
    issued_date?: string;
    expires_date?: string;
    document_file_path: string;
}

// LPK Selection
export interface LPKSelection {
    lpk_id?: number;
    other_name?: string;
    none: boolean;
}

// Onboarding Data
export interface OnboardingData {
    interests?: string[];
    lpk_selection?: LPKSelection;
    lpk_name?: string;
    company_preferences?: string[];
    willing_to_interview_onsite?: boolean;
    completed_at?: string;
}

// Comprehensive response from detail endpoint
export interface VerificationDetailResponse {
    verification: AccountVerificationDetail;
    experiences: JapanWorkExperience[];
    candidate_profile?: CandidateProfile;
    candidate_details?: CandidateDetail;
    work_experiences?: WorkExperience[];
    skills?: Skill[];
    certificates?: CandidateCertificate[];
    onboarding_data?: OnboardingData;
}

export interface VerificationFilter {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const verificationService = {
    // Get all verifications (Admin)
    getAll: async (filter?: VerificationFilter) => {
        const params = new URLSearchParams();
        if (filter?.page) params.append('page', filter.page.toString());
        if (filter?.limit) params.append('limit', filter.limit.toString());
        if (filter?.role) params.append('role', filter.role);
        if (filter?.status) params.append('status', filter.status);

        const response = await adminApiClient.get<PaginatedResult<AccountVerification>>(`/verifications?${params.toString()}`);
        return response.data;
    },

    // Get verification detail by ID (Admin)
    getDetail: async (id: number) => {
        const response = await adminApiClient.get<VerificationDetailResponse>(`/verifications/${id}`);
        return response.data;
    },

    // Verify a user (Admin)
    verify: async (id: number, action: 'APPROVE' | 'REJECT', notes?: string) => {
        const response = await adminApiClient.post(`/verifications/${id}/verify`, { action, notes: notes || '' });
        return response.data;
    },

    // Get current user status
    getMyStatus: async () => {
        const response = await adminApiClient.get<AccountVerification>('/verifications/me');
        return response.data;
    }
};
