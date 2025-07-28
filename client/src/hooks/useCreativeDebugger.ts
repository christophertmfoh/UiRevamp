import { useState, useCallback, useEffect } from 'react';

/**
 * Phase 5 Component 4: Creative Debugger Hook
 * Development-friendly debugging with creative context preservation
 */

interface DebugInfo {
  timestamp: Date;
  context: string;
  action: string;
  data?: any;
  performance?: {
    renderTime: number;
    memory: number;
  };
}

interface CreativeSession {
  startTime: Date;
  actions: DebugInfo[];
  errors: Array<{
    error: Error;
    context: string;
    timestamp: Date;
  }>;
  performance: {
    avgRenderTime: number;
    peakMemory: number;
    actionCount: number;
  };
}

export const useCreativeDebugger = (context: string = 'unknown') => {
  const [session, setSession] = useState<CreativeSession>(() => ({
    startTime: new Date(),
    actions: [],
    errors: [],
    performance: {
      avgRenderTime: 0,
      peakMemory: 0,
      actionCount: 0
    }
  }));

  const [isDebugMode, setIsDebugMode] = useState(() => 
    process.env.NODE_ENV === 'development' || 
    localStorage.getItem('creative-debug') === 'true'
  );

  // Log creative action with performance metrics
  const logAction = useCallback((action: string, data?: any) => {
    if (!isDebugMode) return;

    const timestamp = new Date();
    const renderTime = performance.now();
    const memory = (performance as any).memory?.usedJSHeapSize || 0;

    const debugInfo: DebugInfo = {
      timestamp,
      context,
      action,
      data,
      performance: {
        renderTime,
        memory: Math.round(memory / (1024 * 1024)) // Convert to MB
      }
    };

    setSession(prev => {
      const newActions = [...prev.actions, debugInfo].slice(-50); // Keep last 50 actions
      const actionCount = newActions.length;
      const avgRenderTime = newActions.reduce((sum, a) => sum + (a.performance?.renderTime || 0), 0) / actionCount;
      const peakMemory = Math.max(prev.performance.peakMemory, debugInfo.performance?.memory || 0);

      return {
        ...prev,
        actions: newActions,
        performance: {
          avgRenderTime: Math.round(avgRenderTime * 100) / 100,
          peakMemory,
          actionCount
        }
      };
    });

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎨 [${context}] ${action}`, {
        data,
        performance: debugInfo.performance,
        timestamp: timestamp.toLocaleTimeString()
      });
    }
  }, [context, isDebugMode]);

  // Log error with creative context
  const logError = useCallback((error: Error, additionalContext?: string) => {
    const errorInfo = {
      error,
      context: additionalContext || context,
      timestamp: new Date()
    };

    setSession(prev => ({
      ...prev,
      errors: [...prev.errors, errorInfo].slice(-10) // Keep last 10 errors
    }));

    // Enhanced error logging for creative workflow
    console.group('🚨 Creative Workflow Error');
    console.error('Context:', errorInfo.context);
    console.error('Error:', error);
    console.error('Session data:', {
      duration: Date.now() - session.startTime.getTime(),
      actionCount: session.actions.length,
      lastAction: session.actions[session.actions.length - 1]
    });
    console.groupEnd();
  }, [context, session.startTime, session.actions]);

  // Get debug summary for reporting
  const getDebugSummary = useCallback(() => {
    const duration = Date.now() - session.startTime.getTime();
    const durationMinutes = Math.round(duration / 60000);

    return {
      sessionDuration: `${durationMinutes}m`,
      totalActions: session.performance.actionCount,
      averageRenderTime: `${session.performance.avgRenderTime}ms`,
      peakMemory: `${session.performance.peakMemory}MB`,
      errorCount: session.errors.length,
      recentActions: session.actions.slice(-5).map(a => ({
        action: a.action,
        time: a.timestamp.toLocaleTimeString(),
        renderTime: a.performance?.renderTime
      })),
      recentErrors: session.errors.slice(-3).map(e => ({
        message: e.error.message,
        context: e.context,
        time: e.timestamp.toLocaleTimeString()
      }))
    };
  }, [session]);

  // Export session data for debugging
  const exportDebugData = useCallback(() => {
    const debugData = {
      ...getDebugSummary(),
      fullSession: session,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const dataStr = JSON.stringify(debugData, null, 2);
    
    // Copy to clipboard
    navigator.clipboard.writeText(dataStr).then(() => {
      console.log('Debug data copied to clipboard');
    });

    return debugData;
  }, [getDebugSummary, session, context]);

  // Toggle debug mode
  const toggleDebugMode = useCallback(() => {
    const newMode = !isDebugMode;
    setIsDebugMode(newMode);
    localStorage.setItem('creative-debug', newMode.toString());
    logAction('debug_mode_toggled', { enabled: newMode });
  }, [isDebugMode, logAction]);

  // Clear session data
  const clearSession = useCallback(() => {
    setSession({
      startTime: new Date(),
      actions: [],
      errors: [],
      performance: {
        avgRenderTime: 0,
        peakMemory: 0,
        actionCount: 0
      }
    });
    logAction('session_cleared');
  }, [logAction]);

  // Keyboard shortcut for debug panel
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + D to toggle debug mode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        toggleDebugMode();
      }

      // Ctrl/Cmd + Shift + E to export debug data
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        exportDebugData();
      }
    };

    if (isDebugMode) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isDebugMode, toggleDebugMode, exportDebugData]);

  return {
    // State
    isDebugMode,
    session,
    
    // Actions
    logAction,
    logError,
    toggleDebugMode,
    clearSession,
    
    // Utilities
    getDebugSummary,
    exportDebugData,
    
    // Quick access
    sessionDuration: Date.now() - session.startTime.getTime(),
    actionCount: session.performance.actionCount,
    errorCount: session.errors.length,
    avgRenderTime: session.performance.avgRenderTime,
    peakMemory: session.performance.peakMemory
  };
};