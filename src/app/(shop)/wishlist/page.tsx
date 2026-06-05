import type { Metadata } from 'next'
import { WishlistView } from './WishlistView'

export const metadata: Metadata = {
  title: 'Wishlist',
  robots: { index: false, follow: false },
}

export default function WishlistPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-10">
      <h1 className="mb-8 font-serif text-3xl">Wishlist</h1>
      <WishlistView />
    </div>
  )
}
