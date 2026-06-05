import { ProductGridSkeleton } from '@/components/shop/ProductGrid'
import { Skeleton } from '@/components/ui/Skeleton'

export default function CollectionLoading(): React.ReactElement {
  return (
    <div>
      <div className="flex flex-col items-center gap-3 border-b border-border px-4 py-16 text-center md:py-24">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="mx-auto max-w-container px-4 py-8 md:px-10">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  )
}
