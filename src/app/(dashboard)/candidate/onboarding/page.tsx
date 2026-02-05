'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { submitOnboarding, searchLPK } from '@/lib/candidate-api';
import {
    type InterestKey,
    type CompanyPreferenceKey,
    type LPK,
    type LPKSelectionType,
    type OnboardingSubmitData,
} from '@/types/onboarding';
import styles from './onboarding.module.css';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

    // Form State
    const [interests, setInterests] = useState<InterestKey[]>([]);
    const [lpkSelectionType, setLpkSelectionType] = useState<LPKSelectionType>('list');
    const [selectedLPK, setSelectedLPK] = useState<LPK | null>(null);
    const [lpkOtherName, setLpkOtherName] = useState('');
    const [companyPreferences, setCompanyPreferences] = useState<CompanyPreferenceKey[]>([]);
    const [willingToInterviewOnsite, setWillingToInterviewOnsite] = useState<boolean | null>(null);
    // Step 4: Personal Details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
    const [birthDate, setBirthDate] = useState('');

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            case 4:
                // Validate personal details and interview preference
                return (
                    willingToInterviewOnsite !== null &&
                    firstName.trim().length > 0 &&
                    lastName.trim().length > 0 &&
                    phone.trim().length > 0 &&
                    gender !== '' &&
                    birthDate !== ''
                );
            default:
                return false;
        }
    }, [currentStep, interests, lpkSelectionType, selectedLPK, lpkOtherName, companyPreferences, willingToInterviewOnsite, firstName, lastName, phone, gender, birthDate]);

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
            setError(null);
        }
    };

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS && canProceed()) {
            setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
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
                willing_to_interview_onsite: willingToInterviewOnsite,
                // Step 4: Personal Details
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: phone.trim(),
                gender: gender as 'MALE' | 'FEMALE',
                birth_date: birthDate,
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

    const handlePreferenceToggle = (key: CompanyPreferenceKey) => {
        if (companyPreferences.includes(key)) {
            setCompanyPreferences(companyPreferences.filter((p) => p !== key));
        } else {
            setCompanyPreferences([...companyPreferences, key]);
        }
    };

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
        4: {
            title: 'Personal Details & Interview',
            subtitle: 'Complete your profile with basic personal information and let us know your interview availability.',
            question: 'Please fill in your personal details',
        },
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Left Panel - Hero Image */}
            <div className={styles.heroPanel}>
                <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Professional"
                    className={styles.heroImage}
                />
                <div className={styles.heroOverlay}>
                    <p className={styles.quote}>
                        &ldquo;Connecting Japanese businesses with exceptional Indonesian talent.&rdquo;
                    </p>
                </div>
            </div>

            {/* Right Panel - Form Content */}
            <div className={styles.formPanel}>
                <div className={styles.scrollArea}>
                    <div className={styles.contentWrapper}>
                        <p className={styles.stepIndicator}>
                            Step {currentStep} of {TOTAL_STEPS}
                        </p>

                        <h1 className={styles.title}>
                            {stepConfig[currentStep].title}
                        </h1>
                        <p className={styles.subtitle}>
                            {stepConfig[currentStep].subtitle}
                        </p>

                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <h2 className={styles.question}>
                            {stepConfig[currentStep].question}
                        </h2>

                        {/* Step 1 */}
                        {currentStep === 1 && (
                            <div className={styles.optionsList}>
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

                                <div className={styles.divider}>
                                    <div className={styles.dividerLine} />
                                    <span className={styles.dividerText}>or</span>
                                    <div className={styles.dividerLine} />
                                </div>

                                <CheckboxOption
                                    checked={interests.includes('none')}
                                    onChange={() => handleInterestToggle('none')}
                                    label="Not interested in any of the above positions"
                                />
                            </div>
                        )}

                        {/* Step 2 */}
                        {currentStep === 2 && (
                            <div className={styles.optionsList}>
                                <RadioOption
                                    checked={lpkSelectionType === 'list'}
                                    onChange={() => setLpkSelectionType('list')}
                                    label="Select from registered LPK list"
                                />
                                {lpkSelectionType === 'list' && (
                                    <div className={styles.inputWrapper}>
                                        <LPKAutocomplete
                                            value={selectedLPK}
                                            onSearch={searchLPK}
                                            onChange={setSelectedLPK}
                                        />
                                    </div>
                                )}

                                <RadioOption
                                    checked={lpkSelectionType === 'other'}
                                    onChange={() => setLpkSelectionType('other')}
                                    label="Other (enter manually)"
                                />
                                {lpkSelectionType === 'other' && (
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            value={lpkOtherName}
                                            onChange={(e) => setLpkOtherName(e.target.value)}
                                            placeholder="Enter LPK name..."
                                            className={styles.textInput}
                                        />
                                    </div>
                                )}

                                <div className={styles.divider}>
                                    <div className={styles.dividerLine} />
                                    <span className={styles.dividerText}>or</span>
                                    <div className={styles.dividerLine} />
                                </div>

                                <RadioOption
                                    checked={lpkSelectionType === 'none'}
                                    onChange={() => setLpkSelectionType('none')}
                                    label="I did not study at an LPK"
                                />
                            </div>
                        )}

                        {/* Step 3 */}
                        {currentStep === 3 && (
                            <div className={styles.optionsList}>
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
                            </div>
                        )}

                        {/* Step 4 */}
                        {currentStep === 4 && (
                            <div className={styles.optionsList}>
                                {/* Personal Details Form */}
                                <div className={styles.formSection}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Nama Depan <span className={styles.required}>*</span></label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Contoh: Budi"
                                                className={styles.textInput}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Nama Belakang <span className={styles.required}>*</span></label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Contoh: Santoso"
                                                className={styles.textInput}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Nomor Telepon (WhatsApp) <span className={styles.required}>*</span></label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Contoh: 081234567890"
                                            className={styles.textInput}
                                        />
                                        <span className={styles.formHint}>Pastikan nomor ini bisa dihubungi melalui WhatsApp</span>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Jenis Kelamin <span className={styles.required}>*</span></label>
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE' | '')}
                                                className={styles.selectInput}
                                            >
                                                <option value="">Pilih...</option>
                                                <option value="MALE">Laki-laki</option>
                                                <option value="FEMALE">Perempuan</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Tanggal Lahir <span className={styles.required}>*</span></label>
                                            <input
                                                type="date"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e.target.value)}
                                                className={styles.textInput}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Interview Preference */}
                                <div className={styles.divider}>
                                    <div className={styles.dividerLine} />
                                    <span className={styles.dividerText}>Preferensi Interview</span>
                                    <div className={styles.dividerLine} />
                                </div>

                                <RadioOption
                                    checked={willingToInterviewOnsite === true}
                                    onChange={() => setWillingToInterviewOnsite(true)}
                                    label="Ya, saya bersedia hadir interview secara langsung di Indonesia"
                                />
                                <RadioOption
                                    checked={willingToInterviewOnsite === false}
                                    onChange={() => setWillingToInterviewOnsite(false)}
                                    label="Tidak, saya hanya bisa interview online/remote"
                                />
                            </div>
                        )}

                        {/* Navigation */}
                        <div className={styles.buttonGroup}>
                            {currentStep < TOTAL_STEPS ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!canProceed()}
                                        className={`${styles.button} ${styles.primaryButton}`}
                                    >
                                        Continue
                                    </button>
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className={`${styles.button} ${styles.secondaryButton}`}
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
                                        className={`${styles.button} ${styles.primaryButton}`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Preferences'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className={`${styles.button} ${styles.secondaryButton}`}
                                    >
                                        Back
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile FAB */}
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={styles.mobileFab}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

