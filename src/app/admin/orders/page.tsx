import { ShoppingBag } from 'lucide-react'
import { getAllOrders } from '@/services/order.service'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { formatPrice } from '@/lib/utils'
import type { CartItem, OrderStatus } from '@/types/shop.types'

export default async function AdminOrdersPage(): Promise<React.ReactElement> {
  const orders = await getAllOrders()

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl">Orders</h1>
        <p className="text-sm text-text-muted">{orders.length} total</p>
      </header>

      <Card>
        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            description="Orders placed in the storefront will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                // order.items is JSON we control on write; shape is CartItem[]
                const items = (order.items as unknown as CartItem[]) ?? []
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{order.customer_name}</span>
                        <span className="text-xs text-text-muted">{order.customer_email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{items.length}</TableCell>
                    <TableCell className="text-right">{formatPrice(Number(order.subtotal))}</TableCell>
                    <TableCell>
                      <OrderStatusSelect orderId={order.id} status={order.status as OrderStatus} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
