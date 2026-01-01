'use client';

import React from 'react';
import CheckboxCard from '../CheckboxCard';
import { INTEREST_OPTIONS, type InterestKey } from '@/types/onboarding';

interface Step1InterestsProps {
    selectedInterests: InterestKey[];
    onChange: (interests: InterestKey[]) => void;
}

/**
 * Step 1: Special Interest Survey
 * "Apakah Anda tertarik dengan posisi berikut?"
 */
export default function Step1Interests({ selectedInterests, onChange }: Step1InterestsProps) {
    const isNoneSelected = selectedInterests.includes('none');

    const handleInterestChange = (key: InterestKey, checked: boolean) => {
        if (key === 'none') {
            // If "Tidak tertarik" is selected, clear all other selections
            if (checked) {
                onChange(['none']);
            } else {
                onChange([]);
            }
        } else {
            // If any other option is selected, remove "none" if present
            let newInterests = selectedInterests.filter((i) => i !== 'none');

            if (checked) {
                newInterests = [...newInterests, key];
            } else {
                newInterests = newInterests.filter((i) => i !== key);
            }

            onChange(newInterests);
        }
    };

    // Separate regular options from the "none" option
    const regularOptions = INTEREST_OPTIONS.filter((opt) => opt.key !== 'none');
    const noneOption = INTEREST_OPTIONS.find((opt) => opt.key === 'none');

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Survei Minat Khusus
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
                Apakah Anda tertarik dengan posisi berikut?
            </p>

            <fieldset>
                <legend className="sr-only">Pilih posisi yang diminati</legend>

                <div className="space-y-3">
                    {/* Regular Options */}
                    {regularOptions.map((option) => (
                        <CheckboxCard
                            key={option.key}
                            label={option.label}
                            description={option.description}
                            checked={selectedInterests.includes(option.key)}
                            disabled={isNoneSelected}
                            onChange={(checked) => handleInterestChange(option.key, checked)}
                        />
                    ))}

                    {/* Divider */}
                    <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Atau
                            </span>
                        </div>
                    </div>

                    {/* "None" Option */}
                    {noneOption && (
                        <CheckboxCard
                            label={noneOption.label}
                            checked={isNoneSelected}
                            variant="muted"
                            onChange={(checked) => handleInterestChange('none', checked)}
                        />
                    )}
                </div>
            </fieldset>
        </div>
    );
}
