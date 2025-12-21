import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchJobs,
    fetchEmployerJobs,
    fetchJobById,
    createJob,
    updateJob,
    closeJob,
    deleteJob
} from '@/lib/employer-api';
import type { Job, JobWithCompany, CreateJobInput, UpdateJobInput, JobListResponse } from '@/types/employer';

// Query Keys - centralized for consistency
export const jobQueryKeys = {
    all: ['jobs'] as const,
    list: (page: number, pageSize: number) => ['jobs', 'list', page, pageSize] as const,
    employerList: (page: number, pageSize: number) => ['jobs', 'employer', page, pageSize] as const,
    detail: (id: number) => ['jobs', 'detail', id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch paginated jobs list (public - all jobs)
 * Returns jobs with loading, error, and pagination metadata
 */
export function useJobs(page = 1, pageSize = 10) {
    return useQuery<JobListResponse, Error>({
        queryKey: jobQueryKeys.list(page, pageSize),
        queryFn: () => fetchJobs(page, pageSize),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Fetch paginated jobs list (employer's own jobs only)
 * Use this in the employer dashboard
 */
export function useEmployerJobs(page = 1, pageSize = 10) {
    return useQuery<JobListResponse, Error>({
        queryKey: jobQueryKeys.employerList(page, pageSize),
        queryFn: () => fetchEmployerJobs(page, pageSize),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Fetch single job by ID (with company data)
 * Returns job with company profile information
 */
export function useJob(id: number) {
    return useQuery<JobWithCompany, Error>({
        queryKey: jobQueryKeys.detail(id),
        queryFn: () => fetchJobById(id),
        enabled: id > 0,
        staleTime: 1000 * 60 * 5,
    });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new job
 * Invalidates job list cache on success
 */
export function useCreateJob() {
    const queryClient = useQueryClient();

    return useMutation<Job, Error, CreateJobInput>({
        mutationFn: createJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: jobQueryKeys.all });
        },
    });
}

/**
 * Update an existing job
 * Invalidates both list and detail cache on success
 */
export function useUpdateJob() {
    const queryClient = useQueryClient();

    return useMutation<Job, Error, { id: number; input: UpdateJobInput }>({
        mutationFn: ({ id, input }) => updateJob(id, input),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: jobQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: jobQueryKeys.detail(id) });
        },
    });
}

/**
 * Close a job (change status to closed)
 * Invalidates job cache on success
 */
export function useCloseJob() {
    const queryClient = useQueryClient();

    return useMutation<Job, Error, number>({
        mutationFn: closeJob,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: jobQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: jobQueryKeys.detail(id) });
        },
    });
}

/**
 * Delete a job permanently
 * Invalidates job cache on success
 */
export function useDeleteJob() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: deleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: jobQueryKeys.all });
        },
    });
}
