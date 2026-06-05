import { NextResponse, type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { toggleWishlist } from '@/services/wishlist.service'
import { wishlistToggleSchema } from '@/lib/validations/schemas'
import { getSessionUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { checkRateLimit, rateLimiters } from '@/lib/redis/rate-limit'
import {
  fail,
  unauthorized,
  invalidInput,
  rateLimited,
  serverError,
  getClientIp,
} from '@/lib/api/http'

/** POST /api/v1/wishlist — auth: toggle a product in the user's wishlist. */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const ip = getClientIp(request)
    const limit = await checkRateLimit(rateLimiters.wishlist, ip)
    if (!limit.success) return rateLimited()

    const user = await getSessionUser()
    if (!user) return unauthorized()

    const parsed = wishlistToggleSchema.safeParse(await request.json())
    if (!parsed.success) return invalidInput()

    const result = await toggleWishlist(user.id, parsed.data.product_id)
    if (result.error) return fail(result.error, 400)

    await recordAudit({
      userId: user.id,
      action: `wishlist.${result.action}`,
      resource: 'wishlist',
      resourceId: parsed.data.product_id,
      ipAddress: ip,
    })

    return NextResponse.json({ success: true, action: result.action })
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}
