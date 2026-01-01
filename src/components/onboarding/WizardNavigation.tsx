'use client';

import React from 'react';

interface WizardNavigationProps {
    currentStep: number;
    totalSteps: number;
    canProceed: boolean;
    isSubmitting?: boolean;
    onBack: () => void;
    onNext: () => void;
    onFinish: () => void;
}

/**
 * WizardNavigation component
 * Back/Next/Finish buttons with proper disabled states
 */
export default function WizardNavigation({
    currentStep,
    totalSteps,
    canProceed,
    isSubmitting = false,
    onBack,
    onNext,
    onFinish,
}: WizardNavigationProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700 mt-8">
            {/* Back Button */}
            <button
                type="button"
                onClick={onBack}
                disabled={isFirstStep || isSubmitting}
                className={`
                    inline-flex justify-center items-center px-6 py-3 
                    border border-slate-300 dark:border-slate-600 
                    text-base font-medium rounded-lg 
                    text-slate-700 dark:text-slate-300 
                    bg-white dark:bg-transparent 
                    transition-all duration-200
                    w-full sm:w-auto
                    ${isFirstStep || isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:ring-offset-slate-900'
                    }
                `}
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali
            </button>

            {/* Spacer */}
            <div className="flex-1 hidden sm:block" />

            {/* Next / Finish Button */}
            {isLastStep ? (
                <button
                    type="button"
                    onClick={onFinish}
                    disabled={!canProceed || isSubmitting}
                    className={`
                        inline-flex justify-center items-center px-8 py-3 
                        border border-transparent 
                        text-base font-medium rounded-lg 
                        text-white 
                        bg-blue-600 
                        transition-all duration-200
                        w-full sm:w-auto
                        ${!canProceed || isSubmitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-slate-900 shadow-lg shadow-blue-500/25'
                        }
                    `}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            Selesai & Lanjutkan
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </>
                    )}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canProceed || isSubmitting}
                    className={`
                        inline-flex justify-center items-center px-8 py-3 
                        border border-transparent 
                        text-base font-medium rounded-lg 
                        text-white 
                        bg-slate-900 dark:bg-slate-100 dark:text-slate-900
                        transition-all duration-200
                        w-full sm:w-auto
                        ${!canProceed || isSubmitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-slate-800 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:ring-offset-slate-900 shadow-lg shadow-slate-900/10'
                        }
                    `}
                >
                    Lanjut
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}
