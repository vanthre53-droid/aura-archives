import type { Database } from './database.types'

export type { OrderStatus, UserRole } from './database.types'

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type Category = Database['public']['Tables']['categories']['Row']
export type WishlistRow = Database['public']['Tables']['wishlist']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type UserProfile = Database['public']['Tables']['users']['Row']

/** A single line item stored in orders.items and the client cart. */
export interface CartItem {
  product_id: string
  name: string
  price: number
  qty: number
  size: string | null
  image: string | null
}

export interface ShippingAddress {
  line1: string
  city: string
  state: string
  pin: string
  country: string
}
