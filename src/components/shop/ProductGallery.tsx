'use client'

import { useState } from 'react'
import { ProductImage } from '@/components/shop/ProductImage'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[] | null
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps): React.ReactElement {
  const gallery = images && images.length > 0 ? images : [null]
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      <ProductImage
        src={gallery[active]}
        alt={name}
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {gallery.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={active === i}
              className={cn(
                'relative aspect-product w-20 shrink-0 overflow-hidden border',
                active === i ? 'border-primary' : 'border-transparent',
              )}
            >
              <ProductImage src={src} alt={`${name} ${i + 1}`} sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
