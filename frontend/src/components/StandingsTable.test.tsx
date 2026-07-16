import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('renders clickable sort controls for sortable columns', () => {
    render(
      <StandingsTable
        columns={[
          { key: 'name', header: 'Player', render: (row) => row.name },
          {
            key: 'points',
            header: 'Points',
            sortable: true,
            sortValue: (row) => row.points,
            render: (row) => row.points,
          },
        ]}
        rows={[{ id: 1, name: 'Jannik Sinner', points: 13450 }]}
        rowKey={(row) => row.id}
      />,
    )

    expect(screen.getByRole('button', { name: 'Sort by Points' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Points/ })).toBeInTheDocument()
  })

  it('reorders rows when a sortable header is clicked and toggles direction', async () => {
    const user = userEvent.setup()
    render(
      <StandingsTable
        columns={[
          {
            key: 'position',
            header: 'Rank',
            sortable: true,
            sortValue: (row) => row.position,
            render: (row) => row.position,
          },
          { key: 'name', header: 'Player', render: (row) => row.name },
          {
            key: 'points',
            header: 'Points',
            sortable: true,
            sortValue: (row) => row.points,
            render: (row) => row.points,
          },
        ]}
        rows={[
          { id: 1, position: 1, name: 'Jannik Sinner', points: 13450 },
          { id: 2, position: 2, name: 'Carlos Alcaraz', points: 10460 },
          { id: 3, position: 3, name: 'Alexander Zverev', points: 8480 },
        ]}
        rowKey={(row) => row.id}
      />,
    )

    const bodyRows = () => screen.getAllByRole('row').slice(1)

    expect(within(bodyRows()[0]).getByText('Jannik Sinner')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sort by Points' }))
    expect(within(bodyRows()[0]).getByText('Alexander Zverev')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Points/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    )

    await user.click(screen.getByRole('button', { name: /Sort by Points/ }))
    expect(within(bodyRows()[0]).getByText('Jannik Sinner')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Points/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    )

    await user.click(screen.getByRole('button', { name: /Sort by Rank/ }))
    expect(within(bodyRows()[0]).getByText('Jannik Sinner')).toBeInTheDocument()
    expect(within(bodyRows()[2]).getByText('Alexander Zverev')).toBeInTheDocument()
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
