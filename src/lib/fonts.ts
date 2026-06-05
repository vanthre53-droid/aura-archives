import { Bodoni_Moda, DM_Sans } from 'next/font/google'

/**
 * Fonts must be initialized at module level (never inside a component).
 * Exposed as CSS variables consumed by Tailwind (font-serif / font-sans).
 */
export const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})
