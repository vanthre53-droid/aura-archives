import * as Sentry from '@sentry/nextjs'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/config'
import type { UserProfile } from '@/types/shop.types'

/** All customer profiles (admin, service role — bypasses RLS). */
export async function getAllCustomers(): Promise<UserProfile[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    Sentry.captureException(error)
    return []
  }
}
