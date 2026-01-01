'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { submitOnboarding, searchLPK } from '@/lib/candidate-api';
import SearchableDropdown from '@/components/onboarding/SearchableDropdown';
import {
    type InterestKey,
    type CompanyPreferenceKey,
    type LPK,
    type LPKSelectionType,
    type OnboardingSubmitData,
} from '@/types/onboarding';

const TOTAL_STEPS = 3;

/**
 * Onboarding Wizard - Professional Split Layout
 * Left: Hero image with quote | Right: Form content
 */
export default function OnboardingPage() {
    const router = useRouter();

    // Wizard State
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [interests, setInterests] = useState<InterestKey[]>([]);
    const [lpkSelectionType, setLpkSelectionType] = useState<LPKSelectionType>('list');
    const [selectedLPK, setSelectedLPK] = useState<LPK | null>(null);
    const [lpkOtherName, setLpkOtherName] = useState('');
    const [companyPreferences, setCompanyPreferences] = useState<CompanyPreferenceKey[]>([]);
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

    // Navigation
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
            router.push('/candidate');
            router.refresh();
        } catch (err) {
            console.error('Onboarding submission failed:', err);
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Interest toggle (checkbox style multi-select)
    const handleInterestToggle = (key: InterestKey) => {
        if (key === 'none') {
            setInterests(interests.includes('none') ? [] : ['none']);
        } else {
            const withoutNone = interests.filter((i) => i !== 'none');
            if (interests.includes(key)) {
                setInterests(withoutNone.filter((i) => i !== key));
            } else {
                setInterests([...withoutNone, key]);
            }
        }
    };

    // Company preference toggle
    const handlePreferenceToggle = (key: CompanyPreferenceKey) => {
        if (companyPreferences.includes(key)) {
            setCompanyPreferences(companyPreferences.filter((p) => p !== key));
        } else {
            setCompanyPreferences([...companyPreferences, key]);
        }
    };

    // Step content configuration
    const stepConfig = {
        1: {
            title: 'Special Interest Survey',
            subtitle: 'Find your fit talent in J-Expert Recruitment. Help us match you with the perfect opportunities by indicating your interest in specific roles.',
            question: 'Are you interested in the following positions?',
        },
        2: {
            title: 'LPK Training Background',
            subtitle: 'Tell us about your Japanese language training background. This helps employers understand your educational journey.',
            question: 'Where did you learn Japanese before coming to Japan?',
        },
        3: {
            title: 'Company Type Preferences',
            subtitle: 'Help us understand your ideal workplace. Select the types of companies you would prefer to work for.',
            question: 'What type of company ownership do you prefer?',
        },
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100">
                <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Professional at work"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Quote Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/80 to-transparent">
                    <p className="text-white text-lg font-light leading-relaxed max-w-md">
                        &ldquo;Connecting Japanese businesses with exceptional Indonesian talent.&rdquo;
                    </p>
                </div>
            </div>

            {/* Right Panel - Form Content */}
            <div className="flex-1 lg:w-1/2 flex flex-col bg-white">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-8 py-12 lg:px-16 xl:px-24">
                    <div className="max-w-lg mx-auto">
                        {/* Step Indicator */}
                        <p className="text-blue-600 font-medium mb-8">
                            Step {currentStep} of {TOTAL_STEPS}
                        </p>

                        {/* Title & Subtitle */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            {stepConfig[currentStep].title}
                        </h1>
                        <p className="text-slate-500 leading-relaxed mb-10">
                            {stepConfig[currentStep].subtitle}
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Question */}
                        <h2 className="text-slate-900 font-semibold mb-6">
                            {stepConfig[currentStep].question}
                        </h2>

                        {/* Step 1: Interest Options */}
                        {currentStep === 1 && (
                            <div className="space-y-3">
                                {/* Interest checkboxes */}
                                <CheckboxOption
                                    checked={interests.includes('teacher')}
                                    disabled={interests.includes('none')}
                                    onChange={() => handleInterestToggle('teacher')}
                                    label="Teacher / Sensei"
                                />
                                <CheckboxOption
                                    checked={interests.includes('translator')}
                                    disabled={interests.includes('none')}
                                    onChange={() => handleInterestToggle('translator')}
                                    label="Translator / Interpreter"
                                />
                                <CheckboxOption
                                    checked={interests.includes('admin')}
                                    disabled={interests.includes('none')}
                                    onChange={() => handleInterestToggle('admin')}
                                    label="Japanese Language Administration & Documentation"
                                />

                                {/* OR Divider */}
                                <div className="flex items-center gap-4 py-4">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-slate-400 text-sm uppercase tracking-wide">or</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>

                                {/* None option */}
                                <CheckboxOption
                                    checked={interests.includes('none')}
                                    onChange={() => handleInterestToggle('none')}
                                    label="Not interested in any of the above positions"
                                />
                            </div>
                        )}

                        {/* Step 2: LPK Selection */}
                        {currentStep === 2 && (
                            <div className="space-y-3">
                                {/* Select from list */}
                                <RadioOption
                                    checked={lpkSelectionType === 'list'}
                                    onChange={() => setLpkSelectionType('list')}
                                    label="Select from registered LPK list"
                                />
                                {lpkSelectionType === 'list' && (
                                    <div className="ml-8 mt-3 mb-4">
                                        <SearchableDropdown
                                            value={selectedLPK}
                                            placeholder="Type LPK name to search..."
                                            onSearch={searchLPK}
                                            onChange={setSelectedLPK}
                                        />
                                    </div>
                                )}

                                {/* Other */}
                                <RadioOption
                                    checked={lpkSelectionType === 'other'}
                                    onChange={() => setLpkSelectionType('other')}
                                    label="Other (enter manually)"
                                />
                                {lpkSelectionType === 'other' && (
                                    <div className="ml-8 mt-3 mb-4">
                                        <input
                                            type="text"
                                            value={lpkOtherName}
                                            onChange={(e) => setLpkOtherName(e.target.value)}
                                            placeholder="Enter LPK name..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}

                                {/* OR Divider */}
                                <div className="flex items-center gap-4 py-4">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-slate-400 text-sm uppercase tracking-wide">or</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>

                                {/* None */}
                                <RadioOption
                                    checked={lpkSelectionType === 'none'}
                                    onChange={() => setLpkSelectionType('none')}
                                    label="I did not study at an LPK"
                                />
                            </div>
                        )}

                        {/* Step 3: Company Preferences */}
                        {currentStep === 3 && (
                            <div className="space-y-3">
                                <CheckboxOption
                                    checked={companyPreferences.includes('pma')}
                                    onChange={() => handlePreferenceToggle('pma')}
                                    label="100% Japanese-owned company (PMA)"
                                    sublabel="Companies fully owned by Japanese investors"
                                />
                                <CheckboxOption
                                    checked={companyPreferences.includes('joint_venture')}
                                    onChange={() => handlePreferenceToggle('joint_venture')}
                                    label="Japan-Indonesia Joint Venture"
                                    sublabel="Partnership between Japanese and Indonesian parties"
                                />
                                <CheckboxOption
                                    checked={companyPreferences.includes('local')}
                                    onChange={() => handlePreferenceToggle('local')}
                                    label="100% Indonesian-owned company (Local)"
                                    sublabel="Companies fully owned by Indonesian investors"
                                />

                                <p className="text-slate-400 text-sm mt-6">
                                    Select one or more options based on your preference
                                </p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-4 mt-10 pt-6 border-t border-slate-100">
                            {currentStep < TOTAL_STEPS ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!canProceed()}
                                        className={`
                                            px-6 py-3 rounded-lg font-medium transition-colors
                                            ${canProceed()
                                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        Continue
                                    </button>
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="px-6 py-3 rounded-lg font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleFinish}
                                        disabled={!canProceed() || isSubmitting}
                                        className={`
                                            px-6 py-3 rounded-lg font-medium transition-colors
                                            ${canProceed() && !isSubmitting
                                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Preferences'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-3 rounded-lg font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Back to top button (mobile) */}
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 w-12 h-12 bg-slate-900 text-white rounded-lg shadow-lg flex items-center justify-center lg:hidden"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

// ============================================================================
// Checkbox Option Component
// ============================================================================

interface CheckboxOptionProps {
    checked: boolean;
    disabled?: boolean;
    onChange: () => void;
    label: string;
    sublabel?: string;
}

function CheckboxOption({ checked, disabled, onChange, label, sublabel }: CheckboxOptionProps) {
    return (
        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            className={`
                w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-all
                ${checked
                    ? 'border-slate-900 bg-slate-50'
                    : disabled
                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }
            `}
        >
            {/* Checkbox */}
            <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                ${checked ? 'border-slate-900 bg-slate-900' : 'border-slate-300'}
            `}>
                {checked && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
            {/* Label */}
            <div>
                <span className={`font-medium ${checked ? 'text-slate-900' : 'text-slate-700'}`}>
                    {label}
                </span>
                {sublabel && (
                    <p className="text-slate-500 text-sm mt-1">{sublabel}</p>
                )}
            </div>
        </button>
    );
}

// ============================================================================
// Radio Option Component (for LPK selection)
// ============================================================================

interface RadioOptionProps {
    checked: boolean;
    onChange: () => void;
    label: string;
}

function RadioOption({ checked, onChange, label }: RadioOptionProps) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`
                w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all
                ${checked
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }
            `}
        >
            {/* Radio dot */}
            <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                ${checked ? 'border-slate-900' : 'border-slate-300'}
            `}>
                {checked && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
            </div>
            {/* Label */}
            <span className={`font-medium ${checked ? 'text-slate-900' : 'text-slate-700'}`}>
                {label}
            </span>
        </button>
    );
}
