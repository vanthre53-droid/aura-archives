import { cn } from '@/lib/utils'

/**
 * A shimmer placeholder. To prevent CLS, size it to match the final content
 * exactly (use the same width/height/aspect-ratio as what it replaces).
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('skeleton rounded-sm', className)} {...props} />
}
