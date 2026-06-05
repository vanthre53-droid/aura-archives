'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingBag } from 'lucide-react'
import { CartItem } from '@/components/shop/CartItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { FormError } from '@/components/forms/FormError'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { useCart } from '@/hooks/useCart'
import { useUser } from '@/hooks/useUser'
import { useToast } from '@/hooks/useToast'
import { createOrderSchema } from '@/lib/validations/schemas'
import { formatPrice } from '@/lib/utils'
import { z } from 'zod'

const checkoutSchema = createOrderSchema.omit({ items: true })
// Input has optional fields with schema defaults (e.g. country); output is fully resolved.
type CheckoutFormInput = z.input<typeof checkoutSchema>
type CheckoutInput = z.output<typeof checkoutSchema>

export function CartView(): React.ReactElement {
  const router = useRouter()
  const { items, subtotal, clear, hasHydrated } = useCart()
  const { user } = useUser()
  const { toast } = useToast()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormInput, unknown, CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customer_email: user?.email ?? '', shipping_address: { country: 'India' } },
  })

  if (!hasHydrated) return <div className="skeleton h-64 w-full" />

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your archive is empty"
        description="Add a piece to begin."
        action={
          <Button asChild variant="secondary" size="sm">
            <Link href="/collections">Browse collections</Link>
          </Button>
        }
      />
    )
  }

  async function onSubmit(values: CheckoutInput): Promise<void> {
    setFormError(null)
    if (!user) {
      toast({ title: 'Please sign in to place your order.' })
      router.push('/login?redirectTo=/cart')
      return
    }
    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, items }),
      })
      const json = (await response.json()) as { success: boolean; error?: string }
      if (!response.ok || !json.success) {
        setFormError(json.error ?? 'We could not place your order. Please try again.')
        return
      }
      clear()
      toast({ title: 'Order placed', description: 'A confirmation is on its way.', variant: 'success' })
      router.push('/account/orders')
    } catch {
      setFormError('We could not place your order. Please try again.')
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="divide-y divide-border">
        {items.map((item) => (
          <CartItem key={`${item.product_id}-${item.size}`} item={item} />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex h-fit flex-col gap-4 border border-border p-6" noValidate>
        <h2 className="font-serif text-xl">Order summary</h2>
        <div className="flex items-center justify-between border-b border-border pb-4 text-sm">
          <span className="uppercase tracking-widest text-text-muted">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <FormField htmlFor="customer_name" label="Full name" error={errors.customer_name?.message} required>
          <Input id="customer_name" aria-invalid={Boolean(errors.customer_name)} {...register('customer_name')} />
        </FormField>
        <FormField htmlFor="customer_email" label="Email" error={errors.customer_email?.message} required>
          <Input id="customer_email" type="email" aria-invalid={Boolean(errors.customer_email)} {...register('customer_email')} />
        </FormField>
        <FormField htmlFor="customer_phone" label="Phone" error={errors.customer_phone?.message}>
          <Input id="customer_phone" {...register('customer_phone')} />
        </FormField>
        <FormField htmlFor="line1" label="Address" error={errors.shipping_address?.line1?.message} required>
          <Input id="line1" aria-invalid={Boolean(errors.shipping_address?.line1)} {...register('shipping_address.line1')} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField htmlFor="city" label="City" error={errors.shipping_address?.city?.message} required>
            <Input id="city" {...register('shipping_address.city')} />
          </FormField>
          <FormField htmlFor="state" label="State" error={errors.shipping_address?.state?.message} required>
            <Input id="state" {...register('shipping_address.state')} />
          </FormField>
          <FormField htmlFor="pin" label="PIN / ZIP" error={errors.shipping_address?.pin?.message} required>
            <Input id="pin" {...register('shipping_address.pin')} />
          </FormField>
          <FormField htmlFor="country" label="Country" error={errors.shipping_address?.country?.message} required>
            <Input id="country" {...register('shipping_address.country')} />
          </FormField>
        </div>

        <FormError message={formError ?? undefined} />
        <SubmitButton isLoading={isSubmitting} className="w-full">
          Place order
        </SubmitButton>
        <p className="text-center text-[11px] text-text-muted">
          This is a prototype — no payment is taken.
        </p>
      </form>
    </div>
  )
}
