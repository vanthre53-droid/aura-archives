import { Skeleton } from '@/components/ui/Skeleton'

export default function AuthLoading(): React.ReactElement {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  )
}
