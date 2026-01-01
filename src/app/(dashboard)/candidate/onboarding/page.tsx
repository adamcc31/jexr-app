'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import WizardProgress from '@/components/onboarding/WizardProgress';
import WizardNavigation from '@/components/onboarding/WizardNavigation';
import Step1Interests from '@/components/onboarding/steps/Step1Interests';
import Step2LPK from '@/components/onboarding/steps/Step2LPK';
import Step3CompanyType from '@/components/onboarding/steps/Step3CompanyType';
import { submitOnboarding } from '@/lib/candidate-api';
import {
    type InterestKey,
    type CompanyPreferenceKey,
    type LPK,
    type LPKSelectionType,
    type OnboardingSubmitData,
    initialWizardState,
} from '@/types/onboarding';

const TOTAL_STEPS = 3;

/**
 * Onboarding Wizard Page
 * Multi-step wizard for first-time candidate onboarding
 */
export default function OnboardingPage() {
    const router = useRouter();

    // Wizard State
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [interests, setInterests] = useState<InterestKey[]>(initialWizardState.interests);
    const [lpkSelectionType, setLpkSelectionType] = useState<LPKSelectionType>(initialWizardState.lpkSelectionType);
    const [selectedLPK, setSelectedLPK] = useState<LPK | null>(initialWizardState.selectedLPK);
    const [lpkOtherName, setLpkOtherName] = useState(initialWizardState.lpkOtherName);
    const [companyPreferences, setCompanyPreferences] = useState<CompanyPreferenceKey[]>(initialWizardState.companyPreferences);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validation
    const canProceed = useCallback(() => {
        switch (currentStep) {
            case 1:
                return interests.length > 0;
            case 2:
                if (lpkSelectionType === 'list') return selectedLPK !== null;
                if (lpkSelectionType === 'other') return lpkOtherName.trim().length > 0;
                if (lpkSelectionType === 'none') return true;
                return false;
            case 3:
                return companyPreferences.length > 0;
            default:
                return false;
        }
    }, [currentStep, interests, lpkSelectionType, selectedLPK, lpkOtherName, companyPreferences]);

    // Navigation Handlers
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
            setError(null);
        }
    };

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS && canProceed()) {
            setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
            setError(null);
        }
    };

    const handleFinish = async () => {
        if (!canProceed()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Build submission data
            const data: OnboardingSubmitData = {
                interests,
                lpk_selection: {
                    lpk_id: lpkSelectionType === 'list' ? selectedLPK?.id ?? null : null,
                    other_name: lpkSelectionType === 'other' ? lpkOtherName.trim() : null,
                    none: lpkSelectionType === 'none',
                },
                company_preferences: companyPreferences,
            };

            await submitOnboarding(data);

            // Redirect to dashboard on success
            router.push('/candidate');
            router.refresh();
        } catch (err) {
            console.error('Onboarding submission failed:', err);
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render current step
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1Interests
                        selectedInterests={interests}
                        onChange={setInterests}
                    />
                );
            case 2:
                return (
                    <Step2LPK
                        selectionType={lpkSelectionType}
                        selectedLPK={selectedLPK}
                        otherName={lpkOtherName}
                        onSelectionTypeChange={setLpkSelectionType}
                        onLPKChange={setSelectedLPK}
                        onOtherNameChange={setLpkOtherName}
                    />
                );
            case 3:
                return (
                    <Step3CompanyType
                        selectedPreferences={companyPreferences}
                        onChange={setCompanyPreferences}
                    />
                );
        }
    };

    return (
        <main className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900">
            {/* Left Panel - Decorative Image */}
            <div className="w-full lg:w-5/12 xl:w-1/2 relative h-64 lg:h-auto overflow-hidden group">
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 z-10 transition-colors" />
                <img
                    alt="Professional team collaborating in modern office"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/60 to-transparent text-white hidden lg:block">
                    <h3 className="font-semibold text-xl mb-2">Selamat Datang di J-Expert</h3>
                    <p className="text-white/90">
                        Bantu kami mengenal Anda lebih baik untuk memberikan rekomendasi pekerjaan yang tepat.
                    </p>
                </div>
            </div>

            {/* Right Panel - Wizard Content */}
            <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
                <div className="max-w-xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Profil Awal
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Lengkapi profil Anda untuk mendapatkan rekomendasi pekerjaan yang lebih baik.
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <WizardProgress
                        currentStep={currentStep}
                        totalSteps={TOTAL_STEPS}
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="ml-3 text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Step Content */}
                    <div className="min-h-[300px]">
                        {renderStep()}
                    </div>

                    {/* Navigation */}
                    <WizardNavigation
                        currentStep={currentStep}
                        totalSteps={TOTAL_STEPS}
                        canProceed={canProceed()}
                        isSubmitting={isSubmitting}
                        onBack={handleBack}
                        onNext={handleNext}
                        onFinish={handleFinish}
                    />
                </div>
            </div>
        </main>
    );
}
