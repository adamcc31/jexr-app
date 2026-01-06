import React from 'react'

export default function WebsiteSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'J Expert',
        alternateName: ['J-Expert', 'JExpert', 'J-Expert Recruitment'],
        url: 'https://jexpertrecruitment.com',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://jexpertrecruitment.com/job-categories?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
