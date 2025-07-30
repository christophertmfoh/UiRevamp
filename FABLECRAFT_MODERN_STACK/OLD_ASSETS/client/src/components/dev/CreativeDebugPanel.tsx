import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Bug, 
  Activity, 
  Clock, 
  MemoryStick, 
  Download,
  Trash2,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCreativeDebugger } from '@/hooks/useCreativeDebugger';

/**
 * Phase 5 Component 4: Creative Debug Panel
 * Visual debugging interface for creative development workflow
 */

interface CreativeDebugPanelProps {
  context?: string;
  collapsed?: boolean;
}

export const CreativeDebugPanel: React.FC<CreativeDebugPanelProps> = ({ 
  context = 'debug-panel',
  collapsed = false 
}) => {
  const {
    isDebugMode,
    session,
    toggleDebugMode,
    clearSession,
    getDebugSummary,
    exportDebugData,
    sessionDuration,
    actionCount,
    errorCount,
    avgRenderTime,
    peakMemory
  } = useCreativeDebugger(context);

  const [isExpanded, setIsExpanded] = useState(!collapsed);
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'errors'>('overview');

  const summary = getDebugSummary();
  
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (!isDebugMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleDebugMode}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Creative Debug
                  {isExpanded ? 
                    <ChevronDown className="w-3 h-3" /> : 
                    <ChevronRight className="w-3 h-3" />
                  }
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {errorCount > 0 ? `${errorCount} errors` : 'Healthy'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDebugMode();
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <EyeOff className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {!isExpanded && (
                <div className="text-xs text-muted-foreground">
                  {actionCount} actions • {formatDuration(sessionDuration)}
                </div>
              )}
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Session: {formatDuration(sessionDuration)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Actions: {actionCount}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <MemoryStick className="w-3 h-3" />
                    Peak: {peakMemory}MB
                  </div>
                  <div className="flex items-center gap-1">
                    <Bug className="w-3 h-3" />
                    Errors: {errorCount}
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {(['overview', 'actions', 'errors'] as const).map((tab) => (
                  <Button
                    key={tab}
                    size="sm"
                    variant={activeTab === tab ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 h-7 text-xs capitalize"
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-32">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Avg Render:</span>
                        <span className="font-mono">{avgRenderTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Context:</span>
                        <span className="font-mono">{context}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={errorCount > 0 ? "destructive" : "secondary"} className="text-xs">
                          {errorCount > 0 ? `${errorCount} errors` : 'Stable'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Press Ctrl+Shift+D to toggle debug mode
                      <br />
                      Press Ctrl+Shift+E to export data
                    </div>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {summary.recentActions.length > 0 ? (
                        summary.recentActions.map((action, index) => (
                          <div key={index} className="text-xs p-2 bg-muted/50 rounded">
                            <div className="font-medium">{action.action}</div>
                            <div className="text-muted-foreground flex justify-between">
                              <span>{action.time}</span>
                              {action.renderTime && (
                                <span>{action.renderTime.toFixed(1)}ms</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground text-center py-4">
                          No recent actions
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}

                {activeTab === 'errors' && (
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {summary.recentErrors.length > 0 ? (
                        summary.recentErrors.map((error, index) => (
                          <div key={index} className="text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <div className="font-medium text-red-700 dark:text-red-300">
                              {error.message}
                            </div>
                            <div className="text-red-600 dark:text-red-400 flex justify-between">
                              <span>{error.context}</span>
                              <span>{error.time}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground text-center py-4">
                          No errors - great job!
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportDebugData}
                  className="flex-1 h-7 text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSession}
                  className="flex-1 h-7 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};