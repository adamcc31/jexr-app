'use client';

import React from 'react';
import SearchableDropdown from '../SearchableDropdown';
import { searchLPK } from '@/lib/candidate-api';
import type { LPK, LPKSelectionType } from '@/types/onboarding';

interface Step2LPKProps {
    selectionType: LPKSelectionType;
    selectedLPK: LPK | null;
    otherName: string;
    onSelectionTypeChange: (type: LPKSelectionType) => void;
    onLPKChange: (lpk: LPK | null) => void;
    onOtherNameChange: (name: string) => void;
}

/**
 * Step 2: LPK Origin
 * "Sebutkan LPK bahasa Jepang tempat Anda belajar sebelum berangkat ke Jepang"
 */
export default function Step2LPK({
    selectionType,
    selectedLPK,
    otherName,
    onSelectionTypeChange,
    onLPKChange,
    onOtherNameChange,
}: Step2LPKProps) {
    const handleLPKSearch = async (query: string): Promise<LPK[]> => {
        return await searchLPK(query);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Asal LPK
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
                Sebutkan LPK bahasa Jepang tempat Anda belajar sebelum berangkat ke Jepang
            </p>

            <div className="space-y-4">
                {/* Option: Select from List */}
                <label
                    className={`
                        relative flex items-start p-4 rounded-lg cursor-pointer
                        border transition-all duration-200
                        ${selectionType === 'list'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                    `}
                >
                    <input
                        type="radio"
                        name="lpk-type"
                        value="list"
                        checked={selectionType === 'list'}
                        onChange={() => onSelectionTypeChange('list')}
                        className="mt-1 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                        <span className="font-medium text-slate-900 dark:text-white block mb-2">
                            Pilih dari daftar LPK
                        </span>
                        <SearchableDropdown
                            value={selectedLPK}
                            disabled={selectionType !== 'list'}
                            placeholder="Ketik nama LPK untuk mencari..."
                            onSearch={handleLPKSearch}
                            onChange={onLPKChange}
                        />
                    </div>
                </label>

                {/* Option: Other (Manual Input) */}
                <label
                    className={`
                        relative flex items-start p-4 rounded-lg cursor-pointer
                        border transition-all duration-200
                        ${selectionType === 'other'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                    `}
                >
                    <input
                        type="radio"
                        name="lpk-type"
                        value="other"
                        checked={selectionType === 'other'}
                        onChange={() => onSelectionTypeChange('other')}
                        className="mt-1 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                        <span className="font-medium text-slate-900 dark:text-white block mb-2">
                            Lainnya (tulis manual)
                        </span>
                        <input
                            type="text"
                            value={otherName}
                            onChange={(e) => onOtherNameChange(e.target.value)}
                            disabled={selectionType !== 'other'}
                            placeholder="Nama LPK..."
                            className={`
                                w-full px-4 py-3
                                bg-white dark:bg-slate-800
                                border border-slate-300 dark:border-slate-600
                                rounded-lg
                                text-slate-900 dark:text-slate-100
                                placeholder-slate-400 dark:placeholder-slate-500
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                transition-all duration-200
                                ${selectionType !== 'other' ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        />
                    </div>
                </label>

                {/* Option: No LPK */}
                <label
                    className={`
                        relative flex items-center p-4 rounded-lg cursor-pointer
                        border transition-all duration-200
                        ${selectionType === 'none'
                            ? 'border-slate-500 bg-slate-100 dark:bg-slate-800'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                    `}
                >
                    <input
                        type="radio"
                        name="lpk-type"
                        value="none"
                        checked={selectionType === 'none'}
                        onChange={() => onSelectionTypeChange('none')}
                        className="h-4 w-4 text-slate-600 border-slate-300 focus:ring-slate-500"
                    />
                    <span className="ml-3 font-medium text-slate-700 dark:text-slate-300">
                        Saya tidak belajar di LPK
                    </span>
                </label>
            </div>
        </div>
    );
}
