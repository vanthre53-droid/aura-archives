# Command: Run Checks

Before considering any step complete:

```
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

E2E (requires a running app / preview): `pnpm test:e2e`.
Env sanity before deploy: `pnpm check:env`.
