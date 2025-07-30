import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreativeErrorBoundary } from '@/components/dev/CreativeErrorBoundary';
import { CreativeDebugPanel } from '@/components/dev/CreativeDebugPanel';
import { WritingEditor } from '@/components/writing/WritingEditor';
import { StoryOutlineEditor } from '@/components/writing/StoryOutlineEditor';
import { useCreativeDebugger } from '@/hooks/useCreativeDebugger';
import { AlertTriangle, Bug, Zap, TestTube } from 'lucide-react';

/**
 * Phase 5 Component 4: Debug Demo Page
 * Showcase for development-friendly debugging tools
 */

const ErrorTrigger: React.FC = () => {
  const { logAction } = useCreativeDebugger('error-trigger');
  
  const triggerError = () => {
    logAction('intentional_error_triggered');
    throw new Error('Intentional test error for debugging demonstration');
  };

  return (
    <Button variant="destructive" onClick={triggerError}>
      <AlertTriangle className="w-4 h-4 mr-2" />
      Trigger Test Error
    </Button>
  );
};

export const DebugDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'editor' | 'outline' | 'error'>('editor');
  const { logAction, getDebugSummary, sessionDuration } = useCreativeDebugger('debug-demo');

  const handleDemoChange = (demo: typeof activeDemo) => {
    setActiveDemo(demo);
    logAction('demo_switched', { demo });
  };

  const summary = getDebugSummary();

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-6 h-6" />
              Phase 5 Component 4: Creative Development Debugging
            </CardTitle>
            <p className="text-muted-foreground">
              Writer-centric error handling and creative context preservation
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Session Duration</div>
                <div className="font-mono text-lg">{Math.floor(sessionDuration / 60000)}m</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total Actions</div>
                <div className="font-mono text-lg">{summary.totalActions}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Error Count</div>
                <div className="font-mono text-lg">{summary.errorCount}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Avg Render</div>
                <div className="font-mono text-lg">{summary.averageRenderTime}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={activeDemo === 'editor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDemoChange('editor')}
              >
                Writing Editor
              </Button>
              
              <Button
                variant={activeDemo === 'outline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDemoChange('outline')}
              >
                Story Outline
              </Button>
              
              <Button
                variant={activeDemo === 'error' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDemoChange('error')}
              >
                Error Testing
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Press <Badge variant="outline" className="text-xs font-mono">Ctrl+Shift+D</Badge> to toggle debug mode,{' '}
              <Badge variant="outline" className="text-xs font-mono">Ctrl+Shift+E</Badge> to export debug data
            </div>
          </CardContent>
        </Card>

        {/* Demo Content */}
        <CreativeErrorBoundary 
          context={`debug-demo-${activeDemo}`}
          onError={(error, errorInfo) => {
            console.log('Creative Error Boundary caught:', { error, errorInfo });
          }}
        >
          {activeDemo === 'editor' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Writing Editor with Debug Integration
              </h2>
              
              <WritingEditor
                projectId="debug-demo-project"
                documentId="demo-doc"
                placeholder="Start writing to see debug actions being logged..."
                onSave={(content) => {
                  console.log('Content saved:', content.length, 'characters');
                }}
              />
            </div>
          )}

          {activeDemo === 'outline' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Story Outline Editor
              </h2>
              
              <StoryOutlineEditor
                projectId="debug-demo-project"
                outlineId="demo-outline"
                onStructureChange={(structure) => {
                  console.log('Outline structure changed:', structure.length, 'items');
                }}
              />
            </div>
          )}

          {activeDemo === 'error' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Error Handling Demo
              </h2>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Error Boundary Testing</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Test the creative error boundary with writer-friendly error messages
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Test Error Recovery</h4>
                      <p className="text-sm text-muted-foreground">
                        Trigger an error to see the creative error boundary in action
                      </p>
                      <CreativeErrorBoundary context="error-test-zone">
                        <ErrorTrigger />
                      </CreativeErrorBoundary>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Debug Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Automatic error recovery for common issues</li>
                        <li>• Creative context preservation</li>
                        <li>• One-click debug data export</li>
                        <li>• Real-time action logging</li>
                        <li>• Writer-friendly error messages</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      💡 Development Tips
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Check browser console for detailed error logs</li>
                      <li>• Debug panel shows real-time performance metrics</li>
                      <li>• Error boundaries preserve creative work during failures</li>
                      <li>• All creative actions are automatically logged</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CreativeErrorBoundary>

        {/* Debug Panel - Always visible when debug mode is on */}
        <CreativeDebugPanel context={`debug-demo-${activeDemo}`} />
      </div>
    </div>
  );
};