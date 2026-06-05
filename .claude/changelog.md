# Build Changelog (Claude working log)

## Step 01 — Project setup
- Scaffolded Next.js 14.2 (App Router, TypeScript strict, Tailwind, ESLint, src/, @/ alias).
- Installed full dependency set (Supabase, Drizzle, Anthropic + AI SDK, Resend,
  Upstash, Inngest, Sentry, PostHog, Recharts, Zustand, TanStack Query, RHF + Zod,
  DOMPurify, Radix primitives, Vitest, Playwright, next-pwa).
- Configured Tailwind tokens, ESLint (no-any, no-unused), Prettier, tsconfig strict.
- Added design tokens + animations CSS, Bodoni Moda + DM Sans via next/font.
- Added next.config.mjs (security headers, CSP, image remote patterns, PWA wrapper).
- Added PWA manifest, robots, sitemap (static routes).
- Added env config validator, constants, utils (cn/formatPrice/generateSlug).
- Added drizzle / vitest / playwright / sentry / vercel configs.
- Created folder skeleton and `.claude` knowledge base.
- Added GitHub Actions CI.

## Step 05 — Storefront pages (completed)
- Built remaining content pages so footer/sitemap links resolve: `/about`,
  `/shipping`, `/returns`, `/sizing` (ring + clothing size tables), `/care-guide`
  (Accordion), and legal pages `/privacy`, `/terms`, `/cookies`.
- Added `(legal)/layout.tsx` (Navbar/Footer/BottomNav chrome) and a shared
  `LegalDocument` component to keep the three legal pages DRY.
- Each page has its own metadata; all 8 prerender as static content.
- Fixed pre-existing type errors surfaced by `tsc`:
  - Re-exported `OrderStatus`/`UserRole` from `@/types/shop.types`
    (order.service.ts imported `OrderStatus` from there).
  - `account/orders` cast `order.items` (Json) through `unknown` to `CartItem[]`.
  - `CartView` checkout form now types `useForm` with input/output generics
    (`z.input`/`z.output`) so the zodResolver default (`country`) typechecks.
- Removed leftover `.gitkeep` placeholders from now-populated route folders.
- Verified: `tsc --noEmit` clean, `next lint` clean, `next build` succeeds (30 routes).

## Step 06 — API routes (completed)
- Shared infra:
  - `lib/redis/rate-limit.ts` — Upstash sliding-window limiters (named per route);
    no-ops (allows requests) when Redis is unconfigured.
  - `lib/api/http.ts` — `{ success, data | error }` envelope helpers, status
    shortcuts (401/403/422/429/500), and `getClientIp`.
  - `lib/audit.ts` — `recordAudit` writes to `audit_logs` via service role,
    best-effort (Sentry on failure, never blocks the request), no PII.
  - `lib/auth.ts` — server `getSessionUser` / `getUserRole` / `getAdminUser`.
- Routes (all follow rate-limit → auth → Zod → service → audit → envelope):
  - `GET /api/health` — DB connectivity probe, 503 when a configured DB is down.
  - `GET /api/v1/products` — public listing (category/tags/featured/page/limit≤50).
  - `POST /api/v1/products` — admin: create (slug auto-derived; dup-slug → friendly 400).
  - `PUT/DELETE /api/v1/products/[id]` — admin: update / soft-delete (404 when missing).
  - `POST /api/v1/wishlist` — auth: toggle, returns `{ success, action }`.
  - `POST /api/v1/orders` — auth: create order (5/hr).
- Schemas: `createProductSchema`/`updateProductSchema`, `wishlistToggleSchema`.
  Services: product create/update/soft-delete + new `wishlist.service.ts`.
- Verified: typecheck + lint clean, `next build` (33 routes). Runtime smoke test —
  health 200, products 200 (sample data + filters), wishlist/orders 401, products POST 403.

## Step 07 — Admin panel (completed)
- `admin/layout.tsx` (sidebar + content) + `loading.tsx` skeleton; metadata noindex.
- Dashboard (`admin/page.tsx`): product/order/customer/revenue stat cards + recent
  orders table.
- Products: list table (`admin/products`), create (`/new`) and edit (`/[id]/edit`)
  via a shared client `ProductForm` that POSTs/PUTs the Step 06 `/api/v1/products`
  endpoints (admin auth enforced server-side).
- Orders (`admin/orders`): table with inline status changes via a Server Action
  (`updateOrderStatusAction` — admin check + Zod + audit + `revalidatePath`) driven
  by a client `OrderStatusSelect`.
- Customers (`admin/customers`): profile table (role / status / joined).
- AI Usage (`admin/ai-usage`): token/cost stat cards + Recharts bar chart, reading
  `ai_usage_logs` (empty until Step 08).
- Settings (`admin/settings`): read-only app + integration status (Supabase/Anthropic/
  Redis/Resend/Sentry/PostHog/Inngest).
- New services: `user.service` (`getAllCustomers`), `admin.service`
  (`getDashboardStats`, `getAiUsage`); product service gained `getAllProductsAdmin`
  / `getProductByIdAdmin`. Shared `ORDER_STATUSES` const + `orderStatusSchema`,
  reusable `OrderStatusBadge` / `StatCard`.
- Verified: typecheck + lint clean, `next build` (40 routes). Runtime smoke test —
  all 8 admin routes 200; products list renders catalogue, AI page shows empty state.
