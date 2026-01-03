import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { CandidateWithFullDetails } from '@/types/candidate';
import { EducationForm } from './EducationForm';
import { WorkExperienceForm } from './WorkExperienceForm';
import { SkillSetForm } from './SkillSetForm';
import { ComputerSkillForm } from './ComputerSkillForm';
import { LanguageCertificateForm } from './LanguageCertificateForm';
import { SoftSkillForm } from './SoftSkillForm';
import { JobPreferencesForm } from './JobPreferencesForm';
import { FiLoader } from 'react-icons/fi';
import clsx from 'clsx';

export function ProfessionalProfile() {
    const { profile, masterSkills, loading, saving, saveProfile } = useCandidateProfile();

    const methods = useForm<CandidateWithFullDetails>({
        defaultValues: {
            profile: {
                title: '',
                bio: '',
                highest_education: '',
                major_field: '',
                desired_job_position: '',
                desired_job_position_other: '',
                preferred_work_environment: '',
                career_goals_3y: '',
                special_message: '',
                skills_other: '',
                resume_url: '',
                main_concerns_returning: [],
            },
            details: {
                soft_skills_description: '',
                applied_work_values: '',
                major_achievements: ''
            },
            work_experiences: [],
            certificates: [],
            skill_ids: [],
        }
    });

    const { register, formState: { errors } } = methods;

    // Reset form when profile loads
    useEffect(() => {
        if (profile) {
            // Convert skill_ids to strings for checkbox value compatibility
            // HTML checkbox values are always strings, so we need to match types
            methods.reset({
                ...profile,
                skill_ids: (profile.skill_ids || []).map(id => String(id)) as unknown as number[]
            });
        }
    }, [profile, methods]);

    const onSubmit = (data: CandidateWithFullDetails) => {
        // Convert skill_ids from strings to numbers (HTML checkboxes return strings)
        const transformedData = {
            ...data,
            skill_ids: (data.skill_ids || []).map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id)),
            certificates: data.certificates || [],
            work_experiences: data.work_experiences || [],
        };
        saveProfile(transformedData);
    };

    if (loading) {
        return <div className="text-center p-5"><FiLoader className="animate-spin text-primary mx-auto" size={30} /></div>;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>

                {/* Professional Summary Section */}
                <div className="rounded shadow p-4 bg-white mb-4">
                    <h5 className="mb-4">Professional Summary</h5>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">Professional Title <span className="text-danger">*</span></label>
                            <input
                                {...register('profile.title', { required: "Professional Title is required", minLength: { value: 3, message: "Minimum 3 characters" } })}
                                className={clsx("form-control", errors.profile?.title && "is-invalid")}
                                placeholder="e.g. Senior Mechanical Engineer"
                            />
                            {errors.profile?.title && <div className="invalid-feedback">{errors.profile.title.message}</div>}
                        </div>

                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">Professional Bio <span className="text-danger">*</span></label>
                            <textarea
                                {...register('profile.bio', { required: "Professional Bio is required", minLength: { value: 10, message: "Please provide at least 10 characters" } })}
                                rows={3}
                                className={clsx("form-control", errors.profile?.bio && "is-invalid")}
                                placeholder="Brief summary of your professional background..."
                            />
                            {errors.profile?.bio && <div className="invalid-feedback">{errors.profile.bio.message}</div>}
                        </div>

                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">Additional Portfolio Links <span className="text-muted small">(Optional)</span></label>
                            <input
                                {...register('profile.resume_url')}
                                className="form-control"
                                placeholder="https://linkedin.com/in/... or https://github.com/..."
                            />
                            <div className="form-text text-muted">
                                Additional online portfolio links (LinkedIn, GitHub, etc).
                                <strong> Note:</strong> Your CV document is uploaded in the Identity &amp; Verification tab.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Components */}
                <div className="rounded shadow p-4 bg-white mb-4">
                    <EducationForm />
                </div>

                <div className="rounded shadow p-4 bg-white mb-4">
                    <WorkExperienceForm />
                </div>

                <div className="rounded shadow p-4 bg-white mb-4">
                    <SkillSetForm masterSkills={masterSkills} />
                </div>

                <div className="rounded shadow p-4 bg-white mb-4">
                    <ComputerSkillForm masterSkills={masterSkills} />
                </div>

                <div className="rounded shadow p-4 bg-white mb-4">
                    <LanguageCertificateForm />
                </div>

                <div className="rounded shadow p-4 bg-white mb-4">
                    <JobPreferencesForm />
                </div>

                <div className="rounded shadow p-4 bg-white mb-4">
                    <SoftSkillForm />
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary w-100 py-3 text-uppercase fw-bold"
                        style={{ backgroundColor: '#0f172a', borderColor: '#0f172a' }}
                    >
                        {saving && <FiLoader className="animate-spin me-2" size={16} />}
                        Save Professional Profile
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}
