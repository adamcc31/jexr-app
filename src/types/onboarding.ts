/**
 * Onboarding Types
 * TypeScript definitions for the onboarding wizard module
 */

// ============================================================================
// LPK (Lembaga Pelatihan Kerja)
// ============================================================================

export interface LPK {
    id: number;
    name: string;
    created_at: string;
}

// ============================================================================
// Step 1: Interests
// ============================================================================

export type InterestKey = 'teacher' | 'translator' | 'admin' | 'none';

export interface InterestOption {
    key: InterestKey;
    label: string;
    description?: string;
}

export const INTEREST_OPTIONS: InterestOption[] = [
    { key: 'teacher', label: 'Guru / Sensei' },
    { key: 'translator', label: 'Penerjemah / Interpreter' },
    { key: 'admin', label: 'Administrasi Pemberkasan Bahasa Jepang' },
    { key: 'none', label: 'Tidak tertarik pada 3 posisi tersebut' },
];

// ============================================================================
// Step 2: LPK Selection
// ============================================================================

export interface LPKSelection {
    lpk_id?: number | null;
    other_name?: string | null;
    none: boolean;
}

export type LPKSelectionType = 'list' | 'other' | 'none';

// ============================================================================
// Step 3: Company Preferences
// ============================================================================

export type CompanyPreferenceKey = 'pma' | 'joint_venture' | 'local';

export interface CompanyPreferenceOption {
    key: CompanyPreferenceKey;
    label: string;
    description: string;
}

export const COMPANY_PREFERENCE_OPTIONS: CompanyPreferenceOption[] = [
    {
        key: 'pma',
        label: 'Perusahaan 100% kepemilikan asal Jepang (PMA)',
        description: 'Perusahaan yang sepenuhnya dimiliki oleh investor Jepang',
    },
    {
        key: 'joint_venture',
        label: 'Perusahaan gabungan Jepang–Indonesia (Joint Venture)',
        description: 'Perusahaan kerjasama antara pihak Jepang dan Indonesia',
    },
    {
        key: 'local',
        label: 'Perusahaan 100% kepemilikan Indonesia (Lokal)',
        description: 'Perusahaan yang sepenuhnya dimiliki oleh investor Indonesia',
    },
];

// ============================================================================
// Onboarding Status & Submission
// ============================================================================

export interface OnboardingStatus {
    completed: boolean;
    completed_at?: string | null;
}

export interface OnboardingSubmitData {
    interests: InterestKey[];
    lpk_selection: LPKSelection;
    company_preferences: CompanyPreferenceKey[];
}

// ============================================================================
// Wizard State
// ============================================================================

export interface OnboardingWizardState {
    currentStep: 1 | 2 | 3;
    // Step 1 data
    interests: InterestKey[];
    // Step 2 data
    lpkSelectionType: LPKSelectionType;
    selectedLPK: LPK | null;
    lpkOtherName: string;
    // Step 3 data
    companyPreferences: CompanyPreferenceKey[];
    // UI state
    isSubmitting: boolean;
    error: string | null;
}

export const initialWizardState: OnboardingWizardState = {
    currentStep: 1,
    interests: [],
    lpkSelectionType: 'list',
    selectedLPK: null,
    lpkOtherName: '',
    companyPreferences: [],
    isSubmitting: false,
    error: null,
};
