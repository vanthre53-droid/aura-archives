# Changelog

All notable changes are documented here. Format: Conventional Commits.

## [Unreleased]

### Step 01 — Project setup
- chore: scaffold Next.js 14 (App Router, TypeScript strict, Tailwind, ESLint, src/, @/ alias)
- chore: install full dependency set (Supabase, Drizzle, Anthropic + AI SDK, Resend,
  Upstash, Inngest, Sentry, PostHog, Recharts, Zustand, TanStack Query, RHF + Zod,
  DOMPurify, Radix, Vitest, Playwright, next-pwa)
- feat: design tokens, animations, Bodoni Moda + DM Sans via next/font
- feat: security headers + CSP, image remote patterns, PWA wrapper (next.config.mjs)
- feat: PWA manifest, robots, static sitemap
- feat: env config validator, constants, utils (cn / formatPrice / generateSlug)
- chore: drizzle / vitest / playwright / sentry / vercel configs
- chore: Supabase migrations (schema, RLS, seed) + config.toml
- chore: GitHub Actions CI; `.claude` knowledge base; docs

### Step 05 — Storefront pages
- feat: content pages — about, shipping, returns, sizing (size tables), care-guide (accordion)
- feat: legal pages — privacy, terms, cookies, with shared LegalDocument component
- feat: (legal) route-group layout (Navbar / Footer / BottomNav)
- fix: re-export OrderStatus / UserRole from shop.types; checkout form input/output typing

### Step 06 — API routes
- feat: rate limiting (Upstash sliding window, graceful no-op when unconfigured)
- feat: API envelope/http helpers, audit logging, server auth helpers
- feat: GET /api/health (DB probe)
- feat: GET/POST /api/v1/products, PUT/DELETE /api/v1/products/[id] (admin CRUD, soft delete)
- feat: POST /api/v1/wishlist (toggle), POST /api/v1/orders (create)
- feat: product + wishlist Zod schemas and service-layer functions

### Step 07 — Admin panel
- feat: admin layout + dashboard (stat cards, recent orders)
- feat: product management (list, create, edit) reusing the /api/v1/products endpoints
- feat: order management with inline status updates (Server Action + audit log)
- feat: customers table, AI usage charts (Recharts), settings/integration status
- feat: admin + user services, dashboard/AI aggregates, shared order-status helpers

### Step 08 — AI concierge
- feat: lib/ai — Anthropic client (lazy/graceful), Haiku 4.5 model + cost pricing,
  bounded system prompt, prompt caching on the system block
- feat: usage logging to ai_usage_logs + trailing-30-day monthly-budget guard
- feat: POST /api/ai/chat — public, rate-limited, streaming (text deltas), logs token usage
- feat: floating ChatWidget (streamed replies, typing indicator) mounted in the shop layout
- feat: chat Zod schemas; `aiChat` rate limiter (20/min)

### Step 09 — Email + background jobs
- feat: Resend client (graceful no-op when unconfigured) + shared React Email layout
- feat: transactional templates — order confirmation, welcome, shipping/status update
- feat: Inngest v4 functional client with typed events (staticSchema), 3 functions, webhook route
- feat: emit order/created (orders API), order/status.updated (admin action), user/registered (auth callback)
- refactor: updateOrderStatus returns the updated order row (for status emails)

### Step 10 — Customers API
- feat: GET /api/v1/customers — admin-only list with rate limit + audit log

### Step 11 — Analytics
- feat: PostHogProvider (init + manual SPA pageviews, off until configured) + Vercel Analytics in root layout

### Step 12 — Tests + verification
- test: unit — AI cost estimation, chat request schema; integration — email graceful no-op
- test: Playwright e2e smoke (home renders, concierge opens)
- chore: alias `server-only` to a stub in vitest so server modules are unit-testable
- chore: verified `tsc --noEmit`, `vitest run` (13 passing), and `next build` (43 routes) all green

### Step 13 — Loading skeletons (CLS prevention)
- feat: added loading.tsx to all 27 pages that were missing one (auth, legal, shop, admin)
- chore: 31 pages now have loading skeletons (32 files total including root); 0 missing
- chore: build + type-check + tests all pass (43 routes, 13/13 tests)
