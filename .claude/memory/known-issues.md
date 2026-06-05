# Known Issues / Watch List

- Vercel AI SDK v6 API differs from the v3-era `StreamingTextResponse` referenced in
  the master prompt; the chat route (Step 08) uses the v6 `streamText` + UI message
  stream response.
- `next-pwa` (original) is unmaintained for App Router; using `@ducanh2912/next-pwa`.
- `next.config.ts` is not supported on Next 14 → using `next.config.mjs`.
- External services (Supabase, Anthropic, Resend, Upstash, Sentry, PostHog, Inngest)
  require credentials in `.env.local`; the app boots without them but those features
  are inert until configured (`src/lib/config.ts` exposes `isXConfigured()` guards).
