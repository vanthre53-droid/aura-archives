// Template: branded component. Copy into src/components/... and rename.
import { cn } from '@/lib/utils'

interface ExampleProps {
  title: string
  className?: string
}

export function Example({ title, className }: ExampleProps): React.ReactElement {
  return (
    <section className={cn('flex flex-col gap-2', className)}>
      <h2 className="font-serif text-2xl">{title}</h2>
    </section>
  )
}
