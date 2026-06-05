import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env, isRedisConfigured } from '@/lib/config'

/**
 * Upstash-backed rate limiting. When Redis is not configured (prototype/local),
 * every limiter is `null` and `checkRateLimit` allows the request through so the
 * app stays usable — production deployments must set the Upstash credentials.
 */
const redis = isRedisConfigured()
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

type Window = Parameters<typeof Ratelimit.slidingWindow>[1]

function makeLimiter(tokens: number, window: Window, prefix: string): Ratelimit | null {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `aura:${prefix}`,
    analytics: false,
  })
}

/** Named limiters matching the documented per-route limits (docs/API.md). */
export const rateLimiters = {
  productsRead: makeLimiter(60, '60 s', 'products-read'),
  productsWrite: makeLimiter(30, '60 s', 'products-write'),
  wishlist: makeLimiter(60, '60 s', 'wishlist'),
  orders: makeLimiter(5, '1 h', 'orders'),
  aiChat: makeLimiter(20, '60 s', 'ai-chat'),
} as const

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/** Checks a request against a limiter. Allows the request when limiting is off. */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<RateLimitResult> {
  if (!limiter) return { success: true, limit: 0, remaining: 0, reset: 0 }
  const { success, limit, remaining, reset } = await limiter.limit(identifier)
  return { success, limit, remaining, reset }
}
