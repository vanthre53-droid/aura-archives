-- Seed categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Fine Jewelry', 'jewelry', 'Handcrafted precious metal and gemstone pieces', 1),
  ('Apparel', 'clothing', 'Editorial clothing with archival influences', 2)
ON CONFLICT (slug) DO NOTHING;

-- Seed sample product (replace image URLs after uploading to Supabase Storage)
INSERT INTO public.products (category_id, name, slug, tagline, description, details, price, currency, sizes, tags, is_active, is_featured, stock_quantity)
SELECT
  c.id,
  'Sculptural Gold Ring',
  'sculptural-gold-ring',
  'NEW ARRIVAL | LIMITED',
  'An exploration of organic form and fluid geometry, handcrafted in 18k recycled yellow gold.',
  ARRAY['18k Recycled Solid Gold', 'Hand-polished mirror finish', 'Width: 8mm - 12mm (tapered)'],
  145000.00,
  'INR',
  ARRAY['52','54','56','58'],
  ARRAY['new-arrival','limited','jewelry','rings'],
  true,
  true,
  12
FROM public.categories c WHERE c.slug = 'jewelry'
ON CONFLICT (slug) DO NOTHING;
