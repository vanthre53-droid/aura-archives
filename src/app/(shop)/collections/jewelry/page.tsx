import type { Metadata } from 'next'
import { CollectionListing } from '@/components/shop/CollectionListing'
import { JsonLd } from '@/components/seo/JsonLd'
import { collectionPageSchema } from '@/components/seo/schemas'

export const metadata: Metadata = {
  title: 'Fine Jewelry',
  description: 'Handcrafted precious metal and gemstone pieces from the Aura Archives.',
}

const FILTER_TAGS = ['new-arrival', 'limited', 'rings', 'necklaces', 'earrings', 'bracelets']

export default async function JewelryPage({
  searchParams,
}: {
  searchParams: { tag?: string; page?: string }
}): Promise<React.ReactElement> {
  const page = Number(searchParams.page) || 1
  return (
    <>
      <JsonLd data={collectionPageSchema('Fine Jewelry', '/collections/jewelry')} />
      <CollectionListing
        categorySlug="jewelry"
        eyebrow="The Archive"
        title="Fine Jewelry"
        description="Handcrafted precious metal and gemstone pieces, often limited edition."
        filterTags={FILTER_TAGS}
        page={page}
        tag={searchParams.tag}
        basePath="/collections/jewelry"
      />
    </>
  )
}
