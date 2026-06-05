import 'server-only'
import * as Sentry from '@sentry/nextjs'
import { inngest } from '@/lib/inngest/client'
import { isInngestConfigured } from '@/lib/config'

type SendArgs = Parameters<typeof inngest.send>[0]

/**
 * Fire-and-forget event emission. No-ops when Inngest is unconfigured and never
 * throws, so a background-job failure can never break a user-facing request.
 */
export async function emitEvent(event: SendArgs): Promise<void> {
  if (!isInngestConfigured()) return
  try {
    await inngest.send(event)
  } catch (error) {
    Sentry.captureException(error)
  }
}
