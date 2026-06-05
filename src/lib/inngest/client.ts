import { Inngest, eventType, staticSchema } from 'inngest'
import type { CartItem, OrderStatus } from '@/types/shop.types'

export const inngest = new Inngest({ id: 'aura-archives' })

/**
 * Typed event catalogue. `staticSchema` gives compile-time data typing without
 * pulling a validator into the event path — the API routes that emit these
 * events have already validated their inputs with Zod.
 */
export const orderCreated = eventType('order/created', {
  schema: staticSchema<{
    orderId: string
    customerEmail: string
    customerName: string
    items: CartItem[]
    subtotal: number
    currency: string
  }>(),
})

export const orderStatusUpdated = eventType('order/status.updated', {
  schema: staticSchema<{
    orderId: string
    customerEmail: string
    customerName: string
    status: OrderStatus
  }>(),
})

export const userRegistered = eventType('user/registered', {
  schema: staticSchema<{ email: string; name: string }>(),
})
