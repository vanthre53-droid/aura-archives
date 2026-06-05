import { FormError } from '@/components/forms/FormError'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  /** Must match the `id` of the control rendered as children. */
  htmlFor: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  htmlFor,
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps): React.ReactElement {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-[11px] uppercase tracking-widest text-text-muted"
      >
        {label}
        {required ? <span className="ml-1 text-error">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-text-muted">{hint}</p> : null}
      <FormError id={`${htmlFor}-error`} message={error} />
    </div>
  )
}
