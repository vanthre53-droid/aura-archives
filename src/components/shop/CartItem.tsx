'use client'

import { Minus, Plus, X } from 'lucide-react'
import { ProductImage } from '@/components/shop/ProductImage'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types/shop.types'

export function CartItem({ item }: { item: CartItemType }): React.ReactElement {
  const { updateQty, removeItem } = useCart()

  return (
    <div className="flex gap-4 py-4">
      <div className="w-20 shrink-0">
        <ProductImage src={item.image} alt={item.name} sizes="80px" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm">{item.name}</p>
          <button
            type="button"
            aria-label={`Remove ${item.name}`}
            onClick={() => removeItem(item.product_id, item.size)}
            className="text-text-muted hover:text-text"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        {item.size ? (
          <p className="text-xs text-text-muted">Size: {item.size}</p>
        ) : null}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQty(item.product_id, item.size, item.qty - 1)}
              className="px-2 py-1 hover:bg-surface-dim"
            >
              <Minus className="h-3 w-3" aria-hidden />
            </button>
            <span className="min-w-8 text-center text-sm">{item.qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQty(item.product_id, item.size, item.qty + 1)}
              className="px-2 py-1 hover:bg-surface-dim"
            >
              <Plus className="h-3 w-3" aria-hidden />
            </button>
          </div>
          <span className="text-sm">{formatPrice(item.price * item.qty)}</span>
        </div>
      </div>
    </div>
  )
}
