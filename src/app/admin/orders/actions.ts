'use server'

import { revalidatePath } from 'next/cache'
import { getAdminUser } from '@/lib/auth'
import { updateOrderStatus } from '@/services/order.service'
import { orderStatusSchema } from '@/lib/validations/schemas'
import { recordAudit } from '@/lib/audit'
import { emitEvent } from '@/lib/inngest/emit'

interface ActionResult {
  success: boolean
  error?: string
}

/** Admin-only: change an order's status. Validates the status and audits the change. */
export async function updateOrderStatusAction(orderId: string, status: string): Promise<ActionResult> {
  const admin = await getAdminUser()
  if (!admin) return { success: false, error: 'You do not have access to this action.' }

  const parsed = orderStatusSchema.safeParse(status)
  if (!parsed.success) return { success: false, error: 'Invalid status.' }

  const updated = await updateOrderStatus(orderId, parsed.data)
  if (!updated) return { success: false, error: 'Could not update the order.' }

  await recordAudit({
    userId: admin.id,
    action: 'order.status_update',
    resource: 'order',
    resourceId: orderId,
    metadata: { status: parsed.data },
  })

  await emitEvent({
    name: 'order/status.updated',
    data: {
      orderId: updated.id,
      customerEmail: updated.customer_email,
      customerName: updated.customer_name,
      status: parsed.data,
    },
  })

  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  return { success: true }
}
