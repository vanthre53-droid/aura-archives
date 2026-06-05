import type { Metadata } from 'next'
import { CollectionHero } from '@/components/shop/CollectionHero'
import { SUPPORT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Returns',
  description: 'Our returns and exchange policy for Aura Archives orders.',
}

const SECTIONS = [
  {
    heading: 'Window',
    body: 'You may return most pieces within 14 days of delivery for a refund or exchange. The window begins on the day your order arrives.',
  },
  {
    heading: 'Condition',
    body: 'Items must be unworn, undamaged, and returned with their original packaging and any tags intact. For hygiene reasons, pierced earrings cannot be returned unless faulty.',
  },
  {
    heading: 'How to return',
    body: 'Start a return from your account or email us, and we will send a prepaid label for domestic orders. Once we receive and inspect the piece, your refund is issued to the original payment method within five business days.',
  },
  {
    heading: 'Made-to-order and final sale',
    body: 'Made-to-order and engraved pieces are produced individually and cannot be returned unless they arrive faulty. Any such exclusions are noted clearly on the product page.',
  },
]

export default function ReturnsPage(): React.ReactElement {
  return (
    <>
      <CollectionHero eyebrow="Support" title="Returns" description="If a piece is not right, here is how to send it back." />
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-16 md:px-10">
        {SECTIONS.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="font-serif text-2xl">{section.heading}</h2>
            <p className="text-sm leading-relaxed text-text-muted">{section.body}</p>
          </section>
        ))}
        <p className="border-t border-border pt-8 text-sm text-text-muted">
          Need a hand with a return? Write to us at {SUPPORT_EMAIL}.
        </p>
      </div>
    </>
  )
}
