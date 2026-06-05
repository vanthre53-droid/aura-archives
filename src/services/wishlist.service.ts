import * as Sentry from '@sentry/nextjs'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'

type ToggleResult =
  | { action: 'added' | 'removed'; error?: undefined }
  | { action?: undefined; error: string }

/**
 * Toggles a product in the signed-in user's wishlist. Uses the request-scoped
 * client so RLS keeps writes bound to the current user.
 */
export async function toggleWishlist(userId: string, productId: string): Promise<ToggleResult> {
  if (!isSupabaseConfigured()) {
    return { error: 'Wishlist is not available in this environment.' }
  }
  try {
    const supabase = createClient()
    const { data: existing, error: selectError } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle()
    if (selectError) throw selectError

    if (existing) {
      const { error } = await supabase.from('wishlist').delete().eq('id', existing.id)
      if (error) throw error
      return { action: 'removed' }
    }

    const { error } = await supabase
      .from('wishlist')
      .insert({ user_id: userId, product_id: productId })
    if (error) throw error
    return { action: 'added' }
  } catch (error) {
    Sentry.captureException(error)
    return { error: 'Could not update your wishlist.' }
  }
}
