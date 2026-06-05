import { inngest, orderCreated, orderStatusUpdated, userRegistered } from '@/lib/inngest/client'
import { sendOrderConfirmation, sendShippingUpdate, sendWelcome } from '@/lib/email/send'

/** order/created → email the customer their confirmation. */
const orderConfirmation = inngest.createFunction(
  { id: 'order-confirmation-email', retries: 3, triggers: [orderCreated] },
  async ({ event, step }) => {
    return step.run('send-order-confirmation', () =>
      sendOrderConfirmation(event.data.customerEmail, {
        customerName: event.data.customerName,
        orderId: event.data.orderId,
        items: event.data.items,
        subtotal: event.data.subtotal,
        currency: event.data.currency,
      }),
    )
  },
)

/** order/status.updated → email the customer the new status. */
const shippingUpdate = inngest.createFunction(
  { id: 'order-status-email', retries: 3, triggers: [orderStatusUpdated] },
  async ({ event, step }) => {
    return step.run('send-shipping-update', () =>
      sendShippingUpdate(event.data.customerEmail, {
        customerName: event.data.customerName,
        orderId: event.data.orderId,
        status: event.data.status,
      }),
    )
  },
)

/** user/registered → send a one-time welcome email. */
const welcome = inngest.createFunction(
  { id: 'welcome-email', retries: 2, triggers: [userRegistered] },
  async ({ event, step }) => {
    return step.run('send-welcome', () => sendWelcome(event.data.email, event.data.name))
  },
)

/** All functions served by the Inngest webhook. */
export const functions = [orderConfirmation, shippingUpdate, welcome]
