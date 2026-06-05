import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  hint?: string
}

export function StatCard({ label, value, icon: Icon, hint }: StatCardProps): React.ReactElement {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-text-muted">{label}</span>
        <Icon className="h-4 w-4 text-text-muted" aria-hidden />
      </div>
      <span className="font-serif text-3xl">{value}</span>
      {hint ? <span className="text-xs text-text-muted">{hint}</span> : null}
    </Card>
  )
}
