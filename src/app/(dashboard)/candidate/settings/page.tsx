"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import Navbar from "../../../components/navbarCandidate";
import Footer from "../../../components/footer";
import ScrollTop from "../../../components/scrollTop";
import clsx from "clsx";
import { apiClient } from "@/lib/api";

// --- API & Types ---

// Enum constants for type safety
const MARITAL_STATUS_OPTIONS = ["SINGLE", "MARRIED", "DIVORCED"] as const;
const JAPANESE_SPEAKING_LEVEL_OPTIONS = ["NATIVE", "FLUENT", "BASIC", "PASSIVE"] as const;

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
    japanese_level: string; // N5, N4, N3, N2, N1

    // HR Candidate Data: Identity & Demographics
    birth_date?: string;
    domicile_city?: string;
    marital_status?: typeof MARITAL_STATUS_OPTIONS[number];
    children_count?: number;

    // HR Candidate Data: Core Competencies
    main_job_fields?: string[];
    golden_skill?: string;
    japanese_speaking_level?: typeof JAPANESE_SPEAKING_LEVEL_OPTIONS[number];

    // HR Candidate Data: Expectations & Availability
    expected_salary?: number;
    japan_return_date?: string;
    available_start_date?: string;
    preferred_locations?: string[];
    preferred_industries?: string[];

    // HR Candidate Data: Supporting Documents
    supporting_certificates_url?: string[];
};

type JapanWorkExperience = {
    id?: number;
    company_name: string;
    job_title: string;
    start_date: string;
    end_date?: string | null;
    description?: string;
};

type VerificationResponse = {
    verification: AccountVerification;
    experiences: JapanWorkExperience[];
};

// --- Validation Schema ---

const schema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email().optional(), // Read only mostly
    occupation: z.string().min(1, "Occupation is required"),
    japan_experience_duration: z.union([z.string(), z.number()]).transform((val) => Number(val)),
    intro: z.string().optional(),

    // File URLs
    profile_picture_url: z.string().optional(),
    japanese_certificate_url: z.string().optional(), // Made optional, now conditionally required
    cv_url: z.string().optional(),

    // Contact
    phone: z.string().min(1, "Phone number is required"),
    website_url: z.string().optional(),

    // Japanese Level
    japanese_level: z.string().optional(),

    // HR Candidate Data: Identity & Demographics
    birth_date: z.string().optional(),
    domicile_city: z.string().optional(),
    marital_status: z.enum(MARITAL_STATUS_OPTIONS).optional().or(z.literal("")),
    children_count: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),

    // HR Candidate Data: Core Competencies
    main_job_fields: z.array(z.string()).optional(),
    golden_skill: z.string().optional(),
    japanese_speaking_level: z.enum(JAPANESE_SPEAKING_LEVEL_OPTIONS).optional().or(z.literal("")),

    // HR Candidate Data: Expectations & Availability
    expected_salary: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
    japan_return_date: z.string().optional(),
    available_start_date: z.string().optional(),
    preferred_locations: z.array(z.string()).optional(),
    preferred_industries: z.array(z.string()).optional(),

    // HR Candidate Data: Supporting Documents
    supporting_certificates_url: z.array(z.string()).optional(),

    // Experiences
    experiences: z.array(z.object({
        company_name: z.string().min(1, "Company name is required"),
        job_title: z.string().min(1, "Job title is required"),
        start_date: z.string().min(1, "Start date is required"),
        end_date: z.string().nullable().optional(),
        description: z.string().optional(),
    })),
}).refine((data) => {
    // Japanese certificate is required if japanese_level is set
    if (data.japanese_level && data.japanese_level !== "") {
        return data.japanese_certificate_url && data.japanese_certificate_url !== "";
    }
    return true;
}, {
    message: "Japanese certificate is required when language level is selected",
    path: ["japanese_certificate_url"],
});

type FormData = z.infer<typeof schema>;

