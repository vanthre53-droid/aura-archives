'use client'

import { cn } from '@/lib/utils'

interface SizeSelectorProps {
  sizes: string[]
  value: string | null
  onChange: (size: string) => void
  error?: boolean
}

export function SizeSelector({ sizes, value, onChange, error }: SizeSelectorProps): React.ReactElement {
  return (
    <div role="radiogroup" aria-label="Select size" className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const selected = value === size
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(size)}
            className={cn(
              'min-w-12 border px-3 py-2 text-xs uppercase tracking-widest transition-colors',
              selected ? 'border-primary bg-primary text-white' : 'border-border text-text hover:border-primary',
              error && !value && 'border-error',
            )}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}
