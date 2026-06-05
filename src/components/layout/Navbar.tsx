'use client'

import * as React from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, Search, ShoppingBag, Shield, User, LogOut, X } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import { useUiStore } from '@/store/ui.store'
import { useCartStore, selectCartCount } from '@/store/cart.store'
import { useUser } from '@/hooks/useUser'
import { useAuth } from '@/hooks/useAuth'

const NAV_LINKS = [
  { href: '/collections/jewelry', label: 'Jewelry' },
  { href: '/collections/clothing', label: 'Clothing' },
  { href: '/exhibitions', label: 'Exhibitions' },
  { href: '/about', label: 'About' },
]

export function Navbar(): React.ReactElement {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const openCart = useUiStore((s) => s.setCartDrawerOpen)
  const hasHydrated = useCartStore((s) => s.hasHydrated)
  const cartCount = useCartStore(selectCartCount)
  const { user, isAdmin, loading } = useUser()
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 md:px-10">
        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger
            aria-label="Open menu"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
            <Dialog.Content className="fixed left-0 top-0 z-50 h-full w-72 max-w-[80vw] border-r border-border bg-surface p-6 data-[state=open]:animate-slide-up">
              <div className="mb-8 flex items-center justify-between">
                <Dialog.Title className="font-serif text-lg uppercase tracking-widest">
                  Menu
                </Dialog.Title>
                <Dialog.Close aria-label="Close menu">
                  <X className="h-5 w-5" aria-hidden />
                </Dialog.Close>
              </div>
              <nav className="flex flex-col gap-5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm uppercase tracking-widest text-text hover:text-text-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                {!loading && isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm uppercase tracking-widest text-gold hover:text-text-muted"
                  >
                    Admin Panel
                  </Link>
                ) : null}
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-widest text-text transition-colors hover:text-text-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          aria-label={`${APP_NAME} home`}
          className="absolute left-1/2 -translate-x-1/2 font-serif text-lg uppercase tracking-[0.3em] md:text-xl"
        >
          Aura
        </Link>

        <div className="flex items-center gap-4">
          {!loading && isAdmin ? (
            <Link href="/admin" aria-label="Admin panel" className="hover:text-text-muted">
              <Shield className="h-5 w-5" aria-hidden />
            </Link>
          ) : null}
          <Link href="/search" aria-label="Search" className="hover:text-text-muted">
            <Search className="h-5 w-5" aria-hidden />
          </Link>
          <button
            type="button"
            aria-label="Open bag"
            onClick={() => openCart(true)}
            className="relative hover:text-text-muted"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {hasHydrated && cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-primary px-1 text-[10px] leading-none text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
          {!loading ? (
            user ? (
              <button
                type="button"
                aria-label="Sign out"
                onClick={() => void signOut()}
                className="hover:text-text-muted"
              >
                <LogOut className="h-5 w-5" aria-hidden />
              </button>
            ) : (
              <Link href="/login" aria-label="Sign in" className="hover:text-text-muted">
                <User className="h-5 w-5" aria-hidden />
              </Link>
            )
          ) : null}
        </div>
      </div>
    </header>
  )
}
