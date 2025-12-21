/**
 * Admin Hooks Index
 * 
 * Re-exports all admin hooks for convenient importing.
 */

// Stats
export { useAdminStats, adminStatsKeys } from './useAdminStats';

// Users
export {
    useAdminUsers,
    useAdminUser,
    useDisableUser,
    useCreateUser,
    useUpdateUser,
    useDeleteUserMutation as useDeleteUser,
    adminUsersKeys
} from './useAdminUsers';

// Companies
export {
    useAdminCompanies,
    useVerifyCompany,
    adminCompaniesKeys
} from './useAdminCompanies';

// Jobs
export {
    useAdminJobs,
    useHideJob,
    useFlagJob,
    adminJobsKeys
} from './useAdminJobs';

// Verifications
export {
    useAdminVerifications,
    useAdminVerificationDetail,
    useApproveVerification,
    useRejectVerification,
    adminVerificationsKeys
} from './useAdminVerifications';
