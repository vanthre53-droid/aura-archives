import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/auth'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactElement> {
  const admin = await getAdminUser()
  if (!admin) redirect('/')

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main id="main-content" className="flex-1 bg-surface-low">
        {children}
      </main>
    </div>
  )
}
