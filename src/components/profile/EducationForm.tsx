import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CandidateWithFullDetails } from '@/types/candidate';
import clsx from 'clsx';

export function EducationForm() {
    const { register, formState: { errors } } = useFormContext<CandidateWithFullDetails>();

    return (
        <div className="mb-0">
            <h5 className="mb-4">Education</h5>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Highest Education <span className="text-danger">*</span></label>
                    <select
                        {...register('profile.highest_education', { required: "Highest education is required" })}
                        className={clsx("form-select", errors.profile?.highest_education && "is-invalid")}
                    >
                        <option value="">Select Education Level</option>
                        <option value="HIGH_SCHOOL">High School / Vocational (SMA/SMK)</option>
                        <option value="DIPLOMA_1">Diploma 1 (D1)</option>
                        <option value="DIPLOMA_2">Diploma 2 (D2)</option>
                        <option value="DIPLOMA_3">Diploma 3 (D3)</option>
                        <option value="BACHELOR">Bachelor's Degree (S1)</option>
                        <option value="MASTER">Master's Degree (S2)</option>
                        <option value="DOCTORATE">Doctorate (S3)</option>
                        <option value="OTHER">Other</option>
                    </select>
                    {errors.profile?.highest_education && (
                        <div className="invalid-feedback">{errors.profile.highest_education.message}</div>
                    )}
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Major / Field of Study <span className="text-danger">*</span></label>
                    <input
                        {...register('profile.major_field', { required: "Major is required" })}
                        className={clsx("form-control", errors.profile?.major_field && "is-invalid")}
                        placeholder="e.g. Mechanical Engineering"
                    />
                    {errors.profile?.major_field && (
                        <div className="invalid-feedback">{errors.profile.major_field.message}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
