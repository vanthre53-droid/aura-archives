'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  tags: string[]
}

/** Horizontal scrollable tag filter that reflects state in the URL (?tag=). */
export function FilterBar({ tags }: FilterBarProps): React.ReactElement {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag')

  function select(tag: string | null): void {
    const params = new URLSearchParams(searchParams.toString())
    if (tag) params.set('tag', tag)
    else params.delete('tag')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto py-4">
      <FilterChip label="All" active={!activeTag} onClick={() => select(null)} />
      {tags.map((tag) => (
        <FilterChip
          key={tag}
          label={tag.replace(/-/g, ' ')}
          active={activeTag === tag}
          onClick={() => select(tag)}
        />
      ))}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'whitespace-nowrap border px-4 py-2 text-[11px] uppercase tracking-widest transition-colors',
        active ? 'border-primary bg-primary text-white' : 'border-border text-text-muted hover:border-primary',
      )}
    >
      {label}
    </button>
  )
}
