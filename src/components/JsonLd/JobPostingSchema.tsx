import React from 'react';
import { JobWithCompany } from '@/types/employer';

interface JobPostingSchemaProps {
    job: JobWithCompany;
}

export default function JobPostingSchema({ job }: JobPostingSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        identifier: {
            '@type': 'PropertyValue',
            name: job.company_name,
            value: job.id,
        },
        datePosted: new Date(job.created_at).toISOString(),
        validThrough: new Date(new Date(job.created_at).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Roughly 3 months validity
        employmentType: job.employment_type?.toUpperCase().replace(' ', '_'),
        hiringOrganization: {
            '@type': 'Organization',
            name: job.company_name,
            sameAs: `https://jexpertrecruitment.com/candidate/companies/${job.company_id}`,
            logo: job.company_logo_url,
        },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
                addressCountry: 'ID', // Assuming ID, or need to parse from location string
            },
        },
        baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'IDR',
            value: {
                '@type': 'QuantitativeValue',
                minValue: job.salary_min,
                maxValue: job.salary_max,
                unitText: 'MONTH',
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
