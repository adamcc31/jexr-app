import React from 'react'

interface BreadcrumbItem {
    label: string
    path: string
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[]
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `https://jexpertrecruitment.com${item.path}`,
        })),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
