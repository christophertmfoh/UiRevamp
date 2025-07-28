import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Bug, FileText, Clock } from 'lucide-react';

/**
 * Phase 5 Component 4: Creative Error Boundary
 * Writer-centric error handling with creative context preservation
 */

interface Props {
  children: ReactNode;
  context?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  timestamp: Date | null;
  recoveryAttempts: number;
}

export class CreativeErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      timestamp: null,
      recoveryAttempts: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      timestamp: new Date()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
      timestamp: new Date()
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Log for development debugging
    if (process.env.NODE_ENV === 'development') {
      console.group('🎨 Creative Error Boundary - Context Preserved');
      console.error('Error in context:', this.props.context);
      console.error('Error details:', error);
      console.error('Component stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Attempt automatic recovery for common issues
    this.attemptAutoRecovery(error);
  }

  private attemptAutoRecovery = (error: Error) => {
    const { recoveryAttempts } = this.state;
    
    // Limit recovery attempts to prevent infinite loops
    if (recoveryAttempts >= 3) return;

    // Auto-recovery for common creative workflow issues
    const isRecoverableError = 
      error.message.includes('ResizeObserver') ||
      error.message.includes('ChunkLoadError') ||
      error.message.includes('Loading CSS chunk');

    if (isRecoverableError) {
      this.retryTimeout = setTimeout(() => {
        this.handleRetry();
      }, 2000);
    }
  };

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      timestamp: null,
      recoveryAttempts: prevState.recoveryAttempts + 1
    }));

    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReportIssue = () => {
    const { error, errorInfo } = this.state;
    const errorReport = {
      context: this.props.context,
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: this.state.timestamp?.toISOString(),
      userAgent: navigator.userAgent
    };

    // Copy to clipboard for easy reporting
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    console.log('Error report copied to clipboard:', errorReport);
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, timestamp, recoveryAttempts } = this.state;
      const isAutoRecovering = this.retryTimeout !== null;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Creative Flow Interrupted</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Don't worry - your work is preserved
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Context Information */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Creative Context
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Location:</span>
                    <div className="font-mono text-xs bg-muted p-2 rounded">
                      {this.props.context || 'Writing Interface'}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Time:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timestamp?.toLocaleTimeString() || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Technical Details
                </h3>
                
                <div className="space-y-2">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Error Message:</div>
                    <div className="font-mono text-sm">
                      {error?.message || 'Unknown error occurred'}
                    </div>
                  </div>
                  
                  {recoveryAttempts > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Recovery attempts: {recoveryAttempts}/3
                    </Badge>
                  )}
                </div>
              </div>

              {/* Recovery Actions */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Quick Recovery</h3>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={this.handleRetry}
                    disabled={isAutoRecovering}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isAutoRecovering ? 'animate-spin' : ''}`} />
                    {isAutoRecovering ? 'Auto-recovering...' : 'Try Again'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={this.handleReload}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Restart App
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={this.handleReportIssue}
                    className="flex items-center gap-2"
                  >
                    <Bug className="w-4 h-4" />
                    Copy Debug Info
                  </Button>
                </div>
              </div>

              {/* Creative Workflow Tips */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-2">
                  💡 Creative Flow Tips
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Your writing progress is automatically saved</li>
                  <li>• Character data and projects are preserved</li>
                  <li>• Try refreshing if the error persists</li>
                  <li>• Check the browser console for more details</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}