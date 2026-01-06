import React from 'react'

export default function OrganizationSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'J Expert',
        legalName: 'PT Exata Indonesia', // Inferred from parent company context
        url: 'https://jexpertrecruitment.com',
        logo: 'https://jexpertrecruitment.com/images/logo-dark.png',
        email: 'info@jexpertrecruitment.com',
        description: 'Recruitment Agency connecting Japanese companies with Japan-Ready Indonesian Talent',
        sameAs: [
            'https://www.facebook.com/jexpertrecruitment',
            'https://www.linkedin.com/company/j-expert-recruitment',
            'https://www.instagram.com/jexpertrecruitment'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-811-8664-789',
            contactType: 'customer service',
            areaServed: ['ID', 'JP'],
            availableLanguage: ['en', 'id', 'ja'],
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jakarta',
            addressCountry: 'ID',
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
