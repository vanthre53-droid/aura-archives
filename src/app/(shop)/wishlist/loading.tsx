import { Skeleton } from '@/components/ui/Skeleton'

export default function WishlistLoading(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-10 md:px-10">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-product w-full" />
        ))}
      </div>
    </div>
  )
}
