'use client';

import React from 'react';
import CheckboxCard from '../CheckboxCard';
import { COMPANY_PREFERENCE_OPTIONS, type CompanyPreferenceKey } from '@/types/onboarding';

interface Step3CompanyTypeProps {
    selectedPreferences: CompanyPreferenceKey[];
    onChange: (preferences: CompanyPreferenceKey[]) => void;
}

/**
 * Step 3: Company Type Preferences
 * "Tipe perusahaan seperti apa yang ingin Anda cari?"
 */
export default function Step3CompanyType({
    selectedPreferences,
    onChange,
}: Step3CompanyTypeProps) {
    const handlePreferenceChange = (key: CompanyPreferenceKey, checked: boolean) => {
        if (checked) {
            onChange([...selectedPreferences, key]);
        } else {
            onChange(selectedPreferences.filter((p) => p !== key));
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Tipe Perusahaan yang Dicari
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
                Tipe perusahaan seperti apa yang ingin Anda cari? (pilih satu atau lebih)
            </p>

            <fieldset>
                <legend className="sr-only">Pilih tipe perusahaan yang diminati</legend>

                <div className="space-y-3">
                    {COMPANY_PREFERENCE_OPTIONS.map((option) => (
                        <CheckboxCard
                            key={option.key}
                            label={option.label}
                            description={option.description}
                            checked={selectedPreferences.includes(option.key)}
                            onChange={(checked) => handlePreferenceChange(option.key, checked)}
                        />
                    ))}
                </div>
            </fieldset>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex">
                    <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="ml-3 text-sm text-blue-700 dark:text-blue-300">
                        Preferensi ini akan membantu kami mencocokkan Anda dengan lowongan pekerjaan yang sesuai.
                    </p>
                </div>
            </div>
        </div>
    );
}
