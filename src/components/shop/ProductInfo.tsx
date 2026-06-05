'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SizeSelector } from '@/components/shop/SizeSelector'
import { WishlistButton } from '@/components/shop/WishlistButton'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/shop.types'

export function ProductInfo({ product }: { product: Product }): React.ReactElement {
  const sizes = product.sizes ?? []
  const { addToCart } = useCart()
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null)
  const [showError, setShowError] = useState(false)

  const inStock = product.stock_quantity > 0

  function handleAdd(): void {
    if (sizes.length > 0 && !size) {
      setShowError(true)
      return
    }
    addToCart({
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      qty: 1,
      size,
      image: product.images?.[0] ?? null,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {product.tagline ? <Badge variant="gold">{product.tagline}</Badge> : null}
        <h1 className="font-serif text-3xl md:text-4xl">{product.name}</h1>
        <div className="flex items-baseline gap-3">
          <span className="text-lg">{formatPrice(Number(product.price), product.currency)}</span>
          {product.compare_at_price ? (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(Number(product.compare_at_price), product.currency)}
            </span>
          ) : null}
        </div>
      </div>

      {product.description ? (
        <p className="text-sm leading-relaxed text-text-muted">{product.description}</p>
      ) : null}

      {sizes.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-widest text-text-muted">Size</span>
          <SizeSelector sizes={sizes} value={size} onChange={(s) => { setSize(s); setShowError(false) }} error={showError} />
          {showError ? <p className="text-xs text-error">Please select a size.</p> : null}
        </div>
      ) : null}

      <div className="flex items-stretch gap-2">
        <Button onClick={handleAdd} disabled={!inStock} className="flex-1">
          {inStock ? 'Add to bag' : 'Out of stock'}
        </Button>
        <WishlistButton productId={product.id} size="lg" />
      </div>
    </div>
  )
}
