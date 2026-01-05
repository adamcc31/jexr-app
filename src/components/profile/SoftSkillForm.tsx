import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CandidateWithFullDetails } from '@/types/candidate';
import clsx from 'clsx';

export function SoftSkillForm() {
    const { t } = useTranslation('candidate');
    const { register, formState: { errors } } = useFormContext<CandidateWithFullDetails>();

    return (
        <div className="mb-0">
            <h5 className="mb-4">{t('professional.softSkills')}</h5>

            <div className="row">
                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">{t('professional.softSkillsDescription')} <span className="text-danger">*</span></label>
                    <div className="form-text mb-1">{t('professional.softSkillsDescHelp')}</div>
                    <textarea
                        {...register('details.soft_skills_description', {
                            required: t('professional.softSkillsRequired'),
                            minLength: { value: 20, message: t('professional.minCharactersMessage', { count: 20 }) }
                        })}
                        rows={4}
                        className={clsx("form-control", errors.details?.soft_skills_description && "is-invalid")}
                        placeholder={t('professional.softSkillsPlaceholder')}
                    />
                    {errors.details?.soft_skills_description && (
                        <div className="invalid-feedback">{errors.details.soft_skills_description.message}</div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">{t('professional.appliedWorkValues')} <span className="text-danger">*</span></label>
                    <div className="form-text mb-1">{t('professional.appliedWorkValuesHelp')}</div>
                    <textarea
                        {...register('details.applied_work_values', { required: t('professional.appliedWorkValuesRequired') })}
                        rows={4}
                        className={clsx("form-control", errors.details?.applied_work_values && "is-invalid")}
                        placeholder={t('professional.appliedWorkValuesPlaceholder')}
                    />
                    {errors.details?.applied_work_values && (
                        <div className="invalid-feedback">{errors.details.applied_work_values.message}</div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">{t('professional.majorAchievements')} <span className="text-danger">*</span></label>
                    <div className="form-text mb-1">{t('professional.majorAchievementsHelp')}</div>
                    <textarea
                        {...register('details.major_achievements', { required: t('professional.majorAchievementsRequired') })}
                        rows={4}
                        className={clsx("form-control", errors.details?.major_achievements && "is-invalid")}
                        placeholder={t('professional.majorAchievementsPlaceholder')}
                    />
                    {errors.details?.major_achievements && (
                        <div className="invalid-feedback">{errors.details.major_achievements.message}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

