# PR Review Flow

1. CI must pass (lint, type-check, test, build) — see `.github/workflows/ci.yml`.
2. Reviewer runs through `.claude/prompts/review-template.md`.
3. Check the diff scope matches the description (no drive-by edits).
4. Verify new env vars are documented in `.env.example` and `.claude/env.md`.
5. Verify migrations include RLS for any new table.
6. Approve only when mobile (375px) and a11y are addressed.
