import { Skeleton } from '@/components/ui/Skeleton'

export default function EditProductLoading(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <Skeleton className="h-8 w-44" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full max-w-lg" />
        ))}
      </div>
    </div>
  )
}
