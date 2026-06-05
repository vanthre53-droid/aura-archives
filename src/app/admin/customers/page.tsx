import { Users } from 'lucide-react'
import { getAllCustomers } from '@/services/user.service'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'

export default async function AdminCustomersPage(): Promise<React.ReactElement> {
  const customers = await getAllCustomers()

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl">Customers</h1>
        <p className="text-sm text-text-muted">{customers.length} total</p>
      </header>

      <Card>
        {customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers yet"
            description="Registered customers will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.full_name ?? '—'}</TableCell>
                  <TableCell className="text-text-muted">{customer.email}</TableCell>
                  <TableCell>
                    <Badge variant={customer.role === 'admin' ? 'primary' : 'outline'}>
                      {customer.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.is_banned ? (
                      <Badge variant="error">Banned</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-text-muted">
                    {new Date(customer.created_at).toLocaleDateString()}
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