// Components

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
            className={`${styles.optionCard} ${checked ? styles.checked : ''}`}
        >
            <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
                {checked && (
                    <svg className={styles.checkboxIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
            <div className={styles.labelContainer}>
                <span className={styles.labelText}>{label}</span>
                {sublabel && <span className={styles.sublabelText}>{sublabel}</span>}
            </div>
        </button>
    );
}

function RadioOption({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`${styles.optionCard} ${checked ? styles.checked : ''}`}
        >
            <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
                {checked && <div className={styles.radioDot} />}
            </div>
            <div className={styles.labelContainer}>
                <span className={styles.labelText}>{label}</span>
            </div>
        </button>
    );
}

function LPKAutocomplete({ value, onSearch, onChange }: { value: LPK | null, onSearch: (q: string) => Promise<LPK[]>, onChange: (lpk: LPK | null) => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<LPK[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Sync query with value if provided
    useEffect(() => {
        if (value) {
            setQuery(value.name);
        }
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query && (!value || query !== value.name)) {
                try {
                    const data = await onSearch(query);
                    setResults(data || []);
                } catch (e) {
                    setResults([]);
                }
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query, onSearch, value]);

    const handleSelect = (lpk: LPK) => {
        onChange(lpk);
        setQuery(lpk.name);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (value && e.target.value !== value.name) {
            onChange(null);
        }
        setIsOpen(true);
    };

    return (
        <div className={styles.dropdownWrapper}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                placeholder="Type LPK name..."
                className={styles.dropdownInput}
            />
            {isOpen && results.length > 0 && (
                <div className={styles.dropdownMenu}>
                    {results.map((lpk) => (
                        <div
                            key={lpk.id}
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(lpk)}
                        >
                            {lpk.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
