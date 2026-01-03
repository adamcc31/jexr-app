import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CandidateWithFullDetails } from '@/types/candidate';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import clsx from 'clsx';

export function WorkExperienceForm() {
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
                <h5 className="mb-0">Work Experience</h5>
                <button
                    type="button"
                    onClick={addExperience}
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                >
                    <FiPlus /> Add Experience
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
                                title="Remove Experience"
                            >
                                <FiTrash2 size={18} />
                            </button>

                            <div className="row">
                                {/* Company Name */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Company Name <span className="text-danger">*</span></label>
                                    <input
                                        {...register(`work_experiences.${index}.company_name` as const, { required: "Company is required" })}
                                        className={clsx("form-control", errors.work_experiences?.[index]?.company_name && "is-invalid")}
                                        placeholder="e.g. PT Maju Mundur"
                                    />
                                    {errors.work_experiences?.[index]?.company_name && (
                                        <div className="invalid-feedback">{errors.work_experiences[index]?.company_name?.message}</div>
                                    )}
                                </div>

                                {/* Job Title */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Job Title <span className="text-danger">*</span></label>
                                    <input
                                        {...register(`work_experiences.${index}.job_title` as const, { required: "Job Title is required" })}
                                        className={clsx("form-control", errors.work_experiences?.[index]?.job_title && "is-invalid")}
                                        placeholder="e.g. Software Engineer"
                                    />
                                    {errors.work_experiences?.[index]?.job_title && (
                                        <div className="invalid-feedback">{errors.work_experiences[index]?.job_title?.message}</div>
                                    )}
                                </div>

                                {/* Experience Type */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Experience Type <span className="text-danger">*</span></label>
                                    <select
                                        {...register(`work_experiences.${index}.experience_type` as const)}
                                        className="form-select"
                                    >
                                        <option value="LOCAL">Local (Indonesia)</option>
                                        <option value="OVERSEAS">Overseas (Japan/Other)</option>
                                    </select>
                                </div>

                                {/* Country Code */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Country <span className="text-danger">*</span></label>
                                    <select
                                        {...register(`work_experiences.${index}.country_code` as const)}
                                        className="form-select"
                                    >
                                        <option value="ID">Indonesia</option>
                                        <option value="JP">Japan</option>
                                        <option value="US">USA</option>
                                        <option value="SG">Singapore</option>
                                        <option value="MY">Malaysia</option>
                                        <option value="OT">Other</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Start Date <span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        {...register(`work_experiences.${index}.start_date` as const, { required: "Start Date is required" })}
                                        className={clsx("form-control", errors.work_experiences?.[index]?.start_date && "is-invalid")}
                                    />
                                    {errors.work_experiences?.[index]?.start_date && (
                                        <div className="invalid-feedback">{errors.work_experiences[index]?.start_date?.message}</div>
                                    )}
                                </div>

                                {/* End Date */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">End Date</label>
                                    <input
                                        type="date"
                                        {...register(`work_experiences.${index}.end_date` as const)}
                                        className="form-control"
                                    />
                                    <div className="form-text">Leave empty if you currently work here.</div>
                                </div>

                                {/* Description */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Description / Responsibilities <span className="text-danger">*</span></label>
                                    <textarea
                                        {...register(`work_experiences.${index}.description` as const, { required: "Description is required" })}
                                        rows={3}
                                        className={clsx("form-control", errors.work_experiences?.[index]?.description && "is-invalid")}
                                        placeholder="Describe your key achievements and responsibilities..."
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
                        No work experience added yet.
                    </div>
                )}
            </div>
        </div>
    );
}
