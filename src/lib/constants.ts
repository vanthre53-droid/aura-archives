export const APP_NAME = 'Aura Archives'

export const APP_VERSION = '1.0.0'

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const SUPPORT_EMAIL = 'support@auraarchives.com'
export const PRIVACY_EMAIL = 'privacy@auraarchives.com'
export const LEGAL_EMAIL = 'legal@auraarchives.com'

export const DEFAULT_CURRENCY = 'INR'

/** Default pagination size for product listings. */
export const PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 50

/** Category slugs used across the storefront. */
export const CATEGORY_SLUGS = {
  jewelry: 'jewelry',
  clothing: 'clothing',
} as const

/** Order lifecycle, in progression order. Mirrors the `order_status` DB enum. */
export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
] as const
