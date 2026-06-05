'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'

export function NewsletterSignup(): React.ReactElement {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function onSubmit(event: React.FormEvent): void {
    event.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast({ title: 'Enter a valid email address.', variant: 'error' })
      return
    }
    setDone(true)
    toast({ title: 'Welcome to the archive', description: 'You are on the list.', variant: 'success' })
  }

  return (
    <section className="flex flex-col items-center gap-4 border-y border-border px-4 py-16 text-center">
      <h2 className="font-serif text-2xl">Join the archive</h2>
      <p className="max-w-md text-sm text-text-muted">
        Early access to new arrivals and exhibitions. No noise.
      </p>
      {done ? (
        <p className="text-sm text-success">Thank you — you are on the list.</p>
      ) : (
        <form onSubmit={onSubmit} className="flex w-full max-w-sm gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            aria-label="Email address"
            required
          />
          <Button type="submit">Join</Button>
        </form>
      )}
    </section>
  )
}
