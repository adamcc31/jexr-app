import { Plus_Jakarta_Sans } from 'next/font/google'
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./assets/scss/style.scss"
import "./assets/css/materialdesignicons.min.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ["400", "500", "600", "700"],  // Reduced from 7 to 4 weights
  display: 'swap',  // Prevents FOIT, shows fallback font while loading
  variable: '--font-jakarta',
  preload: true,
})

export const metadata = {
  title: {
    template: '%s | J Expert',
    default: 'J Expert - Japan-Ready Talent Recruitment Indonesia', // Fallback if no title is defined
  },
  description: 'J Expert connects Japanese companies in Indonesia with highly disciplined, skilled, and culturally aligned Indonesian talent (ex-Kenshusei) for long-term success.',
  metadataBase: new URL('https://jexpertrecruitment.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'J Expert - Japan-Ready Talent Recruitment Indonesia',
    description: 'J Expert connects Japanese companies in Indonesia with highly disciplined, skilled, and culturally aligned Indonesian talent.',
    url: 'https://jexpertrecruitment.com',
    siteName: 'J Expert',
    images: [
      {
        url: '/images/share.png', // Assuming we have or will have a share image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

// Mobile-first viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
}

import Providers from "./providers"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.variable}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
