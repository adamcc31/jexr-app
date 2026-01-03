import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { CandidateWithFullDetails, Skill } from '@/types/candidate';
import clsx from 'clsx';

interface Props {
    masterSkills: Skill[];
}

export function ComputerSkillForm({ masterSkills }: Props) {
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
            <h5 className="mb-4">Computer Skills</h5>

            <div className="card border-0 bg-light p-3">
                <small className="text-uppercase text-muted fw-bold mb-2 d-block">
                    Technical & Software Skills
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
                <label className="form-label fw-semibold">Other Computer Skills</label>
                <div className="form-text mb-2">
                    List any other software or technical skills not shown above (comma-separated).
                </div>
                <textarea
                    {...register('profile.skills_other')}
                    rows={2}
                    className={clsx("form-control", errors.profile?.skills_other && "is-invalid")}
                    placeholder="e.g. Figma, Adobe Premiere, Python, etc."
                />
            </div>
        </div>
    );
}
