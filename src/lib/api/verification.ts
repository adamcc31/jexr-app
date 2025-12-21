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
    domicile_city?: string;
    marital_status?: string; // SINGLE, MARRIED, DIVORCED
    children_count?: number;

    // HR Candidate Data: Core Competencies
    main_job_fields?: string[];
    golden_skill?: string;
    japanese_speaking_level?: string; // NATIVE, FLUENT, BASIC, PASSIVE

    // HR Candidate Data: Expectations & Availability
    expected_salary?: number; // Netto/THP in raw number
    japan_return_date?: string;
    available_start_date?: string;
    preferred_locations?: string[];
    preferred_industries?: string[];

    // HR Candidate Data: Supporting Documents
    supporting_certificates_url?: string[];
}

// Japan work experience record
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

// Response from detail endpoint
export interface VerificationDetailResponse {
    verification: AccountVerificationDetail;
    experiences: JapanWorkExperience[];
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
