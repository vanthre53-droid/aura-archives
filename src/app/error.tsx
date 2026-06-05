'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { ErrorState } from '@/components/ui/ErrorState'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}): React.ReactElement {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <main id="main-content" className="flex min-h-[60vh] items-center justify-center">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred. Please try again, or contact support if it persists."
        onRetry={reset}
      />
    </main>
  )
}
