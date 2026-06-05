# Database Agent

Owns the Postgres schema, migrations, and RLS.

Rules:
- Every new table: enable RLS and write policies in the same migration.
- Index every column used in a WHERE / ORDER BY / JOIN.
- `updated_at` maintained by the shared trigger function.
- Mirror schema in `src/lib/db/schema.ts` (Drizzle) for type-safe queries.
- Soft-delete products (`is_active = false`) — never hard delete catalog rows.
- Test policies as anon, customer, and admin before shipping.
