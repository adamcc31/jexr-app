import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('candidate');
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
                    <h5 className="mb-4">{t('professional.professionalSummary')}</h5>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">{t('professional.professionalTitle')} <span className="text-danger">*</span></label>
                            <input
                                {...register('profile.title', { required: t('professional.professionalTitleRequired'), minLength: { value: 3, message: t('professional.minCharacters', { count: 3 }) } })}
                                className={clsx("form-control", errors.profile?.title && "is-invalid")}
                                placeholder={t('professional.professionalTitlePlaceholder')}
                            />
                            {errors.profile?.title && <div className="invalid-feedback">{errors.profile.title.message}</div>}
                        </div>

                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">{t('professional.professionalBio')} <span className="text-danger">*</span></label>
                            <textarea
                                {...register('profile.bio', { required: t('professional.professionalBioRequired'), minLength: { value: 10, message: t('professional.minCharactersMessage', { count: 10 }) } })}
                                rows={3}
                                className={clsx("form-control", errors.profile?.bio && "is-invalid")}
                                placeholder={t('professional.professionalBioPlaceholder')}
                            />
                            {errors.profile?.bio && <div className="invalid-feedback">{errors.profile.bio.message}</div>}
                        </div>

                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">{t('professional.additionalPortfolio')} <span className="text-muted small">({t('settings.optional')})</span></label>
                            <input
                                {...register('profile.resume_url')}
                                className="form-control"
                                placeholder={t('professional.additionalPortfolioPlaceholder')}
                            />
                            <div className="form-text text-muted">
                                {t('professional.portfolioHelp')}
                                <strong> {t('professional.portfolioNote')}</strong>
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
                        {t('professional.saveProfile')}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}

