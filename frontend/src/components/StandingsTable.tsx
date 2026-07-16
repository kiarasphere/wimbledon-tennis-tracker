import { useState, type ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface StandingsColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
  /** When true, shows sort arrows and enables click-to-sort. */
  sortable?: boolean
  /** Value used when sorting this column. */
  sortValue?: (row: T) => string | number | null | undefined
}

interface StandingsTableProps<T> {
  columns: StandingsColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  emptyMessage?: string
}

function compareSortValues(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function sortRows<T>(
  rows: T[],
  columns: StandingsColumn<T>[],
  sortKey: string,
  direction: SortDirection,
): T[] {
  const column = columns.find((entry) => entry.key === sortKey)
  if (!column?.sortValue) return rows

  const multiplier = direction === 'asc' ? 1 : -1
  return [...rows].sort(
    (left, right) => compareSortValues(column.sortValue!(left), column.sortValue!(right)) * multiplier,
  )
}

export function StandingsTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'No data available yet.',
}: StandingsTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  if (rows.length === 0) {
    return (
      <div className="table-shell table-empty" role="status">
        <p className="table-empty-message">{emptyMessage}</p>
      </div>
    )
  }

  const displayRows =
    sortKey != null ? sortRows(rows, columns, sortKey, sortDirection) : rows

  function handleSort(columnKey: string) {
    if (sortKey === columnKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(columnKey)
    setSortDirection('asc')
  }

  return (
    <div className="table-shell">
      <table className="standings-table">
        <thead>
          <tr>
            {columns.map((column) => {
              const isActive = sortKey === column.key
              const ariaSort = !column.sortable
                ? undefined
                : isActive
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'

              return (
                <th key={column.key} className={column.className} aria-sort={ariaSort}>
                  {column.sortable ? (
                    <button
                      type="button"
                      className="sortable-header"
                      onClick={() => handleSort(column.key)}
                      aria-label={`Sort by ${column.header}`}
                    >
                      <span>{column.header}</span>
                      <span className="sort-arrows" aria-hidden="true">
                        {isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PositionBadge({ position }: { position: number }) {
  return <span className={`position-badge position-${position}`}>{position}</span>
}

export function CountryBadge({
  country,
  countryColour,
}: {
  country: string | null | undefined
  countryColour: string | null | undefined
}) {
  const colour = countryColour ? `#${countryColour}` : '#666666'

  return (
    <span className="team-badge">
      <span className="team-dot" style={{ backgroundColor: colour }} aria-hidden="true" />
      <span>{country ?? 'Unknown'}</span>
    </span>
  )
}

export function PointsDelta({ points, pointsStart }: { points: number; pointsStart: number }) {
  const delta = Math.round(points - pointsStart)
  const formattedPoints = Math.round(points)
  const signedDelta = delta === 0 ? null : delta > 0 ? `+${delta}` : `${delta}`

  return (
    <span className="points-cell">
      <span className="points-value">{formattedPoints}</span>
      <span className="points-delta" aria-hidden={signedDelta === null}>
        {signedDelta}
      </span>
    </span>
  )
}

export function PlayerCell({
  playerId,
  fullName,
  nameAcronym,
  photoUrl,
}: {
  playerId: number
  fullName: string | null
  nameAcronym: string | null
  photoUrl: string | null
}) {
  return (
    <>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={fullName ?? `Player ${playerId}`}
          className="driver-headshot"
          loading="lazy"
        />
      ) : (
        <div className="driver-headshot placeholder">{nameAcronym ?? playerId}</div>
      )}
      <div>
        <div className="primary-label">{fullName ?? `Player ${playerId}`}</div>
        <div className="secondary-label">{nameAcronym ?? `#${playerId}`}</div>
      </div>
    </>
  )
}
