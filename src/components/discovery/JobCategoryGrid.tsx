'use client';

/**
 * JobCategoryGrid Component
 *
 * Displays job categories in a responsive grid layout.
 * Each category shows the title and job count.
 * Clicking a category navigates to the job list filtered by that category.
 */

import React from 'react';
import Link from 'next/link';
import { useJobCategories } from '@/hooks/useDiscovery';
import {
    FiBox,
    FiHeart,
    FiTool,
    FiHome,
    FiCoffee,
    FiSun,
    FiDroplet,
    FiTruck,
    FiSettings,
    FiActivity
} from 'react-icons/fi';

// Map category IDs to icons
const categoryIcons: Record<string, React.ElementType> = {
    'manufacturing': FiBox,
    'caregiving': FiHeart,
    'construction': FiTool,
    'hospitality': FiHome,
    'food-processing': FiCoffee,
    'agriculture': FiSun,
    'cleaning-services': FiDroplet,
    'logistics': FiTruck,
    'building-maintenance': FiSettings,
    'automotive': FiActivity,
};

function getIconForCategory(categoryId: string): React.ElementType {
    return categoryIcons[categoryId] || FiBox;
}

// Loading skeleton for category card
function CategorySkeleton() {
    return (
        <div className="col">
            <div className="position-relative job-category text-center px-4 py-5 rounded shadow placeholder-glow">
                <div className="feature-icon bg-soft-primary rounded shadow mx-auto position-relative overflow-hidden d-flex justify-content-center align-items-center">
                    <div className="placeholder" style={{ width: 24, height: 24 }}></div>
                </div>
                <div className="mt-4">
                    <div className="placeholder col-8 mx-auto mb-2" style={{ height: 20 }}></div>
                    <div className="placeholder col-5 mx-auto" style={{ height: 16 }}></div>
                </div>
            </div>
        </div>
    );
}

export default function JobCategoryGrid() {
    const { data: categories, isLoading, error } = useJobCategories();

    return (
        <div className="container">
            <div className="row justify-content-center mb-4">
                <div className="col-12 text-center">
                    <h4 className="title mb-3">Browse by Category</h4>
                    <p className="text-muted para-desc mx-auto mb-0">
                        Explore job opportunities across different industries
                    </p>
                </div>
            </div>

            <div className="row row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-1 g-4">
                {/* Loading State */}
                {isLoading && (
                    <>
                        <CategorySkeleton />
                        <CategorySkeleton />
                        <CategorySkeleton />
                        <CategorySkeleton />
                        <CategorySkeleton />
                        <CategorySkeleton />
                        <CategorySkeleton />
                        <CategorySkeleton />
                        <CategorySkeleton />
                        <CategorySkeleton />
                    </>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="col-12">
                        <div className="alert alert-warning text-center">
                            <i className="mdi mdi-alert-circle me-2"></i>
                            Unable to load categories. Please try again later.
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && categories?.length === 0 && (
                    <div className="col-12">
                        <div className="text-center py-4">
                            <FiBox className="text-muted mb-3" style={{ fontSize: 48 }} />
                            <h5 className="text-muted">No categories available</h5>
                        </div>
                    </div>
                )}

                {/* Categories Grid */}
                {!isLoading && !error && categories?.map((category) => {
                    const Icon = getIconForCategory(category.id);
                    return (
                        <div className="col" key={category.id}>
                            <Link
                                href={`/candidate/jobs?category=${category.id}`}
                                className="text-decoration-none"
                            >
                                <div className="position-relative job-category text-center px-4 py-5 rounded shadow">
                                    <div className="feature-icon bg-soft-primary rounded shadow mx-auto position-relative overflow-hidden d-flex justify-content-center align-items-center">
                                        <Icon className="fea icon-ex-md" />
                                    </div>
                                    <div className="mt-4">
                                        <h5 className="title text-dark mb-2">{category.title}</h5>
                                        <p className="text-muted mb-0">
                                            {category.job_count} {category.job_count === 1 ? 'Job' : 'Jobs'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
