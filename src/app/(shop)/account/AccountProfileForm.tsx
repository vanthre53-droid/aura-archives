'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { useToast } from '@/hooks/useToast'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/config'
import { profileSchema, type ProfileInput } from '@/lib/validations/schemas'
import type { UserProfile } from '@/types/shop.types'

export function AccountProfileForm({ profile }: { profile: UserProfile }): React.ReactElement {
  const { toast } = useToast()
  const [email] = useState(profile.email)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: profile.full_name ?? '', phone: profile.phone ?? '' },
  })

  async function onSubmit(values: ProfileInput): Promise<void> {
    if (!isSupabaseConfigured()) {
      toast({ title: 'Profile updates require Supabase to be configured.', variant: 'error' })
      return
    }
    const supabase = createClient()
    const { error } = await supabase
      .from('users')
      .update({ full_name: values.fullName, phone: values.phone || null })
      .eq('id', profile.id)
    if (error) {
      toast({ title: 'We could not save your changes. Please try again.', variant: 'error' })
      return
    }
    toast({ title: 'Profile updated', variant: 'success' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4" noValidate>
      <FormField htmlFor="email" label="Email">
        <Input id="email" value={email} disabled readOnly />
      </FormField>
      <FormField htmlFor="fullName" label="Full name" error={errors.fullName?.message} required>
        <Input id="fullName" aria-invalid={Boolean(errors.fullName)} {...register('fullName')} />
      </FormField>
      <FormField htmlFor="phone" label="Phone" error={errors.phone?.message}>
        <Input id="phone" {...register('phone')} />
      </FormField>
      <SubmitButton isLoading={isSubmitting}>Save changes</SubmitButton>
    </form>
  )
}
