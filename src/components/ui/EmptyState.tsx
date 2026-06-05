import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 py-20 text-center',
        className,
      )}
    >
      <Icon className="h-10 w-10 text-text-muted/50" aria-hidden />
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-xl">{title}</h3>
        {description ? <p className="max-w-sm text-sm text-text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
