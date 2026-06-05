import Link from 'next/link'
import { Package, ShoppingBag, Users, IndianRupee } from 'lucide-react'
import { getDashboardStats } from '@/services/admin.service'
import { getAllOrders } from '@/services/order.service'
import { StatCard } from '@/components/admin/StatCard'
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge'
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
import type { OrderStatus } from '@/types/shop.types'

export default async function AdminDashboardPage(): Promise<React.ReactElement> {
  const [stats, orders] = await Promise.all([getDashboardStats(), getAllOrders()])
  const recentOrders = orders.slice(0, 8)

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl">Dashboard</h1>
        <p className="text-sm text-text-muted">An overview of the archive.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Products"
          value={String(stats.productCount)}
          icon={Package}
          hint={`${stats.activeProductCount} active`}
        />
        <StatCard label="Orders" value={String(stats.orderCount)} icon={ShoppingBag} />
        <StatCard label="Customers" value={String(stats.customerCount)} icon={Users} />
        <StatCard label="Revenue" value={formatPrice(stats.revenue)} icon={IndianRupee} />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Recent orders</h2>
          <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-text-muted hover:text-text">
            View all
          </Link>
        </div>
        <Card>
          {recentOrders.length === 0 ? (
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell className="text-text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status as OrderStatus} />
                    </TableCell>
                    <TableCell className="text-right">{formatPrice(Number(order.subtotal))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </section>
    </div>
  )
}
