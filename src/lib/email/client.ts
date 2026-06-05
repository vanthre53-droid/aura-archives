import 'server-only'
import { Resend } from 'resend'
import { env, isEmailConfigured } from '@/lib/config'

let cached: Resend | null = null

export { isEmailConfigured }

/** The address transactional mail is sent from. */
export const EMAIL_FROM = env.EMAIL_FROM ?? 'Aura Archives <onboarding@resend.dev>'

/**
 * Lazily constructs a shared Resend client, or `null` when email is not
 * configured (prototype/local) so senders can no-op gracefully.
 */
export function getResend(): Resend | null {
  if (!isEmailConfigured()) return null
  if (!cached) cached = new Resend(env.RESEND_API_KEY!)
  return cached
}
