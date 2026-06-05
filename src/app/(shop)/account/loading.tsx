import { Skeleton } from '@/components/ui/Skeleton'

export default function AccountLoading(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-10 md:px-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-11 w-full max-w-md" />
      <Skeleton className="h-11 w-full max-w-md" />
      <Skeleton className="h-11 w-full max-w-md" />
    </div>
  )
}
