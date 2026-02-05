"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import "react-image-crop/dist/ReactCrop.css";
import { useTranslation } from "react-i18next";

import Navbar from "../../../components/navbarCandidate";
import clsx from "clsx";
import { apiClient } from "@/lib/api";
import { ProfessionalProfile } from "@/components/profile/ProfessionalProfile";
import { getOnboardingData, type OnboardingData } from "@/lib/candidate-api";
import { INTEREST_OPTIONS, COMPANY_PREFERENCE_OPTIONS } from "@/types/onboarding";

// --- Constants for HR Data Options ---

const MARITAL_STATUS_OPTIONS = ["SINGLE", "MARRIED", "DIVORCED"] as const;
const GENDER_OPTIONS = ["MALE", "FEMALE"] as const;
const JAPANESE_SPEAKING_LEVEL_OPTIONS = ["NATIVE", "FLUENT", "BASIC", "PASSIVE"] as const;
const RELIGION_OPTIONS = [
    { value: "ISLAM", label: "Islam" },
    { value: "KRISTEN", label: "Kristen (Protestan)" },
    { value: "KATOLIK", label: "Katolik" },
    { value: "HINDU", label: "Hindu" },
    { value: "BUDDHA", label: "Buddha" },
    { value: "KONGHUCU", label: "Konghucu" },
    { value: "OTHER", label: "Lainnya" },
] as const;

// Main Job Fields - Technical skills from Japan for Leader/Foreman positions
const MAIN_JOB_FIELD_OPTIONS = [
    { value: "WELDING", label: "Welding (TIG, MIG, MAG, Spot Welding)" },
    { value: "MACHINING_CNC", label: "Machining/CNC Operator (Lathe, Milling)" },
    { value: "PRESS_STAMPING", label: "Press/Metal Stamping (Metal molding press/car body)" },
    { value: "PLASTIC_INJECTION", label: "Plastic Injection/Molding (Electronics/Automotive parts)" },
    { value: "ASSEMBLY", label: "Assembly (Electronics or Automotive)" },
    { value: "QUALITY_CONTROL", label: "Quality Control (QC) & Inspection" },
    { value: "PAINTING", label: "Painting (Spray painting of bodies/parts)" },
    { value: "MAINTENANCE", label: "Maintenance/Mechanical Technician (Factory/Electrical machinery)" },
    { value: "FORKLIFT_LOGISTICS", label: "Forklift & Logistics (Warehouse/Shipping)" },
    { value: "DIE_CASTING", label: "Die Casting/Metal Casting" },
    { value: "FOOD_PROCESSING", label: "Food Processing (Bakery, bento, fish factory)" },
    { value: "AGRICULTURE", label: "Agriculture (Modern plantation)" },
    { value: "CAREGIVER", label: "Caregiver/Kaigo (Elderly Care)" },
    { value: "INTERPRETER", label: "Interpreter/Translator (Oral/Document Translation)" },
    { value: "CONSTRUCTION", label: "Construction/Scaffolding (Building Construction)" },
] as const;

// Preferred Locations - Japanese Industrial Estates in Indonesia
const PREFERRED_LOCATION_OPTIONS = [
    { value: "CIKARANG_CIBITUNG", label: "Cikarang & Cibitung (MM2100, Jababeka, EJIP)" },
    { value: "KARAWANG", label: "Karawang (KIIC, Suryacipta - Toyota/Daihatsu Base)" },
    { value: "JAKARTA", label: "Jakarta Area (Office/Sales/Interpreter positions)" },
    { value: "BEKASI", label: "Bekasi City & North (Pondok Ungu, Bantargebang)" },
    { value: "TANGERANG_BANTEN", label: "Tangerang & Banten (Cikupa, Balaraja, Cilegon)" },
    { value: "BOGOR", label: "Bogor & Surrounding (Sentul, Cileungsi, Gunung Putri)" },
    { value: "PURWAKARTA_SUBANG", label: "Purwakarta & Subang (New Industrial Areas)" },
    { value: "SURABAYA_GRESIK", label: "Surabaya & Gresik (PIER/Rungkut/JIIPE)" },
    { value: "BATAM_RIAU", label: "Batam & Riau Islands (Electronics/Semiconductor)" },
    { value: "CENTRAL_JAVA", label: "Central Java (Semarang/Kendal - Garment/Textiles)" },
    { value: "ANYWHERE", label: "Willing to be Placed Anywhere ⭐" },
] as const;

