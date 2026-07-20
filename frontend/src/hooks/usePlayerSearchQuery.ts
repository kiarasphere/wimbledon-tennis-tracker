import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/** Sync player search text with the `q` URL query param. */
export function usePlayerSearchQuery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const setQuery = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value) {
            next.set('q', value)
          } else {
            next.delete('q')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return [query, setQuery] as const
}
