'use client'

import { useEffect, useRef } from 'react'

/** Calls `onLoadMore` when the returned sentinel ref scrolls into view. */
export function useInfiniteScroll(
  onLoadMore: () => void,
  enabled = true,
): React.RefObject<HTMLDivElement> {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [onLoadMore, enabled])

  return sentinelRef
}
