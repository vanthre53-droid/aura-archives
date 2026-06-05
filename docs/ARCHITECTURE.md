# Architecture

## Overview
Aura Archives is a Next.js 14 App Router application backed entirely by Supabase
(Postgres, Auth, Storage, Realtime). Rendering favors React Server Components; client
components are used only for interactivity (cart, wishlist, chat, forms, realtime).

## Layers
- **Routes** (`src/app`) — route groups `(auth)`, `(shop)`, `(legal)`, plus `admin` and
  `api`. Server components fetch data; `loading.tsx` provides skeletons.
- **Components** (`src/components`) — `layout`, `ui` (branded Shadcn-style), `shop`,
  `ai`, `admin`, `forms`, `seo`, `analytics`.
- **Services** (`src/services`) — domain logic, the only place that talks to the DB for
  non-trivial operations.
- **Lib** (`src/lib`) — Supabase clients, AI client + prompts + cost tracking, Redis +
  rate limiting, email, Drizzle schema, Zod validations, config, utils.
- **Store** (`src/store`) — Zustand for client UI state. TanStack Query for server state.
- **Types** (`src/types`) — generated DB types + derived domain types.

## Access control
RLS at the database is the source of truth. `middleware.ts` adds route-level gating
(redirect guests/customers away from `/admin`, guests away from customer-only routes).

## Data flow (write path)
Client form → API route (rate limit → auth → Zod → service → audit log) → Supabase.

## Performance
CLS = 0 is enforced: explicit image dimensions / aspect-ratio, next/font, fixed-size
skeletons, dynamic imports for heavy/admin/chat code.
