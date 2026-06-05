'use client'

import { Button, type ButtonProps } from '@/components/ui/Button'

interface SubmitButtonProps extends Omit<ButtonProps, 'type'> {
  /** Loading state from the form (e.g. React Hook Form's `isSubmitting`). */
  isLoading?: boolean
}

/**
 * A submit button that always disables and shows a spinner while submitting,
 * preventing double submits. Pass the form's submitting state via `isLoading`.
 */
export function SubmitButton({
  isLoading = false,
  children,
  ...props
}: SubmitButtonProps): React.ReactElement {
  return (
    <Button type="submit" isLoading={isLoading} {...props}>
      {children}
    </Button>
  )
}
