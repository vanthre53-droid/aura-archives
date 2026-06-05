'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatusAction } from '@/app/admin/orders/actions'
import { useToast } from '@/hooks/useToast'
import { ORDER_STATUSES } from '@/lib/constants'
import type { OrderStatus } from '@/types/shop.types'

interface OrderStatusSelectProps {
  orderId: string
  status: OrderStatus
}

export function OrderStatusSelect({ orderId, status }: OrderStatusSelectProps): React.ReactElement {
  const [value, setValue] = useState<OrderStatus>(status)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const next = event.target.value as OrderStatus
    const previous = value
    setValue(next)
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next)
      if (!result.success) {
        setValue(previous)
        toast({ title: result.error ?? 'Could not update the order.', variant: 'error' })
        return
      }
      toast({ title: 'Order updated', variant: 'success' })
    })
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Order status"
      className="h-9 border border-border bg-surface px-2 text-xs uppercase tracking-widest text-text focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50"
    >
      {ORDER_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
