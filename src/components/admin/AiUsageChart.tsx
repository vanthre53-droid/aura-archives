'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { AiUsageDay } from '@/services/admin.service'

export function AiUsageChart({ data }: { data: AiUsageDay[] }): React.ReactElement {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => value.slice(5)}
          tick={{ fontSize: 11 }}
          stroke="var(--color-text-muted)"
        />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" width={48} />
        <Tooltip
          cursor={{ fill: 'var(--color-surface-dim)' }}
          contentStyle={{
            fontSize: 12,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
        />
        <Bar dataKey="tokens" name="Tokens" fill="var(--color-primary)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
