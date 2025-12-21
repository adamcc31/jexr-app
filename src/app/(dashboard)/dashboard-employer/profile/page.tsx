'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { fetchCompanyProfile, updateCompanyProfile } from '@/lib/employer-api';
import type { CompanyProfileInput } from '@/types/employer';

// Type for pending file uploads
type PendingFile = {
    file: File;
    previewUrl: string;
};

export default function EmployerProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state (text fields only - URLs are set after upload)
    const [formData, setFormData] = useState<CompanyProfileInput>({
        company_name: '',
        logo_url: null,
        location: null,
        company_story: null,
        founded: null,
        founder: null,
        headquarters: null,
        employee_count: null,
        website: null,
        industry: null,
        description: null,
        hide_company_details: true,
        gallery_image_1: null,
        gallery_image_2: null,
        gallery_image_3: null,
    });

    // Pending files (not yet uploaded - will upload on Save)
    const [pendingLogo, setPendingLogo] = useState<PendingFile | null>(null);
    const [pendingGallery, setPendingGallery] = useState<Record<1 | 2 | 3, PendingFile | null>>({
        1: null,
        2: null,
        3: null,
    });

    // Load existing profile
    useEffect(() => {
        async function loadProfile() {
            try {
                setIsLoading(true);
                const profile = await fetchCompanyProfile();
                if (profile) {
                    setFormData({
                        company_name: profile.company_name || '',
                        logo_url: profile.logo_url,
                        location: profile.location,
                        company_story: profile.company_story,
                        founded: profile.founded,
                        founder: profile.founder,
                        headquarters: profile.headquarters,
                        employee_count: profile.employee_count,
                        website: profile.website,
                        industry: profile.industry,
                        description: profile.description,
                        hide_company_details: profile.hide_company_details ?? true,
                        gallery_image_1: profile.gallery_image_1,
                        gallery_image_2: profile.gallery_image_2,
                        gallery_image_3: profile.gallery_image_3,
                    });
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
                // New profile - keep defaults
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            if (pendingLogo?.previewUrl) URL.revokeObjectURL(pendingLogo.previewUrl);
            Object.values(pendingGallery).forEach(p => {
                if (p?.previewUrl) URL.revokeObjectURL(p.previewUrl);
            });
        };
    }, [pendingLogo, pendingGallery]);

    // Compress image using canvas
    const compressImage = useCallback(async (file: File, maxSizeKB: number = 1024): Promise<Blob> => {
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
    }, []);

    // Upload a single file to Supabase
    const uploadFile = useCallback(async (
        file: File,
        bucket: string,
        oldUrl?: string | null
    ): Promise<string> => {
        let uploadFile: File | Blob = file;
        if (file.type.startsWith('image/')) {
            try {
                uploadFile = await compressImage(file, 1024);
                console.log(`Image compressed: ${file.size} -> ${uploadFile.size} bytes`);
            } catch (err) {
                console.error('Compression failed, using original:', err);
            }
        }

        const formDataUpload = new FormData();
        formDataUpload.append('file', uploadFile, file.name.replace(/\.[^.]+$/, '.jpg'));

        const oldUrlParam = oldUrl ? `&old_url=${encodeURIComponent(oldUrl)}` : '';

        const response = await apiClient.post<{ success: boolean; data: { url: string } }>(
            `/upload?bucket=${bucket}${oldUrlParam}`,
            formDataUpload,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return response.data.data.url;
    }, [compressImage]);

    // Handle logo file selection (just preview, not upload)
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revoke old preview URL
        if (pendingLogo?.previewUrl) URL.revokeObjectURL(pendingLogo.previewUrl);

        setPendingLogo({
            file,
            previewUrl: URL.createObjectURL(file),
        });
    };

    // Handle gallery file selection (just preview, not upload)
    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>, index: 1 | 2 | 3) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revoke old preview URL
        if (pendingGallery[index]?.previewUrl) {
            URL.revokeObjectURL(pendingGallery[index]!.previewUrl);
        }

        setPendingGallery(prev => ({
            ...prev,
            [index]: {
                file,
                previewUrl: URL.createObjectURL(file),
            },
        }));
    };

    // Remove pending logo
    const removePendingLogo = () => {
        if (pendingLogo?.previewUrl) URL.revokeObjectURL(pendingLogo.previewUrl);
        setPendingLogo(null);
    };

    // Remove pending gallery image
    const removePendingGallery = (index: 1 | 2 | 3) => {
        if (pendingGallery[index]?.previewUrl) {
            URL.revokeObjectURL(pendingGallery[index]!.previewUrl);
        }
        setPendingGallery(prev => ({ ...prev, [index]: null }));
    };

    // Form input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value || null }));
        }
    };

    // Form submission - upload files ONLY on save
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validate company name
        if (!formData.company_name?.trim()) {
            setError('Company name is required');
            return;
        }

        // Count gallery images (existing + pending)
        const galleryImages = [
            pendingGallery[1] ? 'pending' : formData.gallery_image_1,
            pendingGallery[2] ? 'pending' : formData.gallery_image_2,
            pendingGallery[3] ? 'pending' : formData.gallery_image_3,
        ].filter(img => img && img.toString().trim() !== '');

        if (galleryImages.length > 0 && galleryImages.length !== 3) {
            setError('Gallery must have exactly 3 images. Please upload all 3 images or remove all of them.');
            return;
        }

        try {
            setIsSaving(true);

            // Prepare final form data
            const finalData: CompanyProfileInput = { ...formData };

            // Upload pending logo if any
            if (pendingLogo) {
                const logoUrl = await uploadFile(pendingLogo.file, 'profile_company', formData.logo_url);
                finalData.logo_url = logoUrl;
            }

            // Upload pending gallery images if any
            if (pendingGallery[1]) {
                const url = await uploadFile(pendingGallery[1].file, 'company_gallery', formData.gallery_image_1);
                finalData.gallery_image_1 = url;
            }
            if (pendingGallery[2]) {
                const url = await uploadFile(pendingGallery[2].file, 'company_gallery', formData.gallery_image_2);
                finalData.gallery_image_2 = url;
            }
            if (pendingGallery[3]) {
                const url = await uploadFile(pendingGallery[3].file, 'company_gallery', formData.gallery_image_3);
                finalData.gallery_image_3 = url;
            }

            // Save to database
            await updateCompanyProfile(finalData);

            // Update local state with uploaded URLs
            setFormData(finalData);

            // Clear pending files
            setPendingLogo(null);
            setPendingGallery({ 1: null, 2: null, 3: null });

            setSuccessMessage('Company profile saved successfully!');
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err: unknown) {
            console.error('Save failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Get display URL for logo (pending preview or saved URL)
    const getLogoUrl = () => {
        if (pendingLogo?.previewUrl) return pendingLogo.previewUrl;
        return formData.logo_url;
    };

    // Get display URL for gallery (pending preview or saved URL)
    const getGalleryUrl = (index: 1 | 2 | 3) => {
        if (pendingGallery[index]?.previewUrl) return pendingGallery[index]!.previewUrl;
        const field = `gallery_image_${index}` as 'gallery_image_1' | 'gallery_image_2' | 'gallery_image_3';
        return formData[field];
    };

    if (isLoading) {
        return (
            <div className="container-fluid">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h4 className="mb-4">Company Profile</h4>

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {successMessage}
                            <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Logo Upload */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Company Logo</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex align-items-center gap-4">
                                    <div
                                        className="position-relative border rounded d-flex align-items-center justify-content-center bg-light"
                                        style={{ width: '120px', height: '120px' }}
                                    >
                                        {getLogoUrl() ? (
                                            <Image
                                                src={getLogoUrl()!}
                                                alt="Company Logo"
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="rounded"
                                            />
                                        ) : (
                                            <span className="text-muted small">No Logo</span>
                                        )}
                                        {pendingLogo && (
                                            <span className="position-absolute top-0 end-0 badge bg-warning text-dark" style={{ fontSize: '10px' }}>
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="form-control"
                                            disabled={isSaving}
                                        />
                                        <small className="text-muted d-block mt-1">
                                            Will be uploaded when you click Save
                                        </small>
                                        {pendingLogo && (
                                            <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={removePendingLogo}>
                                                Remove pending
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Basic Information</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Company Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            className="form-control"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            value={formData.location || ''}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Tokyo, Japan"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Industry</label>
                                        <input
                                            type="text"
                                            name="industry"
                                            className="form-control"
                                            value={formData.industry || ''}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Technology, Healthcare"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            className="form-control"
                                            value={formData.website || ''}
                                            onChange={handleInputChange}
                                            placeholder="https://www.example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Company Story */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Company Story</h5>
                            </div>
                            <div className="card-body">
                                <textarea
                                    name="company_story"
                                    className="form-control"
                                    rows={6}
                                    value={formData.company_story || ''}
                                    onChange={handleInputChange}
                                    placeholder="Tell candidates about your company's mission, values, and culture..."
                                />
                            </div>
                        </div>

                        {/* Company Details */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Company Details</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Founded</label>
                                        <input
                                            type="text"
                                            name="founded"
                                            className="form-control"
                                            value={formData.founded || ''}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 2010"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Founder</label>
                                        <input
                                            type="text"
                                            name="founder"
                                            className="form-control"
                                            value={formData.founder || ''}
                                            onChange={handleInputChange}
                                            placeholder="Founder name"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Headquarters</label>
                                        <input
                                            type="text"
                                            name="headquarters"
                                            className="form-control"
                                            value={formData.headquarters || ''}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Tokyo, Japan"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Number of Employees</label>
                                        <input
                                            type="text"
                                            name="employee_count"
                                            className="form-control"
                                            value={formData.employee_count || ''}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 50-100"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Short Description</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows={3}
                                            value={formData.description || ''}
                                            onChange={handleInputChange}
                                            placeholder="Brief description of what your company does..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visibility Control */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Visibility Settings</h5>
                            </div>
                            <div className="card-body">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="hide_company_details"
                                        name="hide_company_details"
                                        checked={formData.hide_company_details}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="hide_company_details">
                                        Hide company details from unverified users
                                    </label>
                                </div>
                                <small className="text-muted d-block mt-2">
                                    When enabled, detailed company information (Founded, Founder, Headquarters, Employee count, Website)
                                    will only be visible to verified candidates. Unverified or logged-out users will see basic info only.
                                </small>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Company Gallery</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted mb-3">
                                    Upload exactly 3 images to showcase your company&apos;s workspace, team, or culture.
                                    <strong className="d-block mt-1">Images will be uploaded when you click Save.</strong>
                                </p>
                                <div className="row g-3">
                                    {([1, 2, 3] as const).map((index) => {
                                        const imageUrl = getGalleryUrl(index);
                                        const hasPending = !!pendingGallery[index];

                                        return (
                                            <div key={index} className="col-md-4">
                                                <div
                                                    className="position-relative border rounded d-flex align-items-center justify-content-center bg-light"
                                                    style={{ height: '200px' }}
                                                >
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={`Gallery ${index}`}
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                            className="rounded"
                                                        />
                                                    ) : (
                                                        <span className="text-muted">Image {index}</span>
                                                    )}
                                                    {hasPending && (
                                                        <span className="position-absolute top-0 end-0 badge bg-warning text-dark" style={{ fontSize: '10px' }}>
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleGalleryChange(e, index)}
                                                    className="form-control mt-2"
                                                    disabled={isSaving}
                                                />
                                                {hasPending && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger mt-1 w-100"
                                                        onClick={() => removePendingGallery(index)}
                                                    >
                                                        Remove pending
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Company Profile'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