// --- Components ---

// File size limits in bytes
const FILE_SIZE_LIMITS = {
    profile_picture_url: 3 * 1024 * 1024, // 3MB
    japanese_certificate_url: 3 * 1024 * 1024, // 3MB
    cv_url: 2 * 1024 * 1024, // 2MB
};

const FILE_SIZE_LABELS = {
    profile_picture_url: "3MB",
    japanese_certificate_url: "3MB",
    cv_url: "2MB",
};

// Compress image using canvas
const compressImage = async (file: File, maxSizeKB: number = 1024): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Max dimensions for compression
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

                // Start with high quality and reduce until under maxSizeKB
                let quality = 0.9;
                const tryCompress = () => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Compression failed'));
                                return;
                            }
                            if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
                                quality -= 0.1;
                                tryCompress();
                            } else {
                                resolve(blob);
                            }
                        },
                        'image/jpeg',
                        quality
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

// Center-crop image to a square and compress
const centerCropAndCompress = async (file: File, maxSizeKB: number = 1024): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');

                // Calculate crop dimensions (square from center)
                const size = Math.min(img.width, img.height);
                const startX = (img.width - size) / 2;
                const startY = (img.height - size) / 2;

                // Output size (max 600px for profile picture)
                const outputSize = Math.min(size, 600);
                canvas.width = outputSize;
                canvas.height = outputSize;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, startX, startY, size, size, 0, 0, outputSize, outputSize);

                // Compress with quality reduction
                let quality = 0.9;
                const tryCompress = () => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Crop failed'));
                                return;
                            }
                            if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
                                quality -= 0.1;
                                tryCompress();
                            } else {
                                resolve(blob);
                            }
                        },
                        'image/jpeg',
                        quality
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
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);

    // Cropping modal state
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);

    // ReactCrop state
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);

    // Initialize crop when image loads (centered 1:1 aspect ratio)
    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const cropSize = Math.min(width, height, 300);
        const newCrop = centerCrop(
            makeAspectCrop({ unit: 'px', width: cropSize }, 1, width, height),
            width,
            height
        );
        setCrop(newCrop);

        // Also set completedCrop so the button is enabled immediately
        // Convert percentage crop to pixel crop for initial value
        setCompletedCrop({
            unit: 'px',
            x: newCrop.x,
            y: newCrop.y,
            width: newCrop.width,
            height: newCrop.height,
        });
    }, []);

    // Extract cropped image as blob
    const getCroppedImg = useCallback(async (): Promise<Blob | null> => {
        if (!imgRef.current || !completedCrop) return null;

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        // Output size (max 600px)
        const outputSize = Math.min(Math.max(cropWidth, cropHeight), 600);
        canvas.width = outputSize;
        canvas.height = outputSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            cropWidth,
            cropHeight,
            0,
            0,
            outputSize,
            outputSize
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
        });
    }, [completedCrop]);

    // 1. Fetch Data
    const { data: profileData, isLoading } = useQuery<VerificationResponse>({
        queryKey: ["candidateVerification"],
        queryFn: async () => {
            try {
                const res = await apiClient.get("/candidates/me/verification");
                return res.data.data; // Assuming { data: { verification: ..., experiences: [...] } }
            } catch (error: any) {
                // Handle 404 or other errors gracefully
                if (error.response?.status === 404) return null;
                throw error;
            }
        },
    });

    // 2. Form Setup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            experiences: [],
            japan_experience_duration: 0,
            children_count: 0,
            expected_salary: 0,
            main_job_fields: [],
            preferred_locations: [],
            preferred_industries: [],
            supporting_certificates_url: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "experiences",
    });

    // 3. Pre-fill Form
    useEffect(() => {
        if (profileData) {
            const v = profileData.verification;
            if (v) {
                // Existing fields
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
                setValue("japanese_level", v.japanese_level || "");

                // HR Candidate Data: Identity & Demographics
                setValue("birth_date", v.birth_date ? v.birth_date.split('T')[0] : "");
                setValue("domicile_city", v.domicile_city || "");
                setValue("marital_status", v.marital_status || "");
                setValue("children_count", v.children_count || 0);

                // HR Candidate Data: Core Competencies
                setValue("main_job_fields", v.main_job_fields || []);
                setValue("golden_skill", v.golden_skill || "");
                setValue("japanese_speaking_level", v.japanese_speaking_level || "");

                // HR Candidate Data: Expectations & Availability
                setValue("expected_salary", v.expected_salary || 0);
                setValue("japan_return_date", v.japan_return_date ? v.japan_return_date.split('T')[0] : "");
                setValue("available_start_date", v.available_start_date ? v.available_start_date.split('T')[0] : "");
                setValue("preferred_locations", v.preferred_locations || []);
                setValue("preferred_industries", v.preferred_industries || []);

                // HR Candidate Data: Supporting Documents
                setValue("supporting_certificates_url", v.supporting_certificates_url || []);
            }
            if (profileData.experiences) {
                // Ensure dates are formatted as YYYY-MM-DD for input[type="date"]
                const formattedExps = profileData.experiences.map(e => ({
                    ...e,
                    start_date: e.start_date ? e.start_date.split('T')[0] : "",
                    end_date: e.end_date ? e.end_date.split('T')[0] : null,
                }));
                setValue("experiences", formattedExps);
            }
        }
    }, [profileData, setValue]);

    // 4. Mutations
    const updateMutation = useMutation({
        mutationFn: async (data: FormData) => {
            // Transform data for API
            const payload = {
                verification: {
                    // Existing fields
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
                    japanese_level: data.japanese_level,

                    // HR Candidate Data: Identity & Demographics
                    birth_date: data.birth_date ? new Date(data.birth_date).toISOString() : null,
                    domicile_city: data.domicile_city || null,
                    marital_status: data.marital_status || null,
                    children_count: data.marital_status === "MARRIED" ? Number(data.children_count) : 0,

                    // HR Candidate Data: Core Competencies
                    main_job_fields: data.main_job_fields || [],
                    golden_skill: data.golden_skill || null,
                    japanese_speaking_level: data.japanese_speaking_level || null,

                    // HR Candidate Data: Expectations & Availability
                    expected_salary: Number(data.expected_salary) || null,
                    japan_return_date: data.japan_return_date ? new Date(data.japan_return_date).toISOString() : null,
                    available_start_date: data.available_start_date ? new Date(data.available_start_date).toISOString() : null,
                    preferred_locations: data.preferred_locations || [],
                    preferred_industries: data.preferred_industries || [],

                    // HR Candidate Data: Supporting Documents
                    supporting_certificates_url: data.supporting_certificates_url || [],
                },
                experiences: data.experiences.map(e => ({
                    ...e,
                    start_date: new Date(e.start_date).toISOString(),
                    end_date: e.end_date ? new Date(e.end_date).toISOString() : null,
                })),
            };

            const res = await apiClient.put("/candidates/me/verification", payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["candidateVerification"] });
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Your profile has been updated.',
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: (err) => {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save changes. Please try again.',
            });
        }
    });

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: "profile_picture_url" | "japanese_certificate_url" | "cv_url") => {
        const file = event.target.files?.[0];
        if (!file) return;

        // File size validation
        const maxSize = FILE_SIZE_LIMITS[field];
        const maxSizeLabel = FILE_SIZE_LABELS[field];

        if (file.size > maxSize) {
            // For profile pictures, try to compress first
            if (field === "profile_picture_url" && file.type.startsWith("image/")) {
                const confirmed = await Swal.fire({
                    title: 'File Too Large',
                    text: `Your image is ${(file.size / 1024 / 1024).toFixed(2)}MB. Would you like to compress it to under 1MB?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, compress it',
                    cancelButtonText: 'No, choose another file',
                });

                if (confirmed.isConfirmed) {
                    // Open cropping modal
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImageToCrop(e.target?.result as string);
                        setOriginalFile(file);
                        setCropModalOpen(true);
                    };
                    reader.readAsDataURL(file);
                    return;
                }
                return;
            }

            // For non-images, just show error
            Swal.fire({
                title: 'File Too Large',
                text: `Maximum file size is ${maxSizeLabel}. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
                icon: 'error',
            });
            return;
        }

        // Map field to Supabase bucket name
        const bucketMap: Record<string, string> = {
            profile_picture_url: "Profile_Picture",
            japanese_certificate_url: "JLPT",
            cv_url: "CV",
        };
        const bucket = bucketMap[field] || "CV";

        // For profile pictures, compress before upload
        let uploadFile: File | Blob = file;
        if (field === "profile_picture_url" && file.type.startsWith("image/")) {
            try {
                uploadFile = await compressImage(file, 1024); // Compress to under 1MB
                Swal.fire({
                    title: 'Image Compressed',
                    text: `Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(uploadFile.size / 1024 / 1024).toFixed(2)}MB`,
                    icon: 'info',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (err) {
                console.error("Compression failed:", err);
            }
        }

        const formData = new FormData();
        formData.append("file", uploadFile, file.name);

        // Get current URL for this field (to delete old file)
        const currentUrl = watch(field);
        const oldUrlParam = currentUrl ? `&old_url=${encodeURIComponent(currentUrl)}` : "";

        setUploading(true);
        try {
            const res = await apiClient.post(`/upload?bucket=${bucket}${oldUrlParam}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const url = res.data.data.url;
            setValue(field, url);
            Swal.fire({
                title: 'Upload Successful',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Upload Error:", error);
            Swal.fire('Upload Failed', 'Please try again', 'error');
        } finally {
            setUploading(false);
        }
    };

    // Handle cropped image upload using ReactCrop selection
    const handleCroppedUpload = async () => {
        setCropModalOpen(false);
        setUploading(true);

        try {
            // Get cropped image from ReactCrop
            const croppedBlob = await getCroppedImg();
            if (!croppedBlob) {
                Swal.fire('Error', 'Could not crop image. Please try again.', 'error');
                setUploading(false);
                return;
            }

            // Compress the cropped image
            const compressedBlob = await compressImage(
                new File([croppedBlob], originalFile?.name || 'profile.jpg', { type: 'image/jpeg' }),
                1024
            );

            const formData = new FormData();
            formData.append("file", compressedBlob, originalFile?.name || 'profile.jpg');

            // Get current profile picture URL to delete old file
            const currentProfilePic = watch("profile_picture_url");
            const oldUrlParam = currentProfilePic ? `&old_url=${encodeURIComponent(currentProfilePic)}` : "";

            const res = await apiClient.post(`/upload?bucket=Profile_Picture${oldUrlParam}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const url = res.data.data.url;
            setValue("profile_picture_url", url);
            Swal.fire({
                title: 'Profile Picture Updated',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Upload Error:", error);
            Swal.fire('Upload Failed', 'Please try again', 'error');
        } finally {
            setUploading(false);
            setImageToCrop(null);
            setOriginalFile(null);
            setCrop(undefined);
            setCompletedCrop(undefined);
        }
    };

    const watchedProfilePic = watch("profile_picture_url");
    const watchedCert = watch("japanese_certificate_url");
    const watchedCv = watch("cv_url");

    const onSubmit = (data: FormData) => {
        updateMutation.mutate(data);
    };

    if (isLoading) return <div className="text-center p-5">Loading profile...</div>;

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={false} />
            <section className="section">
                <div className="container">
                    <div className="row">
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="rounded shadow p-4">
                                <h5 className="mb-4">Candidate Profile Verification</h5>
                                {profileData?.verification?.status === 'SUBMITTED' && (
                                    <div className="alert alert-success">Profile Submitted for Verification</div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* --- A. Profile Picture --- */}
                                    <div className="row mb-4">
                                        <div className="col-12 text-center">
                                            <div className="d-inline-block position-relative">
                                                <div style={{ width: 120, height: 120, overflow: 'hidden', borderRadius: '50%', background: '#f0f0f0', margin: '0 auto' }}>
                                                    {watchedProfilePic ? (
                                                        <img src={watchedProfilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className="d-flex align-items-center justify-content-center h-100 text-muted">No Image</div>
                                                    )}
                                                </div>
                                                <label className="btn btn-sm btn-primary mt-2 position-relative" style={{ cursor: 'pointer' }}>
                                                    {uploading ? "Uploading..." : "Change Picture"}
                                                    <input type="file" className="d-none" accept="image/*" onChange={(e) => handleFileUpload(e, "profile_picture_url")} disabled={uploading} />
                                                </label>
                                                <div className="small text-muted mt-1">(Max 3MB)</div>
                                            </div>
                                            {errors.profile_picture_url && <p className="text-danger small">{errors.profile_picture_url.message}</p>}
                                        </div>
                                    </div>

                                    <hr />

                                    {/* --- B. Personal Detail --- */}
                                    <h5>Personal Detail :</h5>
                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">First Name:<span className="text-danger">*</span></label>
                                                <input {...register("first_name")} className={clsx("form-control", errors.first_name && "is-invalid")} placeholder="First Name" />
                                                {errors.first_name && <div className="invalid-feedback">{errors.first_name.message}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Last Name:<span className="text-danger">*</span></label>
                                                <input {...register("last_name")} className={clsx("form-control", errors.last_name && "is-invalid")} placeholder="Last Name" />
                                                {errors.last_name && <div className="invalid-feedback">{errors.last_name.message}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Occupation:<span className="text-danger">*</span></label>
                                                <input {...register("occupation")} className={clsx("form-control", errors.occupation && "is-invalid")} placeholder="e.g. Web Developer" />
                                                {errors.occupation && <div className="invalid-feedback">{errors.occupation.message}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Japan Work Exp (Months):<span className="text-danger">*</span></label>
                                                <input type="number" {...register("japan_experience_duration")} className={clsx("form-control", errors.japan_experience_duration && "is-invalid")} placeholder="Total months" />
                                                {errors.japan_experience_duration && <div className="invalid-feedback">{errors.japan_experience_duration.message}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Japanese Language Level:</label>
                                                <select {...register("japanese_level")} className={clsx("form-control", errors.japanese_level && "is-invalid")}>
                                                    <option value="">Select Level</option>
                                                    <option value="N5">N5</option>
                                                    <option value="N4">N4</option>
                                                    <option value="N3">N3</option>
                                                    <option value="N2">N2</option>
                                                    <option value="N1">N1</option>
                                                </select>
                                                {errors.japanese_level && <div className="invalid-feedback">{errors.japanese_level.message}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Japanese Certificate:<span className="text-danger">*</span> <small className="text-muted fw-normal">(Max 3MB)</small></label>
                                                <div className="d-flex">
                                                    <input type="file" className="form-control" onChange={(e) => handleFileUpload(e, "japanese_certificate_url")} disabled={uploading} />
                                                </div>
                                                {watchedCert && <p className="small text-success mt-1">File Uploaded <a href={watchedCert} target="_blank" rel="noreferrer">View</a></p>}
                                                {errors.japanese_certificate_url && <p className="text-danger small">{errors.japanese_certificate_url.message}</p>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">CV / Resume: <small className="text-muted fw-normal">(Max 2MB, PDF/DOC)</small></label>
                                                <div className="d-flex">
                                                    <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, "cv_url")} disabled={uploading} />
                                                </div>
                                                {watchedCv && <p className="small text-success mt-1">CV Uploaded <a href={watchedCv} target="_blank" rel="noreferrer">View</a></p>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Introduction :</label>
                                                <textarea {...register("intro")} rows={4} className="form-control" placeholder="Short intro..."></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <hr />

                                    {/* --- HR: Identity & Demographics --- */}
                                    <h5>Identity & Demographics :</h5>
                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Date of Birth:</label>
                                                <input type="date" {...register("birth_date")} className="form-control" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Domicile City:</label>
                                                <input {...register("domicile_city")} className="form-control" placeholder="e.g. Jakarta" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Marital Status:</label>
                                                <select {...register("marital_status")} className="form-control">
                                                    <option value="">Select Status</option>
                                                    {MARITAL_STATUS_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Number of Children:</label>
                                                <input
                                                    type="number"
                                                    {...register("children_count")}
                                                    className="form-control"
                                                    min={0}
                                                    disabled={watch("marital_status") !== "MARRIED"}
                                                />
                                                {watch("marital_status") !== "MARRIED" && (
                                                    <small className="text-muted">Only applicable for married candidates</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <hr />

                                    {/* --- HR: Core Competencies --- */}
                                    <h5>Core Competencies :</h5>
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Main Job Fields: <small className="text-muted fw-normal">(Check all that apply)</small></label>
                                                <Controller
                                                    name="main_job_fields"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="border rounded p-3" style={{ maxHeight: '280px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
                                                                    {MAIN_JOB_FIELD_OPTIONS.map(opt => (
                                                                        <div key={opt.value} className="form-check mb-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                id={`job-${opt.value}`}
                                                                                checked={(field.value || []).includes(opt.value)}
                                                                                onChange={(e) => {
                                                                                    const current = field.value || [];
                                                                                    if (e.target.checked) {
                                                                                        field.onChange([...current, opt.value]);
                                                                                    } else {
                                                                                        field.onChange(current.filter((v: string) => v !== opt.value));
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={`job-${opt.value}`}>
                                                                                {opt.label}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <div className="border rounded p-3 bg-light" style={{ minHeight: '280px' }}>
                                                                    <strong className="d-block mb-2 text-primary">Selected ({(field.value || []).length}):</strong>
                                                                    {(field.value || []).length === 0 ? (
                                                                        <p className="text-muted small mb-0">No job fields selected</p>
                                                                    ) : (
                                                                        <div className="d-flex flex-wrap gap-1">
                                                                            {(field.value || []).map((val: string) => {
                                                                                const option = MAIN_JOB_FIELD_OPTIONS.find(o => o.value === val);
                                                                                return (
                                                                                    <span key={val} className="badge bg-primary d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                                                                        {option?.label.split('(')[0].trim() || val}
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn-close btn-close-white ms-1"
                                                                                            style={{ fontSize: '0.5rem' }}
                                                                                            onClick={() => field.onChange((field.value || []).filter((v: string) => v !== val))}
                                                                                        />
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Golden Skill: <small className="text-muted fw-normal">(Skill you can teach others)</small></label>
                                                <input {...register("golden_skill")} className="form-control" placeholder="e.g. TIG Welding, PLC Programming" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Japanese Speaking Level:</label>
                                                <select {...register("japanese_speaking_level")} className="form-control">
                                                    <option value="">Select Level</option>
                                                    {JAPANESE_SPEAKING_LEVEL_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <hr />

                                    {/* --- HR: Expectations & Availability --- */}
                                    <h5>Expectations & Availability :</h5>
                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Expected Salary (IDR/month, netto):</label>
                                                <input
                                                    type="number"
                                                    {...register("expected_salary")}
                                                    className="form-control"
                                                    placeholder="e.g. 8000000"
                                                    min={0}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Japan Return Date:</label>
                                                <input type="date" {...register("japan_return_date")} className="form-control" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Available Start Date:</label>
                                                <input type="date" {...register("available_start_date")} className="form-control" />
                                            </div>
                                        </div>

                                        <div className="col-12 mt-3">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Preferred Locations: <small className="text-muted fw-normal">(Check all areas you can work in)</small></label>
                                                <Controller
                                                    name="preferred_locations"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="border rounded p-3" style={{ maxHeight: '220px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
                                                                    {PREFERRED_LOCATION_OPTIONS.map(opt => (
                                                                        <div key={opt.value} className="form-check mb-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                id={`loc-${opt.value}`}
                                                                                checked={(field.value || []).includes(opt.value)}
                                                                                onChange={(e) => {
                                                                                    const current = field.value || [];
                                                                                    if (e.target.checked) {
                                                                                        field.onChange([...current, opt.value]);
                                                                                    } else {
                                                                                        field.onChange(current.filter((v: string) => v !== opt.value));
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={`loc-${opt.value}`}>
                                                                                {opt.label}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <div className="border rounded p-3 bg-light" style={{ minHeight: '220px' }}>
                                                                    <strong className="d-block mb-2 text-success">Selected ({(field.value || []).length}):</strong>
                                                                    {(field.value || []).length === 0 ? (
                                                                        <p className="text-muted small mb-0">No locations selected</p>
                                                                    ) : (
                                                                        <div className="d-flex flex-wrap gap-1">
                                                                            {(field.value || []).map((val: string) => {
                                                                                const option = PREFERRED_LOCATION_OPTIONS.find(o => o.value === val);
                                                                                return (
                                                                                    <span key={val} className="badge bg-success d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                                                                        {option?.label.split('(')[0].trim() || val}
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn-close btn-close-white ms-1"
                                                                                            style={{ fontSize: '0.5rem' }}
                                                                                            onClick={() => field.onChange((field.value || []).filter((v: string) => v !== val))}
                                                                                        />
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 mt-3">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Preferred Industries: <small className="text-muted fw-normal">(Based on your Japan experience)</small></label>
                                                <Controller
                                                    name="preferred_industries"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="border rounded p-3" style={{ maxHeight: '220px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
                                                                    {PREFERRED_INDUSTRY_OPTIONS.map(opt => (
                                                                        <div key={opt.value} className="form-check mb-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                id={`ind-${opt.value}`}
                                                                                checked={(field.value || []).includes(opt.value)}
                                                                                onChange={(e) => {
                                                                                    const current = field.value || [];
                                                                                    if (e.target.checked) {
                                                                                        field.onChange([...current, opt.value]);
                                                                                    } else {
                                                                                        field.onChange(current.filter((v: string) => v !== opt.value));
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={`ind-${opt.value}`}>
                                                                                {opt.label}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <div className="border rounded p-3 bg-light" style={{ minHeight: '220px' }}>
                                                                    <strong className="d-block mb-2 text-warning">Selected ({(field.value || []).length}):</strong>
                                                                    {(field.value || []).length === 0 ? (
                                                                        <p className="text-muted small mb-0">No industries selected</p>
                                                                    ) : (
                                                                        <div className="d-flex flex-wrap gap-1">
                                                                            {(field.value || []).map((val: string) => {
                                                                                const option = PREFERRED_INDUSTRY_OPTIONS.find(o => o.value === val);
                                                                                return (
                                                                                    <span key={val} className="badge bg-warning text-dark d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                                                                        {option?.label.split('(')[0].trim() || val}
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn-close ms-1"
                                                                                            style={{ fontSize: '0.5rem' }}
                                                                                            onClick={() => field.onChange((field.value || []).filter((v: string) => v !== val))}
                                                                                        />
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr />

                                    {/* --- C. Work Experience in Japan --- */}
                                    <h5 className="mt-4">Work Experience in Japan :</h5>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="card p-3 mb-3 bg-light">
                                            <div className="d-flex justify-content-between">
                                                <h6>Experience #{index + 1}</h6>
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(index)}>Remove</button>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label">Company Name*</label>
                                                    <input {...register(`experiences.${index}.company_name`)} className={clsx("form-control", errors.experiences?.[index]?.company_name && "is-invalid")} />
                                                    {errors.experiences?.[index]?.company_name && <div className="invalid-feedback">{errors.experiences?.[index]?.company_name?.message}</div>}
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label">Job Title*</label>
                                                    <input {...register(`experiences.${index}.job_title`)} className={clsx("form-control", errors.experiences?.[index]?.job_title && "is-invalid")} />
                                                    {errors.experiences?.[index]?.job_title && <div className="invalid-feedback">{errors.experiences?.[index]?.job_title?.message}</div>}
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label">Start Date*</label>
                                                    <input type="date" {...register(`experiences.${index}.start_date`)} className={clsx("form-control", errors.experiences?.[index]?.start_date && "is-invalid")} />
                                                    {errors.experiences?.[index]?.start_date && <div className="invalid-feedback">{errors.experiences?.[index]?.start_date?.message}</div>}
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label">End Date</label>
                                                    <input type="date" {...register(`experiences.${index}.end_date`)} className="form-control" />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label">Description</label>
                                                    <textarea {...register(`experiences.${index}.description`)} className="form-control" rows={2} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-outline-primary btn-sm mb-4" onClick={() => append({ company_name: "", job_title: "", start_date: "", description: "" })}>
                                        + Add Work Experience
                                    </button>

                                    <hr />

                                    {/* --- D. Contact Info --- */}
                                    <h5>Contact Info :</h5>
                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Phone No.:<span className="text-danger">*</span></label>
                                                <input {...register("phone")} className={clsx("form-control", errors.phone && "is-invalid")} placeholder="Phone number" />
                                                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Website / Portfolio:</label>
                                                <input {...register("website_url")} className="form-control" placeholder="https://" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <input type="submit" className="submitBnt btn btn-primary" value={updateMutation.isPending ? "Saving..." : "Save Changes"} disabled={updateMutation.isPending || uploading} />
                                    </div>

                                </form>
                            </div>

                            {/* --- E. Change Password (Inactive) --- */}
                            <div className="rounded shadow p-4 mt-4 text-muted">
                                <h5>Change password :</h5>
                                <p className="mb-3">Password change will be available soon.</p>
                                <form>
                                    <div className="row mt-4">
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Old password :</label>
                                                <input type="password" className="form-control" disabled />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">New password :</label>
                                                <input type="password" className="form-control" disabled />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Re-type New password :</label>
                                                <input type="password" className="form-control" disabled />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <Footer top={true} />
            <ScrollTop />

            {/* Image Cropping Modal with ReactCrop */}
            {cropModalOpen && imageToCrop && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Crop Profile Picture</h5>
                                <button type="button" className="btn-close" onClick={() => {
                                    setCropModalOpen(false);
                                    setImageToCrop(null);
                                    setOriginalFile(null);
                                    setCrop(undefined);
                                    setCompletedCrop(undefined);
                                }}></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted mb-3 text-center">
                                    <strong>Drag to position</strong> and <strong>resize corners</strong> to crop your image.
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={1}
                                        circularCrop={false}
                                    >
                                        <img
                                            ref={imgRef}
                                            src={imageToCrop}
                                            alt="Crop preview"
                                            onLoad={onImageLoad}
                                            style={{ maxWidth: '100%', maxHeight: '400px' }}
                                        />
                                    </ReactCrop>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setCropModalOpen(false);
                                        setImageToCrop(null);
                                        setOriginalFile(null);
                                        setCrop(undefined);
                                        setCompletedCrop(undefined);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={uploading || !completedCrop}
                                    onClick={handleCroppedUpload}
                                >
                                    {uploading ? 'Processing...' : 'Crop & Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
