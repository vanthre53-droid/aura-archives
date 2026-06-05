import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { sendWelcome, sendOrderConfirmation } from '@/lib/email/send'

/**
 * The email layer must degrade gracefully: when RESEND_API_KEY is absent (as in
 * test/local), senders no-op and report `skipped` rather than throwing.
 */
describe('email senders without configuration', () => {
  const original = process.env.RESEND_API_KEY

  beforeEach(() => {
    delete process.env.RESEND_API_KEY
  })
  afterEach(() => {
    if (original !== undefined) process.env.RESEND_API_KEY = original
  })

  it('skips the welcome email when unconfigured', async () => {
    const result = await sendWelcome('shopper@example.com', 'Shopper')
    expect(result).toEqual({ sent: false, skipped: true })
  })

  it('skips the order confirmation when unconfigured', async () => {
    const result = await sendOrderConfirmation('shopper@example.com', {
      customerName: 'Shopper',
      orderId: 'abcdef12-3456',
      items: [{ product_id: 'p1', name: 'Gold Ring', price: 1000, qty: 1, size: null, image: null }],
      subtotal: 1000,
      currency: 'INR',
    })
    expect(result.sent).toBe(false)
    expect(result.skipped).toBe(true)
  })
})
