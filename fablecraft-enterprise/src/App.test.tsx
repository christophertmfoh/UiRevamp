import { describe, expect, it } from 'vitest'

import App from './App'
import { render, screen } from './test/test-utils'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('FableCraft Enterprise')).toBeInTheDocument()
  })

  it('displays the header with navigation items', () => {
    render(<App />)

    // Check header elements
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Characters')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('World Bible')).toBeInTheDocument()
  })

  it('shows quick stats in the sidebar', () => {
    render(<App />)

    expect(screen.getByText('Quick Stats')).toBeInTheDocument()
    expect(screen.getByText('Total Characters')).toBeInTheDocument()
    expect(screen.getByText('Active Projects')).toBeInTheDocument()
    expect(screen.getByText('TypeScript Errors')).toBeInTheDocument()
  })

  it('displays zero TypeScript errors in green', () => {
    render(<App />)

    const errorCount = screen.getByText('0', { selector: '.text-green-400' })
    expect(errorCount).toBeInTheDocument()
  })

  it('switches between tabs when clicked', async () => {
    const { user } = render(<App />)

    // Initially on overview tab
    expect(screen.getByText('Welcome to FableCraft Enterprise')).toBeInTheDocument()

    // Click on Setup tab
    const setupTab = screen.getByText('Setup')
    await user.click(setupTab)

    // Should show setup content
    expect(screen.getByText('Installed Dependencies')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()

    // Click on Documentation tab
    const docsTab = screen.getByText('Documentation')
    await user.click(docsTab)

    // Should show documentation content
    expect(screen.getByText('Getting Started')).toBeInTheDocument()
    expect(screen.getByText('Configure testing with Vitest')).toBeInTheDocument()
  })

  it('has accessible navigation buttons', () => {
    render(<App />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)

    // Check specific buttons
    expect(screen.getByText('New Project')).toHaveClass('bg-blue-600')
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
