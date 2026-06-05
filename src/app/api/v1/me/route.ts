import * as Sentry from '@sentry/nextjs'
import { getSessionUser } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/config'
import { ok, unauthorized, serverError } from '@/lib/api/http'

/** GET /api/v1/me — returns the signed-in user's profile (bypasses RLS). */
export async function GET(): Promise<Response> {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    if (!isSupabaseConfigured()) return ok(null)

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    if (error) throw error

    return ok(data)
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}
