import 'server-only'
import * as Sentry from '@sentry/nextjs'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/config'
import type { Json } from '@/types/database.types'

interface AuditEntry {
  userId?: string | null
  action: string
  resource: string
  resourceId?: string | null
  ipAddress?: string | null
  metadata?: Record<string, Json>
}

/**
 * Writes an audit log row via the service-role client. Best-effort: failures are
 * reported to Sentry but never block the request that triggered them. No-ops when
 * Supabase is not configured. Do not pass PII in `metadata`.
 */
export async function recordAudit(entry: AuditEntry): Promise<void> {
  if (!isSupabaseConfigured()) return
  try {
    const admin = createAdminClient()
    const { error } = await admin.from('audit_logs').insert({
      user_id: entry.userId ?? null,
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resourceId ?? null,
      ip_address: entry.ipAddress ?? null,
      metadata: entry.metadata ?? {},
    })
    if (error) throw error
  } catch (error) {
    Sentry.captureException(error)
  }
}
