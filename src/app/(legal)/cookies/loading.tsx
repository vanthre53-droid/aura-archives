import { Skeleton } from '@/components/ui/Skeleton'

export default function LegalLoading(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-16 md:px-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}
