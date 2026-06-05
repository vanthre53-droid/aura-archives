'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/config'
import type { UserProfile } from '@/types/shop.types'

interface UseUserResult {
  user: User | null
  profile: UserProfile | null
  isAdmin: boolean
  loading: boolean
}

/**
 * Reads the current auth user + their public.users profile, and keeps it in
 * sync with auth state changes. Fetches the role via an API call to avoid
 * RLS issues on the client.
 */
export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    let active = true

    async function loadProfile(nextUser: User | null): Promise<void> {
      if (!nextUser) {
        if (active) setProfile(null)
        return
      }
      try {
        const res = await fetch('/api/v1/me')
        if (res.ok) {
          const json = await res.json() as { success: boolean; data: UserProfile | null }
          if (active && json.data) setProfile(json.data)
        }
      } catch {
        // Profile fetch failed — isAdmin will be false
      }
    }

    void supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return
      setUser(data.user)
      await loadProfile(data.user)
      if (active) setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      void loadProfile(session?.user ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, profile, isAdmin: profile?.role === 'admin', loading }
}
