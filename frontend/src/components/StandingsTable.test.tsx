import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CountryBadge, PointsDelta, PositionBadge, StandingsTable } from './StandingsTable'

describe('StandingsTable', () => {
  it('renders column headers and row cells', () => {
    render(
      <StandingsTable
        columns={[
          { key: 'name', header: 'Player', render: (row) => row.name },
          { key: 'points', header: 'Points', render: (row) => row.points },
        ]}
        rows={[
          { id: 1, name: 'Jannik Sinner', points: 13450 },
          { id: 2, name: 'Alexander Zverev', points: 8480 },
        ]}
        rowKey={(row) => row.id}
      />,
    )

    expect(screen.getByRole('columnheader', { name: 'Player' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Points' })).toBeInTheDocument()
    expect(screen.getByText('Jannik Sinner')).toBeInTheDocument()
    expect(screen.getByText('8480')).toBeInTheDocument()
  })

  it('shows an empty state when there are no rows', () => {
    render(
      <StandingsTable
        columns={[{ key: 'name', header: 'Player', render: (row: { name: string }) => row.name }]}
        rows={[]}
        rowKey={() => 'none'}
      />,
    )

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('No data available yet.')
  })

  it('accepts a custom empty message', () => {
    render(
      <StandingsTable
        columns={[{ key: 'name', header: 'Player', render: (row: { name: string }) => row.name }]}
        rows={[]}
        rowKey={() => 'none'}
        emptyMessage="Rankings will appear after the tournament."
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Rankings will appear after the tournament.',
    )
  })
})

describe('PositionBadge', () => {
  it('shows the position number', () => {
    render(<PositionBadge position={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

describe('CountryBadge', () => {
  it('renders the country code and colour swatch', () => {
    const { container } = render(<CountryBadge country="ITA" countryColour="009246" />)

    expect(screen.getByText('ITA')).toBeInTheDocument()
    expect(container.querySelector('.team-dot')).toHaveStyle({ backgroundColor: '#009246' })
  })

  it('falls back when country data is missing', () => {
    render(<CountryBadge country={null} countryColour={null} />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })
})

describe('PointsDelta', () => {
  it('shows points without a delta when unchanged', () => {
    const { container } = render(<PointsDelta points={13450} pointsStart={13450} />)
    expect(screen.getByText('13450')).toBeInTheDocument()
    expect(screen.queryByText('+0')).not.toBeInTheDocument()
    expect(container.querySelector('.points-cell')).toBeInTheDocument()
    expect(container.querySelector('.points-delta')).toBeInTheDocument()
    expect(container.querySelector('.points-delta')).toBeEmptyDOMElement()
  })

  it('shows a positive points delta', () => {
    const { container } = render(<PointsDelta points={8480} pointsStart={7190} />)
    expect(screen.getByText('8480')).toBeInTheDocument()
    expect(screen.getByText('+1290')).toBeInTheDocument()
    expect(container.querySelector('.points-cell')).toBeInTheDocument()
  })

  it('shows a negative points delta with a single minus sign', () => {
    render(<PointsDelta points={8160} pointsStart={9460} />)
    expect(screen.getByText('8160')).toBeInTheDocument()
    expect(screen.getByText('-1300')).toBeInTheDocument()
    expect(screen.queryByText('+-1300')).not.toBeInTheDocument()
  })
})
