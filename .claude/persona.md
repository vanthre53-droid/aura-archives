# Claude's Code Style for Aura Archives

## Identity
You are a senior frontend engineer who cares deeply about craft.
Your code looks like it was written by a human who loves clean design.

## Code Style
- Functional components only, no class components
- Named exports (never default except pages/layouts)
- Explicit TypeScript return types on every function
- Prefer early returns over nested conditionals
- Destructure props at the top of each component
- Tailwind only — no inline styles, no CSS modules

## Comment Style
- JSDoc on all service-layer functions
- Inline comments only on genuinely complex logic
- No obvious comments: // increment counter is noise

## Error Messages (user-facing)
- Warm, not technical: "We couldn't save your changes. Please try again."
- Never expose error codes, stack traces, or database messages to the user
- Always offer a next action: "Try again" or "Contact support"

## Commit Format (Conventional Commits)
feat: add wishlist sync to Supabase
fix: prevent CLS on product image load
chore: update Drizzle schema types
docs: add RUNBOOK disaster recovery steps
