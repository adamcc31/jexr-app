import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CandidateWithFullDetails, CertificateType } from '@/types/candidate';
import { FiTrash2, FiPlus, FiUpload } from 'react-icons/fi';
import clsx from 'clsx';
import { uploadFile } from '@/lib/candidate-api';

const CERTIFICATE_TYPES: { value: CertificateType; label: string; maxScore: number }[] = [
    { value: 'TOEFL', label: 'TOEFL iBT', maxScore: 120 },
    { value: 'IELTS', label: 'IELTS', maxScore: 9 },
    { value: 'TOEIC', label: 'TOEIC', maxScore: 990 },
    { value: 'OTHER', label: 'Other', maxScore: 0 },
];

export function LanguageCertificateForm() {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext<CandidateWithFullDetails>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "certificates"
    });

    const [uploading, setUploading] = useState<number | null>(null);

    const addCertificate = () => {
        append({
            certificate_type: 'TOEFL',
            certificate_name: '',
            score_total: undefined,
            issued_date: '',
            expires_date: '',
            document_file_path: ''
        });
    };

    const handleFileUpload = async (index: number, file: File) => {
        try {
            setUploading(index);
            const url = await uploadFile(file, 'JLPT'); // Reuse JLPT bucket for certificates
            setValue(`certificates.${index}.document_file_path`, url);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(null);
        }
    };

    const getScoreInfo = (type: CertificateType) => {
        const found = CERTIFICATE_TYPES.find(t => t.value === type);
        return found || { label: '', maxScore: 0 };
    };

    return (
        <div className="mb-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Language Certificates</h5>
                    <small className="text-muted">TOEFL, IELTS, TOEIC, etc. (JLPT is in Identity tab)</small>
                </div>
                <button
                    type="button"
                    onClick={addCertificate}
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                >
                    <FiPlus /> Add Certificate
                </button>
            </div>

            <div className="vstack gap-4">
                {fields.map((field, index) => {
                    const certType = watch(`certificates.${index}.certificate_type`) as CertificateType;
                    const scoreInfo = getScoreInfo(certType);
                    const docPath = watch(`certificates.${index}.document_file_path`);

                    return (
                        <div key={field.id} className="card bg-light border-0 position-relative">
                            <div className="card-body">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="btn btn-sm text-danger position-absolute top-0 end-0 m-2"
                                    title="Remove Certificate"
                                >
                                    <FiTrash2 size={18} />
                                </button>

                                <div className="row">
                                    {/* Certificate Type */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Certificate Type <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            {...register(`certificates.${index}.certificate_type` as const)}
                                            className="form-select"
                                        >
                                            {CERTIFICATE_TYPES.map(t => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Certificate Name (for OTHER) */}
                                    {certType === 'OTHER' && (
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">
                                                Certificate Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                {...register(`certificates.${index}.certificate_name` as const, {
                                                    required: certType === 'OTHER' ? "Name is required" : false
                                                })}
                                                className={clsx("form-control", errors.certificates?.[index]?.certificate_name && "is-invalid")}
                                                placeholder="e.g. Cambridge English"
                                            />
                                            {errors.certificates?.[index]?.certificate_name && (
                                                <div className="invalid-feedback">{errors.certificates[index]?.certificate_name?.message}</div>
                                            )}
                                        </div>
                                    )}

                                    {/* Score */}
                                    {scoreInfo.maxScore > 0 && (
                                        <div className={certType === 'OTHER' ? "col-12 mb-3" : "col-md-6 mb-3"}>
                                            <label className="form-label fw-semibold">
                                                Score <small className="text-muted">(0-{scoreInfo.maxScore})</small>
                                            </label>
                                            <input
                                                type="number"
                                                {...register(`certificates.${index}.score_total` as const, {
                                                    valueAsNumber: true,
                                                    min: { value: 0, message: `Minimum is 0` },
                                                    max: { value: scoreInfo.maxScore, message: `Maximum is ${scoreInfo.maxScore}` }
                                                })}
                                                className={clsx("form-control", errors.certificates?.[index]?.score_total && "is-invalid")}
                                                placeholder={`e.g. ${Math.round(scoreInfo.maxScore * 0.7)}`}
                                                step={certType === 'IELTS' ? '0.5' : '1'}
                                            />
                                            {errors.certificates?.[index]?.score_total && (
                                                <div className="invalid-feedback">{errors.certificates[index]?.score_total?.message}</div>
                                            )}
                                        </div>
                                    )}

                                    {/* Issued Date */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Issued Date</label>
                                        <input
                                            type="date"
                                            {...register(`certificates.${index}.issued_date` as const)}
                                            className="form-control"
                                        />
                                    </div>

                                    {/* Expires Date */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Expires Date</label>
                                        <input
                                            type="date"
                                            {...register(`certificates.${index}.expires_date` as const)}
                                            className="form-control"
                                        />
                                        <div className="form-text">Leave empty if no expiration</div>
                                    </div>

                                    {/* Document Upload */}
                                    <div className="col-12 mb-3">
                                        <label className="form-label fw-semibold">
                                            Certificate Document <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="hidden"
                                            {...register(`certificates.${index}.document_file_path` as const, {
                                                required: "Document is required"
                                            })}
                                        />

                                        {docPath ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <a href={docPath} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
                                                    View Document
                                                </a>
                                                <label className="btn btn-outline-primary btn-sm mb-0">
                                                    {uploading === index ? 'Uploading...' : 'Replace'}
                                                    <input
                                                        type="file"
                                                        className="d-none"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleFileUpload(index, file);
                                                        }}
                                                        disabled={uploading !== null}
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <label className={clsx(
                                                "btn btn-outline-primary d-flex align-items-center gap-2",
                                                errors.certificates?.[index]?.document_file_path && "border-danger text-danger"
                                            )}>
                                                <FiUpload />
                                                {uploading === index ? 'Uploading...' : 'Upload Certificate (PDF/DOC/Image)'}
                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileUpload(index, file);
                                                    }}
                                                    disabled={uploading !== null}
                                                />
                                            </label>
                                        )}
                                        {errors.certificates?.[index]?.document_file_path && (
                                            <div className="text-danger small mt-1">
                                                {errors.certificates[index]?.document_file_path?.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {fields.length === 0 && (
                    <div className="text-center py-5 border rounded bg-light text-muted">
                        No language certificates added yet.
                    </div>
                )}
            </div>
        </div>
    );
}
