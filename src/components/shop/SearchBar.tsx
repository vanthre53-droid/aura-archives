'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useDebounce } from '@/hooks/useDebounce'

/** Controlled search input that reflects the query in the URL (?q=). */
export function SearchBar(): React.ReactElement {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const debounced = useDebounce(value, 300)

  useEffect(() => {
    const current = searchParams.get('q') ?? ''
    if (debounced === current) return
    const params = new URLSearchParams()
    if (debounced.trim()) params.set('q', debounced.trim())
    router.replace(params.toString() ? `/search?${params.toString()}` : '/search')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search the archive"
        aria-label="Search the archive"
        autoFocus
        className="h-14 pl-11 text-base"
      />
    </div>
  )
}
