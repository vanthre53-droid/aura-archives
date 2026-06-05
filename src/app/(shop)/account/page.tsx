import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import { getMyOrders } from '@/services/order.service'
import { AccountProfileForm } from './AccountProfileForm'
import { SignOutButton } from '@/components/layout/SignOutButton'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { UserProfile } from '@/types/shop.types'

export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
}

function SignInPrompt(): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h1 className="font-serif text-2xl">Your account</h1>
      <p className="max-w-sm text-sm text-text-muted">
        Sign in to view your profile and order history.
      </p>
      <Button asChild>
        <Link href="/login?redirectTo=/account">Sign in</Link>
      </Button>
    </div>
  )
}

export default async function AccountPage(): Promise<React.ReactElement> {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-container px-4 py-12 md:px-10">
        <SignInPrompt />
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="mx-auto max-w-container px-4 py-12 md:px-10">
        <SignInPrompt />
      </div>
    )
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  const orders = await getMyOrders()
  const recent = orders.slice(0, 3)

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl">Account</h1>
        <SignOutButton />
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h2 className="text-[11px] uppercase tracking-widest text-text-muted">Profile</h2>
          {profile ? (
            <AccountProfileForm profile={profile as UserProfile} />
          ) : (
            <p className="text-sm text-text-muted">Profile unavailable.</p>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-widest text-text-muted">Recent orders</h2>
            <Link href="/account/orders" className="text-xs uppercase tracking-widest underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-text-muted">No orders yet.</p>
              <Button asChild variant="secondary" size="sm">
                <Link href="/collections">Shop now</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-border border border-border">
              {recent.map((order) => (
                <li key={order.id} className="flex items-center justify-between p-4 text-sm">
                  <div className="flex flex-col">
                    <span className="capitalize">{order.status}</span>
                    <span className="text-xs text-text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
