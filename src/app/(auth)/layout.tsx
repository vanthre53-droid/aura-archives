import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12"
    >
      <Link
        href="/"
        className="mb-10 font-serif text-2xl uppercase tracking-[0.35em]"
        aria-label={`${APP_NAME} home`}
      >
        Aura
      </Link>
      <div className="w-full max-w-sm border border-border bg-surface p-8">{children}</div>
    </main>
  )
}
