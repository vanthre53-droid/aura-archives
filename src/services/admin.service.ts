import * as Sentry from '@sentry/nextjs'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured, env } from '@/lib/config'
import { SAMPLE_PRODUCTS } from '@/lib/sample-data'

export interface DashboardStats {
  productCount: number
  activeProductCount: number
  orderCount: number
  customerCount: number
  revenue: number
}

/** Aggregate counts for the admin dashboard. Falls back to sample-derived values. */
export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) {
    return {
      productCount: SAMPLE_PRODUCTS.length,
      activeProductCount: SAMPLE_PRODUCTS.filter((p) => p.is_active).length,
      orderCount: 0,
      customerCount: 0,
      revenue: 0,
    }
  }
  try {
    const admin = createAdminClient()
    const [products, activeProducts, customers, orders] = await Promise.all([
      admin.from('products').select('*', { count: 'exact', head: true }),
      admin.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      admin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      admin.from('orders').select('subtotal'),
    ])
    const revenue = (orders.data ?? []).reduce((sum, row) => sum + Number(row.subtotal), 0)
    return {
      productCount: products.count ?? 0,
      activeProductCount: activeProducts.count ?? 0,
      orderCount: orders.data?.length ?? 0,
      customerCount: customers.count ?? 0,
      revenue,
    }
  } catch (error) {
    Sentry.captureException(error)
    return {
      productCount: 0,
      activeProductCount: 0,
      orderCount: 0,
      customerCount: 0,
      revenue: 0,
    }
  }
}

export interface AiUsageDay {
  date: string
  requests: number
  tokens: number
  costUsd: number
}

export interface AiUsageSummary {
  totalRequests: number
  totalTokens: number
  totalCostUsd: number
  budgetUsd: number
  daily: AiUsageDay[]
}

/** AI token/cost usage over the trailing `days`, bucketed by day for charting. */
export async function getAiUsage(days = 14): Promise<AiUsageSummary> {
  const budgetUsd = env.AI_MONTHLY_BUDGET_USD
  const empty: AiUsageSummary = {
    totalRequests: 0,
    totalTokens: 0,
    totalCostUsd: 0,
    budgetUsd,
    daily: [],
  }
  if (!isSupabaseConfigured()) return empty
  try {
    const admin = createAdminClient()
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await admin
      .from('ai_usage_logs')
      .select('total_tokens, cost_usd, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true })
    if (error) throw error

    const buckets = new Map<string, AiUsageDay>()
    let totalRequests = 0
    let totalTokens = 0
    let totalCostUsd = 0
    for (const row of data ?? []) {
      const date = row.created_at.slice(0, 10)
      const day = buckets.get(date) ?? { date, requests: 0, tokens: 0, costUsd: 0 }
      day.requests += 1
      day.tokens += row.total_tokens
      day.costUsd += Number(row.cost_usd)
      buckets.set(date, day)
      totalRequests += 1
      totalTokens += row.total_tokens
      totalCostUsd += Number(row.cost_usd)
    }
    return {
      totalRequests,
      totalTokens,
      totalCostUsd,
      budgetUsd,
      daily: Array.from(buckets.values()),
    }
  } catch (error) {
    Sentry.captureException(error)
    return empty
  }
}
