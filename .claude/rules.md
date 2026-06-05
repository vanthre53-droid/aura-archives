HARD RULES — NEVER BREAK THESE

SECURITY:
✗ Never expose SUPABASE_SERVICE_ROLE_KEY to client — it must ONLY be in server files
✗ Never skip RLS on any new table — enable it and write policies before shipping
✗ Never use `any` TypeScript type — use `unknown` and narrow it
✗ Never commit .env.local to git
✗ Never log PII to console or Sentry — scrub emails, phone, location before logging
✗ Never store card data — no payments in this prototype, but if added later: Stripe tokens only
✗ Never allow unauthenticated access to admin routes

CODE QUALITY:
✗ Every form button must disable + show spinner on submit
✗ Every async function must have try/catch
✗ Every page must have a loading.tsx skeleton
✗ Zero placeholder text anywhere
✗ Zero TODO comments in any file
✗ Zero unused imports or variables (ESLint enforces this)

PERFORMANCE (CLS = 0 is non-negotiable):
✗ Every image must use next/image with explicit width and height
✗ Every font must use next/font (never @import in CSS)
✗ No layout shift — reserve space for every dynamic element before it loads
✗ No page over 200KB JS bundle (gzipped)