// Preferred Industries - Based on candidate's Japan experience
const PREFERRED_INDUSTRY_OPTIONS = [
    { value: "AUTOMOTIVE", label: "Automotive Manufacturing (Cars, Motorcycles, Spare Parts) ⭐" },
    { value: "ELECTRONICS", label: "Electronics & Semiconductor (Printers, Chips, Audio)" },
    { value: "FOOD_BEVERAGE", label: "Food & Beverage Manufacturing (F&B Industry)" },
    { value: "METAL_MACHINERY", label: "Metal & Heavy Machinery (Heavy Machinery, Steel)" },
    { value: "CONSTRUCTION", label: "Construction & Civil Engineering (Japanese Contractors)" },
    { value: "LOGISTICS", label: "Logistics, Warehousing & Trading" },
    { value: "HEALTHCARE", label: "Healthcare & Caregivers (Hospitals/Nursing Homes)" },
    { value: "CHEMICALS_PLASTICS", label: "Chemicals, Plastics & Rubber (Tires, Polymers)" },
    { value: "TEXTILES", label: "Textiles & Garments (Clothing, Shoes)" },
    { value: "SERVICES", label: "Services & Consulting (Recruitment, Visa, Agency)" },
] as const;

// --- API & Types for Verification (Identity) ---

type AccountVerification = {
    id: number;
    user_id: string;
    status: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";
    first_name: string;
    last_name: string;
    profile_picture_url: string;
    occupation: string;
    phone: string;
    website_url: string;
    intro: string;
    japan_experience_duration: number;
    japanese_certificate_url: string;
    cv_url: string;
    portfolio_url?: string;
    japanese_level: string;

    // HR Candidate Data: Identity & Demographics
    birth_date?: string;
    gender?: typeof GENDER_OPTIONS[number];
    domicile_city?: string;
    marital_status?: typeof MARITAL_STATUS_OPTIONS[number];
    children_count?: number;

    // HR Candidate Data: Core Competencies
    main_job_fields?: string[];
    golden_skill?: string;
    japanese_speaking_level?: typeof JAPANESE_SPEAKING_LEVEL_OPTIONS[number];

    // HR Candidate Data: Physical Attributes
    height_cm?: number;
    weight_kg?: number;
    religion?: string;

    // JLPT Certificate Extension
    jlpt_certificate_issue_year?: number;

    // HR Candidate Data: Expectations & Availability
    expected_salary?: number;
    japan_return_date?: string;
    available_start_date?: string;
    preferred_locations?: string[];
    preferred_industries?: string[];
};

// --- Validation Schema for Identity ---

