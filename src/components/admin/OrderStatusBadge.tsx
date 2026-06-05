import { Badge, type BadgeProps } from '@/components/ui/Badge'
import type { OrderStatus } from '@/types/shop.types'

const VARIANT: Record<OrderStatus, BadgeProps['variant']> = {
  pending: 'outline',
  confirmed: 'default',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }): React.ReactElement {
  return <Badge variant={VARIANT[status]}>{status}</Badge>
}
