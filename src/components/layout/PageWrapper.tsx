import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  /** Render as the page's <main> with the skip-link anchor. */
  as?: 'main' | 'div'
  /** Constrain to the editorial container width. */
  contained?: boolean
}

export function PageWrapper({
  children,
  className,
  as = 'main',
  contained = true,
}: PageWrapperProps): React.ReactElement {
  const Component = as
  return (
    <Component
      id={as === 'main' ? 'main-content' : undefined}
      className={cn(
        'w-full px-4 md:px-10',
        contained && 'mx-auto max-w-container',
        className,
      )}
    >
      {children}
    </Component>
  )
}
