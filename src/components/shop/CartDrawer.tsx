'use client'

import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CartItem } from '@/components/shop/CartItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCart } from '@/hooks/useCart'
import { useUiStore } from '@/store/ui.store'
import { formatPrice } from '@/lib/utils'

export function CartDrawer(): React.ReactElement {
  const open = useUiStore((s) => s.cartDrawerOpen)
  const setOpen = useUiStore((s) => s.setCartDrawerOpen)
  const { items, subtotal } = useCart()

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface data-[state=open]:animate-slide-up">
          <div className="flex items-center justify-between border-b border-border p-4">
            <Dialog.Title className="font-serif text-lg uppercase tracking-widest">
              Your Bag
            </Dialog.Title>
            <Dialog.Close aria-label="Close bag">
              <X className="h-5 w-5" aria-hidden />
            </Dialog.Close>
          </div>

          {items.length === 0 ? (
            <EmptyState title="Your archive is empty" description="Add a piece to begin." />
          ) : (
            <>
              <div className="flex-1 divide-y divide-border overflow-y-auto px-4">
                {items.map((item) => (
                  <CartItem key={`${item.product_id}-${item.size}`} item={item} />
                ))}
              </div>
              <div className="flex flex-col gap-3 border-t border-border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="uppercase tracking-widest text-text-muted">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <Button asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/cart">View bag &amp; checkout</Link>
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
