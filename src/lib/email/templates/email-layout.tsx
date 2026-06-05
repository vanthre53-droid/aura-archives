import * as React from 'react'
import { Body, Container, Head, Hr, Html, Preview, Section, Text } from '@react-email/components'
import { APP_NAME, SUPPORT_EMAIL } from '@/lib/constants'

const main: React.CSSProperties = {
  backgroundColor: '#f6f4f1',
  fontFamily: 'Georgia, "Times New Roman", serif',
  color: '#2b2724',
  margin: 0,
  padding: '32px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e7e2dc',
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px',
}

const brand: React.CSSProperties = {
  fontSize: '22px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  textAlign: 'center',
  margin: '0 0 24px',
}

const footer: React.CSSProperties = {
  fontSize: '12px',
  color: '#8a8178',
  textAlign: 'center',
  lineHeight: '1.6',
}

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

/** Shared shell for every transactional email. */
export function EmailLayout({ preview, children }: EmailLayoutProps): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>{APP_NAME}</Text>
          {children}
          <Hr style={{ borderColor: '#e7e2dc', margin: '32px 0 20px' }} />
          <Section>
            <Text style={footer}>
              Questions? Reach our team at {SUPPORT_EMAIL}.
              <br />
              {APP_NAME} — timeless jewelry &amp; clothing.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
