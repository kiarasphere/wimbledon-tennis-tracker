import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContextHeader } from './ContextHeader'
import { mockContext } from '../test/fixtures'

describe('ContextHeader', () => {
  it('shows loading subtitle when context is missing', () => {
    render(<ContextHeader title="ATP Rankings" context={null} />)

    expect(screen.getByRole('heading', { name: 'ATP Rankings' })).toBeInTheDocument()
    expect(screen.getByText('Rankings')).toBeInTheDocument()
    expect(screen.getByText('Loading season context...')).toBeInTheDocument()
  })

  it('renders season context in the subtitle', () => {
    render(<ContextHeader title="ATP Rankings" context={mockContext} />)

    expect(screen.getByText('2026 Season · After Wimbledon')).toBeInTheDocument()
  })

  it('uses custom eyebrow and subtitle when provided', () => {
    render(
      <ContextHeader
        title="Wimbledon Results"
        context={mockContext}
        eyebrow="Grand Slam"
        subtitle="2026 · Wimbledon Men's Singles"
      />,
    )

    expect(screen.getByText('Grand Slam')).toBeInTheDocument()
    expect(screen.getByText("2026 · Wimbledon Men's Singles")).toBeInTheDocument()
  })
})
