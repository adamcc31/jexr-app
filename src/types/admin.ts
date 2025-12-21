/**
 * Admin API Types
 * 
 * TypeScript interfaces for all Admin Dashboard API responses.
 * These types align with the Go backend domain models.
 */

// ============================================================================
// Common Types
// ============================================================================

export type UserRole = 'admin' | 'employer' | 'candidate';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type JobModerationStatus = 'active' | 'hidden' | 'flagged';

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================================================
// Admin Dashboard Stats
// ============================================================================

export interface AdminStats {
    totalUsers: number;
    usersByRole: {
        admin: number;
        employer: number;
        candidate: number;
    };
    totalCompanies: number;
    companiesByStatus: {
        pending: number;
        verified: number;
        rejected: number;
    };
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    systemHealth: {
        status: 'healthy' | 'degraded' | 'down';
        lastChecked: string;
    };
}

// ============================================================================
// User Management
// ============================================================================

export interface AdminUser {
    id: string;
    email: string;
    role: UserRole;
    isDisabled: boolean;
    createdAt: string;
    updatedAt: string;
    // Optional extended info
    profile?: {
        fullName?: string;
        phone?: string;
        avatar?: string;
    };
}

export interface AdminUserFilters {
    role?: UserRole;
    isDisabled?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface DisableUserPayload {
    userId: string;
    disable: boolean;
}

export interface CreateUserPayload {
    email: string;
    role: UserRole;
}

export interface UpdateUserPayload {
    userId: string;
    email: string;
    role: UserRole;
}

// ============================================================================
// Company Verification
// ============================================================================

export interface AdminCompany {
    id: number;
    name: string;
    email: string;
    website?: string;
    description?: string;
    logo?: string;
    verificationStatus: VerificationStatus;
    employerId: string;
    employerEmail: string;
    createdAt: string;
    updatedAt: string;
    // Verification metadata
    verifiedAt?: string;
    verifiedBy?: string;
    rejectionReason?: string;
}

export interface AdminCompanyFilters {
    verificationStatus?: VerificationStatus;
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface VerifyCompanyPayload {
    companyId: number;
    action: 'approve' | 'reject';
    reason?: string;
}

// ============================================================================
// Job Moderation
// ============================================================================

export interface AdminJob {
    id: number;
    title: string;
    companyId: number;
    companyName: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    status: JobModerationStatus;
    isFlagged: boolean;
    flagReason?: string;
    createdAt: string;
    updatedAt: string;
    // Moderation metadata
    hiddenAt?: string;
    hiddenBy?: string;
    flaggedAt?: string;
    flaggedBy?: string;
}

export interface AdminJobFilters {
    status?: JobModerationStatus;
    isFlagged?: boolean;
    companyId?: number;
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface HideJobPayload {
    jobId: number;
    hide: boolean;
    reason?: string;
}

export interface FlagJobPayload {
    jobId: number;
    flag: boolean;
    reason?: string;
}

// ============================================================================
// System Settings (Read-only for now)
// ============================================================================

export interface SystemSettings {
    platformName: string;
    version: string;
    features: {
        [key: string]: boolean;
    };
    limits: {
        maxJobsPerEmployer: number;
        maxApplicationsPerCandidate: number;
        jobExpirationDays: number;
    };
}
