import Link from 'next/link'
import { listProducts } from '@/services/product.service'
import { CollectionHero } from '@/components/shop/CollectionHero'
import { FilterBar } from '@/components/shop/FilterBar'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { CollectionPagination } from '@/components/shop/CollectionPagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PAGE_SIZE } from '@/lib/constants'

interface CollectionListingProps {
  categorySlug: string
  eyebrow: string
  title: string
  description: string
  filterTags: string[]
  page: number
  tag?: string
  basePath: string
}

export async function CollectionListing({
  categorySlug,
  eyebrow,
  title,
  description,
  filterTags,
  page,
  tag,
  basePath,
}: CollectionListingProps): Promise<React.ReactElement> {
  const { products, total } = await listProducts({
    categorySlug,
    tags: tag ? [tag] : undefined,
    page,
    limit: PAGE_SIZE,
  })
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <CollectionHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-container px-4 md:px-10">
        <FilterBar tags={filterTags} />
        {products.length === 0 ? (
          <EmptyState
            title="No pieces found"
            description="Try clearing your filters to see the full collection."
            action={
              <Button asChild variant="secondary" size="sm">
                <Link href={basePath}>Clear filters</Link>
              </Button>
            }
          />
        ) : (
          <>
            <ProductGrid products={products} priorityCount={4} className="py-4" />
            <CollectionPagination page={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </>
  )
}
