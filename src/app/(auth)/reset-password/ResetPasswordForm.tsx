'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { FormError } from '@/components/forms/FormError'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/schemas'

/**
 * Reached via the email reset link. Supabase establishes a recovery session on
 * arrival (the @supabase/ssr client picks it up from the URL), so updateUser can
 * set the new password directly.
 */
export function ResetPasswordForm(): React.ReactElement {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const { toast } = useToast()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit(values: ResetPasswordInput): Promise<void> {
    setFormError(null)
    const result = await updatePassword(values.password)
    if (!result.ok) {
      setFormError(result.error ?? 'Unable to update your password.')
      return
    }
    toast({ title: 'Password updated', description: 'You can now sign in.', variant: 'success' })
    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl">Set a new password</h1>
        <p className="text-sm text-text-muted">Choose a strong password you don&apos;t use elsewhere.</p>
      </header>

      <FormField htmlFor="password" label="New password" error={errors.password?.message} required>
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

      <FormError message={formError ?? undefined} />

      <SubmitButton isLoading={isSubmitting} className="w-full">
        Update password
      </SubmitButton>
    </form>
  )
}
