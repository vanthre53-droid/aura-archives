import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/**
 * Service-role Supabase client — BYPASSES RLS. Server-only.
 * The `server-only` import makes the build fail if this is ever imported into a
 * client component. Use exclusively for trusted server-side operations.
 */
export function createAdminClient(): ReturnType<typeof createClient<Database>> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
