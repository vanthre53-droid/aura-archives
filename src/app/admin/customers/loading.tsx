import { Skeleton } from '@/components/ui/Skeleton'

export default function CustomersLoading(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
