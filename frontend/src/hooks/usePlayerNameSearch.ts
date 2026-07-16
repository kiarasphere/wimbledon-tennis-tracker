import { useSearchParams } from 'react-router-dom'
import {
  filterPlayerStandings,
  type NameSearchable,
} from '../utils/filterPlayerStandings'

const QUERY_PARAM = 'q'

export function usePlayerNameSearch<T extends NameSearchable>(standings: T[]) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get(QUERY_PARAM) ?? ''

  const setQuery = (next: string) => {
    const params = new URLSearchParams(searchParams)
    if (next.trim()) {
      params.set(QUERY_PARAM, next)
    } else {
      params.delete(QUERY_PARAM)
    }
    setSearchParams(params, { replace: true })
  }

  return {
    query,
    setQuery,
    filtered: filterPlayerStandings(standings, query),
  }
}
