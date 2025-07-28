import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageSquare } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean; // If true, only catches errors from immediate children
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorReport = {
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    alert('Error details copied to clipboard. Please share with support.');
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
          onReportError={this.handleReportError}
          isolate={this.props.isolate}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  onRetry: () => void;
  onReload: () => void;
  onGoHome: () => void;
  onReportError: () => void;
  isolate?: boolean;
}

function ErrorFallback({
  error,
  errorInfo,
  onRetry,
  onReload,
  onGoHome,
  onReportError,
  isolate = false
}: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className={`${isolate ? 'p-4' : 'min-h-screen'} flex items-center justify-center bg-background`}>
      <div className="max-w-2xl mx-auto text-center space-y-6 p-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {isolate ? 'Component Error' : 'Something went wrong'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isolate 
              ? 'This component encountered an error and could not be displayed.'
              : 'We apologize for the inconvenience. The application encountered an unexpected error.'
            }
          </p>
        </div>

        {/* Error Details (Development only) */}
        {isDevelopment && error && (
          <div className="text-left bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-foreground">Error Details:</h3>
            <p className="text-sm text-destructive font-mono break-all">
              {error.message}
            </p>
            {error.stack && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">
                  Stack Trace
                </summary>
                <pre className="mt-2 whitespace-pre-wrap font-mono">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          {!isolate && (
            <>
              <button
                onClick={onReload}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>

              <button
                onClick={onGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent/10 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </>
          )}

          <button
            onClick={onReportError}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent/10 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Report Issue
          </button>
        </div>

        {/* Additional Help */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>If this problem persists, please try:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Refreshing the page</li>
            <li>Clearing your browser cache</li>
            <li>Disabling browser extensions</li>
            <li>Contacting support if the issue continues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Hook for programmatic error handling
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error('Manual error reported:', error, errorInfo);
    
    // In production, report to error service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
    
    // Could also trigger toast notification
    throw error; // Re-throw to trigger error boundary
  };
}

// Async error boundary wrapper for suspense/async components
export function AsyncErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      <React.Suspense fallback={<div className="loading-skeleton h-32 w-full rounded-lg" />}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}