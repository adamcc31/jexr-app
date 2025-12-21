import { Plus_Jakarta_Sans } from 'next/font/google'
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./assets/scss/style.scss"
import "./assets/css/materialdesignicons.min.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: '--font-jakarta',
})

export const metadata = {
  title: 'J Expert - Your Specialist Partner for Japan-Ready Talent in Indonesia',
  description: 'J Expert - Your Specialist Partner for Japan-Ready Talent in Indonesia',
}

// Separate viewport export for Next.js 16
export const viewport = {
  width: 1200,
  initialScale: 0.3,
  minimumScale: 0.1,
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
