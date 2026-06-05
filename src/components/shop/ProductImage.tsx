import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  src: string | null | undefined
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}

/**
 * Renders a product image inside a fixed 3:4 container to guarantee zero layout
 * shift. Falls back to a tinted monogram block when no image is available.
 */
export function ProductImage({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 768px) 50vw, 25vw',
  className,
}: ProductImageProps): React.ReactElement {
  return (
    <div className={cn('product-image-wrapper relative aspect-product overflow-hidden bg-surface-dim', className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface-low">
          <span className="font-serif text-2xl uppercase tracking-[0.3em] text-text-muted/40">
            Aura
          </span>
        </div>
      )}
    </div>
  )
}
