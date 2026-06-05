import { type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getAllCustomers } from '@/services/user.service'
import { getAdminUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { checkRateLimit, rateLimiters } from '@/lib/redis/rate-limit'
import { forbidden, ok, rateLimited, serverError, getClientIp } from '@/lib/api/http'

/** GET /api/v1/customers — admin: list all customer profiles. */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const ip = getClientIp(request)
    const limit = await checkRateLimit(rateLimiters.productsRead, ip)
    if (!limit.success) return rateLimited()

    const admin = await getAdminUser()
    if (!admin) return forbidden()

    const customers = await getAllCustomers()

    await recordAudit({
      userId: admin.id,
      action: 'customer.list',
      resource: 'customer',
      ipAddress: ip,
      metadata: { count: customers.length },
    })

    return ok(customers, { total: customers.length })
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}
