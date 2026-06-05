import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emitEvent } from '@/lib/inngest/emit'

/**
 * Exchanges the auth code for a session BEFORE redirecting — otherwise the user
 * lands unauthenticated. Used for email confirmation and password recovery.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const safeNext = next.startsWith('/') ? next : '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Welcome a newly-confirmed account. Skip the password-recovery flow,
      // which shares this callback, to avoid an out-of-context email.
      if (safeNext !== '/reset-password') {
        const { data } = await supabase.auth.getUser()
        const user = data.user
        if (user?.email) {
          const name =
            (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
            user.email.split('@')[0]!
          await emitEvent({ name: 'user/registered', data: { email: user.email, name } })
        }
      }
      return NextResponse.redirect(`${origin}${safeNext}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
