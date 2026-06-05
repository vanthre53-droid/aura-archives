import * as React from 'react'
import { Heading, Hr, Row, Column, Section, Text } from '@react-email/components'
import { EmailLayout } from '@/lib/email/templates/email-layout'
import { formatPrice } from '@/lib/utils'
import type { CartItem } from '@/types/shop.types'

export interface OrderConfirmationEmailProps {
  customerName: string
  orderId: string
  items: CartItem[]
  subtotal: number
  currency?: string
}

const label: React.CSSProperties = { fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }
const itemName: React.CSSProperties = { fontSize: '14px', margin: 0 }
const itemMeta: React.CSSProperties = { fontSize: '12px', color: '#8a8178', margin: 0 }
const amount: React.CSSProperties = { fontSize: '14px', textAlign: 'right', margin: 0 }

/** Sent when an order is successfully placed. */
export function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  subtotal,
  currency = 'INR',
}: OrderConfirmationEmailProps): React.ReactElement {
  const shortId = orderId.slice(0, 8).toUpperCase()
  return (
    <EmailLayout preview={`Your Aura Archives order ${shortId} is confirmed`}>
      <Heading as="h1" style={{ fontSize: '20px', fontWeight: 400 }}>
        Thank you, {customerName}.
      </Heading>
      <Text style={label}>
        Your order <strong>#{shortId}</strong> is confirmed. We will email you again when it ships.
      </Text>

      <Hr style={{ borderColor: '#e7e2dc', margin: '24px 0' }} />

      <Section>
        {items.map((item, i) => (
          <Row key={i} style={{ marginBottom: '12px' }}>
            <Column>
              <Text style={itemName}>{item.name}</Text>
              <Text style={itemMeta}>
                Qty {item.qty}
                {item.size ? ` · Size ${item.size}` : ''}
              </Text>
            </Column>
            <Column style={{ verticalAlign: 'top', width: '110px' }}>
              <Text style={amount}>{formatPrice(item.price * item.qty, currency)}</Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Hr style={{ borderColor: '#e7e2dc', margin: '20px 0' }} />

      <Row>
        <Column>
          <Text style={{ ...itemName, fontWeight: 700 }}>Total</Text>
        </Column>
        <Column style={{ width: '110px' }}>
          <Text style={{ ...amount, fontWeight: 700 }}>{formatPrice(subtotal, currency)}</Text>
        </Column>
      </Row>
    </EmailLayout>
  )
}
