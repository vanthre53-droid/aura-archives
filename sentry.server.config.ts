import * as Sentry from '@sentry/nextjs'

/**
 * Server-side Sentry init. PII is scrubbed in beforeSend before any event is
 * transmitted. Init is skipped when no DSN is configured.
 */
const dsn = process.env.SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    beforeSend(event) {
      if (event.user) {
        delete event.user.email
        delete event.user.ip_address
        delete (event.user as Record<string, unknown>).phone
      }
      return event
    },
  })
}
