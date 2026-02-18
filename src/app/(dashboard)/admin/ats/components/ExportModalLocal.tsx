'use client';

/**
 * ATS Local Export Modal Component
 *
 * Modal for selecting columns and format for export.
 * Extended version with local columns: Unique Code, Email, Phone.
 */

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { EXPORT_COLUMNS as BASE_EXPORT_COLUMNS, type ExportColumn } from '@/types/ats';

interface ExportModalProps {
    show: boolean;
    onHide: () => void;
    totalCandidates: number;
    onExport: (columns: string[], format: 'xlsx' | 'csv') => void;
    isExporting: boolean;
    error?: string | null;
}

// Extended columns for local use
const LOCAL_EXTRA_COLUMNS: ExportColumn[] = [
    { key: 'unique_code', label: 'Unique Code', defaultChecked: true, group: 'identity' },
    { key: 'email', label: 'Email', defaultChecked: true, group: 'identity' },
    { key: 'phone', label: 'Phone', defaultChecked: true, group: 'identity' },
];

// Combine columns
const EXPORT_COLUMNS = [...LOCAL_EXTRA_COLUMNS, ...BASE_EXPORT_COLUMNS];

export default function ExportModalLocal({
    show,
    onHide,
    totalCandidates,
    onExport,
    isExporting,
    error,
}: ExportModalProps) {
    // Initialize selected columns with defaults
    const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(() => {
        const defaults: Record<string, boolean> = {};
        EXPORT_COLUMNS.forEach((col) => {
            defaults[col.key] = col.defaultChecked;
        });
        return defaults;
    });

    const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');

    // Group columns by category
    const columnsByGroup = EXPORT_COLUMNS.reduce((acc, col) => {
        if (!acc[col.group]) {
            acc[col.group] = [];
        }
        acc[col.group].push(col);
        return acc;
    }, {} as Record<string, ExportColumn[]>);

    const groupLabels: Record<string, string> = {
        identity: 'Identity',
        qualifications: 'Qualifications',
        work: 'Work & Availability',
        optional: 'Optional',
    };

    // Toggle column selection
    const toggleColumn = (key: string) => {
        setSelectedColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Select/deselect all in group
    const toggleGroup = (group: string, checked: boolean) => {
        const groupColumns = columnsByGroup[group] || [];
        setSelectedColumns((prev) => {
            const updated = { ...prev };
            groupColumns.forEach((col) => {
                updated[col.key] = checked;
            });
            return updated;
        });
    };

    // Check if all in group are selected
    const isGroupFullySelected = (group: string) => {
        const groupColumns = columnsByGroup[group] || [];
        return groupColumns.every((col) => selectedColumns[col.key]);
    };

    // Handle export
    const handleExport = () => {
        const columns = Object.entries(selectedColumns)
            .filter(([, selected]) => selected)
            .map(([key]) => key);

        if (columns.length === 0) {
            return; // Don't export without columns
        }

        onExport(columns, format);
    };

    const selectedCount = Object.values(selectedColumns).filter(Boolean).length;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Export Candidates (Enhanced)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => { }}>
                        {error}
                    </Alert>
                )}

                <p className="text-muted mb-4">
                    Select the columns you want to include in your export. Exporting{' '}
                    <strong>{totalCandidates.toLocaleString()}</strong> candidates.
                </p>

                {/* Column Selection */}
                {Object.entries(columnsByGroup).map(([group, columns]) => (
                    <div key={group} className="mb-4">
                        <div className="d-flex align-items-center mb-2">
                            <Form.Check
                                type="checkbox"
                                id={`group-${group}`}
                                checked={isGroupFullySelected(group)}
                                onChange={(e) => toggleGroup(group, e.target.checked)}
                                label={<strong>{groupLabels[group]}</strong>}
                            />
                        </div>
                        <Row className="ps-4">
                            {columns.map((col) => (
                                <Col key={col.key} xs={6} md={4}>
                                    <Form.Check
                                        type="checkbox"
                                        id={`col-${col.key}`}
                                        checked={selectedColumns[col.key] || false}
                                        onChange={() => toggleColumn(col.key)}
                                        label={col.label}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}

                {/* Format Selection */}
                <div className="border-top pt-3 mt-3">
                    <Form.Label className="fw-semibold">Export Format</Form.Label>
                    <div>
                        <Form.Check
                            inline
                            type="radio"
                            id="format-csv"
                            name="format"
                            label="CSV (.csv)"
                            checked={format === 'csv'}
                            onChange={() => setFormat('csv')}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            id="format-xlsx"
                            name="format"
                            label="Excel (.xlsx) - CSV fallback"
                            checked={format === 'xlsx'}
                            onChange={() => setFormat('xlsx')}
                            title="Actually exports as CSV for frontend processing simplicity"
                        />
                    </div>
                    <small className="text-muted d-block mt-1">
                        Note: Enhanced export runs in browser and generates CSV files compatible with Excel.
                    </small>
                </div>

                {/* Export limit warning */}
                {totalCandidates > 1000 && (
                    <Alert variant="warning" className="mt-3 mb-0">
                        Warning: Exporting a large number of candidates ({totalCandidates}) might take some time as we fetch detailed verification data for each record.
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <small className="text-muted">
                        {selectedCount} column{selectedCount !== 1 ? 's' : ''} selected
                    </small>
                    <div>
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleExport}
                            disabled={isExporting || selectedCount === 0}
                        >
                            {isExporting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Exporting...
                                </>
                            ) : (
                                'Download'
                            )}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
