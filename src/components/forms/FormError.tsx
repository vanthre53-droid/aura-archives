import { cn } from '@/lib/utils'

interface FormErrorProps {
  message?: string
  id?: string
  className?: string
}

export function FormError({ message, id, className }: FormErrorProps): React.ReactElement | null {
  if (!message) return null
  return (
    <p id={id} role="alert" className={cn('text-xs text-error', className)}>
      {message}
    </p>
  )
}
