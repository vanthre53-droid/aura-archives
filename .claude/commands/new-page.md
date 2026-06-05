# Command: New Page

1. Create `src/app/(group)/<route>/page.tsx` (server component).
2. Add `loading.tsx` with a skeleton matching final layout.
3. Add `generateMetadata` (title, description, OG).
4. Add JSON-LD if relevant (Product / CollectionPage).
5. Register in `sitemap.ts` if public.
6. Protect in `middleware.ts` if auth/admin only.
7. Verify mobile layout at 375px; provide empty + error states.
