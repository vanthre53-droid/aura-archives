import { ProductGrid } from '@/components/shop/ProductGrid'
import type { Product } from '@/types/shop.types'

export function CuratedPairings({ products }: { products: Product[] }): React.ReactElement | null {
  if (products.length === 0) return null
  return (
    <section className="mt-24 flex flex-col gap-8">
      <h2 className="text-center font-serif text-2xl">You might also like</h2>
      <ProductGrid products={products} />
    </section>
  )
}
