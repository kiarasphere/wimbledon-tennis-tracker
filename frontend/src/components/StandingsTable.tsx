import type { ReactNode } from 'react'

export interface StandingsColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
  /** When true, shows sort arrows that look interactive. */
  sortable?: boolean
}

interface StandingsTableProps<T> {
  columns: StandingsColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  emptyMessage?: string
}

export function StandingsTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'No data available yet.',
}: StandingsTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="table-shell table-empty" role="status">
        <p className="table-empty-message">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="table-shell">
      <table className="standings-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.sortable ? (
                  <button type="button" className="sortable-header">
                    <span>{column.header}</span>
                    <span className="sort-arrows" aria-hidden="true">
                      ↕
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
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
  const deltaTone =
    delta > 0 ? 'points-delta-gained' : delta < 0 ? 'points-delta-lost' : 'points-delta-unchanged'

  return (
    <span className="points-cell">
      <span className="points-value">{formattedPoints}</span>
      <span className={`points-delta ${deltaTone}`} aria-hidden={signedDelta === null}>
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
