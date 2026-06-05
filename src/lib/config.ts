import { z } from 'zod'

/**
 * Centralized, Zod-validated environment configuration.
 *
 * Secrets are optional at module load so the app and build do not crash when a
 * given integration is not configured (this is a prototype). Each integration's
 * code is responsible for failing gracefully when its keys are absent — see
 * `isConfigured` helpers below.
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // AI
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_MONTHLY_BUDGET_USD: z.coerce.number().default(10),

  // Redis
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Sentry
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // PostHog
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),

  // Inngest
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Aura Archives'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MAINTENANCE_MODE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
})

export type Env = z.infer<typeof envSchema>

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  // Surface misconfiguration loudly in the server logs without leaking values.
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors)
}

export const env: Env = parsed.success
  ? parsed.data
  : envSchema.parse({}) // fall back to defaults so the prototype still boots

/** True when Supabase URL + anon key are present. */
export const isSupabaseConfigured = (): boolean =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

/** True when the Anthropic API key is present. */
export const isAiConfigured = (): boolean => Boolean(env.ANTHROPIC_API_KEY)

/** True when Upstash Redis credentials are present. */
export const isRedisConfigured = (): boolean =>
  Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN)

/** True when an Inngest event key is present (background jobs enabled). */
export const isInngestConfigured = (): boolean => Boolean(env.INNGEST_EVENT_KEY)

/** True when a Resend API key is present. */
export const isEmailConfigured = (): boolean => Boolean(env.RESEND_API_KEY)
