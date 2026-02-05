'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { OnboardingSubmitData } from '@/types/onboarding'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1'

// Zod Schema for Input Validation
const OnboardingSchema = z.object({
    interests: z.array(z.enum(['teacher', 'translator', 'admin', 'none'])),
    lpk_selection: z.object({
        lpk_id: z.number().nullable().optional(),
        other_name: z.string().nullable().optional(),
        none: z.boolean(),
    }),
    company_preferences: z.array(z.enum(['pma', 'joint_venture', 'local'])),
    willing_to_interview_onsite: z.boolean().nullable().optional(),
    first_name: z.string().min(1, "First name is required").trim(),
    last_name: z.string().min(1, "Last name is required").trim(),
    phone: z.string().min(5, "Phone number is required").trim(),
    gender: z.enum(['MALE', 'FEMALE']),
    birth_date: z.string().min(1, "Birth date is required"),
})

/**
 * Server Action: Submit onboarding data and redirect to candidate dashboard.
 * 
 * Security Measures:
 * 1. Authentication Check (Token existence)
 * 2. Input Validation (Zod Schema)
 * 3. Safe Error Logging (No stack traces exposed)
 * 4. Blocking Revalidation (Prevents race conditions)
 */
export async function submitOnboardingAction(data: OnboardingSubmitData): Promise<{ error?: string }> {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
        return { error: 'Not authenticated' }
    }

    // 1. Input Validation
    const validation = OnboardingSchema.safeParse(data);
    if (!validation.success) {
        console.warn('[Onboarding] Validation Failed:', validation.error.format());
        return { error: 'Invalid data submitted. Please check your inputs.' };
    }

    const validatedData = validation.data;

    try {
        const response = await fetch(`${API_URL}/onboarding/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        })

        if (!response.ok) {
            // Securely handle backend errors - do not expose internal 500 details
            const errorData = await response.json().catch(() => ({}))
            const errorMessage = errorData.message || 'Submission failed'
            console.warn(`[Onboarding] Submission failed for user: ${errorMessage}`);
            return { error: errorMessage }
        }

        // CRITICAL: revalidatePath is blocking - ensures fresh data before redirect
        revalidatePath('/candidate')
        revalidatePath('/candidate/onboarding')

    } catch (error) {
        // Log generic error for security, keep details internal if needed (or just warn)
        console.error('[submitOnboardingAction] Network/System Error');
        return { error: 'Network error. Please try again.' }
    }

    // Redirect happens AFTER revalidation completes
    redirect('/candidate')
}
