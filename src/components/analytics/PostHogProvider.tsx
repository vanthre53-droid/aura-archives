'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as Provider } from 'posthog-js/react'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

/** Captures a pageview whenever the path or query changes. */
function PageviewTracker(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!POSTHOG_KEY) return
    const query = searchParams.toString()
    posthog.capture('$pageview', {
      $current_url: window.origin + pathname + (query ? `?${query}` : ''),
    })
  }, [pathname, searchParams])

  return null
}

/**
 * Initializes PostHog once (client-side) and tracks SPA pageviews. No-ops when
 * NEXT_PUBLIC_POSTHOG_KEY is absent, so analytics stays off until configured.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  useEffect(() => {
    if (!POSTHOG_KEY || posthog.__loaded) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // handled manually for accurate SPA navigation
      capture_pageleave: true,
      person_profiles: 'identified_only',
    })
  }, [])

  if (!POSTHOG_KEY) return <>{children}</>

  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </Provider>
  )
}
