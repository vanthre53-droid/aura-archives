import type { Metadata } from 'next'
import Link from 'next/link'
import { CollectionHero } from '@/components/shop/CollectionHero'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Exhibitions',
  description: 'The stories, materials, and craftsmanship behind the Aura Archives collections.',
}

const EXHIBITS = [
  {
    title: 'On Form & Material',
    body: 'A study of how recycled gold and carved stone find their final shape — wax originals, hand-finishing, and the marks of the maker left intact.',
  },
  {
    title: 'The Archival Wardrobe',
    body: 'Garments drawn from decades of reference: elongated silhouettes, double-faced wool, and fabrics chosen to age well rather than quickly.',
  },
  {
    title: 'Slow Craft',
    body: 'Each piece is produced in small runs by family ateliers. We document the process so the object carries its own provenance.',
  },
]

export default function ExhibitionsPage(): React.ReactElement {
  return (
    <>
      <CollectionHero
        eyebrow="Exhibition"
        title="The Archive, in Context"
        description="Editorial chapters on the philosophy and craft behind our collections."
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-16 px-4 py-16 md:px-10">
        {EXHIBITS.map((exhibit, i) => (
          <section key={exhibit.title} className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-text-muted">
              Chapter {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="font-serif text-3xl">{exhibit.title}</h2>
            <p className="text-sm leading-relaxed text-text-muted">{exhibit.body}</p>
          </section>
        ))}
        <div className="flex flex-col items-center gap-3 border-t border-border pt-12 text-center">
          <p className="font-serif text-2xl">Begin with the pieces.</p>
          <Button asChild>
            <Link href="/collections">Explore collections</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
