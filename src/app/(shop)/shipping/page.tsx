import type { Metadata } from 'next'
import { CollectionHero } from '@/components/shop/CollectionHero'
import { SUPPORT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Shipping',
  description: 'Delivery times, costs, and tracking for Aura Archives orders.',
}

const SECTIONS = [
  {
    heading: 'Dispatch',
    body: 'Orders are prepared and dispatched within two business days. Because pieces are individually inspected and wrapped, we do not offer same-day dispatch.',
  },
  {
    heading: 'Delivery times',
    body: 'Within India, expect delivery in 3–6 business days. International orders typically arrive within 7–14 business days, depending on destination and customs.',
  },
  {
    heading: 'Cost',
    body: 'Standard shipping within India is complimentary on all orders. International shipping is calculated at checkout. Any import duties or taxes are the responsibility of the recipient.',
  },
  {
    heading: 'Tracking',
    body: 'Once your order ships, you will receive an email with a tracking number. You can also follow its progress from your account.',
  },
]

export default function ShippingPage(): React.ReactElement {
  return (
    <>
      <CollectionHero eyebrow="Support" title="Shipping" description="How and when your pieces reach you." />
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-16 md:px-10">
        {SECTIONS.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="font-serif text-2xl">{section.heading}</h2>
            <p className="text-sm leading-relaxed text-text-muted">{section.body}</p>
          </section>
        ))}
        <p className="border-t border-border pt-8 text-sm text-text-muted">
          Questions about a delivery? Write to us at {SUPPORT_EMAIL}.
        </p>
      </div>
    </>
  )
}
