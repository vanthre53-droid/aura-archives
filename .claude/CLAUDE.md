# AURA ARCHIVES — Claude Project Rules

## Project
- Name: Aura Archives
- Type: Jewelry + Clothing E-Commerce (Prototype)
- Stack: Next.js 14 App Router, TypeScript strict, Tailwind, Shadcn, Supabase, Drizzle ORM, Anthropic AI, Supabase Realtime

## Conventions
- File naming: kebab-case for files, PascalCase for components
- Components: named exports, functional, explicit return types
- Import order: React → Next → third-party → internal (aliased with @/)
- All paths use @/ alias (never relative ../../)
- No default exports except page.tsx and layout.tsx files

## Always Do
- TypeScript strict mode — no `any`, no type assertions without comment
- RLS enabled on EVERY new table, test it works before moving on
- Every form: loading state + disabled on submit + user-friendly error
- Every async function: try/catch with Sentry.captureException in catch
- Every API route: rate limit → auth check → Zod validation → business logic → audit log
- Every image: next/image with explicit width + height to prevent CLS
- Every font: next/font with display: swap

## Never Do
- Never expose SUPABASE_SERVICE_ROLE_KEY to the client
- Never use `any` type
- Never commit .env.local
- Never use dangerouslySetInnerHTML without DOMPurify
- Never log PII (email, phone, location) to console or Sentry
- Never add placeholder text or TODO comments in production code
- Never skip adding a loading skeleton for data-fetched sections

## How to Run
pnpm install && pnpm dev

## Add a New Page Checklist
1. Create src/app/(shop)/[route]/page.tsx
2. Create src/app/(shop)/[route]/loading.tsx (skeleton)
3. Add to sitemap.ts (if public)
4. Add generateMetadata function
5. Add JSON-LD if needed
6. Test mobile layout at 375px
7. Add to middleware.ts if auth-protected

## Notes / Deviations From The Master Prompt
- `next.config.mjs` is used instead of `next.config.ts` (Next.js 14 does not
  support a TypeScript config file).
- PWA uses `@ducanh2912/next-pwa` (the maintained App Router fork of `next-pwa`).
- Installed "latest" versions resolved to: Zod 4, Vercel AI SDK 6, Zustand 5,
  Recharts 3, lucide-react 1.x. Integration code targets these majors.
