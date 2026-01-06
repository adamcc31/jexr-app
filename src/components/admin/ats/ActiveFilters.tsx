'use client';

/**
 * ATS Active Filters Component
 *
 * Displays currently active filters as dismissible chips/badges.
 */

import React from 'react';
import { Badge, CloseButton } from 'react-bootstrap';
import type { ATSFilter, ATSFilterOptions } from '@/types/ats';
import { JLPT_LABELS, GENDER_LABELS, EDUCATION_LABELS } from '@/types/ats';

interface ActiveFiltersProps {
    filter: ATSFilter;
    options: ATSFilterOptions | undefined;
    onRemove: (key: keyof ATSFilter, value?: string | number) => void;
}

interface FilterChip {
    key: keyof ATSFilter;
    label: string;
    value?: string | number;
}

export default function ActiveFilters({ filter, options, onRemove }: ActiveFiltersProps) {
    const chips: FilterChip[] = [];

    // Japanese Proficiency Group
    filter.japanese_levels?.forEach((level) => {
        chips.push({
            key: 'japanese_levels',
            label: JLPT_LABELS[level] || level,
            value: level,
        });
    });

    if (filter.japan_experience_min !== undefined || filter.japan_experience_max !== undefined) {
        const min = filter.japan_experience_min ?? 0;
        const max = filter.japan_experience_max ?? '∞';
        chips.push({
            key: 'japan_experience_min',
            label: `Japan Exp: ${min}–${max}mo`,
        });
    }

    if (filter.has_lpk_training !== undefined) {
        chips.push({
            key: 'has_lpk_training',
            label: `LPK: ${filter.has_lpk_training ? 'Yes' : 'No'}`,
        });
    }

    // Competency & Language Group
    filter.english_cert_types?.forEach((cert) => {
        chips.push({
            key: 'english_cert_types',
            label: cert,
            value: cert,
        });
    });

    if (filter.english_min_score !== undefined) {
        chips.push({
            key: 'english_min_score',
            label: `English ≥ ${filter.english_min_score}`,
        });
    }

    filter.technical_skill_ids?.forEach((id) => {
        const skill = options?.technical_skills?.find((s) => s.id === id);
        chips.push({
            key: 'technical_skill_ids',
            label: skill?.name || `Skill #${id}`,
            value: id,
        });
    });

    filter.computer_skill_ids?.forEach((id) => {
        const skill = options?.computer_skills?.find((s) => s.id === id);
        chips.push({
            key: 'computer_skill_ids',
            label: skill?.name || `Skill #${id}`,
            value: id,
        });
    });

    // Logistics & Availability Group
    if (filter.age_min !== undefined || filter.age_max !== undefined) {
        const min = filter.age_min ?? 18;
        const max = filter.age_max ?? '∞';
        chips.push({
            key: 'age_min',
            label: `Age: ${min}–${max}`,
        });
    }

    filter.genders?.forEach((gender) => {
        chips.push({
            key: 'genders',
            label: GENDER_LABELS[gender] || gender,
            value: gender,
        });
    });

    filter.domicile_cities?.forEach((city) => {
        chips.push({
            key: 'domicile_cities',
            label: city,
            value: city,
        });
    });

    if (filter.expected_salary_min !== undefined || filter.expected_salary_max !== undefined) {
        const min = filter.expected_salary_min ? `${(filter.expected_salary_min / 1000000).toFixed(0)}M` : '0';
        const max = filter.expected_salary_max ? `${(filter.expected_salary_max / 1000000).toFixed(0)}M` : '∞';
        chips.push({
            key: 'expected_salary_min',
            label: `Salary: ${min}–${max}`,
        });
    }

    if (filter.available_start_before) {
        chips.push({
            key: 'available_start_before',
            label: `Start ≤ ${filter.available_start_before}`,
        });
    }

    // Education & Experience Group
    filter.education_levels?.forEach((level) => {
        chips.push({
            key: 'education_levels',
            label: EDUCATION_LABELS[level] || level,
            value: level,
        });
    });

    filter.major_fields?.forEach((major) => {
        chips.push({
            key: 'major_fields',
            label: major,
            value: major,
        });
    });

    if (filter.total_experience_min !== undefined || filter.total_experience_max !== undefined) {
        const min = filter.total_experience_min ?? 0;
        const max = filter.total_experience_max ?? '∞';
        chips.push({
            key: 'total_experience_min',
            label: `Exp: ${min}–${max}mo`,
        });
    }

    if (chips.length === 0) {
        return null;
    }

    return (
        <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="text-muted small me-1 align-self-center">Active Filters:</span>
            {chips.map((chip, idx) => (
                <Badge
                    key={`${chip.key}-${chip.value ?? idx}`}
                    bg="light"
                    text="dark"
                    className="d-flex align-items-center gap-1 px-2 py-1"
                >
                    {chip.label}
                    <CloseButton
                        style={{ fontSize: '0.5rem' }}
                        onClick={() => onRemove(chip.key, chip.value)}
                    />
                </Badge>
            ))}
        </div>
    );
}
