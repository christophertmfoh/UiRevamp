/**
 * Enterprise Toast Component Tests
 * 
 * Testing the toast notification system that's currently working
 * in the application to ensure business-critical functionality.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ToastProvider, useToastActions } from '../../../components/ui/Toast'
import { testUtils } from '../../setup'

// Test component to interact with toast system
const TestToastComponent = () => {
  const toast = useToastActions()
  
  return (
    <div>
      <button 
        onClick={() => toast.success('Success!', 'Test success message')}
        data-testid="success-button"
      >
        Success Toast
      </button>
      <button 
        onClick={() => toast.error('Error!', 'Test error message')}
        data-testid="error-button"
      >
        Error Toast
      </button>
      <button 
        onClick={() => toast.warning('Warning!', 'Test warning message')}
        data-testid="warning-button"
      >
        Warning Toast
      </button>
      <button 
        onClick={() => toast.info('Info!', 'Test info message')}
        data-testid="info-button"
      >
        Info Toast
      </button>
    </div>
  )
}

// Helper to render component with toast provider
const renderWithToastProvider = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      {component}
    </ToastProvider>
  )
}

describe('Toast System - Enterprise Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('ToastProvider Integration', () => {
    it('should render children without crashing', () => {
      renderWithToastProvider(<div data-testid="test-content">Test content</div>)
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
    })

    it('should provide toast context to child components', () => {
      renderWithToastProvider(<TestToastComponent />)
      expect(screen.getByTestId('success-button')).toBeInTheDocument()
      expect(screen.getByTestId('error-button')).toBeInTheDocument()
      expect(screen.getByTestId('warning-button')).toBeInTheDocument()
      expect(screen.getByTestId('info-button')).toBeInTheDocument()
    })
  })

  describe('Toast Functionality - Business Critical', () => {
    it('should display success toast with correct content', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('success-button'))
      
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument()
        expect(screen.getByText('Test success message')).toBeInTheDocument()
      })
    })

    it('should display error toast with correct content', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('error-button'))
      
      await waitFor(() => {
        expect(screen.getByText('Error!')).toBeInTheDocument()
        expect(screen.getByText('Test error message')).toBeInTheDocument()
      })
    })

    it('should display warning toast with correct content', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('warning-button'))
      
      await waitFor(() => {
        expect(screen.getByText('Warning!')).toBeInTheDocument()
        expect(screen.getByText('Test warning message')).toBeInTheDocument()
      })
    })

    it('should display info toast with correct content', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('info-button'))
      
      await waitFor(() => {
        expect(screen.getByText('Info!')).toBeInTheDocument()
        expect(screen.getByText('Test info message')).toBeInTheDocument()
      })
    })
  })

  describe('Toast Auto-Dismiss - User Experience', () => {
    it('should auto-dismiss success toast after 5 seconds', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('success-button'))
      
      // Toast should be visible
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument()
      })
      
      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000)
      
      // Toast should be gone
      await waitFor(() => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument()
      })
    })

    it('should auto-dismiss error toast after 8 seconds', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('error-button'))
      
      // Toast should be visible
      await waitFor(() => {
        expect(screen.getByText('Error!')).toBeInTheDocument()
      })
      
      // Fast-forward 8 seconds
      vi.advanceTimersByTime(8000)
      
      // Toast should be gone
      await waitFor(() => {
        expect(screen.queryByText('Error!')).not.toBeInTheDocument()
      })
    })
  })

  describe('Toast Accessibility - Enterprise Compliance', () => {
    it('should have proper ARIA attributes for screen readers', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('success-button'))
      
      await waitFor(() => {
        const toastRegion = screen.getByRole('region')
        expect(toastRegion).toHaveAttribute('aria-label', 'Notifications')
        expect(toastRegion).toHaveAttribute('aria-live', 'polite')
      })
    })

    it('should provide close button with proper accessibility', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('success-button'))
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close notification')
        expect(closeButton).toBeInTheDocument()
        expect(closeButton).toHaveAttribute('aria-label', 'Close notification')
      })
    })
  })

  describe('Multiple Toast Management - Performance', () => {
    it('should handle multiple toasts simultaneously', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      // Trigger multiple toasts
      fireEvent.click(screen.getByTestId('success-button'))
      fireEvent.click(screen.getByTestId('error-button'))
      fireEvent.click(screen.getByTestId('warning-button'))
      
      // All toasts should be visible
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument()
        expect(screen.getByText('Error!')).toBeInTheDocument()
        expect(screen.getByText('Warning!')).toBeInTheDocument()
      })
    })

    it('should dismiss toasts independently based on their timers', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      // Trigger success and error toasts
      fireEvent.click(screen.getByTestId('success-button'))
      fireEvent.click(screen.getByTestId('error-button'))
      
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument()
        expect(screen.getByText('Error!')).toBeInTheDocument()
      })
      
      // Fast-forward 5 seconds (success toast should dismiss)
      vi.advanceTimersByTime(5000)
      
      await waitFor(() => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument()
        expect(screen.getByText('Error!')).toBeInTheDocument()
      })
      
      // Fast-forward 3 more seconds (error toast should dismiss)
      vi.advanceTimersByTime(3000)
      
      await waitFor(() => {
        expect(screen.queryByText('Error!')).not.toBeInTheDocument()
      })
    })
  })

  describe('Manual Toast Dismissal - User Control', () => {
    it('should allow manual dismissal via close button', async () => {
      renderWithToastProvider(<TestToastComponent />)
      
      fireEvent.click(screen.getByTestId('success-button'))
      
      // Toast should be visible
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument()
      })
      
      // Click close button
      const closeButton = screen.getByLabelText('Close notification')
      fireEvent.click(closeButton)
      
      // Toast should be gone immediately
      await waitFor(() => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument()
      })
    })
  })
})