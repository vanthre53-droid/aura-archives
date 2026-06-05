-- Template: enable RLS + standard policies for a user-owned table.
-- Replace <table> and adjust the ownership column as needed.

ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "<table>_select_own" ON public.<table>
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "<table>_insert_own" ON public.<table>
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "<table>_update_own" ON public.<table>
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "<table>_delete_own" ON public.<table>
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "<table>_admin_all" ON public.<table>
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
