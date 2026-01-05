'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

const LANGUAGE_KEY = 'jexpert-language';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Read persisted language preference
        const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
        if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'id')) {
            i18n.changeLanguage(storedLanguage);
            document.documentElement.lang = storedLanguage;
        }
        setIsInitialized(true);
    }, []);

    // Listen for language changes and update HTML lang attribute
    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            document.documentElement.lang = lng;
            localStorage.setItem(LANGUAGE_KEY, lng);
        };

        i18n.on('languageChanged', handleLanguageChange);
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    // Render children immediately - translations work synchronously
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
