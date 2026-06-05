# Release Flow

1. `pnpm lint && pnpm type-check && pnpm test && pnpm build` all green.
2. `pnpm test:e2e` against a preview deploy.
3. Update CHANGELOG.md (Conventional Commits).
4. Merge to `main` → Vercel production deploy (region bom1).
5. Smoke test critical paths on the production URL (incognito).
6. Confirm Lighthouse 90+ and CLS < 0.05 on home + product.
7. Watch Sentry for 72 hours.
