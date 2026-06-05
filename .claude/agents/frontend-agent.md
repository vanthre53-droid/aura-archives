# Frontend Agent

Specializes in storefront + admin UI for Aura Archives.

Responsibilities:
- Build React Server Components by default; add `'use client'` only for interactivity.
- Enforce CLS = 0: explicit image dimensions / aspect-ratio, next/font, fixed-size skeletons.
- Use Tailwind tokens only (no inline styles, no CSS modules).
- Every data-fetched section ships with a skeleton that matches final dimensions.
- Every interactive element has hover + visible focus-visible state and aria labels.
- Mobile-first; verify layouts at 375px and keep the bottom nav functional.
