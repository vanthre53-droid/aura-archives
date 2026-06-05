'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  className?: string
  /** Larger variant for the product detail page. */
  size?: 'sm' | 'lg'
}

export function WishlistButton({
  productId,
  className,
  size = 'sm',
}: WishlistButtonProps): React.ReactElement {
  const { isWishlisted, toggle } = useWishlist()
  const [pending, startTransition] = useTransition()
  const [animating, setAnimating] = useState(false)
  const active = isWishlisted(productId)

  function handleClick(): void {
    setAnimating(true)
    startTransition(async () => {
      await toggle(productId)
    })
    window.setTimeout(() => setAnimating(false), 250)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'inline-flex items-center justify-center transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        size === 'lg' ? 'h-11 w-11 border border-border bg-surface' : 'h-9 w-9',
        animating && 'scale-110',
        className,
      )}
    >
      <Heart
        className={cn(size === 'lg' ? 'h-5 w-5' : 'h-4 w-4', active ? 'fill-error text-error' : 'text-text')}
        aria-hidden
      />
    </button>
  )
}
