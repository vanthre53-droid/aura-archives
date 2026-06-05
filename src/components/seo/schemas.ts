import { APP_NAME, APP_URL } from '@/lib/constants'
import type { Product } from '@/types/shop.types'

export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/icons/icon-512.png`,
    description: 'Timeless artifacts of jewelry and clothing, curated for the contemporary silhouette.',
  }
}

export function productSchema(product: Product): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ? [product.images[0]] : undefined,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: Number(product.price),
      availability:
        product.stock_quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${APP_URL}/products/${product.slug}`,
    },
  }
}

export function collectionPageSchema(name: string, path: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${APP_URL}${path}`,
  }
}
