'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { FormError } from '@/components/forms/FormError'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { registerSchema, type RegisterInput } from '@/lib/validations/schemas'

export function RegisterForm(): React.ReactElement {
  const { signUp } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values: RegisterInput): Promise<void> {
    setFormError(null)
    const result = await signUp(values)
    if (!result.ok) {
      setFormError(result.error ?? 'Unable to create your account.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-serif text-2xl">Check your inbox</h1>
        <p className="text-sm text-text-muted">
          We&apos;ve sent a confirmation link to verify your email. Once confirmed, you can sign in.
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
        <h1 className="font-serif text-2xl">Create your account</h1>
        <p className="text-sm text-text-muted">Join the archive.</p>
      </header>

      <FormField htmlFor="fullName" label="Full name" error={errors.fullName?.message} required>
        <Input
          id="fullName"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          {...register('fullName')}
        />
      </FormField>

      <FormField htmlFor="email" label="Email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </FormField>

      <FormField htmlFor="password" label="Password" error={errors.password?.message} hint="At least 8 characters." required>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </FormField>

      <FormField
        htmlFor="confirmPassword"
        label="Confirm password"
        error={errors.confirmPassword?.message}
        required
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register('confirmPassword')}
        />
      </FormField>

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-2 text-xs text-text-muted">
          <input type="checkbox" className="mt-0.5" {...register('ageConfirmed')} />
          <span>I confirm I am 13 years of age or older.</span>
        </label>
        <FormError message={errors.ageConfirmed?.message} />

        <label className="flex items-start gap-2 text-xs text-text-muted">
          <input type="checkbox" className="mt-0.5" {...register('consentGiven')} />
          <span>
            I agree to the{' '}
            <Link href="/privacy" className="text-text underline">
              Privacy Policy
            </Link>{' '}
            and consent to the processing of my personal data.
          </span>
        </label>
        <FormError message={errors.consentGiven?.message} />
      </div>

      <FormError message={formError ?? undefined} />

      <SubmitButton isLoading={isSubmitting} className="w-full">
        Create account
      </SubmitButton>

      <p className="text-center text-xs text-text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-text underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
