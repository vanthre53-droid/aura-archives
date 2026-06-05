'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { FormError } from '@/components/forms/FormError'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginInput } from '@/lib/validations/schemas'

export function LoginForm(): React.ReactElement {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginInput): Promise<void> {
    setFormError(null)
    const result = await signIn(values)
    if (!result.ok) {
      setFormError(result.error ?? 'Unable to sign in.')
      return
    }
    const redirectTo = searchParams.get('redirectTo')
    router.push(redirectTo && redirectTo.startsWith('/') ? redirectTo : '/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl">Welcome back</h1>
        <p className="text-sm text-text-muted">Sign in to continue.</p>
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

      <FormField htmlFor="password" label="Password" error={errors.password?.message} required>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </FormField>

      <FormError message={formError ?? undefined} />

      <SubmitButton isLoading={isSubmitting} className="w-full">
        Sign in
      </SubmitButton>

      <div className="flex flex-col gap-2 text-center text-xs text-text-muted">
        <Link href="/forgot-password" className="hover:text-text">
          Forgot your password?
        </Link>
        <span>
          New here?{' '}
          <Link href="/register" className="text-text underline">
            Create an account
          </Link>
        </span>
      </div>
    </form>
  )
}
