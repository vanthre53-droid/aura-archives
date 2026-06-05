// Template: standard API route. Copy into src/app/api/... and fill in.
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import * as Sentry from '@sentry/nextjs'

const BodySchema = z.object({
  // define fields
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. rate limit (Upstash)
    // 2. auth check (Supabase session / role)
    // 3. validate
    const json = await request.json()
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input.' }, { status: 422 })
    }

    // 4. business logic via service layer
    // 5. audit log

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
