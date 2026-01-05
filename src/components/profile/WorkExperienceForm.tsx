import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CandidateWithFullDetails } from '@/types/candidate';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import clsx from 'clsx';

export function WorkExperienceForm() {
    const { t } = useTranslation('candidate');
    const { register, control, formState: { errors } } = useFormContext<CandidateWithFullDetails>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "work_experiences"
    });

    const addExperience = () => {
        append({
            id: 0,
            user_id: '',
            country_code: 'ID',
            experience_type: 'LOCAL',
            company_name: '',
            job_title: '',
            start_date: '',
            end_date: '',
            description: ''
        });
    };

    return (
        <div className="mb-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">{t('professional.workExperience')}</h5>
                <button
                    type="button"
                    onClick={addExperience}
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                >
                    <FiPlus /> {t('professional.addExperience')}
                </button>
            </div>

            <div className="vstack gap-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="card bg-light border-0 relative">
                        <div className="card-body">
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="btn btn-sm text-danger position-absolute top-0 end-0 m-2"
                                title={t('professional.remove')}
                            >
                                <FiTrash2 size={18} />
                            </button>

                            <div className="row">
                                {/* Company Name */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">{t('professional.companyName')} <span className="text-danger">*</span></label>
                                    <input
                                        {...register(`work_experiences.${index}.company_name` as const, { required: t('professional.companyNameRequired') })}
                                        className={clsx("form-control", errors.work_experiences?.[index]?.company_name && "is-invalid")}
                                        placeholder="e.g. PT Maju Mundur"
                                    />
                                    {errors.work_experiences?.[index]?.company_name && (
                                        <div className="invalid-feedback">{errors.work_experiences[index]?.company_name?.message}</div>
                                    )}
                                </div>

                                {/* Job Title */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">{t('professional.position')} <span className="text-danger">*</span></label>
                                    <input
                                        {...register(`work_experiences.${index}.job_title` as const, { required: t('professional.positionRequired') })}
                                        className={clsx("form-control", errors.work_experiences?.[index]?.job_title && "is-invalid")}
                                        placeholder="e.g. Software Engineer"
                                    />
                                    {errors.work_experiences?.[index]?.job_title && (
                                        <div className="invalid-feedback">{errors.work_experiences[index]?.job_title?.message}</div>
                                    )}
                                </div>

                                {/* Experience Type */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">{t('professional.experienceType')} <span className="text-danger">*</span></label>
                                    <select
                                        {...register(`work_experiences.${index}.experience_type` as const)}
                                        className="form-select"
                                    >
                                        <option value="LOCAL">{t('professional.local')}</option>
                                        <option value="OVERSEAS">{t('professional.overseas')}</option>
                                    </select>
                                </div>

                                {/* Country Code */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">{t('professional.country')} <span className="text-danger">*</span></label>
                                    <select
                                        {...register(`work_experiences.${index}.country_code` as const)}
                                        className="form-select"
                                    >
                                        <option value="ID">Indonesia</option>
                                        <option value="JP">Japan</option>
                                        <option value="US">USA</option>
                                        <option value="SG">Singapore</option>
                                        <option value="MY">Malaysia</option>
                                        <option value="OT">{t('professional.other')}</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">{t('professional.startDate')} <span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        {...register(`work_experiences.${index}.start_date` as const, { required: t('professional.startDateRequired') })}
                                        className={clsx("form-control", errors.work_experiences?.[index]?.start_date && "is-invalid")}
                                    />
                                    {errors.work_experiences?.[index]?.start_date && (
                                        <div className="invalid-feedback">{errors.work_experiences[index]?.start_date?.message}</div>
                                    )}
                                </div>

                                {/* End Date */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">{t('professional.endDate')}</label>
                                    <input
                                        type="date"
                                        {...register(`work_experiences.${index}.end_date` as const)}
                                        className="form-control"
                                    />
                                    <div className="form-text">{t('professional.currentlyWorking')}</div>
                                </div>

                                {/* Description */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold">{t('professional.description')} <span className="text-danger">*</span></label>
                                    <textarea
                                        {...register(`work_experiences.${index}.description` as const, { required: t('professional.descriptionRequired') })}
                                        rows={3}
                                        className={clsx("form-control", errors.work_experiences?.[index]?.description && "is-invalid")}
                                        placeholder={t('professional.descriptionPlaceholder')}
                                    />
                                    {errors.work_experiences?.[index]?.description && (
                                        <div className="invalid-feedback">{errors.work_experiences[index]?.description?.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-5 border rounded bg-light text-muted">
                        {t('professional.noExperience')}
                    </div>
                )}
            </div>
        </div>
    );
}

