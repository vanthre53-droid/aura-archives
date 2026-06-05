# Architecture Decisions

- **Framework**: Next.js 14 App Router for SSR + RSC + SEO + PWA.
- **Data**: Supabase (Postgres + Auth + Storage + Realtime) as the single backend.
- **Access control**: enforced at the database via RLS; middleware adds route gating.
- **ORM**: Drizzle mirrors the Supabase schema for type-safe edge/server queries; the
  SQL migrations remain the source of truth.
- **State**: Zustand for client UI state (cart/wishlist/chat); TanStack Query for server state.
- **AI**: Anthropic via the Vercel AI SDK, streamed on the Edge runtime; cost logged per call.
- **Config note**: next.config.mjs (not .ts) and @ducanh2912/next-pwa for App Router PWA.
