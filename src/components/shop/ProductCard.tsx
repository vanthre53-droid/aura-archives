import Link from 'next/link'
import { ProductImage } from '@/components/shop/ProductImage'
import { WishlistButton } from '@/components/shop/WishlistButton'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/shop.types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority }: ProductCardProps): React.ReactElement {
  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block" aria-label={product.name}>
          <ProductImage src={product.images?.[0]} alt={product.name} priority={priority} />
        </Link>
        <div className="absolute right-2 top-2">
          <WishlistButton productId={product.id} />
        </div>
        {product.tagline ? (
          <div className="absolute left-2 top-2">
            <Badge variant="primary">{product.tagline.split('|')[0].trim()}</Badge>
          </div>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-3">
        <Link href={`/products/${product.slug}`} className="flex flex-col gap-0.5">
          <h3 className="text-sm text-text transition-colors group-hover:text-text-muted">
            {product.name}
          </h3>
          <span className="text-sm text-text-muted">
            {formatPrice(Number(product.price), product.currency)}
          </span>
        </Link>
      </div>
    </article>
  )
}

export function ProductCardSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton aspect-product w-full" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-1/3" />
    </div>
  )
}
