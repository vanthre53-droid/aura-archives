# Runbook

## Health & monitoring
- Liveness: `GET /api/health` (Better Uptime every 60s from Mumbai/Singapore/Frankfurt).
- Errors: Sentry (PII scrubbed). Analytics/funnels: PostHog.

## Common operations
- **Maintenance mode**: set `MAINTENANCE_MODE=true` in Vercel env and redeploy.
- **Rotate a secret**: update in Vercel + `.env.local`, redeploy, revoke old key at provider.
- **Re-seed sample data**: `pnpm tsx scripts/seed-db.ts` (idempotent upsert).
- **Regenerate DB types**: `pnpm dlx supabase gen types typescript --project-id <id> > src/types/database.types.ts`.

## Incident response
See `.claude/workflows/incident-flow.md`: detect → assess → mitigate (roll back the last
Vercel deploy if correlated) → communicate → fix → postmortem.

## Disaster recovery
- Supabase provides automated daily backups (Pro). To restore, use point-in-time
  recovery from the Supabase dashboard.
- Code: redeploy any prior Vercel deployment via the dashboard (instant rollback).

## AI cost control
- Per-IP rate limit (20/hr) enforced before calling Anthropic.
- Daily Inngest job sums `ai_usage_logs.cost_usd`; alerts admin if over
  `AI_MONTHLY_BUDGET_USD`.
