# Security Policy

## Reporting a vulnerability
Email security@auraarchives.com with details and reproduction steps. Do not open a
public issue for security reports. We aim to acknowledge within 72 hours.

## Controls in this project
- **Access control**: Postgres Row Level Security on every table; middleware gates
  `/admin` (admin role) and customer-only routes.
- **Secrets**: kept in `.env.local` (git-ignored). `SUPABASE_SERVICE_ROLE_KEY` is
  server-only and never prefixed `NEXT_PUBLIC_`.
- **Transport / headers**: HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy, and a Content-Security-Policy (next.config.mjs).
- **Input**: Zod validation + `.trim()` on all inputs; DOMPurify for any rich text;
  no `dangerouslySetInnerHTML` without sanitization.
- **Rate limiting**: Upstash sliding window on auth, AI chat, product, admin, and
  order endpoints.
- **Error handling**: Sentry with a `beforeSend` hook that scrubs email, phone, and IP.
- **Privacy**: DPDP + GDPR — explicit consent at registration, data export and account
  deletion endpoints, named Grievance Officer in the Privacy Policy.

## Out of scope (prototype)
No payment processing, no card data, no health data, no children's data.
