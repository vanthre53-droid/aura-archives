import 'server-only'
import * as Sentry from '@sentry/nextjs'
import { createAdminClient } from '@/lib/supabase/admin'
import { env, isSupabaseConfigured } from '@/lib/config'
import { estimateCostUsd } from '@/lib/ai/models'

export interface UsageRecord {
  userId: string | null
  sessionId: string | null
  model: string
  feature?: string
  inputTokens: number
  outputTokens: number
  latencyMs?: number | null
  success?: boolean
  errorMessage?: string | null
}

/**
 * Persists one AI completion to `ai_usage_logs` (service-role, RLS-bypassing).
 * Best-effort: a logging failure must never break the user-facing response.
 */
export async function logAiUsage(record: UsageRecord): Promise<void> {
  if (!isSupabaseConfigured()) return
  try {
    const admin = createAdminClient()
    const { error } = await admin.from('ai_usage_logs').insert({
      user_id: record.userId,
      session_id: record.sessionId,
      model: record.model,
      feature: record.feature ?? 'chat',
      input_tokens: record.inputTokens,
      output_tokens: record.outputTokens,
      cost_usd: estimateCostUsd(record.model, record.inputTokens, record.outputTokens),
      latency_ms: record.latencyMs ?? null,
      success: record.success ?? true,
      error_message: record.errorMessage ?? null,
    })
    if (error) throw error
  } catch (error) {
    Sentry.captureException(error)
  }
}

/**
 * Returns true when the trailing-30-day estimated spend is at or above the
 * configured monthly budget. Fails open (allows the request) when usage cannot
 * be read, so a transient DB issue does not take the concierge offline.
 */
export async function isOverMonthlyBudget(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  try {
    const admin = createAdminClient()
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await admin
      .from('ai_usage_logs')
      .select('cost_usd')
      .gte('created_at', since)
    if (error) throw error
    const spent = (data ?? []).reduce((sum, row) => sum + Number(row.cost_usd), 0)
    return spent >= env.AI_MONTHLY_BUDGET_USD
  } catch (error) {
    Sentry.captureException(error)
    return false
  }
}
