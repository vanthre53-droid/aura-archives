import { type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { updateProduct, softDeleteProduct } from '@/services/product.service'
import { updateProductSchema } from '@/lib/validations/schemas'
import { getAdminUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { checkRateLimit, rateLimiters } from '@/lib/redis/rate-limit'
import {
  ok,
  fail,
  forbidden,
  invalidInput,
  rateLimited,
  serverError,
  getClientIp,
} from '@/lib/api/http'

interface RouteContext {
  params: { id: string }
}

/** PUT /api/v1/products/[id] — admin: update a product. */
export async function PUT(request: NextRequest, { params }: RouteContext): Promise<Response> {
  try {
    const ip = getClientIp(request)
    const limit = await checkRateLimit(rateLimiters.productsWrite, ip)
    if (!limit.success) return rateLimited()

    const admin = await getAdminUser()
    if (!admin) return forbidden()

    const parsed = updateProductSchema.safeParse(await request.json())
    if (!parsed.success) return invalidInput()

    const { product, error } = await updateProduct(params.id, parsed.data)
    if (!product) return fail(error ?? 'Could not update the product.', error === 'Product not found.' ? 404 : 400)

    await recordAudit({
      userId: admin.id,
      action: 'product.update',
      resource: 'product',
      resourceId: product.id,
      ipAddress: ip,
      metadata: { fields: Object.keys(parsed.data) },
    })

    return ok(product)
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}

/** DELETE /api/v1/products/[id] — admin: soft-delete a product. */
export async function DELETE(request: NextRequest, { params }: RouteContext): Promise<Response> {
  try {
    const ip = getClientIp(request)
    const limit = await checkRateLimit(rateLimiters.productsWrite, ip)
    if (!limit.success) return rateLimited()

    const admin = await getAdminUser()
    if (!admin) return forbidden()

    const { ok: deleted, error } = await softDeleteProduct(params.id)
    if (!deleted) return fail(error ?? 'Could not delete the product.', error === 'Product not found.' ? 404 : 400)

    await recordAudit({
      userId: admin.id,
      action: 'product.delete',
      resource: 'product',
      resourceId: params.id,
      ipAddress: ip,
    })

    return ok({ id: params.id })
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}
