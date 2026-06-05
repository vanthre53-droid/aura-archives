import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Archive',
    links: [
      { href: '/collections/jewelry', label: 'Jewelry' },
      { href: '/collections/clothing', label: 'Clothing' },
      { href: '/exhibitions', label: 'Exhibitions' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { href: '/shipping', label: 'Shipping' },
      { href: '/returns', label: 'Returns' },
      { href: '/sizing', label: 'Sizing' },
      { href: '/care-guide', label: 'Care Guide' },
    ],
  },
  {
    heading: 'House',
    links: [
      { href: '/about', label: 'About' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/cookies', label: 'Cookies' },
    ],
  },
]

export function Footer(): React.ReactElement {
  return (
    <footer className="mt-24 border-t border-border bg-surface-low">
      <div className="mx-auto grid max-w-container grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 md:px-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-xl uppercase tracking-[0.3em]">{APP_NAME}</p>
          <p className="mt-3 max-w-xs text-sm text-text-muted">
            Timeless artifacts of jewelry and clothing, curated for the contemporary silhouette.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h4 className="text-[11px] uppercase tracking-widest text-text-muted">
              {column.heading}
            </h4>
            <ul className="mt-4 flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text transition-colors hover:text-text-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-text-muted md:px-10">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  )
}
