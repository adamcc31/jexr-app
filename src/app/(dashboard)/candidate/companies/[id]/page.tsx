import type { Metadata } from 'next';
import { apiClient } from '@/lib/api';
import type { PublicCompanyProfile, ApiResponse } from '@/types/employer';
import CompanyProfileClient from './CompanyProfileClient';

// ============================================================================
// Server-side Metadata Generation
// ============================================================================

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Generate metadata for SEO
 * Runs on server side for optimal SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const companyId = parseInt(id);

    if (isNaN(companyId) || companyId <= 0) {
        return {
            title: 'Company Not Found | J Expert',
            description: 'The requested company profile could not be found.',
        };
    }

    try {
        const response = await apiClient.get<ApiResponse<PublicCompanyProfile>>(`/companies/${companyId}`);
        const company = response.data.data;

        return {
            title: `${company.company_name} | Company Profile | J Expert`,
            description: company.company_story
                ? company.company_story.substring(0, 160)
                : `View ${company.company_name}'s company profile, open positions, and learn about their culture on J Expert.`,
            openGraph: {
                title: company.company_name,
                description: company.company_story?.substring(0, 160) || `${company.company_name} on J Expert`,
                images: company.logo_url ? [company.logo_url] : [],
            },
        };
    } catch {
        return {
            title: 'Company Profile | J Expert',
            description: 'View company profiles and open positions on J Expert.',
        };
    }
}

// ============================================================================
// Page Component (Server Component wrapper)
// ============================================================================

export default async function CompanyProfilePage({ params }: PageProps) {
    const { id } = await params;
    return <CompanyProfileClient companyId={id} />;
}