const schema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    occupation: z.string().min(1, "Occupation is required"),
    japan_experience_duration: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).refine(val => val > 0, "Japan experience duration is required"),
    intro: z.string().min(1, "Intro/Bio is required"),

    // File URLs
    profile_picture_url: z.string().min(1, "Profile picture is required"),
    japanese_certificate_url: z.string().min(1, "JLPT Certificate is required"),
    cv_url: z.string().min(1, "CV/Resume document is required"),
    portfolio_url: z.string().optional(), // Only optional field

    // Contact
    phone: z.string().min(1, "Phone number is required"),
    website_url: z.string().optional(), // Optional - not rendered in form

    // Japanese Level
    japanese_level: z.string().min(1, "Japanese Level (JLPT) is required"),

    // HR Candidate Data: Identity & Demographics
    birth_date: z.string().min(1, "Date of birth is required"),
    gender: z.string().refine((val) => GENDER_OPTIONS.includes(val as typeof GENDER_OPTIONS[number]), "Gender is required"),
    domicile_city: z.string().min(1, "Domicile city is required"),
    marital_status: z.string().refine((val) => MARITAL_STATUS_OPTIONS.includes(val as typeof MARITAL_STATUS_OPTIONS[number]), "Marital status is required"),
    children_count: z.union([z.string(), z.number()]).transform((val) => Number(val)).refine(val => val >= 0, "Children count is required"),

    // HR Candidate Data: Core Competencies
    main_job_fields: z.array(z.string()).min(1, "At least one main job field is required"),
    golden_skill: z.string().min(1, "Golden skill is required"),
    japanese_speaking_level: z.string().refine((val) => JAPANESE_SPEAKING_LEVEL_OPTIONS.includes(val as typeof JAPANESE_SPEAKING_LEVEL_OPTIONS[number]), "Japanese speaking level is required"),

    // HR Candidate Data: Physical Attributes (required)
    height_cm: z.union([z.string(), z.number()]).transform((val) => Number(val)).refine(val => val > 0, "Height is required"),
    weight_kg: z.union([z.string(), z.number()]).transform((val) => Number(val)).refine(val => val > 0, "Weight is required"),
    religion: z.string().min(1, "Religion is required"),

    // JLPT Certificate Extension (optional)
    jlpt_certificate_issue_year: z.union([z.string(), z.number()]).transform((val) => Number(val) || undefined).optional(),

    // HR Candidate Data: Expectations & Availability
    expected_salary: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).refine(val => val > 0, "Expected salary is required"),
    japan_return_date: z.string().min(1, "Japan return date is required"),
    available_start_date: z.string().min(1, "Available start date is required"),
    preferred_locations: z.array(z.string()).min(1, "At least one preferred location is required"),
    preferred_industries: z.array(z.string()).min(1, "At least one preferred industry is required"),
});

type FormData = z.infer<typeof schema>;

