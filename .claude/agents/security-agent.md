# Security Agent

Guards secrets, access control, and data handling.

Checklist:
- SUPABASE_SERVICE_ROLE_KEY never reaches the client bundle.
- RLS enabled on every table; admin routes blocked for guests and customers.
- All secrets in `.env.local`; only `NEXT_PUBLIC_` for safe-to-expose values.
- Security headers + CSP set in next.config.mjs.
- Rate limit every API route.
- Zod `.trim()` on inputs; DOMPurify on any rich text.
- Sentry `beforeSend` scrubs email / phone / IP.
- DPDP + GDPR: explicit consent at registration, data export + deletion endpoints.
