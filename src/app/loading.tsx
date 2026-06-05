import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-16 md:px-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Skeleton className="aspect-product w-full" />
        <Skeleton className="aspect-product w-full" />
        <Skeleton className="aspect-product w-full" />
        <Skeleton className="aspect-product w-full" />
      </div>
    </div>
  )
}
