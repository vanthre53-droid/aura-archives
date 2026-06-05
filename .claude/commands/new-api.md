# Command: New API Route

Order of operations inside the handler:
1. Rate limit (Upstash) — return 429 on exceed.
2. Auth check (Supabase session / role) — 401 / 403.
3. Zod-validate body/query — 422 on failure.
4. Call the service layer for business logic.
5. Write an audit log row.
6. Return `Response.json({ success, data })` or `{ success: false, error }`.

Always wrap in try/catch + Sentry.captureException. Never leak internals to the client.
