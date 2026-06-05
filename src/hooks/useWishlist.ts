'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWishlistStore } from '@/store/wishlist.store'
import { useUser } from '@/hooks/useUser'
import { useToast } from '@/hooks/useToast'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/config'

/**
 * Wishlist facade. Guests are prompted to sign in; authenticated users have
 * their wishlist synced with Supabase (RLS scopes rows to the user).
 */
export function useWishlist() {
  const router = useRouter()
  const { user } = useUser()
  const ids = useWishlistStore((s) => s.ids)
  const setIds = useWishlistStore((s) => s.set)
  const addLocal = useWishlistStore((s) => s.add)
  const removeLocal = useWishlistStore((s) => s.remove)
  const { toast } = useToast()

  // Load the server wishlist once signed in.
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return
    let active = true
    const supabase = createClient()
    void supabase
      .from('wishlist')
      .select('product_id')
      .then(({ data }) => {
        if (active && data) setIds(data.map((row) => row.product_id))
      })
    return () => {
      active = false
    }
  }, [user, setIds])

  const isWishlisted = useCallback((productId: string): boolean => ids.includes(productId), [ids])

  const toggle = useCallback(
    async (productId: string): Promise<void> => {
      if (!user) {
        toast({ title: 'Sign in to save pieces', description: 'Create an account or sign in to use your wishlist.' })
        router.push('/login?redirectTo=/wishlist')
        return
      }

      const currentlyWishlisted = ids.includes(productId)
      // Optimistic update.
      if (currentlyWishlisted) removeLocal(productId)
      else addLocal(productId)

      if (!isSupabaseConfigured()) return
      const supabase = createClient()
      try {
        if (currentlyWishlisted) {
          await supabase.from('wishlist').delete().eq('product_id', productId).eq('user_id', user.id)
        } else {
          await supabase.from('wishlist').insert({ product_id: productId, user_id: user.id })
        }
      } catch {
        // Revert on failure.
        if (currentlyWishlisted) addLocal(productId)
        else removeLocal(productId)
        toast({ title: 'Could not update wishlist', variant: 'error' })
      }
    },
    [user, ids, addLocal, removeLocal, router, toast],
  )

  return { ids, isWishlisted, toggle, requiresAuth: !user }
}
