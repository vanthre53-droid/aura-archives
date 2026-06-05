import { Skeleton } from '@/components/ui/Skeleton'

export default function CareGuideLoading(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-16 md:px-10">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}
