'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary props interface
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  className?: string;
}

/**
 * Error fallback component props
 */
interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  className?: string;
}

/**
 * Default Error Fallback Component
 */
function DefaultErrorFallback({ error, resetError, className }: ErrorFallbackProps) {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8 ${className || ''}`}>
      <div className="text-center space-y-6 max-w-md mx-auto">
        
        {/* Error Icon */}
        <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        
        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error while loading this section. 
            Please try refreshing the page or contact support if the problem persists.
          </p>
          
          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 p-4 bg-muted rounded-lg text-left">
              <summary className="cursor-pointer font-medium text-sm text-foreground mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={resetError}
            className="flex items-center gap-2"
            aria-label="Retry loading this section"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
            aria-label="Return to homepage"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * FEATURES:
 * - Catches and handles React component errors gracefully
 * - Provides user-friendly error fallback UI
 * - Supports custom error reporting
 * - Development-friendly error details
 * - Accessibility compliant error states
 * - Customizable fallback components
 * 
 * @param props - Error boundary configuration
 * @returns Error boundary wrapper component
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided (for logging/monitoring)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined 
    });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI or default
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <div className={this.props.className} role="alert" aria-live="assertive">
          <FallbackComponent 
            error={this.state.error}
            resetError={this.resetError}
            className={this.props.className}
          />
        </div>
      );
    }

    // Render children normally
    return this.props.children;
  }
}

/**
 * Hook-based Error Boundary for functional components
 * 
 * @param onError - Error handler callback
 * @returns Error boundary wrapper component
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * React Hook for error handling in functional components
 * 
 * @returns Error boundary utilities
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  // Re-throw error to be caught by Error Boundary
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
}