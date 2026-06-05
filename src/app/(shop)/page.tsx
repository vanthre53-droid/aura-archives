import type { Metadata } from 'next'
import Link from 'next/link'
import { getFeaturedProducts, listProducts } from '@/services/product.service'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { NewsletterSignup } from '@/components/shop/NewsletterSignup'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema } from '@/components/seo/schemas'

export const metadata: Metadata = {
  title: 'Aura Archives — Timeless Jewelry & Clothing',
  description:
    'An editorial archive of fine jewelry and clothing, curated for the contemporary silhouette.',
  openGraph: {
    title: 'Aura Archives — Timeless Jewelry & Clothing',
    description: 'Timeless artifacts of jewelry and clothing.',
    images: ['/og/home-og.png'],
  },
}

export default async function HomePage(): Promise<React.ReactElement> {
  const [featured, jewelry] = await Promise.all([
    getFeaturedProducts(8),
    listProducts({ categorySlug: 'jewelry', limit: 4 }),
  ])

  return (
    <>
      <JsonLd data={organizationSchema()} />

      <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-6 border-b border-border px-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-text-muted">The Archive</p>
        <h1 className="max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
          Timeless artifacts, curated.
        </h1>
        <p className="max-w-md text-sm text-text-muted">
          Fine jewelry and archival clothing for the contemporary silhouette.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/collections/jewelry">Shop Jewelry</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/collections/clothing">Shop Clothing</Link>
          </Button>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="mx-auto max-w-container px-4 py-20 md:px-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl">New Arrivals</h2>
            <Link href="/collections" className="text-xs uppercase tracking-widest text-text-muted hover:text-text">
              View all
            </Link>
          </div>
          <ProductGrid products={featured} priorityCount={4} />
        </section>
      ) : null}

      {jewelry.products.length > 0 ? (
        <section className="bg-surface-low">
          <div className="mx-auto max-w-container px-4 py-20 md:px-10">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-serif text-3xl">The Jewelry Archive</h2>
              <Link
                href="/collections/jewelry"
                className="text-xs uppercase tracking-widest text-text-muted hover:text-text"
              >
                View all
              </Link>
            </div>
            <ProductGrid products={jewelry.products} />
          </div>
        </section>
      ) : null}

      <section className="mx-auto flex max-w-container flex-col items-center gap-4 px-4 py-24 text-center md:px-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-text-muted">Exhibition</p>
        <h2 className="max-w-xl font-serif text-3xl md:text-4xl">
          On Form &amp; Material
        </h2>
        <p className="max-w-md text-sm text-text-muted">
          A study of craftsmanship across our archival collections — the stories behind the pieces.
        </p>
        <Button asChild variant="secondary">
          <Link href="/exhibitions">Enter the exhibition</Link>
        </Button>
      </section>

      <NewsletterSignup />
    </>
  )
}
