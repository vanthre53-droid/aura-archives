'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { APP_URL } from '@/lib/constants'
import type { LoginInput, RegisterInput } from '@/lib/validations/schemas'

export interface AuthResult {
  ok: boolean
  error?: string
}

/** Friendly, non-leaky message for any auth failure. */
function toFriendlyError(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return 'That email or password is incorrect.'
  }
  if (/already registered|already exists/i.test(message)) {
    return 'An account with this email already exists.'
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email, then sign in.'
  }
  return 'Something went wrong. Please try again.'
}

/** Auth actions wrapping the browser Supabase client. */
export function useAuth() {
  const router = useRouter()

  const signIn = useCallback(async ({ email, password }: LoginInput): Promise<AuthResult> => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: toFriendlyError(error.message) }
    return { ok: true }
  }, [])

  const signUp = useCallback(
    async ({ email, password, fullName, consentGiven }: RegisterInput): Promise<AuthResult> => {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${APP_URL}/auth/callback`,
          data: { full_name: fullName, consent_given: consentGiven },
        },
      })
      if (error) return { ok: false, error: toFriendlyError(error.message) }
      return { ok: true }
    },
    [],
  )

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${APP_URL}/reset-password`,
    })
    if (error) return { ok: false, error: toFriendlyError(error.message) }
    return { ok: true }
  }, [])

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return { ok: false, error: toFriendlyError(error.message) }
    return { ok: true }
  }, [])

  const signOut = useCallback(async (): Promise<void> => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }, [router])

  return { signIn, signUp, requestPasswordReset, updatePassword, signOut }
}
