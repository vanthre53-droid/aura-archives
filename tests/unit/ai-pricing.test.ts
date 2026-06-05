import { describe, expect, it } from 'vitest'
import { AI_MODEL, estimateCostUsd } from '@/lib/ai/models'

describe('estimateCostUsd', () => {
  it('prices a known model from input and output tokens', () => {
    // Haiku 4.5: $1 / 1M input, $5 / 1M output.
    const cost = estimateCostUsd(AI_MODEL, 1_000_000, 1_000_000)
    expect(cost).toBeCloseTo(6, 6)
  })

  it('rounds to six decimals to match the numeric(10,6) column', () => {
    const cost = estimateCostUsd(AI_MODEL, 1, 1)
    expect(cost).toBe(0.000006)
  })

  it('returns zero for an unknown model rather than NaN', () => {
    expect(estimateCostUsd('made-up-model', 1000, 1000)).toBe(0)
  })
})
