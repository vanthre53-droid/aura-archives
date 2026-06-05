import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductLoading(): React.ReactElement {
  return (
    <div className="mx-auto grid max-w-container gap-10 px-4 py-10 md:grid-cols-2 md:px-10">
      <Skeleton className="aspect-product w-full" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  )
}
