import { Metadata } from 'next';
import ATSPageClient from './ATSPageClient';

export const metadata: Metadata = {
    title: 'ATS - Applicant Tracking System | Admin',
    description: 'Search, filter, and export candidate data for recruitment operations.',
};

export default function ATSPage() {
    return <ATSPageClient />;
}
