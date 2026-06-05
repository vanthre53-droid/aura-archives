import { getDashboardStats } from '@/services/admin.service'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { env, isSupabaseConfigured, isAiConfigured, isRedisConfigured } from '@/lib/config'
import { APP_NAME, APP_VERSION } from '@/lib/constants'

interface Integration {
  name: string
  configured: boolean
  note: string
}

export default async function AdminSettingsPage(): Promise<React.ReactElement> {
  // Touch a service so the page reflects live wiring, not just env presence.
  const stats = await getDashboardStats()

  const integrations: Integration[] = [
    { name: 'Supabase (database + auth)', configured: isSupabaseConfigured(), note: 'Storefront data, orders, RLS' },
    { name: 'Anthropic (AI assistant)', configured: isAiConfigured(), note: 'Shopping assistant (Step 08)' },
    { name: 'Upstash Redis (rate limiting)', configured: isRedisConfigured(), note: 'API rate limits' },
    { name: 'Resend (email)', configured: Boolean(env.RESEND_API_KEY), note: 'Transactional email (Step 10)' },
    { name: 'Sentry (errors)', configured: Boolean(env.SENTRY_DSN ?? env.NEXT_PUBLIC_SENTRY_DSN), note: 'Error monitoring' },
    { name: 'PostHog (analytics)', configured: Boolean(env.NEXT_PUBLIC_POSTHOG_KEY), note: 'Product analytics' },
    { name: 'Inngest (jobs)', configured: Boolean(env.INNGEST_EVENT_KEY), note: 'Background jobs (Step 10)' },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl">Settings</h1>
        <p className="text-sm text-text-muted">Environment and integration status.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
            <CardDescription>Runtime configuration (read-only).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <Row label="Name" value={APP_NAME} />
            <Row label="Version" value={APP_VERSION} />
            <Row label="Environment" value={env.NODE_ENV} />
            <Row label="Maintenance mode" value={env.MAINTENANCE_MODE ? 'On' : 'Off'} />
            <Row label="AI monthly budget" value={`$${env.AI_MONTHLY_BUDGET_USD.toFixed(2)}`} />
            <Row label="Catalogue size" value={`${stats.productCount} products`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Configured via environment variables.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-sm">{integration.name}</span>
                  <span className="text-xs text-text-muted">{integration.note}</span>
                </div>
                <Badge variant={integration.configured ? 'success' : 'outline'}>
                  {integration.configured ? 'Connected' : 'Not set'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-text-muted">{label}</span>
      <span>{value}</span>
    </div>
  )
}
