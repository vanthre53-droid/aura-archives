import * as Sentry from '@sentry/nextjs'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
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

/** Reads a user's role from the profiles table (RLS: users read their own row). */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = createClient()
    const { data, error } = await supabase
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
