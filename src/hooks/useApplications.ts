/**
 * Application Hooks
 *
 * TanStack Query hooks for application operations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applyToJob, fetchMyApplications, uploadFile } from '@/lib/candidate-api';
import { fetchJobApplications, fetchApplicationDetail, updateApplicationStatus } from '@/lib/employer-api';
import type { ApplyToJobInput, UpdateApplicationStatusInput } from '@/types/application';

// ============================================================================
// Query Keys
// ============================================================================

export const applicationKeys = {
    all: ['applications'] as const,
    myApplications: () => [...applicationKeys.all, 'my'] as const,
    jobApplications: (jobId: number) => [...applicationKeys.all, 'job', jobId] as const,
    detail: (id: number) => [...applicationKeys.all, 'detail', id] as const,
};

// ============================================================================
// Candidate Hooks
// ============================================================================

/**
 * Hook to fetch the current candidate's applications
 */
export function useMyApplications() {
    return useQuery({
        queryKey: applicationKeys.myApplications(),
        queryFn: fetchMyApplications,
    });
}

/**
 * Hook to apply to a job
 */
export function useApplyToJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ jobId, input }: { jobId: number; input: ApplyToJobInput }) =>
            applyToJob(jobId, input),
        onSuccess: () => {
            // Invalidate my applications list
            queryClient.invalidateQueries({ queryKey: applicationKeys.myApplications() });
        },
    });
}

/**
 * Hook to upload a file
 */
export function useUploadFile() {
    return useMutation({
        mutationFn: ({ file, bucket }: { file: File; bucket?: 'CV' | 'JLPT' | 'Profile_Picture' }) =>
            uploadFile(file, bucket),
    });
}

// ============================================================================
// Employer Hooks
// ============================================================================

/**
 * Hook to fetch applications for a specific job
 */
export function useJobApplications(jobId: number) {
    return useQuery({
        queryKey: applicationKeys.jobApplications(jobId),
        queryFn: () => fetchJobApplications(jobId),
        enabled: jobId > 0,
    });
}

/**
 * Hook to fetch a single application detail
 */
export function useApplicationDetail(id: number) {
    return useQuery({
        queryKey: applicationKeys.detail(id),
        queryFn: () => fetchApplicationDetail(id),
        enabled: id > 0,
    });
}

/**
 * Hook to update application status
 */
export function useUpdateApplicationStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: number; input: UpdateApplicationStatusInput }) =>
            updateApplicationStatus(id, input),
        onSuccess: (_, variables) => {
            // Invalidate the detail query
            queryClient.invalidateQueries({ queryKey: applicationKeys.detail(variables.id) });
            // Also invalidate all job applications (we don't know which job this belongs to)
            queryClient.invalidateQueries({ queryKey: applicationKeys.all });
        },
    });
}
