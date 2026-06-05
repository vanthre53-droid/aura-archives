import * as Sentry from '@sentry/nextjs'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/config'
import type { UserRole } from '@/types/shop.types'

/** The signed-in user for the current request, or null. Server-only. */
export async function getSessionUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    Sentry.captureException(error)
    return null
  }
}

/** Reads a user's role using the service-role client (bypasses RLS). */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle()
    if (error) throw error
    return data?.role ?? null
  } catch (error) {
    Sentry.captureException(error)
    return null
  }
}

/** Resolves the current admin user, or null when there is no admin session. */
export async function getAdminUser(): Promise<User | null> {
  const user = await getSessionUser()
  if (!user) return null
  const role = await getUserRole(user.id)
  return role === 'admin' ? user : null
}
