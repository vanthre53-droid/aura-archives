'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'default' | 'success' | 'error'

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastEntry extends ToastOptions {
  id: number
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

const variantStyles: Record<ToastVariant, string> = {
  default: 'border-border',
  success: 'border-success',
  error: 'border-error',
}

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([])

  const toast = React.useCallback((options: ToastOptions) => {
    setToasts((current) => [...current, { id: nextId++, ...options }])
  }, [])

  const remove = React.useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const value = React.useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map(({ id, title, description, variant = 'default', duration = 4000 }) => (
          <ToastPrimitive.Root
            key={id}
            duration={duration}
            onOpenChange={(open) => {
              if (!open) remove(id)
            }}
            className={cn(
              'flex items-start gap-3 border-l-2 bg-surface p-4 shadow-md',
              'data-[state=open]:animate-slide-up',
              variantStyles[variant],
            )}
          >
            <div className="flex flex-1 flex-col gap-0.5">
              <ToastPrimitive.Title className="text-sm font-medium text-text">
                {title}
              </ToastPrimitive.Title>
              {description ? (
                <ToastPrimitive.Description className="text-xs text-text-muted">
                  {description}
                </ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close aria-label="Dismiss" className="text-text-muted hover:text-text">
              <X className="h-4 w-4" aria-hidden />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-20 right-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none md:bottom-4" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
