import 'server-only'

/**
 * AI model configuration for the Aura Archives concierge.
 *
 * Haiku 4.5 is the default: fast and inexpensive, which suits a high-traffic
 * storefront concierge running under a small monthly budget. Prices are USD per
 * million tokens and are used only for in-app cost estimation (the admin AI
 * usage dashboard) — they are not billed against, so approximate figures are
 * acceptable.
 */
export const AI_MODEL = 'claude-haiku-4-5-20251001' as const

/** Per-million-token prices (USD) used to estimate spend. */
export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'claude-haiku-4-5-20251001': { input: 1, output: 5 },
}

/** Maximum tokens the concierge may generate per reply. */
export const AI_MAX_OUTPUT_TOKENS = 600

/** Hard cap on how many prior messages we forward, to bound prompt size/cost. */
export const AI_MAX_HISTORY = 12

/** Estimates the USD cost of a single completion. */
export function estimateCostUsd(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing = MODEL_PRICING[model] ?? { input: 0, output: 0 }
  const cost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000
  // Round to 6 decimals to match the numeric(10,6) column.
  return Math.round(cost * 1_000_000) / 1_000_000
}
