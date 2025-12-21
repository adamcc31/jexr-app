'use client';

import React, { useState } from 'react';
import { FiSearch, FiX, FiFilter, FiMapPin, FiDollarSign, FiBriefcase, FiMonitor, FiAward } from 'react-icons/fi';

// ============================================================================
// Filter Types
// ============================================================================

export interface JobFilters {
    location: string;
    salaryMin: number | null;
    salaryMax: number | null;
    employmentTypes: string[];
    jobTypes: string[];
    experienceLevels: string[];
}

export const initialFilters: JobFilters = {
    location: '',
    salaryMin: null,
    salaryMax: null,
    employmentTypes: [],
    jobTypes: [],
    experienceLevels: [],
};

// Filter options
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const JOB_TYPES = ['Onsite', 'Remote', 'Hybrid'];
const EXPERIENCE_LEVELS = ['Entry', 'Junior', 'Mid', 'Senior'];

// ============================================================================
// Component Props
// ============================================================================

interface JobFilterSidebarProps {
    filters: JobFilters;
    onFilterChange: (filters: JobFilters) => void;
    onClearFilters: () => void;
    isLoading?: boolean;
    activeFilterCount?: number;
}

// ============================================================================
// Sidebar Skeleton
// ============================================================================

function FilterSidebarSkeleton() {
    return (
        <div className="card bg-white rounded shadow p-4">
            <div className="placeholder-glow">
                <div className="placeholder col-6 mb-4" style={{ height: 24 }}></div>
                <div className="placeholder col-12 mb-3" style={{ height: 40 }}></div>
                <div className="placeholder col-8 mb-4" style={{ height: 16 }}></div>

                <div className="placeholder col-5 mb-3" style={{ height: 20 }}></div>
                <div className="placeholder col-10 mb-2" style={{ height: 32 }}></div>
                <div className="placeholder col-10 mb-4" style={{ height: 32 }}></div>

                <div className="placeholder col-6 mb-3" style={{ height: 20 }}></div>
                <div className="placeholder col-8 mb-2" style={{ height: 24 }}></div>
                <div className="placeholder col-8 mb-2" style={{ height: 24 }}></div>
                <div className="placeholder col-8 mb-2" style={{ height: 24 }}></div>
            </div>
        </div>
    );
}

// ============================================================================
// Checkbox Filter Section
// ============================================================================

