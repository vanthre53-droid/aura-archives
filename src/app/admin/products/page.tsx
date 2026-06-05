import Link from 'next/link'
import { Plus, Package } from 'lucide-react'
import { getAllProductsAdmin } from '@/services/product.service'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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

export default async function AdminProductsPage(): Promise<React.ReactElement> {
  const products = await getAllProductsAdmin()

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl">Products</h1>
          <p className="text-sm text-text-muted">{products.length} total</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" aria-hidden />
            New product
          </Link>
        </Button>
      </header>

      <Card>
        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Create your first product to populate the storefront."
            action={
              <Button asChild size="sm">
                <Link href="/admin/products/new">New product</Link>
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <span className="font-medium">{product.name}</span>
                    {product.is_featured ? (
                      <Badge variant="gold" className="ml-2">
                        Featured
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'success' : 'outline'}>
                      {product.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(Number(product.price))}</TableCell>
                  <TableCell className="text-right">{product.stock_quantity}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs uppercase tracking-widest text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
