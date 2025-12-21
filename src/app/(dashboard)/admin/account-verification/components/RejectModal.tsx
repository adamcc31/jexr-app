'use client';

import React, { useState } from 'react';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading?: boolean;
}

export default function RejectModal({ isOpen, onClose, onConfirm, isLoading }: RejectModalProps) {
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(reason);
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={handleClose}
                style={{ zIndex: 1040 }}
            />

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h5 className="modal-title d-flex align-items-center gap-2">
                                <span className="bg-danger bg-opacity-10 rounded-circle p-2 d-flex">
                                    <IconifyIcon icon="solar:close-circle-bold" width={24} className="text-danger" />
                                </span>
                                Reject Verification
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleClose}
                                disabled={isLoading}
                            />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <p className="text-muted mb-3">
                                    Please provide a reason for rejecting this verification request.
                                    This will be visible to the user.
                                </p>
                                <div className="mb-3">
                                    <label htmlFor="rejectReason" className="form-label">
                                        Rejection Reason <span className="text-muted">(optional)</span>
                                    </label>
                                    <textarea
                                        id="rejectReason"
                                        className="form-control"
                                        rows={4}
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="e.g., Missing required documents, invalid certificate, etc."
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-danger"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Rejecting...
                                        </>
                                    ) : (
                                        'Reject Verification'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
