'use client'

import { useEffect } from 'react'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/config'

interface RealtimeOptions {
  channel: string
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  enabled?: boolean
}

/**
 * Subscribes to Postgres changes on a table and invokes `onChange`.
 * Cleans up the channel on unmount (no leaks). No-ops when unconfigured.
 */
export function useRealtime<T extends Record<string, unknown>>(
  options: RealtimeOptions,
  onChange: (payload: RealtimePostgresChangesPayload<T>) => void,
): void {
  const { channel, table, event = '*', filter, enabled = true } = options

  useEffect(() => {
    if (!enabled || !isSupabaseConfigured()) return
    const supabase = createClient()
    const sub = supabase
      .channel(channel)
      .on(
        'postgres_changes',
        { event, schema: 'public', table, ...(filter ? { filter } : {}) },
        (payload) => onChange(payload as RealtimePostgresChangesPayload<T>),
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(sub)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, table, event, filter, enabled])
}
