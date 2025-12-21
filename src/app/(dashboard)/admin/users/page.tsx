'use client';

/**
 * User Management Page
 * 
 * Features:
 * - CRUD operations for Users (Create, Read, Update, Delete)
 * - Premium UI design
 * - Role-based filtering
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Form, Button, Modal, Alert, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { ColumnDef } from '@tanstack/react-table';
import { AdminTable, StatusBadge, ConfirmationModal } from '@/components/admin';
import {
    useAdminUsers,
    useDisableUser,
    useCreateUser,
    useUpdateUser,
    useDeleteUser
} from '@/hooks/admin';
import type { AdminUser, UserRole, AdminUserFilters, CreateUserPayload, UpdateUserPayload } from '@/types/admin';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

/**
 * UserFormModal - Handles Create and Edit operations
 */
function UserFormModal({
    show,
    onClose,
    user, // If provided, we are in Edit mode
}: {
    show: boolean;
    onClose: () => void;
    user?: AdminUser | null;
}) {
    const isEdit = !!user;
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<CreateUserPayload | UpdateUserPayload>({
        defaultValues: {
            email: '',
            role: 'candidate'
        }
    });

    // Reset form when user changes or modal opens
    useEffect(() => {
        if (show) {
            if (user) {
                setValue('email', user.email);
                setValue('role', user.role);
            } else {
                reset({ email: '', role: 'candidate' });
            }
        }
    }, [show, user, setValue, reset]);

    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

    const isLoading = isCreating || isUpdating;

    const onSubmit = (data: any) => {
        if (isEdit && user) {
            updateUser({ userId: user.id, email: data.email, role: data.role }, {
                onSuccess: () => {
                    onClose();
                    reset();
                }
            });
        } else {
            createUser({ email: data.email, role: data.role }, {
                onSuccess: () => {
                    onClose();
                    reset();
                }
            });
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered backdrop="static" className="premium-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">
                    {isEdit ? 'Edit User' : 'Create New User'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className="pt-3">
                    {!isEdit && (
                        <Alert variant="info" className="mb-4 small">
                            <div className="d-flex gap-2">
                                <IconifyIcon icon="solar:info-circle-bold" className="mt-1 flex-shrink-0" />
                                <div>
                                    <strong>Note:</strong> Creating a user here only creates the profile record.
                                    The user must still sign up via the login page with this email to set their password.
                                </div>
                            </div>
                        </Alert>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.message as string}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Role</Form.Label>
                        <Form.Select
                            {...register('role', { required: 'Role is required' })}
                            isInvalid={!!errors.role}
                        >
                            <option value="candidate">Candidate</option>
                            <option value="employer">Employer</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.role?.message as string}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isLoading} className="px-4">
                        {isLoading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create User')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

/**
 * UserManagementPage - Main user management page component
 */
export default function UserManagementPage() {
    // State
    const [filters, setFilters] = useState<AdminUserFilters>({
        page: 1,
        pageSize: 10,
    });

    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Data Fetching
    const { data: usersData, isLoading, error, refetch } = useAdminUsers(filters);
    const { mutate: disableUser, isPending: isDisabling } = useDisableUser();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

    // Handlers
    const handleRoleFilter = (role: string) => {
        setFilters(prev => ({
            ...prev,
            role: role === 'all' ? undefined : role as UserRole,
            page: 1,
        }));
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setIsEditMode(false);
        setShowFormModal(true);
    };

    const handleEdit = (user: AdminUser) => {
        setSelectedUser(user);
        setIsEditMode(true);
        setShowFormModal(true);
    };

    const handleDelete = (user: AdminUser) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleToggleDisable = (user: AdminUser) => {
        setSelectedUser(user);
        setShowDisableModal(true);
    };

    const confirmDisable = () => {
        if (!selectedUser) return;
        disableUser(
            { userId: selectedUser.id, disable: !selectedUser.isDisabled },
            {
                onSuccess: () => {
                    setShowDisableModal(false);
                    setSelectedUser(null);
                },
            }
        );
    };

    const confirmDelete = () => {
        if (!selectedUser) return;
        deleteUser(selectedUser.id, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUser(null);
            },
        });
    };

    // Table Columns
    const columns = useMemo<ColumnDef<AdminUser, unknown>[]>(() => [
        {
            accessorKey: 'email',
            header: 'User',
            cell: ({ row }) => (
                <div className="d-flex align-items-center">
                    <div
                        className={`rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0 ${row.original.role === 'admin' ? 'bg-danger bg-opacity-10 text-danger' :
                                row.original.role === 'employer' ? 'bg-info bg-opacity-10 text-info' :
                                    'bg-primary bg-opacity-10 text-primary'
                            }`}
                        style={{ width: '40px', height: '40px', fontSize: '1rem', fontWeight: 'bold' }}
                    >
                        {row.original.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="fw-semibold text-dark">{row.original.email}</div>
                        <div className="small text-muted">ID: {row.original.id.substring(0, 8)}...</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
        },
        {
            accessorKey: 'isDisabled',
            header: 'Status',
            cell: ({ getValue }) => (
                <StatusBadge status={getValue() ? 'disabled' : 'active'} />
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Join Date',
            cell: ({ getValue }) => (
                <span className="text-muted small">
                    {new Date(getValue() as string).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="d-flex gap-2 justify-content-end">
                        <Button
                            variant="light"
                            size="sm"
                            className="btn-icon rounded-circle"
                            onClick={() => handleEdit(user)}
                            title="Edit User"
                        >
                            <IconifyIcon icon="solar:pen-bold" className="text-primary" />
                        </Button>
                        <Button
                            variant="light"
                            size="sm"
                            className="btn-icon rounded-circle"
                            onClick={() => handleToggleDisable(user)}
                            title={user.isDisabled ? 'Enable User' : 'Disable User'}
                        >
                            <IconifyIcon
                                icon={user.isDisabled ? 'solar:user-check-bold' : 'solar:user-block-bold'}
                                className={user.isDisabled ? 'text-success' : 'text-warning'}
                            />
                        </Button>
                        <Button
                            variant="light"
                            size="sm"
                            className="btn-icon rounded-circle"
                            onClick={() => handleDelete(user)}
                            title="Delete User"
                        >
                            <IconifyIcon icon="solar:trash-bin-trash-bold" className="text-danger" />
                        </Button>
                    </div>
                );
            },
        },
    ], []);

    return (
        <div className="user-management-page">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">User Management</h4>
                    <p className="text-muted mb-0">Create, manage, and monitor user accounts</p>
                </div>
                <Button variant="primary" onClick={handleCreate} className="d-flex align-items-center gap-2 shadow-sm">
                    <IconifyIcon icon="solar:user-plus-bold" />
                    <span>Create User</span>
                </Button>
            </div>

            {/* Table */}
            <AdminTable<AdminUser>
                columns={columns}
                data={usersData?.data ?? []} // Safe access thanks to interceptor
                isLoading={isLoading}
                error={error as Error | null}
                onRetry={refetch}
                pageSize={filters.pageSize}
                showPagination={true}
                emptyTitle="No users found"
                emptyMessage="Get started by creating a new user."
                headerActions={
                    <div className="d-flex gap-2">
                        <Form.Select
                            size="sm"
                            value={filters.role || 'all'}
                            onChange={(e) => handleRoleFilter(e.target.value)}
                            style={{ width: '150px' }}
                            className="border-0 shadow-sm bg-light"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="employer">Employer</option>
                            <option value="candidate">Candidate</option>
                        </Form.Select>

                        <Button
                            variant="light"
                            size="sm"
                            onClick={() => refetch()}
                            className="btn-icon rounded-circle shadow-sm"
                        >
                            <IconifyIcon icon="solar:refresh-bold" />
                        </Button>
                    </div>
                }
            />

            {/* Modals */}
            <UserFormModal
                show={showFormModal}
                onClose={() => setShowFormModal(false)}
                user={isEditMode ? selectedUser : null}
            />

            <ConfirmationModal
                show={showDisableModal}
                onClose={() => setShowDisableModal(false)}
                onConfirm={confirmDisable}
                title={selectedUser?.isDisabled ? 'Enable User' : 'Disable User'}
                message={selectedUser?.isDisabled
                    ? `Enable access for ${selectedUser?.email}?`
                    : `Restrict access for ${selectedUser?.email}?`}
                confirmText={selectedUser?.isDisabled ? 'Enable' : 'Disable'}
                variant={selectedUser?.isDisabled ? 'success' : 'warning'}
                isLoading={isDisabling}
            />

            <ConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to PERMANENTLY delete ${selectedUser?.email}? This action cannot be undone.`}
                confirmText="Delete Permanently"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
