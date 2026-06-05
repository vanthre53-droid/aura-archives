# Aura Archives

Timeless artifacts of jewelry and clothing, curated for the contemporary silhouette.
A premium, mobile-first e-commerce prototype (no payments) built for an editorial,
museum-like browsing experience with zero layout shift.

## Stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Supabase
(Postgres + Auth + Storage + Realtime) · Drizzle ORM · Anthropic Claude + Vercel AI SDK ·
Resend · Upstash Redis · Inngest · Sentry · PostHog · Vitest + Playwright · PWA.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values you have
pnpm dev
```

Open http://localhost:3000.

> The app boots without external credentials — features that need a given service
> (Supabase, Anthropic, etc.) stay inert until its keys are added to `.env.local`.
> See `.claude/env.md` for the full variable reference.

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` | ESLint (no-any, no-unused enforced) |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm test` / `pnpm test:e2e` | Vitest unit / Playwright E2E |
| `pnpm format` | Prettier write |
| `pnpm db:generate` / `pnpm db:push` | Drizzle Kit |
| `pnpm check:env` | Validate required env vars |

## Project layout

```
src/app         App Router routes: (auth) (shop) (legal) admin api
src/components  layout · ui · shop · ai · admin · forms · seo · analytics
src/lib         supabase · ai · redis · email · db · validations · utils
src/services    domain services (product, order, wishlist, ai, email)
src/store       Zustand stores (cart, wishlist, chat, ui)
src/types       database + api + shop types
supabase        SQL migrations (schema, RLS, seed) + config
tests           unit · integration · e2e
.claude         project rules, agents, commands, snippets, memory
```

## Build progress

This project is being built step-by-step per the master build plan (see
`.claude/tasks/current-sprint.md`). **Step 01 — Project setup** is complete.

See `DEPLOYMENT.md` for deploy instructions and `docs/RUNBOOK.md` for operations.
