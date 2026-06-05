# Supabase Setup

## 1. Create the project
- Region: **`ap-south-1` (Mumbai)** — required for India DPDP data residency.
- Copy the **Project URL**, **anon key**, and **service role key** into `.env.local`.
- Copy the Postgres connection string into `DATABASE_URL` (for Drizzle Kit).

## 2. Run migrations (in order)
In the Supabase SQL Editor (or `supabase db push`), run:
1. `migrations/001_initial_schema.sql`
2. `migrations/002_rls_policies.sql`
3. `migrations/003_seed_data.sql`
4. `migrations/004_auth_user_trigger.sql`

## 3. Create the storage bucket
Storage → New bucket → name `product-images` → **Public**.

## 4. Enable email auth
Authentication → Providers → Email (enable). Add redirect URL
`http://localhost:3000/auth/callback` (and your production URL).

## 5. Generate TypeScript types
```
pnpm dlx supabase login
pnpm dlx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.types.ts
```
(The committed `database.types.ts` is a faithful hand-authored mirror until you run this.)

## 6. Seed sample data (optional, idempotent)
```
pnpm tsx scripts/seed-db.ts
```

## 7. Promote an admin
After registering your account, in the SQL Editor:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'you@example.com';
```

---

## Verifying RLS

After migrations, confirm RLS is enabled on every table:
```sql
SELECT relname, relrowsecurity
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relname IN ('users','categories','products','wishlist','orders','ai_usage_logs','audit_logs');
-- relrowsecurity must be true for all rows.
```

Test the policies by impersonating roles in the SQL Editor:
```sql
-- As an anonymous visitor: only active products/categories are visible.
SET request.jwt.claims = '{"role":"anon"}';
SET ROLE anon;
SELECT count(*) FROM public.products;       -- only is_active = true
SELECT count(*) FROM public.users;           -- 0 (blocked)
RESET ROLE;

-- As a specific authenticated customer: only their own wishlist/orders.
SET ROLE authenticated;
SET request.jwt.claims = '{"sub":"<USER_UUID>","role":"authenticated"}';
SELECT count(*) FROM public.wishlist;        -- only rows where user_id = <USER_UUID>
RESET ROLE;
```
A customer hitting `/admin` is additionally blocked by `middleware.ts` (Step 04).