// Helper for image compression
const compressImage = async (file: File, maxSizeKB: number = 1024): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 1200;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = (height / width) * maxDim;
                        width = maxDim;
                    } else {
                        width = (width / height) * maxDim;
                        height = maxDim;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                let quality = 0.9;
                const tryCompress = () => {
                    canvas.toBlob((blob) => {
                        if (!blob) { reject(new Error('Compression failed')); return; }
                        if (blob.size > maxSizeKB * 1024 && quality > 0.1) { quality -= 0.1; tryCompress(); }
                        else { resolve(blob); }
                    }, 'image/jpeg', quality
                    );
                };
                tryCompress();
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function CandidateProfileSetting() {
    const { t } = useTranslation('candidate');
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);

    // Read tab from URL query parameter (supports ?tab=professional from modal navigation)
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialTab = searchParams?.get('tab') === 'professional' ? 'professional' : 'identity';
    const [activeTab, setActiveTab] = useState<'identity' | 'professional'>(initialTab);

    // 1. Fetch Verification Data
    const { data: profileData, isLoading } = useQuery<{ verification: AccountVerification }>({
        queryKey: ["candidateVerification"],
        queryFn: async () => {
            const res = await apiClient.get("/candidates/me/verification");
            return res.data.data;
        },
    });

    // 1b. Fetch Onboarding Data (read-only)
    const { data: onboardingData } = useQuery<OnboardingData>({
        queryKey: ["onboardingData"],
        queryFn: getOnboardingData,
    });

    // Helper: Format onboarding interests for display
    const getInterestLabels = (keys: string[] | undefined) => {
        if (!keys || keys.length === 0) return t('settings.notSpecified');
        return keys.map(k => INTEREST_OPTIONS.find(o => o.key === k)?.label || k).join(', ');
    };

    // Helper: Format company preferences for display
    const getCompanyPrefLabels = (keys: string[] | undefined) => {
        if (!keys || keys.length === 0) return t('settings.notSpecified');
        return keys.map(k => COMPANY_PREFERENCE_OPTIONS.find(o => o.key === k)?.label || k).join(', ');
    };

    // Helper: Get LPK display name
    const getLPKDisplayName = (data: OnboardingData | undefined) => {
        if (!data) return t('settings.notSpecified');
        if (data.lpk_selection?.none) return t('settings.noLpkTraining');
        if (data.lpk_name) return data.lpk_name;
        if (data.lpk_selection?.other_name) return data.lpk_selection.other_name;
        return t('settings.notSpecified');
    };

    // 2. Identity Form
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { register, control, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<FormData>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            japan_experience_duration: 0,
            children_count: 0,
            expected_salary: 0,
            main_job_fields: [],
            preferred_locations: [],
            preferred_industries: [],
        },
    });

    // Pre-fill Identity
    useEffect(() => {
        if (profileData && profileData.verification) {
            const v = profileData.verification;
            // Basic fields
            setValue("first_name", v.first_name || "");
            setValue("last_name", v.last_name || "");
            setValue("occupation", v.occupation || "");
            setValue("japan_experience_duration", v.japan_experience_duration || 0);
            setValue("intro", v.intro || "");
            setValue("phone", v.phone || "");
            setValue("website_url", v.website_url || "");
            setValue("profile_picture_url", v.profile_picture_url || "");
            setValue("japanese_certificate_url", v.japanese_certificate_url || "");
            setValue("cv_url", v.cv_url || "");
            setValue("portfolio_url", v.portfolio_url || "");
            setValue("japanese_level", v.japanese_level || "");

            // HR Candidate Data: Identity & Demographics
            setValue("birth_date", v.birth_date ? v.birth_date.split('T')[0] : "");
            setValue("gender", v.gender || "");
            setValue("domicile_city", v.domicile_city || "");
            setValue("marital_status", v.marital_status || "");
            setValue("children_count", v.children_count || 0);

            // HR Candidate Data: Core Competencies
            setValue("main_job_fields", v.main_job_fields || []);
            setValue("golden_skill", v.golden_skill || "");
            setValue("japanese_speaking_level", v.japanese_speaking_level || "");

            // HR Candidate Data: Physical Attributes
            setValue("height_cm", v.height_cm || undefined);
            setValue("weight_kg", v.weight_kg || undefined);
            setValue("religion", v.religion || "");

            // JLPT Certificate Extension
            setValue("jlpt_certificate_issue_year", v.jlpt_certificate_issue_year || undefined);

            // HR Candidate Data: Expectations & Availability
            setValue("expected_salary", v.expected_salary || 0);
            setValue("japan_return_date", v.japan_return_date ? v.japan_return_date.split('T')[0] : "");
            setValue("available_start_date", v.available_start_date ? v.available_start_date.split('T')[0] : "");
            setValue("preferred_locations", v.preferred_locations || []);
            setValue("preferred_industries", v.preferred_industries || []);
        }
    }, [profileData, setValue]);

    const updateMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const payload = {
                verification: {
                    // Basic fields
                    first_name: data.first_name,
                    last_name: data.last_name,
                    occupation: data.occupation,
                    japan_experience_duration: Number(data.japan_experience_duration),
                    intro: data.intro,
                    phone: data.phone,
                    website_url: data.website_url,
                    profile_picture_url: data.profile_picture_url,
                    japanese_certificate_url: data.japanese_certificate_url,
                    cv_url: data.cv_url,
                    portfolio_url: data.portfolio_url,
                    japanese_level: data.japanese_level,

                    // HR Candidate Data: Identity & Demographics
                    birth_date: data.birth_date ? new Date(data.birth_date).toISOString() : null,
                    gender: data.gender || null,
                    domicile_city: data.domicile_city || null,
                    marital_status: data.marital_status || null,
                    children_count: data.marital_status === "MARRIED" ? Number(data.children_count) : 0,

                    // HR Candidate Data: Core Competencies
                    main_job_fields: data.main_job_fields || [],
                    golden_skill: data.golden_skill || null,
                    japanese_speaking_level: data.japanese_speaking_level || null,

                    // HR Candidate Data: Physical Attributes
                    height_cm: data.height_cm ? Number(data.height_cm) : null,
                    weight_kg: data.weight_kg ? Number(data.weight_kg) : null,
                    religion: data.religion || null,

                    // JLPT Certificate Extension
                    jlpt_certificate_issue_year: data.jlpt_certificate_issue_year ? Number(data.jlpt_certificate_issue_year) : null,

                    // HR Candidate Data: Expectations & Availability
                    expected_salary: Number(data.expected_salary) || null,
                    japan_return_date: data.japan_return_date ? new Date(data.japan_return_date).toISOString() : null,
                    available_start_date: data.available_start_date ? new Date(data.available_start_date).toISOString() : null,
                    preferred_locations: data.preferred_locations || [],
                    preferred_industries: data.preferred_industries || [],
                }
            };
            const res = await apiClient.put("/candidates/me/verification", payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["candidateVerification"] });
            Swal.fire({ icon: 'success', title: t('settings.saved'), timer: 1500, showConfirmButton: false });
        },
        onError: (err) => {
            console.error(err);
            Swal.fire({ icon: 'error', title: t('settings.error'), text: t('settings.failedToSave') });
        }
    });

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: "profile_picture_url" | "japanese_certificate_url" | "cv_url") => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (field === "profile_picture_url" && file.type.startsWith("image/")) {
            try {
                const compressed = await compressImage(file, 1024);
                const formData = new FormData();
                formData.append("file", compressed, file.name);
                const currentUrl = watch(field);
                const oldUrlParam = currentUrl ? `&old_url=${encodeURIComponent(currentUrl)}` : "";
                setUploading(true);
                const res = await apiClient.post(`/upload?bucket=Profile_Picture${oldUrlParam}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
                setValue(field, res.data.data.url);
                Swal.fire({ icon: 'success', title: 'Uploaded', timer: 1000, showConfirmButton: false });
            } catch (e) { console.error(e); } finally { setUploading(false); }
            return;
        }

        const bucketMap: Record<string, string> = { profile_picture_url: "Profile_Picture", japanese_certificate_url: "JLPT", cv_url: "CV" };
        const formData = new FormData();
        formData.append("file", file);
        const currentUrl = watch(field);
        const oldUrlParam = currentUrl ? `&old_url=${encodeURIComponent(currentUrl)}` : "";
        setUploading(true);
        try {
            const res = await apiClient.post(`/upload?bucket=${bucketMap[field]}${oldUrlParam}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            setValue(field, res.data.data.url);
            Swal.fire({ icon: 'success', title: 'Uploaded', timer: 1000, showConfirmButton: false });
        } catch (e) { console.error(e); } finally { setUploading(false); }
    };

    const watchedProfilePic = watch("profile_picture_url");
    const watchedCert = watch("japanese_certificate_url");
    const watchedCvUrl = watch("cv_url");
    const watchedMaritalStatus = watch("marital_status");

    if (isLoading) return <div className="text-center p-10">{t('common.loading')}</div>;

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={false} />
            <section className="section bg-gray-50 min-h-screen pt-24 pb-12">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10">

                            <div className="nav nav-pills nav-justified mb-4 bg-white p-2 rounded shadow-sm">
                                <button
                                    onClick={() => setActiveTab('identity')}
                                    className={clsx("nav-link", activeTab === 'identity' && "active")}
                                    type="button"
                                >
                                    {t('settings.identityTab')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('professional')}
                                    className={clsx("nav-link", activeTab === 'professional' && "active")}
                                    type="button"
                                >
                                    {t('settings.professionalTab')}
                                </button>
                            </div>

                            {activeTab === 'identity' ? (
                                <div className="rounded shadow p-4 bg-white">
                                    <h5 className="mb-4">{t('settings.identityVerification')}</h5>
                                    {profileData?.verification?.status === 'SUBMITTED' && (
                                        <div className="alert alert-success">{t('settings.profileSubmitted')}</div>
                                    )}

                                    <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))}>
                                        {/* Profile Picture */}
                                        <div className="row mb-4">
                                            <div className="col-12 text-center">
                                                <label className="form-label fw-semibold">
                                                    {t('settings.profilePicture')} <span className="text-danger">*</span>
                                                </label>
                                                <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#f0f0f0', margin: '0 auto', overflow: 'hidden', border: errors.profile_picture_url ? '2px solid #dc3545' : 'none' }}>
                                                    {watchedProfilePic ? <img src={watchedProfilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="d-flex align-items-center justify-content-center h-100 text-muted">{t('settings.noImage')}</div>}
                                                </div>
                                                <label className="btn btn-sm btn-primary mt-2">
                                                    {uploading ? "..." : t('settings.changePicture')}
                                                    <input type="file" className="d-none" accept="image/*" onChange={(e) => handleFileUpload(e, "profile_picture_url")} />
                                                </label>
                                                {errors.profile_picture_url && (
                                                    <div className="text-danger small mt-1">{errors.profile_picture_url.message}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Personal Details */}
                                        <h6 className="text-muted mb-3">{t('settings.personalDetails')}</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.firstName')} <span className="text-danger">*</span></label>
                                                <input {...register("first_name")} className={clsx("form-control", errors.first_name && "is-invalid")} />
                                                {errors.first_name && <div className="invalid-feedback">{errors.first_name.message}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.lastName')} <span className="text-danger">*</span></label>
                                                <input {...register("last_name")} className={clsx("form-control", errors.last_name && "is-invalid")} />
                                                {errors.last_name && <div className="invalid-feedback">{errors.last_name.message}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.phone')} <span className="text-danger">*</span></label>
                                                <input {...register("phone")} className={clsx("form-control", errors.phone && "is-invalid")} />
                                                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.occupation')} <span className="text-danger">*</span></label>
                                                <input {...register("occupation")} className={clsx("form-control", errors.occupation && "is-invalid")} />
                                                {errors.occupation && <div className="invalid-feedback">{errors.occupation.message}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.birthDate')} <span className="text-danger">*</span></label>
                                                <input type="date" {...register("birth_date")} className={clsx("form-control", errors.birth_date && "is-invalid")} />
                                                {errors.birth_date && <div className="invalid-feedback">{errors.birth_date.message}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.domicileCity')} <span className="text-danger">*</span></label>
                                                <input {...register("domicile_city")} className={clsx("form-control", errors.domicile_city && "is-invalid")} />
                                                {errors.domicile_city && <div className="invalid-feedback">{errors.domicile_city.message}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.gender')} <span className="text-danger">*</span></label>
                                                <select {...register("gender")} className="form-control">
                                                    <option value="">{t('settings.select')}</option>
                                                    <option value="MALE">{t('settings.male')}</option>
                                                    <option value="FEMALE">{t('settings.female')}</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.maritalStatus')} <span className="text-danger">*</span></label>
                                                <select {...register("marital_status")} className="form-control">
                                                    <option value="">{t('settings.select')}</option>
                                                    {MARITAL_STATUS_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.childrenCount')} <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    {...register("children_count")}
                                                    className="form-control"
                                                    disabled={watchedMaritalStatus !== "MARRIED"}
                                                    min={0}
                                                />
                                                {watchedMaritalStatus !== "MARRIED" && (
                                                    <small className="text-muted">{t('settings.marriedOnly')}</small>
                                                )}
                                            </div>
                                        </div>

                                        {/* Physical Attributes */}
                                        <h6 className="text-muted mb-3 mt-4">Detail Fisik</h6>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Tinggi Badan <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    {...register("height_cm")}
                                                    className={clsx("form-control", errors.height_cm && "is-invalid")}
                                                    min={50}
                                                    max={300}
                                                    placeholder="e.g. 165"
                                                />
                                                {errors.height_cm && <div className="invalid-feedback">{errors.height_cm.message}</div>}
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Berat Badan <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    {...register("weight_kg")}
                                                    className={clsx("form-control", errors.weight_kg && "is-invalid")}
                                                    min={10}
                                                    max={500}
                                                    step="0.1"
                                                    placeholder="e.g. 60"
                                                />
                                                {errors.weight_kg && <div className="invalid-feedback">{errors.weight_kg.message}</div>}
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Agama <span className="text-danger">*</span></label>
                                                <select {...register("religion")} className={clsx("form-control", errors.religion && "is-invalid")}>
                                                    <option value="">{t('settings.select')}</option>
                                                    {RELIGION_OPTIONS.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                                {errors.religion && <div className="invalid-feedback">{errors.religion.message}</div>}
                                            </div>
                                        </div>

                                        {/* Japan Experience & Language */}
                                        <h6 className="text-muted mb-3 mt-4">{t('settings.japanExperienceSection')}</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.japanExperience')} <span className="text-danger">*</span></label>
                                                <input type="number" {...register("japan_experience_duration")} className="form-control" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.japaneseLevel')} <span className="text-danger">*</span></label>
                                                <select {...register("japanese_level")} className="form-control">
                                                    <option value="">{t('settings.select')}</option>
                                                    <option value="N5">N5</option>
                                                    <option value="N4">N4</option>
                                                    <option value="N3">N3</option>
                                                    <option value="N2">N2</option>
                                                    <option value="N1">N1</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.japaneseSpeakingLevel')} <span className="text-danger">*</span></label>
                                                <select {...register("japanese_speaking_level")} className="form-control">
                                                    <option value="">{t('settings.select')}</option>
                                                    {JAPANESE_SPEAKING_LEVEL_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.jlptCertificate')} <span className="text-danger">*</span></label>
                                                <input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, "japanese_certificate_url")} />
                                                {watchedCert && <small className="text-success"><i className="mdi mdi-check-circle"></i> {t('common.uploaded')}</small>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Tahun Sertifikat JLPT <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    {...register("jlpt_certificate_issue_year")}
                                                    className={clsx("form-control", errors.jlpt_certificate_issue_year && "is-invalid")}
                                                    min={1984}
                                                    max={new Date().getFullYear()}
                                                    placeholder="e.g. 2023"
                                                />
                                                {errors.jlpt_certificate_issue_year && <div className="invalid-feedback">{errors.jlpt_certificate_issue_year.message}</div>}
                                            </div>
                                        </div>

                                        {/* Core Competencies */}
                                        <h6 className="text-muted mb-3 mt-4">{t('settings.coreCompetencies')}</h6>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">{t('settings.mainJobFields')} <span className="text-danger">*</span> <span className="text-muted small">({t('settings.selectAll')})</span></label>
                                                <Controller
                                                    name="main_job_fields"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {MAIN_JOB_FIELD_OPTIONS.map(opt => (
                                                                <label key={opt.value} className={clsx(
                                                                    "badge px-3 py-2 cursor-pointer",
                                                                    field.value?.includes(opt.value) ? "bg-primary text-white" : "bg-light text-dark border"
                                                                )} style={{ cursor: 'pointer' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="d-none"
                                                                        checked={field.value?.includes(opt.value) || false}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.checked
                                                                                ? [...(field.value || []), opt.value]
                                                                                : (field.value || []).filter((v: string) => v !== opt.value);
                                                                            field.onChange(newValue);
                                                                        }}
                                                                    />
                                                                    {opt.label}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label className="form-label">{t('settings.goldenSkill')} <span className="text-danger">*</span> <span className="text-muted small">({t('settings.strongestSkill')})</span></label>
                                                <input {...register("golden_skill")} className="form-control" placeholder={t('settings.goldenSkillPlaceholder')} />
                                            </div>
                                        </div>

                                        {/* Expectations & Availability */}
                                        <h6 className="text-muted mb-3 mt-4">{t('settings.expectationsSection')}</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.expectedSalary')} <span className="text-danger">*</span></label>
                                                <input type="number" {...register("expected_salary")} className="form-control" placeholder={t('settings.salaryPlaceholder')} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.japanReturnDate')} <span className="text-danger">*</span></label>
                                                <input type="date" {...register("japan_return_date")} className="form-control" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.availableStartDate')} <span className="text-danger">*</span></label>
                                                <input type="date" {...register("available_start_date")} className="form-control" />
                                            </div>
                                        </div>

                                        {/* Preferred Locations */}
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">{t('settings.preferredLocations')} <span className="text-danger">*</span> <span className="text-muted small">({t('settings.selectAll')})</span></label>
                                                <Controller
                                                    name="preferred_locations"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {PREFERRED_LOCATION_OPTIONS.map(opt => (
                                                                <label key={opt.value} className={clsx(
                                                                    "badge px-3 py-2",
                                                                    field.value?.includes(opt.value) ? "bg-info text-white" : "bg-light text-dark border"
                                                                )} style={{ cursor: 'pointer' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="d-none"
                                                                        checked={field.value?.includes(opt.value) || false}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.checked
                                                                                ? [...(field.value || []), opt.value]
                                                                                : (field.value || []).filter((v: string) => v !== opt.value);
                                                                            field.onChange(newValue);
                                                                        }}
                                                                    />
                                                                    {opt.label}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Preferred Industries */}
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">{t('settings.preferredIndustries')} <span className="text-danger">*</span> <span className="text-muted small">({t('settings.selectAll')})</span></label>
                                                <Controller
                                                    name="preferred_industries"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {PREFERRED_INDUSTRY_OPTIONS.map(opt => (
                                                                <label key={opt.value} className={clsx(
                                                                    "badge px-3 py-2",
                                                                    field.value?.includes(opt.value) ? "bg-success text-white" : "bg-light text-dark border"
                                                                )} style={{ cursor: 'pointer' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="d-none"
                                                                        checked={field.value?.includes(opt.value) || false}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.checked
                                                                                ? [...(field.value || []), opt.value]
                                                                                : (field.value || []).filter((v: string) => v !== opt.value);
                                                                            field.onChange(newValue);
                                                                        }}
                                                                    />
                                                                    {opt.label}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <h6 className="text-muted mb-3 mt-4">{t('settings.documents')}</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.cvDocument')} <span className="text-danger">*</span></label>
                                                <input type="file" className={clsx("form-control", errors.cv_url && "is-invalid")} accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, "cv_url")} />
                                                {watchedCvUrl && <small className="text-success"><i className="mdi mdi-check-circle"></i> {t('common.uploaded')}</small>}
                                                {errors.cv_url && <div className="invalid-feedback d-block">{errors.cv_url.message}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('settings.portfolioUrl')} <span className="text-muted small">({t('settings.optional')})</span></label>
                                                <input {...register("portfolio_url")} className="form-control" placeholder="https://linkedin.com/in/..." />
                                            </div>
                                        </div>

                                        {/* Intro */}
                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">{t('settings.introBio')} <span className="text-danger">*</span></label>
                                                <textarea {...register("intro")} className="form-control" rows={3} placeholder={t('settings.introPlaceholder')} />
                                            </div>
                                        </div>

                                        {/* Onboarding Data Section - Read Only */}
                                        {onboardingData && (
                                            <div className="mt-4 pt-4 border-top">
                                                <h6 className="text-muted mb-3">
                                                    <i className="mdi mdi-lock-outline me-2"></i>
                                                    {t('settings.onboardingInfo')} <small className="text-muted">({t('settings.readOnly')})</small>
                                                </h6>

                                                {(!onboardingData.completed_at && (!onboardingData.interests || onboardingData.interests.length === 0)) && (
                                                    <div className="alert alert-light text-muted small mb-3">
                                                        <i className="mdi mdi-information-outline me-1"></i>
                                                        {t('settings.noOnboardingData')}
                                                    </div>
                                                )}

                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label text-muted">
                                                            <i className="mdi mdi-lock text-muted me-1" style={{ fontSize: '12px' }}></i>
                                                            {t('settings.jobInterests')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control bg-light"
                                                            value={getInterestLabels(onboardingData.interests)}
                                                            disabled
                                                            readOnly
                                                            style={{ cursor: 'not-allowed' }}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label text-muted">
                                                            <i className="mdi mdi-lock text-muted me-1" style={{ fontSize: '12px' }}></i>
                                                            {t('settings.lpkTrainingCenter')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control bg-light"
                                                            value={getLPKDisplayName(onboardingData)}
                                                            disabled
                                                            readOnly
                                                            style={{ cursor: 'not-allowed' }}
                                                        />
                                                    </div>
                                                    <div className="col-md-12 mb-3">
                                                        <label className="form-label text-muted">
                                                            <i className="mdi mdi-lock text-muted me-1" style={{ fontSize: '12px' }}></i>
                                                            {t('settings.preferredCompanyTypes')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control bg-light"
                                                            value={getCompanyPrefLabels(onboardingData.company_preferences)}
                                                            disabled
                                                            readOnly
                                                            style={{ cursor: 'not-allowed' }}
                                                        />
                                                        <small className="text-muted">
                                                            <i className="mdi mdi-information-outline me-1"></i>
                                                            {t('settings.onboardingDataNote')}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 text-end">
                                            <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending || !isValid}>
                                                {updateMutation.isPending ? t('settings.saving') : t('settings.saveButton')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <ProfessionalProfile />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
