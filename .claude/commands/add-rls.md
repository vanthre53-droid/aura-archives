# Command: Add RLS To A Table

1. `ALTER TABLE public.<t> ENABLE ROW LEVEL SECURITY;`
2. Add owner policies (select/insert/update/delete `USING auth.uid() = user_id`).
3. Add public-read policy if the data is public (`USING (is_active = true)`).
4. Add admin-all policy (`EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')`).
5. If the table is used with Realtime, match the replication filter to the policy.
6. Test as anon, customer, admin. See `.claude/snippets/rls-policy.sql`.
