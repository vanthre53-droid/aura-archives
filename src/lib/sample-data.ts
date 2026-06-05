import type { Category, Product } from '@/types/shop.types'

/**
 * Fallback catalog used when Supabase is not configured (or returns nothing),
 * so the storefront is fully browsable in the prototype out of the box.
 * Once Supabase has data, the services prefer live rows over these.
 */
const now = new Date().toISOString()

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: '00000000-0000-0000-0000-0000000000c1',
    name: 'Fine Jewelry',
    slug: 'jewelry',
    description: 'Handcrafted precious metal and gemstone pieces',
    image_url: null,
    sort_order: 1,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: '00000000-0000-0000-0000-0000000000c2',
    name: 'Apparel',
    slug: 'clothing',
    description: 'Editorial clothing with archival influences',
    image_url: null,
    sort_order: 2,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
]

function product(p: Partial<Product> & Pick<Product, 'name' | 'slug' | 'price'>): Product {
  return {
    id: p.id ?? p.slug,
    category_id: p.category_id ?? null,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline ?? null,
    description: p.description ?? null,
    details: p.details ?? null,
    price: p.price,
    compare_at_price: p.compare_at_price ?? null,
    currency: p.currency ?? 'INR',
    images: p.images ?? null,
    sizes: p.sizes ?? null,
    tags: p.tags ?? null,
    is_active: p.is_active ?? true,
    is_featured: p.is_featured ?? false,
    stock_quantity: p.stock_quantity ?? 10,
    sort_order: p.sort_order ?? 0,
    created_at: now,
    updated_at: now,
  }
}

const JEWELRY = SAMPLE_CATEGORIES[0].id
const CLOTHING = SAMPLE_CATEGORIES[1].id

export const SAMPLE_PRODUCTS: Product[] = [
  product({
    id: 's-ring',
    category_id: JEWELRY,
    name: 'Sculptural Gold Ring',
    slug: 'sculptural-gold-ring',
    tagline: 'NEW ARRIVAL | LIMITED',
    description:
      'An exploration of organic form and fluid geometry, handcrafted in 18k recycled yellow gold.',
    details: ['18k Recycled Solid Gold', 'Hand-polished mirror finish', 'Width: 8mm – 12mm (tapered)'],
    price: 145000,
    sizes: ['52', '54', '56', '58'],
    tags: ['new-arrival', 'limited', 'jewelry', 'rings'],
    is_featured: true,
  }),
  product({
    id: 's-pendant',
    category_id: JEWELRY,
    name: 'Monolith Pendant',
    slug: 'monolith-pendant',
    tagline: 'ARCHIVE',
    description: 'A single carved stone suspended on a fine gold chain — quiet, architectural, enduring.',
    details: ['Carved onyx', '18k gold chain, 45cm', 'Hand-finished'],
    price: 98000,
    sizes: ['One Size'],
    tags: ['jewelry', 'necklaces'],
    is_featured: true,
  }),
  product({
    id: 's-earrings',
    category_id: JEWELRY,
    name: 'Tidal Hoop Earrings',
    slug: 'tidal-hoop-earrings',
    description: 'Asymmetric hoops cast from a wax original, capturing the motion of water.',
    details: ['Recycled sterling silver', 'Hand-cast', 'Butterfly backs'],
    price: 42000,
    sizes: ['One Size'],
    tags: ['jewelry', 'earrings', 'new-arrival'],
    is_featured: true,
  }),
  product({
    id: 's-cuff',
    category_id: JEWELRY,
    name: 'Brutalist Cuff',
    slug: 'brutalist-cuff',
    description: 'A weighty open cuff with a raw, textured surface and a polished interior.',
    details: ['Recycled bronze', 'Adjustable', 'Protective lacquer'],
    price: 56000,
    sizes: ['S/M', 'M/L'],
    tags: ['jewelry', 'bracelets'],
  }),
  product({
    id: 's-coat',
    category_id: CLOTHING,
    name: 'Archival Wool Coat',
    slug: 'archival-wool-coat',
    tagline: 'NEW ARRIVAL',
    description: 'A double-faced wool coat with a clean, elongated silhouette and concealed closure.',
    details: ['100% virgin wool', 'Fully lined', 'Made in a family atelier'],
    price: 189000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['clothing', 'outerwear', 'new-arrival'],
    is_featured: true,
  }),
  product({
    id: 's-trouser',
    category_id: CLOTHING,
    name: 'Pleated Wide Trouser',
    slug: 'pleated-wide-trouser',
    description: 'High-rise wide-leg trousers in a fluid drape, with a single deep pleat.',
    details: ['Tencel blend', 'Hidden hook closure', 'Unhemmed for tailoring'],
    price: 64000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['clothing', 'trousers'],
  }),
  product({
    id: 's-shirt',
    category_id: CLOTHING,
    name: 'Poplin Column Shirt',
    slug: 'poplin-column-shirt',
    description: 'A crisp cotton-poplin shirt cut long and straight, equally at home tucked or loose.',
    details: ['Organic cotton poplin', 'Mother-of-pearl buttons', 'Relaxed fit'],
    price: 38000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['clothing', 'shirts', 'new-arrival'],
  }),
  product({
    id: 's-knit',
    category_id: CLOTHING,
    name: 'Cashmere Mock Knit',
    slug: 'cashmere-mock-knit',
    description: 'A dense, grade-A cashmere knit with a sculpted mock neck.',
    details: ['Grade-A cashmere', 'Mid-weight', 'Ribbed trims'],
    price: 92000,
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['clothing', 'knitwear'],
  }),
]
