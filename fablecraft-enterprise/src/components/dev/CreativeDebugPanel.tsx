import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bug, 
  Download,
  Trash2,
  ChevronRight,
  ChevronDown,
  EyeOff
} from 'lucide-react'
import { useCreativeDebugger } from '@/hooks/useCreativeDebugger'

/**
 * Creative Debug Panel
 * Visual debugging interface for development workflow
 */

interface CreativeDebugPanelProps {
  context?: string
  collapsed?: boolean
}

export function CreativeDebugPanel({ 
  context = 'debug-panel',
  collapsed = false 
}: CreativeDebugPanelProps) {
  const {
    isDebugMode,
    session,
    toggleDebugMode,
    clearSession,
    exportDebugData,
    sessionDuration,
    actionCount,
    errorCount,
  } = useCreativeDebugger(context)

  const [isExpanded, setIsExpanded] = useState(!collapsed)

  if (!isDebugMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDebugMode}
          className="shadow-lg"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-xl border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Creative Debug
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleDebugMode()
                }}
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            {/* Overview Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{actionCount}</div>
                <div className="text-xs text-muted-foreground">Actions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-destructive">{errorCount}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-muted-foreground">
                  {Math.round(sessionDuration / 1000)}s
                </div>
                <div className="text-xs text-muted-foreground">Session</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={exportDebugData}
                className="flex-1"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSession}
                className="flex-1"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>

            {/* Recent Actions */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Recent Actions</div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {session.actions.slice(-5).map((action, index) => (
                  <div key={index} className="text-xs p-2 rounded bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{action.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {action.context}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      {action.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">
              Press Ctrl+Shift+D to toggle debug mode
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}