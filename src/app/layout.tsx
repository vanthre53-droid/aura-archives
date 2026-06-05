import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { bodoniModa, dmSans } from '@/lib/fonts'
import { ToastProvider } from '@/components/ui/Toast'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Aura Archives — Timeless Jewelry & Clothing',
    template: '%s | Aura Archives',
  },
  description:
    'Timeless artifacts of jewelry and clothing, curated for the contemporary silhouette.',
  applicationName: 'Aura Archives',
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <html lang="en" className={`${bodoniModa.variable} ${dmSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PostHogProvider>
          <ToastProvider>{children}</ToastProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  )
}
