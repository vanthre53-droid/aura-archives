import { describe, expect, it } from 'vitest'
import { chatRequestSchema } from '@/lib/validations/schemas'

describe('chatRequestSchema', () => {
  it('accepts a valid transcript', () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: 'user', content: 'Do you have gold hoops?' }],
      sessionId: 'abc-123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty transcript', () => {
    const result = chatRequestSchema.safeParse({ messages: [] })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown role', () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: 'system', content: 'hi' }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects an over-long message to bound prompt size', () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: 'user', content: 'x'.repeat(2001) }],
    })
    expect(result.success).toBe(false)
  })

  it('trims whitespace from message content', () => {
    const result = chatRequestSchema.parse({
      messages: [{ role: 'user', content: '  hello  ' }],
    })
    expect(result.messages[0]!.content).toBe('hello')
  })
})
