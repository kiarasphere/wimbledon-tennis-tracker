import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  it('renders the default loading message', () => {
    render(<LoadingState />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading standings...')
  })

  it('renders a custom loading message', () => {
    render(<LoadingState message="Loading race results..." />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading race results...')
  })
})
