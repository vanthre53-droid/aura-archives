# Known Traps — Read Before Writing Code

## Supabase
- anon key vs service role: anon respects RLS, service role bypasses it entirely. 
  Always use server.ts (anon-equivalent with cookies) for user-facing routes.
  Only use admin.ts (service role) in trusted server-only operations.
- RLS with realtime: You must enable RLS AND set the replication filter to match 
  your RLS policy, or realtime will leak data across users.
- Auth callback: The callback route at /auth/callback MUST exchange the code for 
  a session before redirecting. If you redirect first, the user stays unauthenticated.

## Next.js App Router
- Server components cannot use useState, useEffect, or any browser API.
  Mark with 'use client' only when you need interactivity.
- Cookies in server components: use the `server.ts` Supabase client (createServerClient), 
  not the browser client.
- next/image: ALWAYS provide width + height to prevent CLS. For dynamic images from 
  Supabase Storage, use fill={true} with a sized parent div.
- next/font: must be initialized at the module level, not inside a component.
- generateMetadata: cannot be used in client components. Keep page.tsx as a server 
  component and export metadata/generateMetadata from it.

## AI / Vercel AI SDK
- Streaming requires the Edge runtime or a long-timeout serverless function.
  Set `export const runtime = 'edge'` on the AI chat route.
- Always track token usage in the onFinish callback, not during streaming.
- Always apply per-user rate limits BEFORE calling the Anthropic API to prevent cost blowouts.

## Zustand Cart/Wishlist
- Zustand store is client-only. For SSR, initialize the store on the client only 
  (wrap with dynamic import or useEffect).
- Cart must persist to localStorage AND sync to Supabase for authenticated users.
  On login, merge guest cart with server cart (prefer higher quantity).

## TypeScript Strict Mode
- `string | null` is NOT the same as `string | undefined`. Supabase returns null for 
  missing values; be explicit in your types.
- Never use `as Type` to cast without a comment explaining why it's safe.

## CLS (Critical — this is Feature #5)
- Reserve all image space BEFORE the image loads using aspect-ratio or explicit height.
- For product grids, skeleton cards must match EXACTLY the size of the real card.
- Font loading: next/font ensures no FOUT. Never load fonts via <link> in <head>.
- Dynamic content (cart count, user name): use a skeleton span matching the text width 
  while loading, not an empty space.
