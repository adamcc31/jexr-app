import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://jexpertrecruitment.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/auth/',
                    '/lock-screen',
                    '/reset-password',
                    '/maintenance',
                    '/comingsoon',
                    '/error',
                    '/api/',
                    '/candidate/',  // Protected candidate dashboard
                    '/employer/',   // Protected employer dashboard
                    '/admin/',      // Protected admin dashboard
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
