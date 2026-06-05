import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout } from '@/lib/email/templates/email-layout'
import { APP_NAME, APP_URL } from '@/lib/constants'

export interface WelcomeEmailProps {
  customerName: string
}

const text: React.CSSProperties = { fontSize: '14px', lineHeight: '1.7', margin: '0 0 16px' }

/** Sent once after a customer registers. */
export function WelcomeEmail({ customerName }: WelcomeEmailProps): React.ReactElement {
  return (
    <EmailLayout preview={`Welcome to ${APP_NAME}`}>
      <Heading as="h1" style={{ fontSize: '20px', fontWeight: 400 }}>
        Welcome, {customerName}.
      </Heading>
      <Text style={text}>
        We are delighted to have you. {APP_NAME} brings together fine jewelry and curated clothing —
        each piece chosen to last.
      </Text>
      <Text style={text}>Begin with the collections that caught our eye this season.</Text>
      <Button
        href={`${APP_URL}/collections`}
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
        Explore the archive
      </Button>
    </EmailLayout>
  )
}
