import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CandidateWithFullDetails } from '@/types/candidate';
import clsx from 'clsx';

export function SoftSkillForm() {
    const { register, formState: { errors } } = useFormContext<CandidateWithFullDetails>();

    return (
        <div className="mb-0">
            <h5 className="mb-4">Personal Details & Soft Skills</h5>

            <div className="row">
                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Soft Skills Description <span className="text-danger">*</span></label>
                    <div className="form-text mb-1">Describe your personal strengths (e.g., leadership, communication, adaptability).</div>
                    <textarea
                        {...register('details.soft_skills_description', {
                            required: "Soft skills description is required",
                            minLength: { value: 20, message: "Please provide a more detailed description (min 20 chars)" }
                        })}
                        rows={4}
                        className={clsx("form-control", errors.details?.soft_skills_description && "is-invalid")}
                        placeholder="I am a quick learner and work well in teams..."
                    />
                    {errors.details?.soft_skills_description && (
                        <div className="invalid-feedback">{errors.details.soft_skills_description.message}</div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Work Values Applied <span className="text-danger">*</span></label>
                    <div className="form-text mb-1">What values do you apply in your work? (e.g., discipline, kaizen, punctuality).</div>
                    <textarea
                        {...register('details.applied_work_values', { required: "Work values are required" })}
                        rows={4}
                        className={clsx("form-control", errors.details?.applied_work_values && "is-invalid")}
                        placeholder="I value punctuality and continuous improvement..."
                    />
                    {errors.details?.applied_work_values && (
                        <div className="invalid-feedback">{errors.details.applied_work_values.message}</div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Major Achievements <span className="text-danger">*</span></label>
                    <div className="form-text mb-1">Highlight your key accomplishments in previous roles.</div>
                    <textarea
                        {...register('details.major_achievements', { required: "Major achievements are required" })}
                        rows={4}
                        className={clsx("form-control", errors.details?.major_achievements && "is-invalid")}
                        placeholder="Successfully reduced downtime by 20% in previous role..."
                    />
                    {errors.details?.major_achievements && (
                        <div className="invalid-feedback">{errors.details.major_achievements.message}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
