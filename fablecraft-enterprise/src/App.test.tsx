import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('FableCraft Enterprise')).toBeInTheDocument()
  })

  it('displays the theme system demo', () => {
    render(<App />)

    // Check header elements
    expect(screen.getByText('FableCraft Enterprise')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('shows the theme system ready card', () => {
    render(<App />)

    expect(screen.getByText('🎉 Theme System Ready!')).toBeInTheDocument()
    expect(
      screen.getByText(
        'The theme system is working perfectly. Try switching themes using the toggle in the header.',
      ),
    ).toBeInTheDocument()
  })

  it('displays completed setup section', () => {
    render(<App />)

    expect(screen.getByText('✅ Completed Setup')).toBeInTheDocument()
    expect(screen.getByText('• UI Components migrated')).toBeInTheDocument()
    expect(screen.getByText('• Theme system configured')).toBeInTheDocument()
  })

  it('shows next steps section', () => {
    render(<App />)

    expect(screen.getByText('🚀 Next Steps')).toBeInTheDocument()
    expect(screen.getByText('• Migrate Landing Page')).toBeInTheDocument()
    expect(screen.getByText('• Migrate Auth Page')).toBeInTheDocument()
  })

  it('has theme toggle button', () => {
    render(<App />)

    const themeToggle = screen.getByText('Toggle theme')
    expect(themeToggle).toBeInTheDocument()
  })
})
