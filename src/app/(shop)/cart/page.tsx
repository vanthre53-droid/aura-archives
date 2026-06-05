import type { Metadata } from 'next'
import { CartView } from './CartView'

export const metadata: Metadata = {
  title: 'Your Bag',
  robots: { index: false, follow: false },
}

export default function CartPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-10">
      <h1 className="mb-8 font-serif text-3xl">Your Bag</h1>
      <CartView />
    </div>
  )
}
