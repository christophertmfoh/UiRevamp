import { describe, expect, it } from 'vitest'

import App from './App'
import { render, screen } from './test/test-utils'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('FableCraft Enterprise')).toBeInTheDocument()
  })

  it('displays the main title and theme demo', () => {
    render(<App />)

    // Check header elements
    expect(screen.getByText('FableCraft Enterprise')).toBeInTheDocument()
    expect(screen.getByText('🎉 Theme System Ready!')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('shows the completed setup status', () => {
    render(<App />)

    expect(screen.getByText('✅ Completed Setup')).toBeInTheDocument()
    expect(screen.getByText('• UI Components migrated')).toBeInTheDocument()
    expect(screen.getByText('• Theme system configured')).toBeInTheDocument()
    expect(screen.getByText('• Auth store ready')).toBeInTheDocument()
  })

  it('displays zero TypeScript errors in environment status', () => {
    render(<App />)

    expect(screen.getByText('Environment Status')).toBeInTheDocument()
    expect(screen.getByText('TypeScript Errors:')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('has theme toggle and sign in buttons', () => {
    render(<App />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)

    // Check that theme toggle and sign in button exist
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('displays different button variants', () => {
    render(<App />)

    // Check all the demo button variants
    expect(screen.getByText('Default')).toBeInTheDocument()
    expect(screen.getByText('Secondary')).toBeInTheDocument()
    expect(screen.getByText('Outline')).toBeInTheDocument()
    expect(screen.getByText('Ghost')).toBeInTheDocument()
    expect(screen.getByText('Destructive')).toBeInTheDocument()
    expect(screen.getByText('Link')).toBeInTheDocument()
  })
})
