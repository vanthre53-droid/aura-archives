'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/schemas'

export function ForgotPasswordForm(): React.ReactElement {
  const { requestPasswordReset } = useAuth()
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(values: ForgotPasswordInput): Promise<void> {
    // Always show success to avoid leaking which emails are registered.
    await requestPasswordReset(values.email)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-serif text-2xl">Check your inbox</h1>
        <p className="text-sm text-text-muted">
          If an account exists for that email, we&apos;ve sent a reset link.
        </p>
        <Link href="/login" className="mt-2 text-sm text-text underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl">Reset your password</h1>
        <p className="text-sm text-text-muted">We&apos;ll email you a reset link.</p>
      </header>

      <FormField htmlFor="email" label="Email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </FormField>

      <SubmitButton isLoading={isSubmitting} className="w-full">
        Send reset link
      </SubmitButton>

      <Link href="/login" className="text-center text-xs text-text-muted hover:text-text">
        Back to sign in
      </Link>
    </form>
  )
}
