import { Skeleton } from '@/components/ui/Skeleton'

export default function SettingsLoading(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <Skeleton className="h-8 w-32" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full max-w-lg" />
        ))}
      </div>
    </div>
  )
}
