import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CandidateWithFullDetails } from '@/types/candidate';
import clsx from 'clsx';

export function EducationForm() {
    const { t } = useTranslation('candidate');
    const { register, formState: { errors } } = useFormContext<CandidateWithFullDetails>();

    return (
        <div className="mb-0">
            <h5 className="mb-4">{t('professional.education')}</h5>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">{t('professional.highestEducation')} <span className="text-danger">*</span></label>
                    <select
                        {...register('profile.highest_education', { required: t('professional.highestEducationRequired') })}
                        className={clsx("form-select", errors.profile?.highest_education && "is-invalid")}
                    >
                        <option value="">{t('professional.selectEducation')}</option>
                        <option value="HIGH_SCHOOL">High School / Vocational (SMA/SMK)</option>
                        <option value="DIPLOMA_1">Diploma 1 (D1)</option>
                        <option value="DIPLOMA_2">Diploma 2 (D2)</option>
                        <option value="DIPLOMA_3">Diploma 3 (D3)</option>
                        <option value="BACHELOR">Bachelor's Degree (S1)</option>
                        <option value="MASTER">Master's Degree (S2)</option>
                        <option value="DOCTORATE">Doctorate (S3)</option>
                        <option value="OTHER">{t('professional.other')}</option>
                    </select>
                    {errors.profile?.highest_education && (
                        <div className="invalid-feedback">{errors.profile.highest_education.message}</div>
                    )}
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">{t('professional.majorField')} <span className="text-danger">*</span></label>
                    <input
                        {...register('profile.major_field', { required: t('professional.majorFieldRequired') })}
                        className={clsx("form-control", errors.profile?.major_field && "is-invalid")}
                        placeholder={t('professional.majorFieldPlaceholder')}
                    />
                    {errors.profile?.major_field && (
                        <div className="invalid-feedback">{errors.profile.major_field.message}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

