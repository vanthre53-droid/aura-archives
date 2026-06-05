# Review Template

- [ ] No `any`; explicit return types; no unused imports/vars.
- [ ] Async code wrapped in try/catch + Sentry; no PII logged.
- [ ] Forms: loading state + disabled on submit + friendly error.
- [ ] Images via next/image with dimensions/aspect-ratio (CLS = 0).
- [ ] Data sections have skeleton + empty + error states.
- [ ] API routes: rate limit → auth → Zod → logic → audit.
- [ ] New tables have RLS + policies + indexes.
- [ ] Mobile verified at 375px; focus-visible + aria where needed.
