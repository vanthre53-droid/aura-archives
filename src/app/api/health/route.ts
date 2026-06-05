import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import { APP_VERSION } from '@/lib/constants'
import type { HealthResponse } from '@/types/api.types'

export const dynamic = 'force-dynamic'

/** Liveness + DB connectivity probe. Returns 503 when a configured DB is down. */
export async function GET(): Promise<NextResponse<HealthResponse>> {
  let dbConnected = false

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('categories').select('id').limit(1)
      dbConnected = !error
    } catch (error) {
      Sentry.captureException(error)
      dbConnected = false
    }
  }

  // The DB is only a failure when it is configured but unreachable.
  const healthy = dbConnected || !isSupabaseConfigured()
  const body: HealthResponse = {
    status: healthy ? 'ok' : 'error',
    db: dbConnected ? 'connected' : 'disconnected',
    version: APP_VERSION,
  }
  return NextResponse.json(body, { status: healthy ? 200 : 503 })
}
