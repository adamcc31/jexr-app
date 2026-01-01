'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { LPK } from '@/types/onboarding';

interface SearchableDropdownProps {
    value: LPK | null;
    disabled?: boolean;
    placeholder?: string;
    onSearch: (query: string) => Promise<LPK[]>;
    onChange: (lpk: LPK | null) => void;
}

/**
 * SearchableDropdown component
 * Debounced autocomplete dropdown for LPK search
 */
export default function SearchableDropdown({
    value,
    disabled = false,
    placeholder = 'Ketik untuk mencari...',
    onSearch,
    onChange,
}: SearchableDropdownProps) {
    const [query, setQuery] = useState(value?.name || '');
    const [results, setResults] = useState<LPK[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced search
    const debouncedSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const data = await onSearch(searchQuery);
            setResults(data);
        } catch (error) {
            console.error('LPK search failed:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [onSearch]);

    // Handle input change with debounce
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setIsOpen(true);
        setHighlightedIndex(-1);

        // Clear previous selection if user types
        if (value && newQuery !== value.name) {
            onChange(null);
        }

        // Debounce search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            debouncedSearch(newQuery);
        }, 300);
    };

    // Handle selection
    const handleSelect = (lpk: LPK) => {
        setQuery(lpk.name);
        onChange(lpk);
        setIsOpen(false);
        setResults([]);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && results[highlightedIndex]) {
                    handleSelect(results[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync query with value
    useEffect(() => {
        if (value) {
            setQuery(value.name);
        }
    }, [value]);

    // Cleanup debounce
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-full">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`
                        w-full px-4 py-3 pr-10
                        bg-white dark:bg-slate-800
                        border border-slate-300 dark:border-slate-600
                        rounded-lg
                        text-slate-900 dark:text-slate-100
                        placeholder-slate-400 dark:placeholder-slate-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                />

                {/* Loading / Search Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
                <ul
                    role="listbox"
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                    {results.map((lpk, index) => (
                        <li
                            key={lpk.id}
                            role="option"
                            aria-selected={highlightedIndex === index}
                            className={`
                                px-4 py-3 cursor-pointer transition-colors
                                ${highlightedIndex === index
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }
                            `}
                            onClick={() => handleSelect(lpk)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {lpk.name}
                        </li>
                    ))}
                </ul>
            )}

            {/* No Results Message */}
            {isOpen && query.length >= 2 && !isLoading && results.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 text-center text-slate-500 dark:text-slate-400">
                    Tidak ditemukan hasil untuk &quot;{query}&quot;
                </div>
            )}
        </div>
    );
}
