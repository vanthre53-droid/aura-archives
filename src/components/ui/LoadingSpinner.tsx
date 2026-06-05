import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  label?: string
}

export function LoadingSpinner({
  className,
  label = 'Loading',
}: LoadingSpinnerProps): React.ReactElement {
  return (
    <span role="status" className={cn('inline-flex items-center justify-center', className)}>
      <Loader2 className="h-5 w-5 animate-spin text-text-muted" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  )
}
