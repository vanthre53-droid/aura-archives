import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout } from '@/lib/email/templates/email-layout'
import { APP_URL } from '@/lib/constants'
import type { OrderStatus } from '@/types/shop.types'

export interface ShippingUpdateEmailProps {
  customerName: string
  orderId: string
  status: OrderStatus
}

const text: React.CSSProperties = { fontSize: '14px', lineHeight: '1.7', margin: '0 0 16px' }

const STATUS_COPY: Record<OrderStatus, string> = {
  pending: 'is being prepared',
  confirmed: 'has been confirmed',
  shipped: 'is on its way to you',
  delivered: 'has been delivered',
  cancelled: 'has been cancelled',
}

/** Sent when an order's status changes. */
export function ShippingUpdateEmail({
  customerName,
  orderId,
  status,
}: ShippingUpdateEmailProps): React.ReactElement {
  const shortId = orderId.slice(0, 8).toUpperCase()
  return (
    <EmailLayout preview={`Order ${shortId} update`}>
      <Heading as="h1" style={{ fontSize: '20px', fontWeight: 400 }}>
        Hello {customerName},
      </Heading>
      <Text style={text}>
        Your order <strong>#{shortId}</strong> {STATUS_COPY[status]}.
      </Text>
      <Button
        href={`${APP_URL}/account/orders`}
        style={{
          backgroundColor: '#2b2724',
          color: '#ffffff',
          fontSize: '12px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          padding: '12px 24px',
          textDecoration: 'none',
        }}
      >
        View your orders
      </Button>
    </EmailLayout>
  )
}
