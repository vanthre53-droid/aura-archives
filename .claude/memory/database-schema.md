# Database Schema (summary)

Tables (see `supabase/migrations/001_initial_schema.sql`):

- **users** — extends auth.users; role (customer|admin), consent fields, flags.
- **categories** — name, slug, is_active, sort_order.
- **products** — name, slug, price, currency, images[], sizes[], tags[], flags, stock.
- **wishlist** — (user_id, product_id) unique.
- **orders** — items JSONB, subtotal, customer + shipping info, status enum.
- **ai_usage_logs** — token counts, cost_usd, latency, success.
- **audit_logs** — action, resource, ip, metadata.

RLS: public read for active categories/products; owner-scoped wishlist/orders;
admin-all on management tables. See `002_rls_policies.sql`.
