import { NextResponse, type NextRequest } from 'next/server'

/** Success envelope: `{ success: true, data }` plus any extra top-level fields. */
export function ok<T>(data: T, extra?: Record<string, unknown>, init?: ResponseInit): NextResponse {
  return NextResponse.json({ success: true, data, ...extra }, init)
}

/** Error envelope: `{ success: false, error }`. Never leak internals here. */
export function fail(error: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error }, { status })
}

export const unauthorized = (): NextResponse => fail('You must be signed in.', 401)
export const forbidden = (): NextResponse => fail('You do not have access to this resource.', 403)
export const invalidInput = (): NextResponse => fail('Invalid input.', 422)
export const rateLimited = (): NextResponse => fail('Too many requests. Please slow down.', 429)
export const serverError = (): NextResponse =>
  fail('Something went wrong. Please try again.', 500)

/** Best-effort client IP for rate-limit keys and audit logs. */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? '127.0.0.1'
}
