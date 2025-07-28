import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';
import { usePerformanceStore } from '@/lib/store';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  isolate?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

// Enhanced Error Boundary with better reporting and recovery
export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId || 'unknown';
    
    // Record error in performance store
    usePerformanceStore.getState().recordError();
    
    // Enhanced error logging
    console.error('🚨 ErrorBoundary caught an error:', {
      errorId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.retryCount,
    });

    // Store error info in state
    this.setState({ errorInfo });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to external service (in production)
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo, errorId);
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    try {
      // Send to error reporting service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorId,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          errorInfo,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          retryCount: this.retryCount,
        }),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
      });
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' => {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return 'low'; // Network/loading issues
    }
    if (error.name === 'TypeError' && error.message.includes('Cannot read property')) {
      return 'medium'; // Data access issues
    }
    return 'high'; // Unknown errors
  };

  private getErrorActions = (severity: 'low' | 'medium' | 'high') => {
    const canRetry = this.retryCount < this.maxRetries;
    
    switch (severity) {
      case 'low':
        return [
          { label: 'Retry', action: this.handleRetry, show: canRetry },
          { label: 'Reload Page', action: this.handleReload, show: true },
        ];
      case 'medium':
        return [
          { label: 'Retry', action: this.handleRetry, show: canRetry },
          { label: 'Go to Home', action: this.handleGoHome, show: true },
          { label: 'Reload Page', action: this.handleReload, show: true },
        ];
      case 'high':
        return [
          { label: 'Go to Home', action: this.handleGoHome, show: true },
          { label: 'Reload Page', action: this.handleReload, show: true },
        ];
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error!;
      const severity = this.getErrorSeverity(error);
      const actions = this.getErrorActions(severity);
      const isIsolated = this.props.isolate;

      // Isolated error (smaller, inline)
      if (isIsolated) {
        return (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 m-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Component Error</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message || 'Something went wrong in this component'}
            </p>
            <div className="flex gap-2 mt-3">
              {actions.filter(a => a.show).map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        );
      }

      // Full-page error (major error)
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-muted-foreground mb-6">
              {severity === 'low' && 'There was a temporary loading issue. Please try again.'}
              {severity === 'medium' && 'We encountered an unexpected error. Your data is safe.'}
              {severity === 'high' && 'A critical error occurred. Please restart the application.'}
            </p>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-muted p-4 rounded-lg mb-6 text-sm">
                <summary className="cursor-pointer font-medium text-foreground mb-2">
                  Error Details (Development)
                </summary>
                <div className="space-y-2">
                  <div>
                    <strong>Error:</strong> {error.name}
                  </div>
                  <div>
                    <strong>Message:</strong> {error.message}
                  </div>
                  {this.state.errorId && (
                    <div>
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                  )}
                  <div>
                    <strong>Retry Count:</strong> {this.retryCount}/{this.maxRetries}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 text-xs overflow-auto">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {actions.filter(a => a.show).map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                    ${i === 0 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  {action.label === 'Retry' && <RefreshCw className="w-4 h-4" />}
                  {action.label === 'Go to Home' && <Home className="w-4 h-4" />}
                  {action.label === 'Reload Page' && <RefreshCw className="w-4 h-4" />}
                  {action.label}
                </button>
              ))}
            </div>

            {/* Error ID for Support */}
            {this.state.errorId && (
              <p className="text-xs text-muted-foreground mt-6">
                Error ID: {this.state.errorId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for manual error reporting
export const useErrorHandler = () => {
  const recordError = usePerformanceStore(state => state.recordError);
  
  const reportError = (error: Error, context?: string) => {
    recordError();
    
    const errorId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.error('🐛 Manual error report:', {
      errorId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    });
  };
  
  return { reportError };
};

// Async Error Boundary for handling Promise rejections
export const AsyncErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { reportError } = useErrorHandler();
  
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled Promise Rejection:', event.reason);
      reportError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        'async-boundary'
      );
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, [reportError]);
  
  return <>{children}</>;
};

// Error Fallback Components
export const ComponentErrorFallback: React.FC<{ error?: Error; onRetry?: () => void }> = ({ 
  error, 
  onRetry 
}) => (
  <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
    <Bug className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
    <p className="text-sm text-muted-foreground mb-3">
      {error?.message || 'This component failed to load'}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export const PageErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="text-center">
      <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
      <h1 className="text-xl font-semibold text-foreground mb-2">
        Page Failed to Load
      </h1>
      <p className="text-muted-foreground mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        Reload Page
      </button>
    </div>
  </div>
);