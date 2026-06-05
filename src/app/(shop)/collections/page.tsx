import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategories } from '@/services/product.service'
import { CollectionHero } from '@/components/shop/CollectionHero'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse the Aura Archives collections of fine jewelry and editorial clothing.',
}

export default async function CollectionsPage(): Promise<React.ReactElement> {
  const categories = await getCategories()
  return (
    <>
      <CollectionHero eyebrow="Explore" title="Collections" description="Two archives, one sensibility." />
      <div className="mx-auto grid max-w-container gap-4 px-4 py-12 md:grid-cols-2 md:px-10">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group flex aspect-[4/3] flex-col items-center justify-center gap-2 border border-border bg-surface-low text-center transition-colors hover:bg-surface-dim"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-text-muted">The Archive</p>
            <h2 className="font-serif text-3xl">{category.name}</h2>
            {category.description ? (
              <p className="max-w-xs text-sm text-text-muted">{category.description}</p>
            ) : null}
            <span className="mt-2 text-xs uppercase tracking-widest underline">Explore</span>
          </Link>
        ))}
      </div>
    </>
  )
}
