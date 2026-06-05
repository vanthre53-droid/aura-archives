import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest',
  {
    variants: {
      variant: {
        default: 'bg-surface-dim text-text',
        outline: 'border border-border text-text-muted',
        gold: 'bg-gold-light text-text',
        primary: 'bg-primary text-white',
        success: 'bg-success/10 text-success',
        error: 'bg-error/10 text-error',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.ReactElement {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
