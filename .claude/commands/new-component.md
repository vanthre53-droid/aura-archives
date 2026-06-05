# Command: New Component

- Functional component, named export, explicit return type (`React.ReactElement`).
- Destructure props at the top; type props with an interface.
- Server component by default; add `'use client'` only when needed.
- Tailwind tokens only. No inline styles.
- Provide loading / empty / error variants where the component renders data.
- Icon-only buttons get `aria-label`. Interactive elements get focus-visible styles.
