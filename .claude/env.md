# Environment Variables Reference

All variables are documented in `.env.example`. Secrets live only in `.env.local`
(git-ignored). `NEXT_PUBLIC_` is used ONLY for values safe to expose to the browser.

| Variable | Public? | Used by |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | yes | Supabase clients |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | yes | Supabase browser/server clients |
| SUPABASE_SERVICE_ROLE_KEY | NO — server only | admin client, seed script |
| DATABASE_URL | NO | Drizzle Kit migrations |
| RESEND_API_KEY | NO | email sends |
| EMAIL_FROM | NO | email "from" address |
| ANTHROPIC_API_KEY | NO | AI chat route |
| AI_MONTHLY_BUDGET_USD | NO | AI budget guard |
| UPSTASH_REDIS_REST_URL / _TOKEN | NO | rate limiting |
| SENTRY_DSN | NO | server error tracking |
| NEXT_PUBLIC_SENTRY_DSN | yes | client error tracking |
| SENTRY_AUTH_TOKEN | NO | CI source map upload |
| NEXT_PUBLIC_POSTHOG_KEY / _HOST | yes | analytics |
| INNGEST_EVENT_KEY / SIGNING_KEY | NO | background jobs |
| NEXT_PUBLIC_APP_URL / _NAME | yes | metadata, sitemap |
| MAINTENANCE_MODE | NO | maintenance toggle |

Validation: `src/lib/config.ts` parses all of these with Zod. Run `pnpm check:env`
before deploy to confirm required keys are present.
