import { cn } from '@/lib/utils'

interface CollectionHeroProps {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function CollectionHero({
  eyebrow,
  title,
  description,
  className,
}: CollectionHeroProps): React.ReactElement {
  return (
    <section
      className={cn(
        'flex flex-col items-center gap-3 border-b border-border px-4 py-16 text-center md:py-24',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-[11px] uppercase tracking-[0.3em] text-text-muted">{eyebrow}</p>
      ) : null}
      <h1 className="max-w-2xl font-serif text-4xl md:text-5xl">{title}</h1>
      {description ? (
        <p className="max-w-md text-sm text-text-muted">{description}</p>
      ) : null}
    </section>
  )
}
