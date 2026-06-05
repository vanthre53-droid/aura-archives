# Debug Template

1. **Symptom** — what page/route, what the user did, what happened vs expected.
2. **Repro** — exact steps; device/viewport; auth state (guest/customer/admin).
3. **Evidence** — console error, network response, Sentry event id (no PII).
4. **Hypothesis** — most likely cause given the stack.
5. **Fix** — smallest change; list files touched.
6. **Verify** — lint + type-check + relevant test; manual check at 375px.
