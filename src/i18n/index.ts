import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import locale resources
import enCandidate from '@/locales/en/candidate.json';
import idCandidate from '@/locales/id/candidate.json';

// Resources configuration
const resources = {
    en: {
        candidate: enCandidate,
    },
    id: {
        candidate: idCandidate,
    },
};

// Initialize i18next
i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback to English when translation is missing
    defaultNS: 'candidate', // default namespace
    ns: ['candidate'], // available namespaces

    interpolation: {
        escapeValue: false, // React already escapes values
    },

    // Missing key handler - logs warning for translators
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
        console.warn(
            `[i18n] Missing translation: "${key}" for language(s): ${lngs.join(', ')} in namespace: ${ns}`
        );
    },

    // React specific settings
    react: {
        useSuspense: false, // Disable suspense for SSR compatibility
    },
});

export default i18n;
