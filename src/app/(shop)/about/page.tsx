import type { Metadata } from 'next'
import Link from 'next/link'
import { CollectionHero } from '@/components/shop/CollectionHero'
import { Button } from '@/components/ui/Button'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About',
  description: `The story and philosophy behind ${APP_NAME} — timeless jewelry and clothing made to last.`,
}

const SECTIONS = [
  {
    heading: 'An archive, not a catalogue',
    body: 'We build slowly. Each release is a small, considered edition rather than a season chased to keep pace. Pieces are meant to be kept, repaired, and handed on — objects that gather meaning rather than dust.',
  },
  {
    heading: 'Material first',
    body: 'Recycled gold, carved natural stone, double-faced wool, and fabrics chosen to age gracefully. We favour materials that earn their keep over time and refuse the ones that do not.',
  },
  {
    heading: 'Made by hand',
    body: 'Our jewelry and garments are produced in small runs by family ateliers who sign their work. We document the process so every piece carries its own quiet provenance.',
  },
]

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <CollectionHero
        eyebrow="The House"
        title="Objects meant to outlast the season"
        description="Aura Archives is a study in restraint — jewelry and clothing made to be kept."
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-16 px-4 py-16 md:px-10">
        {SECTIONS.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="font-serif text-3xl">{section.heading}</h2>
            <p className="text-sm leading-relaxed text-text-muted">{section.body}</p>
          </section>
        ))}
        <div className="flex flex-col items-center gap-3 border-t border-border pt-12 text-center">
          <p className="font-serif text-2xl">See the work.</p>
          <Button asChild>
            <Link href="/collections">Explore collections</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
