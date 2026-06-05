'use client'

import { useCartStore, selectCartCount, selectCartSubtotal } from '@/store/cart.store'
import { useToast } from '@/hooks/useToast'
import type { CartItem } from '@/types/shop.types'

/** Cart facade: state + actions, with a toast on add. */
export function useCart() {
  const items = useCartStore((s) => s.items)
  const hasHydrated = useCartStore((s) => s.hasHydrated)
  const count = useCartStore(selectCartCount)
  const subtotal = useCartStore(selectCartSubtotal)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQty = useCartStore((s) => s.updateQty)
  const clear = useCartStore((s) => s.clear)
  const { toast } = useToast()

  function addToCart(item: CartItem): void {
    addItem(item)
    toast({ title: 'Added to your bag', description: item.name, variant: 'success' })
  }

  return { items, count, subtotal, hasHydrated, addToCart, removeItem, updateQty, clear }
}
