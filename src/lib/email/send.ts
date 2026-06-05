import 'server-only'
import * as Sentry from '@sentry/nextjs'
import { getResend, EMAIL_FROM } from '@/lib/email/client'
import {
  OrderConfirmationEmail,
  type OrderConfirmationEmailProps,
} from '@/lib/email/templates/order-confirmation-email'
import { WelcomeEmail } from '@/lib/email/templates/welcome-email'
import {
  ShippingUpdateEmail,
  type ShippingUpdateEmailProps,
} from '@/lib/email/templates/shipping-update-email'
import { APP_NAME } from '@/lib/constants'

interface SendResult {
  sent: boolean
  skipped?: boolean
}

/** Best-effort send. Never throws — logs to Sentry and reports `sent: false`. */
async function deliver(
  to: string,
  subject: string,
  react: React.ReactElement,
): Promise<SendResult> {
  const resend = getResend()
  if (!resend) return { sent: false, skipped: true }
  try {
    const { error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, react })
    if (error) throw error
    return { sent: true }
  } catch (error) {
    Sentry.captureException(error)
    return { sent: false }
  }
}

export function sendOrderConfirmation(
  to: string,
  props: OrderConfirmationEmailProps,
): Promise<SendResult> {
  return deliver(
    to,
    `Your ${APP_NAME} order is confirmed`,
    OrderConfirmationEmail(props),
  )
}

export function sendWelcome(to: string, customerName: string): Promise<SendResult> {
  return deliver(to, `Welcome to ${APP_NAME}`, WelcomeEmail({ customerName }))
}

export function sendShippingUpdate(
  to: string,
  props: ShippingUpdateEmailProps,
): Promise<SendResult> {
  return deliver(to, `Your ${APP_NAME} order update`, ShippingUpdateEmail(props))
}
