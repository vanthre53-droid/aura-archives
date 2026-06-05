import { Skeleton } from '@/components/ui/Skeleton'

export default function OrdersLoading(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-10 md:px-10">
      <Skeleton className="h-8 w-36" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  )
}
