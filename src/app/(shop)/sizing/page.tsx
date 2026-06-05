import type { Metadata } from 'next'
import { CollectionHero } from '@/components/shop/CollectionHero'
import { SUPPORT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Sizing',
  description: 'Ring and clothing size guides for Aura Archives.',
}

const RING_SIZES = [
  { label: 'Diameter (mm)', values: ['15.7', '16.5', '17.3', '18.1', '18.9'] },
  { label: 'India', values: ['12', '14', '16', '18', '20'] },
  { label: 'US', values: ['5', '6', '7', '8', '9'] },
  { label: 'UK', values: ['J', 'L', 'N', 'P', 'R'] },
]

const CLOTHING_SIZES = [
  { label: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
  { label: 'Bust (in)', values: ['32', '34', '36', '38', '40'] },
  { label: 'Waist (in)', values: ['25', '27', '29', '31', '33'] },
  { label: 'Hip (in)', values: ['35', '37', '39', '41', '43'] },
]

function SizeTable({
  caption,
  rows,
}: {
  caption: string
  rows: { label: string; values: string[] }[]
}): React.ReactElement {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-2xl">{caption}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-sm">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.label} className="border-b border-border">
                <th
                  scope="row"
                  className="py-3 pr-4 text-left text-xs font-normal uppercase tracking-widest text-text-muted"
                >
                  {row.label}
                </th>
                {row.values.map((value, colIndex) => (
                  <td
                    key={`${row.label}-${colIndex}`}
                    className={rowIndex === 0 ? 'py-3 px-3 text-center font-serif' : 'py-3 px-3 text-center'}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function SizingPage(): React.ReactElement {
  return (
    <>
      <CollectionHero eyebrow="Support" title="Sizing" description="Find your fit before you commit to a piece." />
      <div className="mx-auto flex max-w-3xl flex-col gap-14 px-4 py-16 md:px-10">
        <SizeTable caption="Ring sizes" rows={RING_SIZES} />
        <SizeTable caption="Clothing sizes" rows={CLOTHING_SIZES} />
        <div className="flex flex-col gap-3 border-t border-border pt-8">
          <h2 className="font-serif text-2xl">How to measure</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            For rings, wrap a strip of paper around the base of your finger, mark where it meets, and measure the
            length in millimetres against the diameter column. For garments, measure over light clothing and keep the
            tape level.
          </p>
          <p className="text-sm text-text-muted">
            Between sizes or unsure? Write to {SUPPORT_EMAIL} and we will help you choose.
          </p>
        </div>
      </div>
    </>
  )
}
