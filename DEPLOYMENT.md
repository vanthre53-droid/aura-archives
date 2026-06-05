# Deployment

Target: Vercel (region `bom1` — Mumbai), with Supabase in `ap-south-1`.

## Prerequisites (one-time, manual)
1. **Supabase** — create a project in `ap-south-1`; copy URL + anon key + service role key.
2. **Supabase Storage** — create a public bucket `product-images`.
3. **Supabase Auth** — enable email auth; set redirect URL `/auth/callback`.
4. **Anthropic** — API key with a monthly spend limit.
5. **Resend** — verified sending domain; API key.
6. **Upstash** — Redis database; REST URL + token.
7. **Sentry** — Next.js project; DSN + auth token.
8. **PostHog** — project key + host.
9. **Inngest** — event key + signing key.
10. **Vercel** — import the repo; set all env vars; region `bom1`.

## Database setup
Run the migrations in order against your Supabase project:
`supabase/migrations/001_initial_schema.sql`, `002_rls_policies.sql`, `003_seed_data.sql`.
Then regenerate types: `pnpm dlx supabase gen types typescript --project-id <id> > src/types/database.types.ts`.

## Deploy
- Push to `main` → GitHub Actions runs CI, then `deploy-production.yml` deploys to Vercel
  (requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets).
- PRs deploy a preview via `deploy-preview.yml`.

## Post-deploy checklist
- `pnpm check:env` passes; `/api/health` returns `{ status: 'ok' }`.
- Lighthouse 90+ on home + product; CLS < 0.05.
- Sentry shows no new errors for 72h.
