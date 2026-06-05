import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { searchProducts } from '@/services/product.service'
import { SearchBar } from '@/components/shop/SearchBar'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: false },
}

async function Results({ query }: { query: string }): Promise<React.ReactElement> {
  if (!query) {
    return (
      <p className="py-16 text-center text-sm text-text-muted">
        Search the archive by name, material, or category.
      </p>
    )
  }
  const products = await searchProducts(query)
  if (products.length === 0) {
    return (
      <EmptyState
        title={`No results for “${query}”`}
        description="Try a different term, or browse the collections."
        action={
          <Button asChild variant="secondary" size="sm">
            <Link href="/collections">Browse collections</Link>
          </Button>
        }
      />
    )
  }
  return (
    <>
      <p className="py-4 text-xs uppercase tracking-widest text-text-muted">
        {products.length} {products.length === 1 ? 'result' : 'results'}
      </p>
      <ProductGrid products={products} />
    </>
  )
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}): React.ReactElement {
  const query = searchParams.q?.trim() ?? ''
  return (
    <div className="mx-auto max-w-container px-4 py-10 md:px-10">
      <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
        <SearchBar />
      </Suspense>
      <div className="mt-6">
        <Suspense key={query} fallback={<LoadingSpinner className="mx-auto py-16" />}>
          <Results query={query} />
        </Suspense>
      </div>
    </div>
  )
}
