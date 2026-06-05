import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  ids: string[]
  hasHydrated: boolean
  set: (ids: string[]) => void
  add: (id: string) => void
  remove: (id: string) => void
  toggleLocal: (id: string) => boolean
  has: (id: string) => boolean
  setHydrated: () => void
}

/**
 * Local wishlist state (product ids). The useWishlist hook keeps this in sync
 * with Supabase for authenticated users; guests persist locally.
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      hasHydrated: false,
      set: (ids) => set({ ids: Array.from(new Set(ids)) }),
      add: (id) => set((state) => ({ ids: Array.from(new Set([...state.ids, id])) })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      toggleLocal: (id) => {
        const has = get().ids.includes(id)
        set((state) => ({
          ids: has ? state.ids.filter((x) => x !== id) : [...state.ids, id],
        }))
        return !has
      },
      has: (id) => get().ids.includes(id),
      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: 'aura-wishlist',
      partialize: (state) => ({ ids: state.ids }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
)
