'use client';

/**
 * ConfirmationModal Component
 * 
 * Generic confirmation dialog for destructive or important actions.
 * Used for disable user, reject company, hide job, etc.
 */

import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

export type ConfirmationVariant = 'danger' | 'warning' | 'primary' | 'success';

interface ConfirmationModalProps {
    /** Whether the modal is visible */
    show: boolean;
    /** Callback when modal is closed/cancelled */
    onClose: () => void;
    /** Callback when action is confirmed */
    onConfirm: () => void;
    /** Modal title */
    title: string;
    /** Modal body message */
    message: string | React.ReactNode;
    /** Text for confirm button (default: "Confirm") */
    confirmText?: string;
    /** Text for cancel button (default: "Cancel") */
    cancelText?: string;
    /** Button variant for confirm action */
    variant?: ConfirmationVariant;
    /** Whether confirm action is in progress */
    isLoading?: boolean;
}

/**
 * ConfirmationModal - Displays a confirmation dialog before performing actions
 * 
 * @example
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 * const { mutate, isPending } = useDisableUser();
 * 
 * <ConfirmationModal
 *     show={showModal}
 *     onClose={() => setShowModal(false)}
 *     onConfirm={() => mutate({ userId: user.id, disable: true })}
 *     title="Disable User"
 *     message="Are you sure you want to disable this user?"
 *     confirmText="Disable"
 *     variant="danger"
 *     isLoading={isPending}
 * />
 * ```
 */
export function ConfirmationModal({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmationModalProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop={isLoading ? 'static' : true}
            keyboard={!isLoading}
        >
            <Modal.Header closeButton={!isLoading}>
                <Modal.Title className="fs-5">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {typeof message === 'string' ? (
                    <p className="mb-0 text-muted">{message}</p>
                ) : (
                    message
                )}
            </Modal.Body>
            <Modal.Footer className="border-top-0">
                <Button
                    variant="light"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {cancelText}
                </Button>
                <Button
                    variant={variant}
                    onClick={handleConfirm}
                    disabled={isLoading}
                    style={{ minWidth: '90px' }}
                >
                    {isLoading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                className="me-2"
                            />
                            Loading...
                        </>
                    ) : (
                        confirmText
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;
