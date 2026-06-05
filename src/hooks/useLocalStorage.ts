'use client'

import { useCallback, useEffect, useState } from 'react'

/** A typed, SSR-safe localStorage-backed state hook. */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) setStored(JSON.parse(item) as T)
    } catch {
      // Ignore read/parse errors and keep the initial value.
    }
  }, [key])

  const setValue = useCallback(
    (value: T) => {
      setStored(value)
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // Ignore quota/serialization errors.
      }
    },
    [key],
  )

  return [stored, setValue]
}
