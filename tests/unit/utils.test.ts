import { describe, expect, it } from 'vitest'
import { formatPrice, generateSlug } from '@/lib/utils'

describe('generateSlug', () => {
  it('kebab-cases a product name', () => {
    expect(generateSlug('Sculptural Gold Ring')).toBe('sculptural-gold-ring')
  })

  it('strips punctuation and collapses separators', () => {
    expect(generateSlug('  18k  Gold — Ring!! ')).toBe('18k-gold-ring')
  })
})

describe('formatPrice', () => {
  it('formats INR without decimals using Indian digit grouping', () => {
    const result = formatPrice(145000, 'INR')
    expect(result).toContain('1,45,000')
    expect(result).not.toContain('.')
    expect(result).toMatch(/₹|INR/)
  })
})
