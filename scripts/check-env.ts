/**
 * Verifies required environment variables are present before deploy.
 * Run with: pnpm check:env
 */
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

const OPTIONAL = [
  'ANTHROPIC_API_KEY',
  'RESEND_API_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'SENTRY_DSN',
  'NEXT_PUBLIC_POSTHOG_KEY',
  'INNGEST_EVENT_KEY',
] as const

const missingRequired = REQUIRED.filter((key) => !process.env[key])
const missingOptional = OPTIONAL.filter((key) => !process.env[key])

if (missingOptional.length > 0) {
  console.warn('⚠ Optional integrations not configured:', missingOptional.join(', '))
}

if (missingRequired.length > 0) {
  console.error('✗ Missing required environment variables:', missingRequired.join(', '))
  process.exit(1)
}

console.warn('✓ Required environment variables present.')
