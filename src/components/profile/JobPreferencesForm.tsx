import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CandidateWithFullDetails } from '@/types/candidate';
import clsx from 'clsx';

export function JobPreferencesForm() {
    const { t } = useTranslation('candidate');
    const { register, watch, formState: { errors } } = useFormContext<CandidateWithFullDetails>();

    const jobPosition = watch('profile.desired_job_position');

    return (
        <div className="mb-0">
            <h5 className="mb-4">{t('professional.jobPreferences')}</h5>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">{t('professional.desiredPosition')} <span className="text-danger">*</span></label>
                    <select
                        {...register('profile.desired_job_position', { required: t('professional.desiredPositionRequired') })}
                        className={clsx("form-select", errors.profile?.desired_job_position && "is-invalid")}
                    >
                        <option value="">{t('professional.selectPosition')}</option>
                        <option value="TOKUTEI_GINOU_NURSING">Tokutei Ginou - Care Worker</option>
                        <option value="TOKUTEI_GINOU_FOOD">Tokutei Ginou - Food Service</option>
                        <option value="TOKUTEI_GINOU_AUTO">Tokutei Ginou - Auto Repair</option>
                        <option value="ENGINEER">Engineer</option>
                        <option value="INTERPRETER">Interpreter</option>
                        <option value="OTHER">{t('professional.other')}</option>
                    </select>
                    {errors.profile?.desired_job_position && (
                        <div className="invalid-feedback">{errors.profile.desired_job_position.message}</div>
                    )}
                </div>

                {jobPosition === 'OTHER' && (
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">{t('professional.otherPosition')} <span className="text-danger">*</span></label>
                        <input
                            {...register('profile.desired_job_position_other', {
                                required: t('professional.otherPositionRequired')
                            })}
                            className={clsx("form-control", errors.profile?.desired_job_position_other && "is-invalid")}
                            placeholder={t('professional.otherPositionPlaceholder')}
                        />
                        {errors.profile?.desired_job_position_other && (
                            <div className="invalid-feedback">{errors.profile.desired_job_position_other.message}</div>
                        )}
                    </div>
                )}

                <div className={jobPosition === 'OTHER' ? "col-12 mb-3" : "col-md-6 mb-3"}>
                    <label className="form-label fw-semibold">{t('professional.preferredEnvironment')} <span className="text-danger">*</span></label>
                    <input
                        {...register('profile.preferred_work_environment', { required: t('professional.preferredEnvironmentRequired') })}
                        className={clsx("form-control", errors.profile?.preferred_work_environment && "is-invalid")}
                        placeholder={t('professional.preferredEnvironmentPlaceholder')}
                    />
                    {errors.profile?.preferred_work_environment && (
                        <div className="invalid-feedback">{errors.profile.preferred_work_environment.message}</div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">{t('professional.careerGoals')} <span className="text-danger">*</span></label>
                    <textarea
                        {...register('profile.career_goals_3y', { required: t('professional.careerGoalsRequired') })}
                        rows={3}
                        className={clsx("form-control", errors.profile?.career_goals_3y && "is-invalid")}
                        placeholder={t('professional.careerGoalsPlaceholder')}
                    />
                    {errors.profile?.career_goals_3y && (
                        <div className="invalid-feedback">{errors.profile.career_goals_3y.message}</div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">{t('professional.specialMessage')} <span className="text-danger">*</span></label>
                    <textarea
                        {...register('profile.special_message', { required: t('professional.specialMessageRequired') })}
                        rows={3}
                        className={clsx("form-control", errors.profile?.special_message && "is-invalid")}
                        placeholder={t('professional.specialMessagePlaceholder')}
                    />
                    {errors.profile?.special_message && (
                        <div className="invalid-feedback">{errors.profile.special_message.message}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

