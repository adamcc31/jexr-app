/**
 * Profile Completion Utilities
 * 
 * Categorized tracking of mandatory profile fields for candidates.
 * Used to show personalized completion guidance.
 */

import type { CandidateVerification, CandidateWithFullDetails } from '@/types/candidate';

// ============================================================================
// Field Categories (Mandatory Only)
// ============================================================================

interface MandatoryField {
    key: string;
    labelKey: string; // i18n key for label
    getValue: (v: CandidateVerification, prof?: CandidateWithFullDetails | null) => boolean;
}

// Identity & Verification fields (from settings page "Identity" tab)
const IDENTITY_FIELDS: MandatoryField[] = [
    { key: 'first_name', labelKey: 'completionModal.fields.firstName', getValue: (v) => !!v.first_name },
    { key: 'last_name', labelKey: 'completionModal.fields.lastName', getValue: (v) => !!v.last_name },
    { key: 'profile_picture_url', labelKey: 'completionModal.fields.profilePicture', getValue: (v) => !!v.profile_picture_url },
    { key: 'occupation', labelKey: 'completionModal.fields.occupation', getValue: (v) => !!v.occupation },
    { key: 'phone', labelKey: 'completionModal.fields.phone', getValue: (v) => !!v.phone },
    { key: 'intro', labelKey: 'completionModal.fields.intro', getValue: (v) => !!v.intro },
    { key: 'birth_date', labelKey: 'completionModal.fields.birthDate', getValue: (v) => !!v.birth_date },
    { key: 'domicile_city', labelKey: 'completionModal.fields.domicileCity', getValue: (v) => !!v.domicile_city },
    { key: 'marital_status', labelKey: 'completionModal.fields.maritalStatus', getValue: (v) => !!v.marital_status },
    { key: 'children_count', labelKey: 'completionModal.fields.childrenCount', getValue: (v) => v.children_count !== undefined && v.children_count !== null },
    { key: 'japan_experience_duration', labelKey: 'completionModal.fields.japanExperience', getValue: (v) => !!v.japan_experience_duration && v.japan_experience_duration > 0 },
    { key: 'japanese_level', labelKey: 'completionModal.fields.japaneseLevel', getValue: (v) => !!v.japanese_level },
    { key: 'japanese_certificate_url', labelKey: 'completionModal.fields.jlptCertificate', getValue: (v) => !!v.japanese_certificate_url },
    { key: 'japanese_speaking_level', labelKey: 'completionModal.fields.japaneseSpeaking', getValue: (v) => !!v.japanese_speaking_level },
    { key: 'cv_url', labelKey: 'completionModal.fields.cvDocument', getValue: (v) => !!v.cv_url },
    { key: 'main_job_fields', labelKey: 'completionModal.fields.mainJobFields', getValue: (v) => !!v.main_job_fields && v.main_job_fields.length > 0 },
    { key: 'golden_skill', labelKey: 'completionModal.fields.goldenSkill', getValue: (v) => !!v.golden_skill },
    { key: 'expected_salary', labelKey: 'completionModal.fields.expectedSalary', getValue: (v) => !!v.expected_salary && v.expected_salary > 0 },
    { key: 'japan_return_date', labelKey: 'completionModal.fields.japanReturnDate', getValue: (v) => !!v.japan_return_date },
    { key: 'available_start_date', labelKey: 'completionModal.fields.availableStartDate', getValue: (v) => !!v.available_start_date },
    { key: 'preferred_locations', labelKey: 'completionModal.fields.preferredLocations', getValue: (v) => !!v.preferred_locations && v.preferred_locations.length > 0 },
    { key: 'preferred_industries', labelKey: 'completionModal.fields.preferredIndustries', getValue: (v) => !!v.preferred_industries && v.preferred_industries.length > 0 },
];

// Professional CV fields (from settings page "Professional Profile (CV)" tab)
const PROFESSIONAL_FIELDS: MandatoryField[] = [
    { key: 'title', labelKey: 'completionModal.fields.professionalTitle', getValue: (_, prof) => !!prof?.profile?.title },
    { key: 'bio', labelKey: 'completionModal.fields.professionalBio', getValue: (_, prof) => !!prof?.profile?.bio },
    { key: 'highest_education', labelKey: 'completionModal.fields.educationLevel', getValue: (_, prof) => !!prof?.profile?.highest_education },
    { key: 'work_experiences', labelKey: 'completionModal.fields.workExperience', getValue: (_, prof) => (prof?.work_experiences?.length ?? 0) > 0 },
    { key: 'skills', labelKey: 'completionModal.fields.skills', getValue: (_, prof) => (prof?.skill_ids?.length ?? 0) > 0 },
];

// ============================================================================
// Calculation Functions
// ============================================================================

export interface DetailedCompletionResult {
    percentage: number;
    missingIdentity: string[];      // i18n keys for missing identity fields
    missingProfessional: string[];  // i18n keys for missing professional fields
    isComplete: boolean;
    totalFields: number;
    filledFields: number;
}

/**
 * Calculate detailed profile completion with categorized missing fields.
 * Only considers mandatory fields (optional fields are ignored).
 */
export function calculateDetailedCompletion(
    v: CandidateVerification | undefined,
    professionalProfile?: CandidateWithFullDetails | null
): DetailedCompletionResult {
    if (!v) {
        return {
            percentage: 0,
            missingIdentity: IDENTITY_FIELDS.map(f => f.labelKey),
            missingProfessional: PROFESSIONAL_FIELDS.map(f => f.labelKey),
            isComplete: false,
            totalFields: IDENTITY_FIELDS.length + PROFESSIONAL_FIELDS.length,
            filledFields: 0,
        };
    }

    // Check identity fields
    const missingIdentity: string[] = [];
    let identityFilled = 0;
    for (const field of IDENTITY_FIELDS) {
        if (field.getValue(v, professionalProfile)) {
            identityFilled++;
        } else {
            missingIdentity.push(field.labelKey);
        }
    }

    // Check professional fields
    const missingProfessional: string[] = [];
    let professionalFilled = 0;
    for (const field of PROFESSIONAL_FIELDS) {
        if (field.getValue(v, professionalProfile)) {
            professionalFilled++;
        } else {
            missingProfessional.push(field.labelKey);
        }
    }

    const totalFields = IDENTITY_FIELDS.length + PROFESSIONAL_FIELDS.length;
    const filledFields = identityFilled + professionalFilled;
    const percentage = Math.round((filledFields / totalFields) * 100);

    return {
        percentage,
        missingIdentity,
        missingProfessional,
        isComplete: missingIdentity.length === 0 && missingProfessional.length === 0,
        totalFields,
        filledFields,
    };
}

// Session storage key for popup dismissal
export const POPUP_DISMISSED_KEY = 'jexpert-profile-popup-dismissed';
