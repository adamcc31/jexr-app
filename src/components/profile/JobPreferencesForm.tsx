import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CandidateWithFullDetails } from '@/types/candidate';
import clsx from 'clsx';

export function JobPreferencesForm() {
    const { register, watch, formState: { errors } } = useFormContext<CandidateWithFullDetails>();

    const jobPosition = watch('profile.desired_job_position');

    return (
        <div className="mb-0">
            <h5 className="mb-4">Job Preferences & Goals</h5>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Desired Job Position <span className="text-danger">*</span></label>
                    <select
                        {...register('profile.desired_job_position', { required: "Desired Position is required" })}
                        className={clsx("form-select", errors.profile?.desired_job_position && "is-invalid")}
                    >
                        <option value="">Select Position</option>
                        <option value="TOKUTEI_GINOU_NURSING">Tokutei Ginou - Care Worker</option>
                        <option value="TOKUTEI_GINOU_FOOD">Tokutei Ginou - Food Service</option>
                        <option value="TOKUTEI_GINOU_AUTO">Tokutei Ginou - Auto Repair</option>
                        <option value="ENGINEER">Engineer</option>
                        <option value="INTERPRETER">Interpreter</option>
                        <option value="OTHER">Other</option>
                    </select>
                    {errors.profile?.desired_job_position && (
                        <div className="invalid-feedback">{errors.profile.desired_job_position.message}</div>
                    )}
                </div>

                {jobPosition === 'OTHER' && (
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Other Position <span className="text-danger">*</span></label>
                        <input
                            {...register('profile.desired_job_position_other', {
                                required: "Please specify your desired position"
                            })}
                            className={clsx("form-control", errors.profile?.desired_job_position_other && "is-invalid")}
                            placeholder="Specify position"
                        />
                        {errors.profile?.desired_job_position_other && (
                            <div className="invalid-feedback">{errors.profile.desired_job_position_other.message}</div>
                        )}
                    </div>
                )}

                <div className={jobPosition === 'OTHER' ? "col-12 mb-3" : "col-md-6 mb-3"}>
                    <label className="form-label fw-semibold">Preferred Work Environment <span className="text-danger">*</span></label>
                    <input
                        {...register('profile.preferred_work_environment', { required: "Preferred Environment is required" })}
                        className={clsx("form-control", errors.profile?.preferred_work_environment && "is-invalid")}
                        placeholder="e.g. Urban area, Manufacturing plant, Hospital"
                    />
                    {errors.profile?.preferred_work_environment && (
                        <div className="invalid-feedback">{errors.profile.preferred_work_environment.message}</div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Career Goals (3 Years) <span className="text-danger">*</span></label>
                    <textarea
                        {...register('profile.career_goals_3y', { required: "Career Goals are required" })}
                        rows={3}
                        className={clsx("form-control", errors.profile?.career_goals_3y && "is-invalid")}
                        placeholder="Where do you see yourself in 3 years? e.g. Being a team leader..."
                    />
                    {errors.profile?.career_goals_3y && (
                        <div className="invalid-feedback">{errors.profile.career_goals_3y.message}</div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Special Message to Employers <span className="text-danger">*</span></label>
                    <textarea
                        {...register('profile.special_message', { required: "Special Message is required" })}
                        rows={3}
                        className={clsx("form-control", errors.profile?.special_message && "is-invalid")}
                        placeholder="Any specific requests or message for companies..."
                    />
                    {errors.profile?.special_message && (
                        <div className="invalid-feedback">{errors.profile.special_message.message}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
