'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Sparkles,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
  { href: '/admin/customers', label: 'Customers', icon: Users, exact: false },
  { href: '/admin/ai-usage', label: 'AI Usage', icon: Sparkles, exact: false },
  { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
]

export function AdminSidebar(): React.ReactElement {
  const pathname = usePathname()

  return (
    <aside className="flex shrink-0 flex-col gap-8 border-b border-border bg-surface p-4 md:h-screen md:w-60 md:border-b-0 md:border-r md:p-6">
      <Link href="/admin" className="font-serif text-lg uppercase tracking-[0.25em]">
        {APP_NAME}
        <span className="block text-[10px] tracking-widest text-text-muted">Admin</span>
      </Link>
      <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 whitespace-nowrap px-3 py-2 text-sm transition-colors',
                active ? 'bg-primary text-white' : 'text-text hover:bg-surface-dim',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
