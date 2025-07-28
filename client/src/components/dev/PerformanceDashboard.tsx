import React from 'react';
import { usePerformanceStore } from '@/lib/store';
import { useLazyLoadingMetrics } from '@/components/projects/LazyProjectComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';

/**
 * Replit-Optimized Performance Dashboard
 * Simple, development-friendly performance insights for creative workflow
 */
export const PerformanceDashboard: React.FC = () => {
  const performance = usePerformanceStore();
  const { loadedComponents, totalLoaded } = useLazyLoadingMetrics();
  const [isVisible, setIsVisible] = React.useState(false);

  // Simple performance metrics for development
  const metrics = performance.getMetrics();
  
  // Memory usage estimate (simplified for Replit)
  const getMemoryEstimate = () => {
    try {
      // @ts-ignore - Only available in development
      return (performance as any).memory?.usedJSHeapSize 
        ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) 
        : null;
    } catch {
      return null;
    }
  };

  const memoryMB = getMemoryEstimate();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <Button
        variant="outline" 
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 bg-background/80 backdrop-blur-sm"
      >
        <Activity className="w-4 h-4 mr-2" />
        Perf
      </Button>

      {/* Dashboard Panel */}
      {isVisible && (
        <Card className="w-80 bg-background/95 backdrop-blur-sm border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              Fablecraft Performance (Dev)
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3 text-sm">
            {/* Page Load Performance */}
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-2" />
                Page Load
              </span>
              <span className={`font-mono ${metrics.pageLoadTime > 3000 ? 'text-red-500' : 'text-green-500'}`}>
                {metrics.pageLoadTime || '—'}ms
              </span>
            </div>

            {/* Last API Call */}
            <div className="flex justify-between items-center">
              <span>Last API</span>
              <span className="font-mono text-xs">
                {metrics.lastApiCall ? 
                  `${metrics.lastApiCall.endpoint.split('/').pop()} (${metrics.lastApiCall.time}ms)` : 
                  '—'
                }
              </span>
            </div>

            {/* Lazy Loaded Components */}
            <div className="flex justify-between items-center">
              <span>Components</span>
              <span className="font-mono">{totalLoaded} loaded</span>
            </div>

            {/* Memory Usage (if available) */}
            {memoryMB && (
              <div className="flex justify-between items-center">
                <span>Memory</span>
                <span className={`font-mono ${memoryMB > 100 ? 'text-orange-500' : 'text-green-500'}`}>
                  {memoryMB}MB
                </span>
              </div>
            )}

            {/* Error Count */}
            {metrics.errorCount > 0 && (
              <div className="flex justify-between items-center text-red-500">
                <span className="flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-2" />
                  Errors
                </span>
                <span className="font-mono">{metrics.errorCount}</span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-2 border-t space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={performance.logPerformanceInfo}
              >
                📊 Log Full Report
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => {
                  console.clear();
                  console.log('🧹 Performance logs cleared');
                }}
              >
                🧹 Clear Console
              </Button>
            </div>

            {/* Development Tips */}
            <div className="text-xs text-muted-foreground pt-2 border-t">
              💡 <strong>Replit Tips:</strong><br/>
              • Fast hot-reload &lt;500ms<br/>
              • Keep bundles small<br/>
              • Use lazy loading wisely
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceDashboard;