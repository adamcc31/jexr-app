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
  title: 'J Expert - Your Specialist Partner for Japan-Ready Talent in Indonesia',
  description: 'J Expert - Your Specialist Partner for Japan-Ready Talent in Indonesia',
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
