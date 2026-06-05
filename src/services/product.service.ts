import * as Sentry from '@sentry/nextjs'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/config'
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from '@/lib/sample-data'
import { PAGE_SIZE } from '@/lib/constants'
import { generateSlug } from '@/lib/utils'
import type { CreateProductInput, UpdateProductInput } from '@/lib/validations/schemas'
import type { Database } from '@/types/database.types'
import type { Category, Product } from '@/types/shop.types'

interface ListOptions {
  categorySlug?: string
  tags?: string[]
  featured?: boolean
  page?: number
  limit?: number
}

interface ListResult {
  products: Product[]
  total: number
}

function filterSample(options: ListOptions): ListResult {
  const { categorySlug, tags, featured, page = 1, limit = PAGE_SIZE } = options
  let items = SAMPLE_PRODUCTS.filter((p) => p.is_active)
  if (categorySlug) {
    const category = SAMPLE_CATEGORIES.find((c) => c.slug === categorySlug)
    items = items.filter((p) => p.category_id === category?.id)
  }
  if (featured) items = items.filter((p) => p.is_featured)
  if (tags?.length) items = items.filter((p) => tags.every((t) => p.tags?.includes(t)))
  const total = items.length
  const start = (page - 1) * limit
  return { products: items.slice(start, start + limit), total }
}

/** List products with optional filters. Falls back to sample data when Supabase
 * is not configured or a query fails. */
export async function listProducts(options: ListOptions = {}): Promise<ListResult> {
  if (!isSupabaseConfigured()) return filterSample(options)

  const { categorySlug, tags, featured, page = 1, limit = PAGE_SIZE } = options
  try {
    const supabase = createClient()
    let categoryId: string | undefined
    if (categorySlug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle()
      if (!category) return { products: [], total: 0 }
      categoryId = category.id
    }

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (categoryId) query = query.eq('category_id', categoryId)
    if (featured) query = query.eq('is_featured', true)
    if (tags?.length) query = query.contains('tags', tags)

    const { data, count, error } = await query
    if (error) throw error
    return { products: data ?? [], total: count ?? 0 }
  } catch (error) {
    Sentry.captureException(error)
    return filterSample(options)
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { products } = await listProducts({ featured: true, limit })
  return products
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug && p.is_active) ?? null
  }
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    if (error) throw error
    return data
  } catch (error) {
    Sentry.captureException(error)
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug && p.is_active) ?? null
  }
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const category = SAMPLE_CATEGORIES.find((c) => c.id === product.category_id)
  const { products } = await listProducts({
    categorySlug: category?.slug,
    limit: limit + 1,
  })
  return products.filter((p) => p.id !== product.id).slice(0, limit)
}

export async function searchProducts(query: string, limit = 24): Promise<Product[]> {
  const term = query.trim()
  if (!term) return []
  if (!isSupabaseConfigured()) {
    const lower = term.toLowerCase()
    return SAMPLE_PRODUCTS.filter(
      (p) =>
        p.is_active &&
        (p.name.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower) ||
          p.tags?.some((t) => t.includes(lower))),
    ).slice(0, limit)
  }
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(limit)
    if (error) throw error
    return data ?? []
  } catch (error) {
    Sentry.captureException(error)
    return []
  }
}

export async function getActiveProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return SAMPLE_PRODUCTS.map((p) => p.slug)
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('products').select('slug').eq('is_active', true)
    if (error) throw error
    return (data ?? []).map((row) => row.slug)
  } catch (error) {
    Sentry.captureException(error)
    return []
  }
}

/** All products including inactive (admin listing, service role). */
export async function getAllProductsAdmin(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return SAMPLE_PRODUCTS
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    Sentry.captureException(error)
    return SAMPLE_PRODUCTS
  }
}

/** A single product by id, including inactive (admin edit, service role). */
export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.from('products').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  } catch (error) {
    Sentry.captureException(error)
    return null
  }
}

/** Postgres unique-violation code, surfaced by Supabase on duplicate slug. */
const UNIQUE_VIOLATION = '23505'

/** Creates a product (admin). Service-role write — bypasses RLS. */
export async function createProduct(
  input: CreateProductInput,
): Promise<{ product: Product | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { product: null, error: 'Product management is not available in this environment.' }
  }
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('products')
      .insert({
        name: input.name,
        slug: input.slug ?? generateSlug(input.name),
        category_id: input.category_id ?? null,
        tagline: input.tagline || null,
        description: input.description || null,
        details: input.details ?? null,
        price: input.price,
        compare_at_price: input.compare_at_price ?? null,
        currency: input.currency,
        images: input.images ?? null,
        sizes: input.sizes ?? null,
        tags: input.tags ?? null,
        is_active: input.is_active,
        is_featured: input.is_featured,
        stock_quantity: input.stock_quantity,
        sort_order: input.sort_order,
      })
      .select()
      .single()
    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return { product: null, error: 'A product with this slug already exists.' }
      }
      throw error
    }
    return { product: data }
  } catch (error) {
    Sentry.captureException(error)
    return { product: null, error: 'Could not create the product.' }
  }
}

/** Maps a partial product input to a DB update patch, dropping undefined keys. */
function toProductPatch(
  input: UpdateProductInput,
): Database['public']['Tables']['products']['Update'] {
  const patch: Database['public']['Tables']['products']['Update'] = {}
  if (input.name !== undefined) patch.name = input.name
  if (input.slug !== undefined) patch.slug = input.slug
  if (input.category_id !== undefined) patch.category_id = input.category_id ?? null
  if (input.tagline !== undefined) patch.tagline = input.tagline || null
  if (input.description !== undefined) patch.description = input.description || null
  if (input.details !== undefined) patch.details = input.details
  if (input.price !== undefined) patch.price = input.price
  if (input.compare_at_price !== undefined) patch.compare_at_price = input.compare_at_price ?? null
  if (input.currency !== undefined) patch.currency = input.currency
  if (input.images !== undefined) patch.images = input.images
  if (input.sizes !== undefined) patch.sizes = input.sizes
  if (input.tags !== undefined) patch.tags = input.tags
  if (input.is_active !== undefined) patch.is_active = input.is_active
  if (input.is_featured !== undefined) patch.is_featured = input.is_featured
  if (input.stock_quantity !== undefined) patch.stock_quantity = input.stock_quantity
  if (input.sort_order !== undefined) patch.sort_order = input.sort_order
  return patch
}

/** Updates a product (admin). Returns the updated row, or an error/not-found. */
export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<{ product: Product | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { product: null, error: 'Product management is not available in this environment.' }
  }
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('products')
      .update({ ...toProductPatch(input), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return { product: null, error: 'A product with this slug already exists.' }
      }
      throw error
    }
    if (!data) return { product: null, error: 'Product not found.' }
    return { product: data }
  } catch (error) {
    Sentry.captureException(error)
    return { product: null, error: 'Could not update the product.' }
  }
}

/** Soft-deletes a product (admin) by clearing `is_active`. */
export async function softDeleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Product management is not available in this environment.' }
  }
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('products')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id')
      .maybeSingle()
    if (error) throw error
    if (!data) return { ok: false, error: 'Product not found.' }
    return { ok: true }
  } catch (error) {
    Sentry.captureException(error)
    return { ok: false, error: 'Could not delete the product.' }
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return SAMPLE_CATEGORIES
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    if (error) throw error
    return data ?? SAMPLE_CATEGORIES
  } catch (error) {
    Sentry.captureException(error)
    return SAMPLE_CATEGORIES
  }
}
