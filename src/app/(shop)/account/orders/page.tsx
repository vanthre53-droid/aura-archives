import type { Metadata } from 'next'
import Link from 'next/link'
import { getMyOrders } from '@/services/order.service'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { CartItem } from '@/types/shop.types'

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
}

export default async function OrdersPage(): Promise<React.ReactElement> {
  const orders = await getMyOrders()

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-10">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/account" className="text-xs uppercase tracking-widest text-text-muted hover:text-text">
          Account
        </Link>
        <span className="text-text-muted">/</span>
        <h1 className="font-serif text-3xl">Orders</h1>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order, it will appear here."
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/collections">Shop now</Link>
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => {
            // order.items is stored as JSON we control on write; shape is CartItem[]
            const items = (order.items as unknown as CartItem[]) ?? []
            return (
              <li key={order.id} className="border border-border p-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-text-muted">
                      {new Date(order.created_at).toLocaleDateString()} · #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-sm">
                      {items.length} {items.length === 1 ? 'piece' : 'pieces'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline">{order.status}</Badge>
                    <span className="text-sm">{formatPrice(Number(order.subtotal))}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
