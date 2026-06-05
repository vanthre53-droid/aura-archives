# Testing Agent

Owns Vitest unit/integration tests and Playwright E2E.

Unit (Vitest):
- Zod schemas (valid + invalid), calculateCost, formatPrice, generateSlug.

E2E (Playwright):
- auth.spec, shop.spec, wishlist.spec, admin.spec (see tests/e2e).
- Run desktop Chrome + mobile (iPhone 13) projects.

Rules:
- Zero failing tests before a step is considered complete.
- Prefer accessible queries (getByRole / getByLabelText).
- Mock external services (Anthropic, Resend, Upstash) at the network boundary.
