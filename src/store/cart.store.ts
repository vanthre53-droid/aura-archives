import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/shop.types'

interface CartState {
  items: CartItem[]
  hasHydrated: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string | null) => void
  updateQty: (productId: string, size: string | null, qty: number) => void
  clear: () => void
  setHydrated: () => void
}

const sameLine = (a: CartItem, productId: string, size: string | null): boolean =>
  a.product_id === productId && a.size === size

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, item.product_id, item.size))
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.product_id, item.size) ? { ...i, qty: i.qty + item.qty } : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, size)),
        })),
      updateQty: (productId, size, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (sameLine(i, productId, size) ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: 'aura-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
)

/** Total item count across the cart. */
export const selectCartCount = (state: CartState): number =>
  state.items.reduce((sum, i) => sum + i.qty, 0)

/** Cart subtotal in the catalog currency. */
export const selectCartSubtotal = (state: CartState): number =>
  state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
