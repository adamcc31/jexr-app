'use client';

import React from 'react';

interface WizardProgressProps {
    currentStep: number;
    totalSteps: number;
    stepLabels?: string[];
}

/**
 * WizardProgress component
 * Displays step indicator with progress bar
 */
export default function WizardProgress({
    currentStep,
    totalSteps,
    stepLabels = ['Minat Khusus', 'Asal LPK', 'Tipe Perusahaan'],
}: WizardProgressProps) {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="mb-8">
            {/* Step Counter */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Langkah {currentStep} dari {totalSteps}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-500">
                    {stepLabels[currentStep - 1]}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Step Dots */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0">
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                        <div
                            key={step}
                            className={`
                                w-4 h-4 rounded-full border-2 transition-all duration-200
                                ${step < currentStep
                                    ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                                    : step === currentStep
                                        ? 'bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50'
                                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                                }
                            `}
                        >
                            {step < currentStep && (
                                <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
