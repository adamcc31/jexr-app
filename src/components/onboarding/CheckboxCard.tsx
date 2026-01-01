'use client';

import React from 'react';

interface CheckboxCardProps {
    label: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
    variant?: 'default' | 'muted';
    onChange: (checked: boolean) => void;
}

/**
 * Reusable CheckboxCard component
 * Entire card is clickable with clear selected/unselected states
 * Adapted from new_question_page.html design
 */
export default function CheckboxCard({
    label,
    description,
    checked,
    disabled = false,
    variant = 'default',
    onChange,
}: CheckboxCardProps) {
    const handleClick = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    const baseClasses = `
        relative flex items-center p-4 rounded-lg cursor-pointer
        transition-all duration-200 shadow-sm
        border
    `;

    const variantClasses = variant === 'muted'
        ? checked
            ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 dark:border-slate-500'
            : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 opacity-90 hover:opacity-100'
        : checked
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
            : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600';

    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : '';

    return (
        <div
            role="checkbox"
            aria-checked={checked}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            {/* Checkbox Input */}
            <div className="flex items-center h-5">
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onChange(!checked)}
                    className={`
                        h-5 w-5 rounded focus:ring-2 focus:ring-offset-2
                        ${variant === 'muted'
                            ? 'text-slate-500 border-gray-300 focus:ring-slate-500 dark:bg-slate-700 dark:border-slate-600'
                            : 'text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600'
                        }
                    `}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Label & Description */}
            <div className="ml-3 flex-1">
                <span
                    className={`
                        font-medium block
                        ${checked
                            ? variant === 'muted'
                                ? 'text-slate-800 dark:text-slate-300'
                                : 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }
                    `}
                >
                    {label}
                </span>
                {description && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 block">
                        {description}
                    </span>
                )}
            </div>

            {/* Check Icon */}
            {checked && (
                <div className={`${variant === 'muted' ? 'text-slate-500' : 'text-blue-600 dark:text-blue-400'}`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}
