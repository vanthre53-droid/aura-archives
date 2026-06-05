import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { env, isAiConfigured } from '@/lib/config'

let cached: Anthropic | null = null

/**
 * Lazily constructs a shared Anthropic client. Returns `null` when no API key is
 * configured so callers can degrade gracefully (the concierge is optional in the
 * prototype). The instance is reused across requests to keep the HTTP agent warm.
 */
export function getAnthropic(): Anthropic | null {
  if (!isAiConfigured()) return null
  if (!cached) cached = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY! })
  return cached
}
