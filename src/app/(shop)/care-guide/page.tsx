import type { Metadata } from 'next'
import { CollectionHero } from '@/components/shop/CollectionHero'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion'

export const metadata: Metadata = {
  title: 'Care Guide',
  description: 'How to care for and preserve your Aura Archives jewelry and clothing.',
}

const CARE_ITEMS = [
  {
    value: 'jewelry-everyday',
    trigger: 'Everyday jewelry',
    body: 'Put jewelry on last, after fragrance and lotion, and take it off before sleeping or bathing. Wipe each piece with a soft, dry cloth after wear to remove oils.',
  },
  {
    value: 'jewelry-storage',
    trigger: 'Storing jewelry',
    body: 'Store pieces individually in a soft pouch or lined box, away from light and humidity. Keep chains fastened to prevent tangling, and store silver with an anti-tarnish strip.',
  },
  {
    value: 'jewelry-stones',
    trigger: 'Gemstones and pearls',
    body: 'Natural stones and pearls are porous. Avoid chemicals and ultrasonic cleaners, and clean only with a slightly damp cloth. Restring pearls periodically if worn often.',
  },
  {
    value: 'clothing-washing',
    trigger: 'Washing garments',
    body: 'Follow the care label first. As a rule, wash less and air more — spot clean where possible, and use a cool, gentle cycle or hand wash for delicate fabrics.',
  },
  {
    value: 'clothing-wool',
    trigger: 'Wool and knitwear',
    body: 'Lay knitwear flat to dry to keep its shape, and never wring it. A fabric comb removes pilling. Rest wool a day between wears so it can recover.',
  },
  {
    value: 'clothing-storage',
    trigger: 'Storing clothing',
    body: 'Fold heavy knits rather than hanging them, and use shaped hangers for structured pieces. Keep cedar nearby to deter moths, and store everything clean and dry.',
  },
]

export default function CareGuidePage(): React.ReactElement {
  return (
    <>
      <CollectionHero
        eyebrow="Support"
        title="Care Guide"
        description="A few habits will keep your pieces looking their best for years."
      />
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-10">
        <Accordion type="single" collapsible className="w-full">
          {CARE_ITEMS.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  )
}
