import * as Sentry from '@sentry/nextjs'

/**
 * Client-side Sentry init. PII (email, phone, location) is scrubbed in
 * beforeSend so it never leaves the browser. Init is skipped when no DSN is set.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
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
