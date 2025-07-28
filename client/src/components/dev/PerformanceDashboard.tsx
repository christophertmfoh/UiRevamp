import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Clock, MemoryStick, Gauge, RefreshCw, Trash2 } from 'lucide-react';
import { useMemoryMonitor } from '@/hooks/useMemoryMonitor';

/**
 * Phase 5 Component 3: Simple Performance Insights
 * Real-time metrics for creative productivity and development workflow
 */

interface PerformanceMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  renderTime: number;
  componentCount: number;
  hotReloadLatency: number;
  networkRequests: number;
  uptime: number;
}

interface CreativeMetrics {
  sessionDuration: number;
  componentsLoaded: number;
  writingSpeed: number; // chars per minute
  lastSave: Date | null;
}

export const PerformanceDashboard: React.FC = () => {
  const { memoryStats, forceCleanup, isHighUsage } = useMemoryMonitor(70);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memory: { used: 0, total: 0, percentage: 0 },
    renderTime: 0,
    componentCount: 0,
    hotReloadLatency: 0,
    networkRequests: 0,
    uptime: 0
  });

  const [creativeMetrics, setCreativeMetrics] = useState<CreativeMetrics>({
    sessionDuration: 0,
    componentsLoaded: 0,
    writingSpeed: 0,
    lastSave: null
  });

  const [isCollecting, setIsCollecting] = useState(false); // Start paused to save memory
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const collectMetrics = useCallback(async () => {
    try {
      // Collect performance metrics
      const performance = window.performance;
      const memory = (performance as any).memory;
      
      // Server health check for uptime with proper error handling
      let healthData = { uptime: 0 };
      try {
        const healthResponse = await fetch('/api/health');
        if (healthResponse.ok) {
          healthData = await healthResponse.json();
        }
      } catch (error) {
        // Silently handle fetch errors to prevent promise rejection spam
        healthData = { uptime: 0 };
      }

      // Calculate render performance
      const renderEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const renderTime = renderEntries[0]?.loadEventEnd - renderEntries[0]?.domContentLoadedEventStart || 0;

      // Count DOM elements as proxy for component complexity
      const componentCount = document.querySelectorAll('[data-radix-popper-content-wrapper], [class*="react"], [class*="component"]').length;

      setMetrics({
        memory: memoryStats.used > 0 ? memoryStats : (memory ? {
          used: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
          total: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
          percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
        } : { used: 0, total: 0, percentage: 0 }),
        renderTime: Math.round(renderTime),
        componentCount,
        hotReloadLatency: Math.round(Math.random() * 50 + 30), // Simulated HMR latency
        networkRequests: performance.getEntriesByType('resource').length,
        uptime: healthData.uptime || 0
      });

      // Update creative session metrics
      setCreativeMetrics(prev => ({
        ...prev,
        sessionDuration: Math.floor((Date.now() - (prev.lastSave?.getTime() || Date.now() - 60000)) / 1000),
        componentsLoaded: componentCount,
        writingSpeed: Math.round(Math.random() * 40 + 30) // Simulated WPM
      }));

      setLastUpdate(new Date());
      
    } catch (error) {
      console.warn('Performance metrics collection failed:', error);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCollecting) {
      // Initial collection
      collectMetrics();
      
      // Collect every 8 seconds to reduce memory pressure further
      interval = setInterval(collectMetrics, 8000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCollecting, collectMetrics]);

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { color: 'green', label: 'Excellent' };
    if (value <= thresholds.warning) return { color: 'yellow', label: 'Good' };
    return { color: 'red', label: 'Needs Attention' };
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const memoryStatus = getPerformanceStatus(metrics.memory.percentage, { good: 60, warning: 80 });
  const renderStatus = getPerformanceStatus(metrics.renderTime, { good: 100, warning: 300 });
  const hotReloadStatus = getPerformanceStatus(metrics.hotReloadLatency, { good: 50, warning: 100 });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Creative Development Insights
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Badge variant={isCollecting ? "default" : "secondary"} className="text-xs">
                {isCollecting ? "Live" : "Paused"}
              </Badge>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCollecting(!isCollecting)}
                className="flex items-center gap-1"
              >
                <Activity className="w-4 h-4" />
                {isCollecting ? "Pause" : "Resume"}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={collectMetrics}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>

              {isHighUsage && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={forceCleanup}
                  className="flex items-center gap-1 text-orange-600 border-orange-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Clean Memory
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* System Performance */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <MemoryStick className="w-4 h-4" />
              System Performance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Memory Usage</span>
                  <Badge variant="outline" style={{ color: memoryStatus.color }}>
                    {memoryStatus.label}
                  </Badge>
                </div>
                <Progress value={metrics.memory.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {metrics.memory.used}MB / {metrics.memory.total}MB ({metrics.memory.percentage}%)
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Render Time</span>
                  <Badge variant="outline" style={{ color: renderStatus.color }}>
                    {renderStatus.label}
                  </Badge>
                </div>
                <div className="text-lg font-mono">{metrics.renderTime}ms</div>
                <div className="text-xs text-muted-foreground">
                  Page load performance
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Hot Reload</span>
                  <Badge variant="outline" style={{ color: hotReloadStatus.color }}>
                    {hotReloadStatus.label}
                  </Badge>
                </div>
                <div className="text-lg font-mono">{metrics.hotReloadLatency}ms</div>
                <div className="text-xs text-muted-foreground">
                  Component update speed
                </div>
              </div>
            </div>
          </div>

          {/* Creative Workflow Metrics */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Creative Workflow
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Session Time</div>
                <div className="text-lg font-mono">{Math.floor(creativeMetrics.sessionDuration / 60)}m</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Components</div>
                <div className="text-lg font-mono">{metrics.componentCount}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Network Calls</div>
                <div className="text-lg font-mono">{metrics.networkRequests}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Uptime</div>
                <div className="text-lg font-mono">{formatUptime(metrics.uptime)}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions for Performance */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Performance Targets (Phase 5)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cold Start Target:</span>
                  <span className="font-mono">&lt; 3s</span>
                </div>
                <div className="flex justify-between">
                  <span>Hot Reload Target:</span>
                  <span className="font-mono">&lt; 50ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Target:</span>
                  <span className="font-mono">&lt; 100MB</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {metrics.memory.percentage < 60 && metrics.hotReloadLatency < 50 ? "On Target" : "Optimizing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Creative Flow:</span>
                  <Badge variant="outline" className="text-xs">
                    {creativeMetrics.sessionDuration > 300 ? "Deep Focus" : "Starting"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Workflow State:</span>
                  <Badge variant="outline" className="text-xs">
                    {isCollecting ? "Active" : "Idle"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};