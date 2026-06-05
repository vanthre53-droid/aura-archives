import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/constants'

/**
 * Static public routes. Product slugs are appended from the database in Step 13.
 */
const STATIC_ROUTES = [
  '',
  '/collections',
  '/collections/jewelry',
  '/collections/clothing',
  '/exhibitions',
  '/about',
  '/shipping',
  '/returns',
  '/sizing',
  '/care-guide',
  '/privacy',
  '/terms',
  '/cookies',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return STATIC_ROUTES.map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}
