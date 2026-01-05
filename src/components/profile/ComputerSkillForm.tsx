import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CandidateWithFullDetails, Skill } from '@/types/candidate';
import clsx from 'clsx';

interface Props {
    masterSkills: Skill[];
}

export function ComputerSkillForm({ masterSkills }: Props) {
    const { t } = useTranslation('candidate');
    const { register, formState: { errors } } = useFormContext<CandidateWithFullDetails>();

    // Filter only COMPUTER category skills
    const computerSkills = useMemo(() => {
        return masterSkills.filter(skill => skill.category === 'COMPUTER');
    }, [masterSkills]);

    if (computerSkills.length === 0) {
        return null; // Don't render if no computer skills in master list
    }

    return (
        <div className="mb-0">
            <h5 className="mb-4">{t('professional.computerSkills')}</h5>

            <div className="card border-0 bg-light p-3">
                <small className="text-uppercase text-muted fw-bold mb-2 d-block">
                    {t('professional.technicalSoftware')}
                </small>
                <div className="d-flex flex-wrap gap-2">
                    {computerSkills.map(skill => (
                        <div key={skill.id} className="form-check form-check-inline m-0">
                            <input
                                type="checkbox"
                                id={`computer-skill-${skill.id}`}
                                value={skill.id}
                                {...register('skill_ids')}
                                className="btn-check"
                            />
                            <label
                                className="btn btn-sm btn-outline-primary rounded-pill"
                                htmlFor={`computer-skill-${skill.id}`}
                            >
                                {skill.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-3">
                <label className="form-label fw-semibold">{t('professional.otherComputerSkills')}</label>
                <div className="form-text mb-2">
                    {t('professional.otherComputerSkillsHelp')}
                </div>
                <textarea
                    {...register('profile.skills_other')}
                    rows={2}
                    className={clsx("form-control", errors.profile?.skills_other && "is-invalid")}
                    placeholder={t('professional.otherComputerSkillsPlaceholder')}
                />
            </div>
        </div>
    );
}

