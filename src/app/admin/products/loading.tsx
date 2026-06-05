import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductsLoading(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
