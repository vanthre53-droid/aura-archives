'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export function SignOutButton(): React.ReactElement {
  const { signOut } = useAuth()
  const [pending, setPending] = useState(false)

  async function handleClick(): Promise<void> {
    setPending(true)
    await signOut()
  }

  return (
    <Button variant="ghost" size="sm" isLoading={pending} onClick={handleClick}>
      Sign out
    </Button>
  )
}
