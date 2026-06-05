import { Skeleton } from '@/components/ui/Skeleton'

export default function CartLoading(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-10 md:grid md:grid-cols-3 md:gap-10 md:px-10">
      <div className="flex flex-col gap-4 md:col-span-2">
        <Skeleton className="h-8 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
