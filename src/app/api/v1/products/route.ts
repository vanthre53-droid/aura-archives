import { type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { listProducts, createProduct } from '@/services/product.service'
import { createProductSchema } from '@/lib/validations/schemas'
import { getAdminUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { checkRateLimit, rateLimiters } from '@/lib/redis/rate-limit'
import { MAX_PAGE_SIZE, PAGE_SIZE } from '@/lib/constants'
import {
  ok,
  fail,
  forbidden,
  invalidInput,
  rateLimited,
  serverError,
  getClientIp,
} from '@/lib/api/http'

/** GET /api/v1/products — public product listing with filters. */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const ip = getClientIp(request)
    const limit = await checkRateLimit(rateLimiters.productsRead, ip)
    if (!limit.success) return rateLimited()

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const requestedLimit = Number(searchParams.get('limit')) || PAGE_SIZE
    const pageSize = Math.min(Math.max(1, requestedLimit), MAX_PAGE_SIZE)
    const category = searchParams.get('category') ?? undefined
    const featured = searchParams.get('featured') === 'true'
    const tagsParam = searchParams.get('tags')
    const tags = tagsParam ? tagsParam.split(',').map((t) => t.trim()).filter(Boolean) : undefined

    const { products, total } = await listProducts({
      categorySlug: category,
      tags,
      featured,
      page,
      limit: pageSize,
    })

    return ok(products, { total, page })
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}

/** POST /api/v1/products — admin: create a product. */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const ip = getClientIp(request)
    const limit = await checkRateLimit(rateLimiters.productsWrite, ip)
    if (!limit.success) return rateLimited()

    const admin = await getAdminUser()
    if (!admin) return forbidden()

    const parsed = createProductSchema.safeParse(await request.json())
    if (!parsed.success) return invalidInput()

    const { product, error } = await createProduct(parsed.data)
    if (!product) return fail(error ?? 'Could not create the product.', 400)

    await recordAudit({
      userId: admin.id,
      action: 'product.create',
      resource: 'product',
      resourceId: product.id,
      ipAddress: ip,
      metadata: { slug: product.slug },
    })

    return ok(product, undefined, { status: 201 })
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}
