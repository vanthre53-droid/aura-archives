-- ═══ USERS ═══
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_own"   ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"   ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_admin_all"    ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ═══ CATEGORIES ═══
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read"  ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_all"    ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ═══ PRODUCTS ═══
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read"  ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_all"    ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ═══ WISHLIST ═══
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist_select_own"  ON public.wishlist FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own"  ON public.wishlist FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_delete_own"  ON public.wishlist FOR DELETE  USING (auth.uid() = user_id);

-- ═══ ORDERS ═══
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own"   ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own"   ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_all"    ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ═══ AI USAGE LOGS ═══
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_usage_insert_any"   ON public.ai_usage_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "ai_usage_admin_read"   ON public.ai_usage_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ═══ AUDIT LOGS ═══
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_logs_insert_any"   ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "audit_logs_admin_all"    ON public.audit_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
