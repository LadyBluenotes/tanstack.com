import { useState, useEffect } from 'react'

function getWithExpiry<T>(key: string) {
  if (typeof window !== 'undefined') {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return undefined
    if (!itemStr) {
      return undefined
    }
    const item: { value: T; ttl: number } = JSON.parse(itemStr)
    // If there is no TTL set, return the value
    if (!item.ttl) {
      return item.value
    }
    // compare the expiry time of the item with the current time
    if (new Date().getTime() > item.ttl) {
      // If the item is expired, delete the item from storage
      localStorage.removeItem(key)
      return undefined
    }
    return item.value
  }
}

/**
 * React state that persists to `localStorage` (with optional TTL).
 *
 * - `key`: localStorage key to read/write
 * - `defaultValue`: initial value if no stored value
 * - `ttl` (ms): optional time-to-live; expired values are cleared and ignored
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  ttl?: number
): [T, typeof setValue] {
  // Lazily initialize from localStorage to avoid an extra render on mount
  const [value, setValue] = useState<T>(() => {
    const stored = getWithExpiry<T>(key)
    return stored !== undefined ? stored : defaultValue
  })

  // If the storage key changes, sync state to the new key's value (if present)
  useEffect(() => {
    const stored = getWithExpiry<T>(key)
    if (stored !== undefined && !Object.is(stored, value)) {
      setValue(stored)
    }
  }, [key, value])

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify({
        value,
        ttl: ttl ? new Date().getTime() + ttl : null,
      })
    )
  }, [key, value, ttl])

  return [value, setValue]
}
