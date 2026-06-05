import { Sparkles, Coins, Activity } from 'lucide-react'
import { getAiUsage } from '@/services/admin.service'
import { StatCard } from '@/components/admin/StatCard'
import { AiUsageChart } from '@/components/admin/AiUsageChart'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function AdminAiUsagePage(): Promise<React.ReactElement> {
  const usage = await getAiUsage(14)
  const budgetUsed = usage.budgetUsd > 0 ? (usage.totalCostUsd / usage.budgetUsd) * 100 : 0

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl">AI Usage</h1>
        <p className="text-sm text-text-muted">Token consumption and cost over the last 14 days.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Requests" value={usage.totalRequests.toLocaleString()} icon={Activity} />
        <StatCard label="Tokens" value={usage.totalTokens.toLocaleString()} icon={Sparkles} />
        <StatCard
          label="Cost"
          value={`$${usage.totalCostUsd.toFixed(2)}`}
          icon={Coins}
          hint={`${budgetUsed.toFixed(0)}% of $${usage.budgetUsd.toFixed(2)} budget`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily tokens</CardTitle>
          <CardDescription>
            Usage is recorded once the AI assistant is live (Step 08).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usage.daily.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No AI usage recorded yet"
              description="Once the shopping assistant handles requests, token usage will appear here."
            />
          ) : (
            <AiUsageChart data={usage.daily} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
