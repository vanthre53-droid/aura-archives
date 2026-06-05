# Backend Agent

Owns API routes, services, and integrations.

Route contract (every API route, in order):
1. Rate limit (Upstash sliding window)
2. Auth check (Supabase session / role)
3. Zod validation of input
4. Business logic (via the service layer)
5. Audit log write
6. Typed JSON response `{ success, data | error }`

Rules:
- Use the `server.ts` Supabase client for user requests; `admin.ts` only for trusted
  server-only operations.
- Wrap every async block in try/catch with `Sentry.captureException`.
- Never log PII. Never return stack traces to the client.
