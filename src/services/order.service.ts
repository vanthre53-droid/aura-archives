import * as Sentry from '@sentry/nextjs'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/config'
import type { CreateOrderInput } from '@/lib/validations/schemas'
import type { Order, OrderStatus } from '@/types/shop.types'

/** Orders belonging to the signed-in user (RLS-scoped). */
export async function getMyOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    Sentry.captureException(error)
    return []
  }
}

/** Creates an order for the given user. Returns the created order or an error. */
export async function createOrder(
  userId: string,
  input: CreateOrderInput,
): Promise<{ order: Order | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { order: null, error: 'Ordering is not available in this environment.' }
  }
  try {
    const supabase = createClient()
    const subtotal = input.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items: input.items,
        subtotal,
        customer_name: input.customer_name,
        customer_email: input.customer_email,
        customer_phone: input.customer_phone || null,
        shipping_address: input.shipping_address,
        notes: input.notes || null,
      })
      .select()
      .single()
    if (error) throw error
    return { order: data }
  } catch (error) {
    Sentry.captureException(error)
    return { order: null, error: 'We could not place your order. Please try again.' }
  }
}

/** All orders (admin, service role — bypasses RLS). */
export async function getAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    Sentry.captureException(error)
    return []
  }
}

/** Updates an order's status and returns the updated row, or null on failure. */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error
    return data
  } catch (error) {
    Sentry.captureException(error)
    return null
  }
}