interface CheckboxFilterProps {
    title: string;
    icon: React.ReactNode;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

function CheckboxFilter({ title, icon, options, selected, onChange }: CheckboxFilterProps) {
    const handleToggle = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(s => s !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="filter-section mb-4">
            <h6 className="d-flex align-items-center mb-3 text-dark fw-semibold">
                {icon}
                <span className="ms-2">{title}</span>
            </h6>
            <div className="filter-options">
                {options.map(option => (
                    <div key={option} className="form-check mb-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`filter-${title}-${option}`}
                            checked={selected.includes(option)}
                            onChange={() => handleToggle(option)}
                        />
                        <label
                            className="form-check-label text-muted"
                            htmlFor={`filter-${title}-${option}`}
                            style={{ cursor: 'pointer' }}
                        >
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function JobFilterSidebar({
    filters,
    onFilterChange,
    onClearFilters,
    isLoading = false,
    activeFilterCount = 0,
}: JobFilterSidebarProps) {
    // Mobile drawer state
    const [mobileOpen, setMobileOpen] = useState(false);

    if (isLoading) {
        return <FilterSidebarSkeleton />;
    }

    // Update individual filter
    const updateFilter = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
        onFilterChange({ ...filters, [key]: value });
    };

    // Format salary for display
    const formatSalaryInput = (value: string): number | null => {
        const num = parseInt(value.replace(/\D/g, ''), 10);
        return isNaN(num) ? null : num;
    };

    const hasActiveFilters = activeFilterCount > 0;

    // Sidebar content
    const sidebarContent = (
        <div className="filter-sidebar-content">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
                    <FiFilter className="me-2 text-primary" />
                    Filters
                    {hasActiveFilters && (
                        <span className="badge bg-primary ms-2 rounded-pill">{activeFilterCount}</span>
                    )}
                </h5>
                {hasActiveFilters && (
                    <button
                        className="btn btn-sm btn-soft-danger"
                        onClick={onClearFilters}
                        title="Clear all filters"
                    >
                        <FiX className="me-1" />
                        Clear
                    </button>
                )}
            </div>

            {/* Location Filter */}
            <div className="filter-section mb-4">
                <h6 className="d-flex align-items-center mb-3 text-dark fw-semibold">
                    <FiMapPin className="text-primary" />
                    <span className="ms-2">Location</span>
                </h6>
                <div className="position-relative">
                    <FiSearch className="position-absolute text-muted" style={{ left: 12, top: 12 }} />
                    <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="City, prefecture, or country"
                        value={filters.location}
                        onChange={(e) => updateFilter('location', e.target.value)}
                    />
                </div>
            </div>

            {/* Salary Range Filter */}
            <div className="filter-section mb-4">
                <h6 className="d-flex align-items-center mb-3 text-dark fw-semibold">
                    <FiDollarSign className="text-primary" />
                    <span className="ms-2">Salary Range (IDR)</span>
                </h6>
                <div className="row g-2">
                    <div className="col-6">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Min"
                            value={filters.salaryMin ? filters.salaryMin.toLocaleString('id-ID') : ''}
                            onChange={(e) => updateFilter('salaryMin', formatSalaryInput(e.target.value))}
                        />
                    </div>
                    <div className="col-6">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Max"
                            value={filters.salaryMax ? filters.salaryMax.toLocaleString('id-ID') : ''}
                            onChange={(e) => updateFilter('salaryMax', formatSalaryInput(e.target.value))}
                        />
                    </div>
                </div>
                <small className="text-muted mt-1 d-block">
                    Filter jobs by salary range
                </small>
            </div>

            {/* Employment Type Filter */}
            <CheckboxFilter
                title="Employment Type"
                icon={<FiBriefcase className="text-primary" />}
                options={EMPLOYMENT_TYPES}
                selected={filters.employmentTypes}
                onChange={(selected) => updateFilter('employmentTypes', selected)}
            />

            {/* Job Type Filter */}
            <CheckboxFilter
                title="Job Type"
                icon={<FiMonitor className="text-primary" />}
                options={JOB_TYPES}
                selected={filters.jobTypes}
                onChange={(selected) => updateFilter('jobTypes', selected)}
            />

            {/* Experience Level Filter */}
            <CheckboxFilter
                title="Experience Level"
                icon={<FiAward className="text-primary" />}
                options={EXPERIENCE_LEVELS}
                selected={filters.experienceLevels}
                onChange={(selected) => updateFilter('experienceLevels', selected)}
            />
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="d-none d-lg-block sticky-top" style={{ top: 100 }}>
                <div className="card bg-white rounded shadow-sm border-0 p-4">
                    {sidebarContent}
                </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="d-lg-none mb-4">
                <button
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                    onClick={() => setMobileOpen(true)}
                >
                    <FiFilter className="me-2" />
                    Filters
                    {hasActiveFilters && (
                        <span className="badge bg-white text-primary ms-2">{activeFilterCount}</span>
                    )}
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`position-fixed top-0 start-0 h-100 bg-white d-lg-none overflow-auto transition-transform ${mobileOpen ? '' : 'translate-x-n100'}`}
                style={{
                    width: '85%',
                    maxWidth: 320,
                    zIndex: 1055,
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-in-out',
                }}
            >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="mb-0 fw-bold">Filter Jobs</h5>
                    <button
                        className="btn btn-sm btn-light rounded-circle"
                        onClick={() => setMobileOpen(false)}
                    >
                        <FiX />
                    </button>
                </div>
                <div className="p-4">
                    {sidebarContent}
                </div>
                <div className="p-3 border-top bg-light">
                    <button
                        className="btn btn-primary w-100"
                        onClick={() => setMobileOpen(false)}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}

// ============================================================================
// Helper: Count Active Filters
// ============================================================================

export function countActiveFilters(filters: JobFilters): number {
    let count = 0;
    if (filters.location.trim()) count++;
    if (filters.salaryMin !== null) count++;
    if (filters.salaryMax !== null) count++;
    count += filters.employmentTypes.length;
    count += filters.jobTypes.length;
    count += filters.experienceLevels.length;
    return count;
}
