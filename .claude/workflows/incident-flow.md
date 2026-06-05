# Incident Flow

1. **Detect** — Better Uptime alert or Sentry spike on /api/health.
2. **Assess** — scope (which routes), blast radius, recent deploy?
3. **Mitigate** — roll back the last Vercel deploy if correlated; enable
   `MAINTENANCE_MODE=true` if data integrity is at risk.
4. **Communicate** — note status; avoid exposing PII in logs/updates.
5. **Fix** — smallest safe change; add a regression test.
6. **Postmortem** — record cause + prevention in `.claude/memory/known-issues.md`.
