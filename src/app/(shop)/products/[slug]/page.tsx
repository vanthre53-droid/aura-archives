import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/services/product.service'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductInfo } from '@/components/shop/ProductInfo'
import { CuratedPairings } from '@/components/shop/CuratedPairings'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import { JsonLd } from '@/components/seo/JsonLd'
import { productSchema } from '@/components/seo/schemas'
import { APP_URL } from '@/lib/constants'

interface Params {
  params: { slug: string }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found' }
  const description = product.description?.slice(0, 155) ?? 'Fine jewelry and archival clothing.'
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      url: `${APP_URL}/products/${product.slug}`,
      images: [{ url: product.images?.[0] ?? '/og/product-og.png', width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function ProductPage({ params }: Params): Promise<React.ReactElement> {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product, 4)

  return (
    <div className="mx-auto max-w-container px-4 py-10 md:px-10">
      <JsonLd data={productSchema(product)} />

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-8">
          <ProductInfo product={product} />

          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description ?? 'A considered piece from the Aura Archives.'}
              </AccordionContent>
            </AccordionItem>
            {product.details && product.details.length > 0 ? (
              <AccordionItem value="heritage">
                <AccordionTrigger>Heritage &amp; Materials</AccordionTrigger>
                <AccordionContent>
                  <ul className="flex list-disc flex-col gap-1 pl-4">
                    {product.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ) : null}
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping &amp; Care</AccordionTrigger>
              <AccordionContent>
                Each piece is dispatched with care packaging and authenticity documentation. See our{' '}
                <Link href="/shipping" className="underline">
                  shipping
                </Link>{' '}
                and{' '}
                <Link href="/care-guide" className="underline">
                  care guide
                </Link>
                .
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <CuratedPairings products={related} />
    </div>
  )
}
