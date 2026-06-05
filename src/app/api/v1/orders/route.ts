import { type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createOrder } from '@/services/order.service'
import { createOrderSchema } from '@/lib/validations/schemas'
import { getSessionUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { emitEvent } from '@/lib/inngest/emit'
import { checkRateLimit, rateLimiters } from '@/lib/redis/rate-limit'
import { DEFAULT_CURRENCY } from '@/lib/constants'
import {
  ok,
  fail,
  unauthorized,
  invalidInput,
  rateLimited,
  serverError,
  getClientIp,
} from '@/lib/api/http'

/** POST /api/v1/orders — auth: place an order. */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const ip = getClientIp(request)
    const limit = await checkRateLimit(rateLimiters.orders, ip)
    if (!limit.success) return rateLimited()

    const user = await getSessionUser()
    if (!user) return unauthorized()

    const parsed = createOrderSchema.safeParse(await request.json())
    if (!parsed.success) return invalidInput()

    const { order, error } = await createOrder(user.id, parsed.data)
    if (!order) return fail(error ?? 'We could not place your order. Please try again.', 400)

    await recordAudit({
      userId: user.id,
      action: 'order.create',
      resource: 'order',
      resourceId: order.id,
      ipAddress: ip,
      metadata: { item_count: parsed.data.items.length },
    })

    await emitEvent({
      name: 'order/created',
      data: {
        orderId: order.id,
        customerEmail: parsed.data.customer_email,
        customerName: parsed.data.customer_name,
        items: parsed.data.items,
        subtotal: order.subtotal,
        currency: DEFAULT_CURRENCY,
      },
    })

    return ok(order, undefined, { status: 201 })
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}
