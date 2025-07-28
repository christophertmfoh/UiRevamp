import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ToastProvider, useToastActions } from '@/components/ui/Toast';

// Test component to use toast actions
const TestComponent = () => {
  const toast = useToastActions();
  
  return (
    <div>
      <button onClick={() => toast.success('Success!', 'Test success message')}>
        Success Toast
      </button>
      <button onClick={() => toast.error('Error!', 'Test error message')}>
        Error Toast
      </button>
      <button onClick={() => toast.warning('Warning!', 'Test warning message')}>
        Warning Toast
      </button>
      <button onClick={() => toast.info('Info!', 'Test info message')}>
        Info Toast
      </button>
    </div>
  );
};

// Helper to render component with toast provider
const renderWithToastProvider = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      {component}
    </ToastProvider>
  );
};

describe('Toast System', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('renders children without crashing', () => {
      renderWithToastProvider(<div>Test content</div>);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('provides toast context to children', () => {
      renderWithToastProvider(<TestComponent />);
      expect(screen.getByText('Success Toast')).toBeInTheDocument();
    });
  });

  describe('Toast Actions', () => {
    it('shows success toast when triggered', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Success Toast'));
      
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Test success message')).toBeInTheDocument();
      });
    });

    it('shows error toast when triggered', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Error Toast'));
      
      await waitFor(() => {
        expect(screen.getByText('Error!')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
      });
    });

    it('shows warning toast when triggered', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Warning Toast'));
      
      await waitFor(() => {
        expect(screen.getByText('Warning!')).toBeInTheDocument();
        expect(screen.getByText('Test warning message')).toBeInTheDocument();
      });
    });

    it('shows info toast when triggered', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Info Toast'));
      
      await waitFor(() => {
        expect(screen.getByText('Info!')).toBeInTheDocument();
        expect(screen.getByText('Test info message')).toBeInTheDocument();
      });
    });
  });

  describe('Toast Auto-dismiss', () => {
    it('auto-dismisses success toast after 5 seconds', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Success Toast'));
      
      // Toast should be visible
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });
      
      // Fast-forward 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      // Toast should be gone
      await waitFor(() => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument();
      });
    });

    it('auto-dismisses error toast after 8 seconds', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Error Toast'));
      
      // Toast should be visible
      await waitFor(() => {
        expect(screen.getByText('Error!')).toBeInTheDocument();
      });
      
      // Fast-forward 8 seconds
      act(() => {
        jest.advanceTimersByTime(8000);
      });
      
      // Toast should be gone
      await waitFor(() => {
        expect(screen.queryByText('Error!')).not.toBeInTheDocument();
      });
    });

    it('auto-dismisses warning toast after 6 seconds', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Warning Toast'));
      
      // Toast should be visible
      await waitFor(() => {
        expect(screen.getByText('Warning!')).toBeInTheDocument();
      });
      
      // Fast-forward 6 seconds
      act(() => {
        jest.advanceTimersByTime(6000);
      });
      
      // Toast should be gone
      await waitFor(() => {
        expect(screen.queryByText('Warning!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Toast Manual Dismissal', () => {
    it('allows manual dismissal via close button', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Success Toast'));
      
      // Toast should be visible
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });
      
      // Click close button
      const closeButton = screen.getByLabelText('Close notification');
      fireEvent.click(closeButton);
      
      // Toast should be gone
      await waitFor(() => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Multiple Toasts', () => {
    it('can show multiple toasts simultaneously', async () => {
      renderWithToastProvider(<TestComponent />);
      
      // Trigger multiple toasts
      fireEvent.click(screen.getByText('Success Toast'));
      fireEvent.click(screen.getByText('Error Toast'));
      fireEvent.click(screen.getByText('Warning Toast'));
      
      // All toasts should be visible
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Error!')).toBeInTheDocument();
        expect(screen.getByText('Warning!')).toBeInTheDocument();
      });
    });

    it('dismisses toasts independently', async () => {
      renderWithToastProvider(<TestComponent />);
      
      // Trigger multiple toasts
      fireEvent.click(screen.getByText('Success Toast'));
      fireEvent.click(screen.getByText('Error Toast'));
      
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Error!')).toBeInTheDocument();
      });
      
      // Fast-forward 5 seconds (success toast should dismiss)
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument();
        expect(screen.getByText('Error!')).toBeInTheDocument();
      });
      
      // Fast-forward 3 more seconds (error toast should dismiss)
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Error!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Promise Integration', () => {
    const TestPromiseComponent = () => {
      const toast = useToastActions();
      
      const handlePromise = async () => {
        const promise = new Promise((resolve) => {
          setTimeout(() => resolve('Success!'), 1000);
        });
        
        await toast.promise(promise, {
          loading: 'Loading...',
          success: 'Promise resolved!',
          error: 'Promise failed!'
        });
      };
      
      return (
        <button onClick={handlePromise}>
          Test Promise
        </button>
      );
    };

    it('shows loading toast during promise execution', async () => {
      renderWithToastProvider(<TestPromiseComponent />);
      
      fireEvent.click(screen.getByText('Test Promise'));
      
      // Loading toast should appear
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
      
      // Fast-forward to resolve promise
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Success toast should appear, loading should be gone
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(screen.getByText('Promise resolved!')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Success Toast'));
      
      await waitFor(() => {
        const toastContainer = screen.getByRole('region');
        expect(toastContainer).toHaveAttribute('aria-label', 'Notifications');
        expect(toastContainer).toHaveAttribute('aria-live', 'polite');
        
        const toast = screen.getByRole('alert');
        expect(toast).toHaveAttribute('aria-live', 'assertive');
      });
    });

    it('close button has proper aria-label', async () => {
      renderWithToastProvider(<TestComponent />);
      
      fireEvent.click(screen.getByText('Success Toast'));
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close notification');
        expect(closeButton).toBeInTheDocument();
      });
    });
  });
});