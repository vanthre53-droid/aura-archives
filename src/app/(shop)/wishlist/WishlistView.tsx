'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ProductGrid, ProductGridSkeleton } from '@/components/shop/ProductGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useWishlistStore } from '@/store/wishlist.store'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/config'
import { SAMPLE_PRODUCTS } from '@/lib/sample-data'
import type { Product } from '@/types/shop.types'

export function WishlistView(): React.ReactElement {
  const ids = useWishlistStore((s) => s.ids)
  const hasHydrated = useWishlistStore((s) => s.hasHydrated)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function resolve(): Promise<void> {
      if (ids.length === 0) {
        if (active) {
          setProducts([])
          setLoading(false)
        }
        return
      }
      if (!isSupabaseConfigured()) {
        const matched = SAMPLE_PRODUCTS.filter((p) => ids.includes(p.id))
        if (active) {
          setProducts(matched)
          setLoading(false)
        }
        return
      }
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').in('id', ids)
      if (active) {
        setProducts(data ?? [])
        setLoading(false)
      }
    }
    if (hasHydrated) void resolve()
    return () => {
      active = false
    }
  }, [ids, hasHydrated])

  if (!hasHydrated || loading) return <ProductGridSkeleton count={4} />

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save pieces you love and find them here."
        action={
          <Button asChild variant="secondary" size="sm">
            <Link href="/collections">Browse collections</Link>
          </Button>
        }
      />
    )
  }

  return <ProductGrid products={products} />
}
