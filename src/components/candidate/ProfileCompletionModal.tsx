'use client';

/**
 * ProfileCompletionModal Component
 * 
 * Shows personalized guidance for completing profile.
 * Displays missing mandatory fields grouped by category.
 */

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface ProfileCompletionModalProps {
    /** Whether the modal is visible */
    show: boolean;
    /** Callback when modal is closed/dismissed */
    onClose: () => void;
    /** Callback when user wants to navigate to settings */
    onNavigate: (tab: 'identity' | 'professional') => void;
    /** Current completion percentage */
    percentage: number;
    /** i18n keys for missing identity fields */
    missingIdentity: string[];
    /** i18n keys for missing professional fields */
    missingProfessional: string[];
}

/**
 * Modal showing personalized profile completion guidance.
 * Groups missing fields by Identity and Professional CV sections.
 */
export function ProfileCompletionModal({
    show,
    onClose,
    onNavigate,
    percentage,
    missingIdentity,
    missingProfessional,
}: ProfileCompletionModalProps) {
    const { t } = useTranslation('candidate');

    const hasIdentityMissing = missingIdentity.length > 0;
    const hasProfessionalMissing = missingProfessional.length > 0;

    // Determine primary action based on what's missing
    const primaryTab: 'identity' | 'professional' = hasIdentityMissing ? 'identity' : 'professional';
    const primaryButtonLabel = hasIdentityMissing
        ? t('completionModal.completeIdentity')
        : t('completionModal.completeProfessional');

    // Get progress bar color based on percentage
    const getProgressColor = () => {
        if (percentage >= 80) return 'bg-success';
        if (percentage >= 50) return 'bg-warning';
        return 'bg-danger';
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop="static"
            keyboard={true}
            size="lg"
        >
            <Modal.Header closeButton className="border-bottom-0 pb-0" style={{ '--bs-btn-close-color': '#000' } as React.CSSProperties}>
                <Modal.Title className="fs-5">
                    <i className="mdi mdi-account-check-outline text-primary me-2"></i>
                    {t('completionModal.title')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
                {/* Progress indicator */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted">{t('completionModal.subtitle', { percentage })}</span>
                        <span className={`fw-bold ${percentage >= 80 ? 'text-success' : percentage >= 50 ? 'text-warning' : 'text-danger'}`}>
                            {percentage}%
                        </span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                        <div
                            className={`progress-bar ${getProgressColor()}`}
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                            aria-valuenow={percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                </div>

                {/* Missing fields grouped by section */}
                <div className="row">
                    {/* Identity Section */}
                    {hasIdentityMissing && (
                        <div className={`${hasProfessionalMissing ? 'col-md-6' : 'col-12'} mb-3`}>
                            <div className="card border-0 bg-light h-100">
                                <div className="card-body">
                                    <h6 className="card-title mb-3 text-primary">
                                        <i className="mdi mdi-card-account-details-outline me-2"></i>
                                        {t('completionModal.identitySection')}
                                    </h6>
                                    <p className="text-muted small mb-2">{t('completionModal.missingFields')}</p>
                                    <ul className="list-unstyled mb-0 small">
                                        {missingIdentity.slice(0, 5).map((fieldKey) => (
                                            <li key={fieldKey} className="mb-1">
                                                <i className="mdi mdi-circle-small text-danger"></i>
                                                {t(fieldKey)}
                                            </li>
                                        ))}
                                        {missingIdentity.length > 5 && (
                                            <li className="text-muted">
                                                <i className="mdi mdi-dots-horizontal"></i>
                                                {t('completionModal.andMore', { count: missingIdentity.length - 5 })}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Professional Section */}
                    {hasProfessionalMissing && (
                        <div className={`${hasIdentityMissing ? 'col-md-6' : 'col-12'} mb-3`}>
                            <div className="card border-0 bg-light h-100">
                                <div className="card-body">
                                    <h6 className="card-title mb-3 text-info">
                                        <i className="mdi mdi-briefcase-outline me-2"></i>
                                        {t('completionModal.professionalSection')}
                                    </h6>
                                    <p className="text-muted small mb-2">{t('completionModal.missingFields')}</p>
                                    <ul className="list-unstyled mb-0 small">
                                        {missingProfessional.map((fieldKey) => (
                                            <li key={fieldKey} className="mb-1">
                                                <i className="mdi mdi-circle-small text-danger"></i>
                                                {t(fieldKey)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Encouragement message */}
                <div className="alert alert-info border-0 mb-0 mt-2">
                    <i className="mdi mdi-information-outline me-2"></i>
                    <small>{t('completionModal.encouragement')}</small>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-top-0 pt-0">
                <Button variant="light" onClick={onClose}>
                    {t('completionModal.later')}
                </Button>
                {/* Show secondary button if both sections have missing fields */}
                {hasIdentityMissing && hasProfessionalMissing && (
                    <Button
                        variant="outline-info"
                        onClick={() => onNavigate('professional')}
                    >
                        {t('completionModal.completeProfessional')}
                    </Button>
                )}
                <Button
                    variant="primary"
                    onClick={() => onNavigate(primaryTab)}
                >
                    {primaryButtonLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProfileCompletionModal;
