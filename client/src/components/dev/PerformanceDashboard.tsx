import React from 'react';
import { usePerformanceStore } from '@/lib/store';
import { useLazyLoadingMetrics } from '@/components/projects/LazyProjectComponents';
import { useReplitBackup } from '@/lib/backup/replitBackup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Clock, Zap, AlertTriangle, Download, Upload, Database, Wifi, Save, FileText } from 'lucide-react';

/**
 * Phase 3: Complete Replit-Native Development Dashboard
 * Integrated performance monitoring, backup system, and creative workflow tools
 */
export const PerformanceDashboard: React.FC = () => {
  const performance = usePerformanceStore();
  const { loadedComponents, totalLoaded } = useLazyLoadingMetrics();
  const backup = useReplitBackup();
  const [isVisible, setIsVisible] = React.useState(false);
  const [healthStatus, setHealthStatus] = React.useState<'healthy' | 'warning' | 'error'>('healthy');
  const [lastHealthCheck, setLastHealthCheck] = React.useState<Date | null>(null);
  const [activeTab, setActiveTab] = React.useState<'performance' | 'backup' | 'system'>('performance');

  // Simple performance metrics for development
  const metrics = performance.getMetrics();
  
  // Enhanced memory tracking for Replit
  const getSystemInfo = () => {
    try {
      const nav = navigator as any;
      return {
        memory: nav.memory ? {
          used: Math.round(nav.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(nav.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(nav.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null,
        connection: nav.connection ? {
          type: nav.connection.effectiveType || 'unknown',
          downlink: nav.connection.downlink || 0
        } : null,
        cores: nav.hardwareConcurrency || 'unknown'
      };
    } catch {
      return { memory: null, connection: null, cores: 'unknown' };
    }
  };

  const systemInfo = getSystemInfo();

  // Health check function (Phase 3 replacement for Prometheus)
  const performHealthCheck = async () => {
    try {
      const start = Date.now();
      const response = await fetch('/api/health');
      const duration = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(duration > 1000 ? 'warning' : 'healthy');
        setLastHealthCheck(new Date());
        console.log('🏥 Health Check:', { status: 'healthy', duration, data });
      } else {
        setHealthStatus('error');
        console.warn('🚨 Health Check Failed:', response.status);
      }
    } catch (error) {
      setHealthStatus('error');
      console.error('💥 Health Check Error:', error);
    }
  };

  // Auto health check every 30 seconds in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      performHealthCheck();
      const interval = setInterval(performHealthCheck, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Export performance data (Phase 3 creative workflow feature)
  const exportPerformanceData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics,
      systemInfo,
      healthStatus,
      loadedComponents,
      errors: metrics.errorCount,
      session: {
        duration: Date.now() - (performance.getMetrics().pageLoadTime || Date.now()),
        components: totalLoaded
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fablecraft-performance-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📊 Performance data exported:', exportData);
  };

  // File input handler for backup import
  const handleBackupImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      backup.importBackup(file).then((backupData) => {
        console.log('📥 Backup imported successfully:', backupData);
      }).catch((error) => {
        console.error('🚨 Backup import failed:', error);
      });
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getHealthColor = () => {
    switch (healthStatus) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div className="space-y-3">
            {/* Performance Metrics */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  Page Load
                </span>
                <span className={`font-mono ${metrics.pageLoadTime > 3000 ? 'text-red-500' : 'text-green-500'}`}>
                  {metrics.pageLoadTime || '—'}ms
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Database className="w-3 h-3 mr-2" />
                  Last API
                </span>
                <span className="font-mono text-xs">
                  {metrics.lastApiCall ? 
                    `${metrics.lastApiCall.endpoint.split('/').pop()} (${metrics.lastApiCall.time}ms)` : 
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Components</span>
                <span className="font-mono">{totalLoaded} loaded</span>
              </div>
            </div>

            {/* Health Status */}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span>Server Health</span>
                <span className={`font-mono text-xs ${getHealthColor()}`}>
                  {healthStatus}
                </span>
              </div>
              {lastHealthCheck && (
                <div className="text-xs text-muted-foreground">
                  Last check: {lastHealthCheck.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Error Tracking */}
            {metrics.errorCount > 0 && (
              <div className="flex justify-between items-center text-red-500 pt-2 border-t">
                <span className="flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-2" />
                  Errors
                </span>
                <span className="font-mono">{metrics.errorCount}</span>
              </div>
            )}
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-3">
            {/* Backup Information */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Stored Backups</span>
                <span className="font-mono">{backup.storageInfo.count}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Storage Used</span>
                <span className="font-mono text-xs">{backup.storageInfo.size}KB</span>
              </div>

              {backup.storageInfo.newest && (
                <div className="text-xs text-muted-foreground">
                  Latest: {new Date(backup.storageInfo.newest).toLocaleString()}
                </div>
              )}
            </div>

            {/* Backup Actions */}
            <div className="pt-2 border-t space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => backup.createBackup()}
                  disabled={backup.isLoading}
                >
                  <Save className="w-3 h-3 mr-1" />
                  Create
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => backup.exportBackup()}
                  disabled={backup.isLoading}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => document.getElementById('backup-import')?.click()}
                  disabled={backup.isLoading}
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Import
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => backup.clearOldBackups(3)}
                  disabled={backup.isLoading}
                >
                  🧹 Clean
                </Button>
              </div>

              <input
                id="backup-import"
                type="file"
                accept=".json"
                onChange={handleBackupImport}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-3">
            {/* System Information */}
            {systemInfo.memory && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-semibold">Memory Usage</div>
                <div className="flex justify-between items-center">
                  <span>Used / Limit</span>
                  <span className={`font-mono text-xs ${
                    systemInfo.memory.used > systemInfo.memory.limit * 0.8 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {systemInfo.memory.used}MB / {systemInfo.memory.limit}MB
                  </span>
                </div>
                
                {systemInfo.connection && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Wifi className="w-3 h-3 mr-1" />
                      Network
                    </span>
                    <span className="font-mono text-xs">
                      {systemInfo.connection.type} ({systemInfo.connection.downlink}Mbps)
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>CPU Cores</span>
                  <span className="font-mono text-xs">{systemInfo.cores}</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-2 border-t space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={performHealthCheck}
                >
                  🏥 Health
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    console.clear();
                    console.log('🧹 Console cleared');
                  }}
                >
                  🧹 Clear
                </Button>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={exportPerformanceData}
              >
                <FileText className="w-3 h-3 mr-1" />
                Export Session Data
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Enhanced Toggle Button with Health Indicator */}
      <Button
        variant="outline" 
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 bg-background/80 backdrop-blur-sm relative"
      >
        <Activity className="w-4 h-4 mr-2" />
        Dev Tools
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          healthStatus === 'healthy' ? 'bg-green-500' : 
          healthStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
      </Button>

      {/* Enhanced Dashboard Panel */}
      {isVisible && (
        <Card className="w-96 bg-background/95 backdrop-blur-sm border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                Fablecraft Dev Dashboard v3.0
              </span>
              <span className={`text-xs ${getHealthColor()}`}>
                {healthStatus.toUpperCase()}
              </span>
            </CardTitle>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-2">
              {[
                { id: 'performance', label: 'Perf', icon: Activity },
                { id: 'backup', label: 'Backup', icon: Save },
                { id: 'system', label: 'System', icon: Database }
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={activeTab === id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(id as any)}
                  className="text-xs h-6 px-2"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="text-sm">
            {renderTabContent()}

            {/* Phase 3 Tips */}
            <div className="text-xs text-muted-foreground pt-3 border-t">
              💡 <strong>Phase 3 Complete:</strong><br/>
              • Replit-native performance monitoring<br/>
              • localStorage backup & export system<br/>
              • Creative workflow optimization<br/>
              • Zero enterprise overhead
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceDashboard;