import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

/** Browser Supabase client (respects RLS via the anon key + user session). */
export function createClient(): ReturnType<typeof createBrowserClient<Database>> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
