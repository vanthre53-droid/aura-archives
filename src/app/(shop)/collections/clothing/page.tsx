import type { Metadata } from 'next'
import { CollectionListing } from '@/components/shop/CollectionListing'
import { JsonLd } from '@/components/seo/JsonLd'
import { collectionPageSchema } from '@/components/seo/schemas'

export const metadata: Metadata = {
  title: 'Apparel',
  description: 'Editorial clothing with archival influences from the Aura Archives.',
}

const FILTER_TAGS = ['new-arrival', 'outerwear', 'trousers', 'shirts', 'knitwear']

export default async function ClothingPage({
  searchParams,
}: {
  searchParams: { tag?: string; page?: string }
}): Promise<React.ReactElement> {
  const page = Number(searchParams.page) || 1
  return (
    <>
      <JsonLd data={collectionPageSchema('Apparel', '/collections/clothing')} />
      <CollectionListing
        categorySlug="clothing"
        eyebrow="The Archive"
        title="Apparel"
        description="Editorial clothing with archival influences and exceptional material quality."
        filterTags={FILTER_TAGS}
        page={page}
        tag={searchParams.tag}
        basePath="/collections/clothing"
      />
    </>
  )
}
