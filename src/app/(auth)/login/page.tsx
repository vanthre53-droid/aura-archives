import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: false },
}

export default function LoginPage(): React.ReactElement {
  return (
    <Suspense fallback={<LoadingSpinner className="mx-auto py-10" />}>
      <LoginForm />
    </Suspense>
  )
}
