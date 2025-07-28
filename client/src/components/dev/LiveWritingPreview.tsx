import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Clock, TrendingUp, Target } from 'lucide-react';

/**
 * Phase 5 Component 2: Live Writing Preview System
 * Real-time writing metrics and session tracking for creative workflow
 */

interface WritingSession {
  id: string;
  startTime: number;
  endTime?: number;
  wordCount: number;
  characterCount: number;
  wordsPerMinute: number;
  totalTime: number;
  projectId: string;
  documentId?: string;
}

interface WritingMetrics {
  currentSession: WritingSession | null;
  totalWords: number;
  totalCharacters: number;
  averageWPM: number;
  sessionDuration: number;
  dailyGoal: number;
  dailyProgress: number;
  velocity: number[]; // Recent WPM measurements
}

interface LiveWritingPreviewProps {
  projectId: string;
  documentId?: string;
  content: string;
  onMetricsUpdate?: (metrics: WritingMetrics) => void;
  dailyGoal?: number;
}

export const LiveWritingPreview: React.FC<LiveWritingPreviewProps> = ({
  projectId,
  documentId,
  content,
  onMetricsUpdate,
  dailyGoal = 1000
}) => {
  const [metrics, setMetrics] = useState<WritingMetrics>({
    currentSession: null,
    totalWords: 0,
    totalCharacters: 0,
    averageWPM: 0,
    sessionDuration: 0,
    dailyGoal,
    dailyProgress: 0,
    velocity: []
  });

  const [isWriting, setIsWriting] = useState(false);
  const sessionRef = useRef<WritingSession | null>(null);
  const lastContentRef = useRef(content);
  const lastUpdateRef = useRef(Date.now());
  const velocityTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize or update writing session
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = content.length;

    // Start new session if writing begins
    if (wordCount > 0 && !sessionRef.current) {
      sessionRef.current = {
        id: `session-${Date.now()}`,
        startTime: Date.now(),
        wordCount: 0,
        characterCount: 0,
        wordsPerMinute: 0,
        totalTime: 0,
        projectId,
        documentId
      };
    }

    // Update current session
    if (sessionRef.current) {
      const now = Date.now();
      const sessionDuration = (now - sessionRef.current.startTime) / 1000 / 60; // minutes
      const wordsWritten = Math.max(0, wordCount - (metrics.totalWords - sessionRef.current.wordCount));
      const currentWPM = sessionDuration > 0 ? wordsWritten / sessionDuration : 0;

      sessionRef.current = {
        ...sessionRef.current,
        wordCount: wordsWritten,
        characterCount: characterCount,
        wordsPerMinute: currentWPM,
        totalTime: sessionDuration
      };
    }

    // Calculate metrics
    const newMetrics: WritingMetrics = {
      currentSession: sessionRef.current,
      totalWords: wordCount,
      totalCharacters: characterCount,
      averageWPM: sessionRef.current?.wordsPerMinute || 0,
      sessionDuration: sessionRef.current?.totalTime || 0,
      dailyGoal,
      dailyProgress: Math.min(100, (wordCount / dailyGoal) * 100),
      velocity: [...metrics.velocity, sessionRef.current?.wordsPerMinute || 0].slice(-10)
    };

    setMetrics(newMetrics);
    onMetricsUpdate?.(newMetrics);

    // Detect active writing
    if (content !== lastContentRef.current) {
      setIsWriting(true);
      lastContentRef.current = content;
      lastUpdateRef.current = Date.now();

      // Clear existing timeout
      if (velocityTimeoutRef.current) {
        clearTimeout(velocityTimeoutRef.current);
      }

      // Set writing to false after 3 seconds of inactivity
      velocityTimeoutRef.current = setTimeout(() => {
        setIsWriting(false);
      }, 3000);
    }
  }, [content, projectId, documentId, dailyGoal, onMetricsUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (velocityTimeoutRef.current) {
        clearTimeout(velocityTimeoutRef.current);
      }
    };
  }, []);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getVelocityTrend = (): 'up' | 'down' | 'stable' => {
    if (metrics.velocity.length < 2) return 'stable';
    
    const recent = metrics.velocity.slice(-3);
    const older = metrics.velocity.slice(-6, -3);
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'up';
    if (recentAvg < olderAvg * 0.9) return 'down';
    return 'stable';
  };

  const velocityTrend = getVelocityTrend();

  return (
    <Card className="w-full max-w-md border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="w-5 h-5" />
          Live Writing Session
          {isWriting && (
            <Badge variant="default" className="animate-pulse">
              Writing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Real-time metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.totalWords.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Words</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(metrics.averageWPM)}
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              WPM
              {velocityTrend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
              {velocityTrend === 'down' && <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
            </div>
          </div>
        </div>

        {/* Session duration */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>Session: {formatDuration(metrics.sessionDuration)}</span>
        </div>

        {/* Daily progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Daily Goal
            </span>
            <span>{metrics.totalWords.toLocaleString()} / {dailyGoal.toLocaleString()}</span>
          </div>
          <Progress value={metrics.dailyProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {metrics.dailyProgress >= 100 ? 'Goal achieved! 🎉' : `${Math.round(100 - metrics.dailyProgress)}% to go`}
          </div>
        </div>

        {/* Writing velocity chart (simplified) */}
        {metrics.velocity.length > 1 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Writing Velocity</div>
            <div className="flex items-end gap-1 h-8">
              {metrics.velocity.slice(-8).map((wpm, index) => (
                <div
                  key={index}
                  className="bg-blue-500 rounded-t flex-1 min-w-[2px]"
                  style={{ 
                    height: `${Math.max(4, (wpm / Math.max(...metrics.velocity, 1)) * 100)}%`,
                    opacity: 0.3 + (index / metrics.velocity.length) * 0.7
                  }}
                  title={`${Math.round(wpm)} WPM`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Recent writing velocity trend
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="pt-2 border-t border-border/20">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Characters: {metrics.totalCharacters.toLocaleString()}</div>
            <div>Avg per word: {metrics.totalWords > 0 ? Math.round(metrics.totalCharacters / metrics.totalWords) : 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Compact version for dashboard integration
 */
export const CompactWritingPreview: React.FC<{ 
  metrics: WritingMetrics;
  className?: string;
}> = ({ metrics, className }) => {
  return (
    <div className={`flex items-center gap-4 p-3 bg-card rounded-lg border ${className}`}>
      <div className="text-center">
        <div className="text-lg font-bold text-blue-600">{metrics.totalWords}</div>
        <div className="text-xs text-muted-foreground">Words</div>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-green-600">{Math.round(metrics.averageWPM)}</div>
        <div className="text-xs text-muted-foreground">WPM</div>
      </div>
      
      <div className="flex-1">
        <Progress value={metrics.dailyProgress} className="h-2" />
        <div className="text-xs text-muted-foreground mt-1">
          {Math.round(metrics.dailyProgress)}% of daily goal
        </div>
      </div>
    </div>
  );
};