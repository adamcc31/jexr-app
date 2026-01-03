import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { CandidateWithFullDetails, Skill } from '@/types/candidate';
import clsx from 'clsx';

interface Props {
    masterSkills: Skill[];
}

export function SkillSetForm({ masterSkills }: Props) {
    const { register, formState: { errors } } = useFormContext<CandidateWithFullDetails>();

    // Group skills by category, excluding COMPUTER (handled separately)
    const skillsByCategory = useMemo(() => {
        const groups: Record<string, Skill[]> = {};
        masterSkills
            .filter(skill => skill.category !== 'COMPUTER') // Exclude computer skills
            .forEach(skill => {
                const cat = skill.category || 'Other';
                if (!groups[cat]) groups[cat] = [];
                groups[cat].push(skill);
            });
        return groups;
    }, [masterSkills]);

    return (
        <div className="mb-0">
            <h5 className="mb-4">Skills & Expertise</h5>

            <div className="vstack gap-4">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category} className="card border-0 bg-light p-3">
                        <small className="text-uppercase text-muted fw-bold mb-2 d-block">{category}</small>
                        <div className="d-flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <div key={skill.id} className="form-check form-check-inline m-0">
                                    <input
                                        type="checkbox"
                                        id={`skill-${skill.id}`}
                                        value={skill.id}
                                        {...register('skill_ids')}
                                        className="btn-check"
                                    />
                                    <label
                                        className="btn btn-sm btn-outline-primary rounded-pill"
                                        htmlFor={`skill-${skill.id}`}
                                    >
                                        {skill.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <label className="form-label fw-semibold">Other Skills <span className="text-danger">*</span></label>
                <div className="form-text mb-2">
                    Enter any other skills not listed above. Separate multiple skills with commas.
                </div>
                <textarea
                    {...register('profile.skills_other', { required: "Please describe your other skills or type 'None'" })}
                    rows={3}
                    className={clsx("form-control", errors.profile?.skills_other && "is-invalid")}
                    placeholder="e.g. Critical Thinking, Public Speaking, Fortran"
                />
                {errors.profile?.skills_other && (
                    <div className="invalid-feedback">{errors.profile.skills_other.message}</div>
                )}
            </div>
        </div>
    );
}
