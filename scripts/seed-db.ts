/**
 * Seeds categories and a sample product via the Supabase service role.
 * Run with: pnpm tsx scripts/seed-db.ts
 *
 * Idempotent: upserts on slug so it is safe to re-run.
 */
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

loadEnv({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('✗ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main(): Promise<void> {
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .upsert(
      [
        {
          name: 'Fine Jewelry',
          slug: 'jewelry',
          description: 'Handcrafted precious metal and gemstone pieces',
          sort_order: 1,
        },
        {
          name: 'Apparel',
          slug: 'clothing',
          description: 'Editorial clothing with archival influences',
          sort_order: 2,
        },
      ],
      { onConflict: 'slug' },
    )
    .select()

  if (catError) throw catError

  const jewelry = categories?.find((c) => c.slug === 'jewelry')
  if (!jewelry) throw new Error('Jewelry category not found after seed.')

  const { error: prodError } = await supabase.from('products').upsert(
    {
      category_id: jewelry.id,
      name: 'Sculptural Gold Ring',
      slug: 'sculptural-gold-ring',
      tagline: 'NEW ARRIVAL | LIMITED',
      description:
        'An exploration of organic form and fluid geometry, handcrafted in 18k recycled yellow gold.',
      details: [
        '18k Recycled Solid Gold',
        'Hand-polished mirror finish',
        'Width: 8mm - 12mm (tapered)',
      ],
      price: 145000,
      currency: 'INR',
      sizes: ['52', '54', '56', '58'],
      tags: ['new-arrival', 'limited', 'jewelry', 'rings'],
      is_active: true,
      is_featured: true,
      stock_quantity: 12,
    },
    { onConflict: 'slug' },
  )

  if (prodError) throw prodError

  console.warn('✓ Seed complete.')
}

main().catch((error) => {
  console.error('✗ Seed failed:', error)
  process.exit(1)
})
