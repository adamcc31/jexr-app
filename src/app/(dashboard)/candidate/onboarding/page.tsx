'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { submitOnboarding } from '@/lib/candidate-api';
import {
    type InterestKey,
    type CompanyPreferenceKey,
    type LPK,
    type LPKSelectionType,
    type OnboardingSubmitData,
    INTEREST_OPTIONS,
    COMPANY_PREFERENCE_OPTIONS,
} from '@/types/onboarding';
import SearchableDropdown from '@/components/onboarding/SearchableDropdown';
import { searchLPK } from '@/lib/candidate-api';

const TOTAL_STEPS = 3;

/**
 * Immersive Onboarding Wizard
 * Full-screen, modern design with smooth transitions
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

    // Interest toggle handler
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

    // Company preference toggle handler
    const handlePreferenceToggle = (key: CompanyPreferenceKey) => {
        if (companyPreferences.includes(key)) {
            setCompanyPreferences(companyPreferences.filter((p) => p !== key));
        } else {
            setCompanyPreferences([...companyPreferences, key]);
        }
    };

    // Step info
    const stepInfo = [
        { title: 'Minat Karir', subtitle: 'Pilih posisi yang Anda minati' },
        { title: 'Riwayat LPK', subtitle: 'Tempat Anda belajar bahasa Jepang' },
        { title: 'Tipe Perusahaan', subtitle: 'Preferensi tempat kerja ideal' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="p-6 lg:p-8">
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <span className="text-white font-bold text-lg">J</span>
                            </div>
                            <span className="text-white font-semibold text-xl hidden sm:block">J-Expert</span>
                        </div>

                        {/* Step Indicator Pills */}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((step) => (
                                <div
                                    key={step}
                                    className={`
                                        transition-all duration-500 rounded-full
                                        ${step === currentStep
                                            ? 'w-10 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/50'
                                            : step < currentStep
                                                ? 'w-3 h-3 bg-blue-400'
                                                : 'w-3 h-3 bg-white/20'
                                        }
                                    `}
                                />
                            ))}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 flex items-center justify-center px-6 py-8">
                    <div className="w-full max-w-2xl">
                        {/* Step Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-300 text-sm mb-6">
                                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {currentStep}
                                </span>
                                Langkah {currentStep} dari {TOTAL_STEPS}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
                                {stepInfo[currentStep - 1].title}
                            </h1>
                            <p className="text-xl text-blue-200/80">
                                {stepInfo[currentStep - 1].subtitle}
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl text-red-200 text-center">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Interests */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                {INTEREST_OPTIONS.filter((o) => o.key !== 'none').map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => handleInterestToggle(option.key)}
                                        disabled={interests.includes('none')}
                                        className={`
                                            w-full p-5 rounded-2xl text-left transition-all duration-300 transform
                                            ${interests.includes(option.key)
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30 scale-[1.02]'
                                                : interests.includes('none')
                                                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                                                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-[1.01]'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-medium">{option.label}</span>
                                            {interests.includes(option.key) && (
                                                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}

                                {/* Divider */}
                                <div className="flex items-center gap-4 py-2">
                                    <div className="flex-1 h-px bg-white/20" />
                                    <span className="text-white/40 text-sm">atau</span>
                                    <div className="flex-1 h-px bg-white/20" />
                                </div>

                                {/* None Option */}
                                <button
                                    type="button"
                                    onClick={() => handleInterestToggle('none')}
                                    className={`
                                        w-full p-5 rounded-2xl text-left transition-all duration-300
                                        ${interests.includes('none')
                                            ? 'bg-slate-600 text-white ring-2 ring-slate-400'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <span className="text-lg">Tidak tertarik pada 3 posisi tersebut</span>
                                </button>
                            </div>
                        )}

                        {/* Step 2: LPK */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                {/* Option: Select from List */}
                                <div
                                    onClick={() => setLpkSelectionType('list')}
                                    className={`
                                        p-6 rounded-2xl cursor-pointer transition-all duration-300
                                        ${lpkSelectionType === 'list'
                                            ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 ring-2 ring-blue-400'
                                            : 'bg-white/10 hover:bg-white/15'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${lpkSelectionType === 'list' ? 'border-blue-400 bg-blue-400' : 'border-white/40'}`}>
                                            {lpkSelectionType === 'list' && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <span className="text-white font-medium text-lg">Pilih dari daftar LPK</span>
                                    </div>
                                    {lpkSelectionType === 'list' && (
                                        <div className="mt-4">
                                            <SearchableDropdown
                                                value={selectedLPK}
                                                placeholder="Ketik nama LPK untuk mencari..."
                                                onSearch={searchLPK}
                                                onChange={setSelectedLPK}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Option: Other */}
                                <div
                                    onClick={() => setLpkSelectionType('other')}
                                    className={`
                                        p-6 rounded-2xl cursor-pointer transition-all duration-300
                                        ${lpkSelectionType === 'other'
                                            ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 ring-2 ring-blue-400'
                                            : 'bg-white/10 hover:bg-white/15'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${lpkSelectionType === 'other' ? 'border-blue-400 bg-blue-400' : 'border-white/40'}`}>
                                            {lpkSelectionType === 'other' && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <span className="text-white font-medium text-lg">Lainnya (tulis manual)</span>
                                    </div>
                                    {lpkSelectionType === 'other' && (
                                        <input
                                            type="text"
                                            value={lpkOtherName}
                                            onChange={(e) => setLpkOtherName(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Masukkan nama LPK..."
                                            className="w-full mt-4 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    )}
                                </div>

                                {/* Option: None */}
                                <div
                                    onClick={() => setLpkSelectionType('none')}
                                    className={`
                                        p-6 rounded-2xl cursor-pointer transition-all duration-300
                                        ${lpkSelectionType === 'none'
                                            ? 'bg-slate-600/50 ring-2 ring-slate-400'
                                            : 'bg-white/5 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${lpkSelectionType === 'none' ? 'border-slate-400 bg-slate-400' : 'border-white/40'}`}>
                                            {lpkSelectionType === 'none' && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <span className="text-white/80 font-medium text-lg">Saya tidak belajar di LPK</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Company Preferences */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                {COMPANY_PREFERENCE_OPTIONS.map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => handlePreferenceToggle(option.key)}
                                        className={`
                                            w-full p-5 rounded-2xl text-left transition-all duration-300 transform
                                            ${companyPreferences.includes(option.key)
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30 scale-[1.02]'
                                                : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-[1.01]'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-lg font-medium block">{option.label}</span>
                                                <span className={`text-sm mt-1 block ${companyPreferences.includes(option.key) ? 'text-white/80' : 'text-white/50'}`}>
                                                    {option.description}
                                                </span>
                                            </div>
                                            {companyPreferences.includes(option.key) && (
                                                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}

                                <p className="text-center text-blue-200/60 text-sm mt-6">
                                    Pilih satu atau lebih sesuai preferensi Anda
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer Navigation */}
                <footer className="p-6 lg:p-8">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={`
                                px-6 py-3 rounded-xl font-medium transition-all duration-300
                                ${currentStep === 1
                                    ? 'text-white/30 cursor-not-allowed'
                                    : 'text-white hover:bg-white/10'
                                }
                            `}
                        >
                            ← Kembali
                        </button>

                        {currentStep < TOTAL_STEPS ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className={`
                                    px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform
                                    ${canProceed()
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105'
                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                    }
                                `}
                            >
                                Lanjutkan →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleFinish}
                                disabled={!canProceed() || isSubmitting}
                                className={`
                                    px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform
                                    ${canProceed() && !isSubmitting
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105'
                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                    }
                                `}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    'Selesai ✓'
                                )}
                            </button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}
