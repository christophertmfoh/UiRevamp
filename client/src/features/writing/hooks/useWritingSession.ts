import { useState, useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';

/**
 * Phase 5 Component 2: Writing Session Management Hook
 * Tracks writing sessions, metrics, and productivity for creative workflow
 */

export interface WritingSessionData {
  id: string;
  startTime: number;
  endTime?: number;
  projectId: string;
  documentId?: string;
  initialWordCount: number;
  finalWordCount: number;
  wordsWritten: number;
  charactersWritten: number;
  duration: number; // milliseconds
  averageWPM: number;
  peakWPM: number;
  sessionType: 'writing' | 'editing' | 'planning';
  breaks: { start: number; end: number }[];
  metadata?: {
    projectTitle?: string;
    documentTitle?: string;
    genre?: string;
    mood?: string;
  };
}

export interface WritingMetrics {
  currentSession: WritingSessionData | null;
  totalWordsToday: number;
  totalTimeToday: number;
  averageWPMToday: number;
  sessionsToday: number;
  currentWPM: number;
  isActive: boolean;
  productivity: 'low' | 'medium' | 'high';
}

interface UseWritingSessionOptions {
  projectId: string;
  documentId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  wpmCalculationWindow?: number; // seconds
  inactivityThreshold?: number; // seconds
}

export const useWritingSession = (options: UseWritingSessionOptions) => {
  const {
    projectId,
    documentId,
    autoSave = true,
    autoSaveInterval = 30000, // 30 seconds
    wpmCalculationWindow = 60, // 1 minute
    inactivityThreshold = 300 // 5 minutes
  } = options;

  const [currentSession, setCurrentSession] = useState<WritingSessionData | null>(null);
  const [metrics, setMetrics] = useState<WritingMetrics>({
    currentSession: null,
    totalWordsToday: 0,
    totalTimeToday: 0,
    averageWPMToday: 0,
    sessionsToday: 0,
    currentWPM: 0,
    isActive: false,
    productivity: 'medium'
  });

  const [content, setContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  // Refs for tracking
  const lastActivityRef = useRef(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const wpmHistoryRef = useRef<{ timestamp: number; wordCount: number }[]>([]);
  const sessionStorageRef = useRef<WritingSessionData[]>([]);

  // Initialize session from localStorage
  useEffect(() => {
    const storedSessions = localStorage.getItem('writing-sessions');
    if (storedSessions) {
      try {
        sessionStorageRef.current = JSON.parse(storedSessions);
        updateTodayMetrics();
      } catch (error) {
        console.warn('Failed to load writing sessions from storage:', error);
      }
    }
  }, []);

  // Start new writing session
  const startSession = useCallback((sessionType: 'writing' | 'editing' | 'planning' = 'writing') => {
    if (currentSession) {
      endSession();
    }

    const wordCount = getWordCount(content);
    const newSession: WritingSessionData = {
      id: nanoid(),
      startTime: Date.now(),
      projectId,
      documentId,
      initialWordCount: wordCount,
      finalWordCount: wordCount,
      wordsWritten: 0,
      charactersWritten: 0,
      duration: 0,
      averageWPM: 0,
      peakWPM: 0,
      sessionType,
      breaks: [],
      metadata: {}
    };

    setCurrentSession(newSession);
    setIsWriting(true);
    lastActivityRef.current = Date.now();
    
    // Reset WPM history
    wpmHistoryRef.current = [{ timestamp: Date.now(), wordCount }];

    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 Started ${sessionType} session:`, newSession.id);
    }

    return newSession;
  }, [content, projectId, documentId, currentSession]);

  // End current session
  const endSession = useCallback(() => {
    if (!currentSession) return null;

    const endTime = Date.now();
    const finalWordCount = getWordCount(content);
    const duration = endTime - currentSession.startTime;
    const wordsWritten = Math.max(0, finalWordCount - currentSession.initialWordCount);
    const charactersWritten = content.length - (currentSession.initialWordCount * 5); // Estimate
    const averageWPM = duration > 0 ? (wordsWritten / (duration / 1000 / 60)) : 0;

    const completedSession: WritingSessionData = {
      ...currentSession,
      endTime,
      finalWordCount,
      wordsWritten,
      charactersWritten,
      duration,
      averageWPM,
      peakWPM: Math.max(currentSession.peakWPM, metrics.currentWPM)
    };

    // Save to storage
    sessionStorageRef.current.push(completedSession);
    if (autoSave) {
      saveSessionsToStorage();
    }

    setCurrentSession(null);
    setIsWriting(false);
    updateTodayMetrics();

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Ended session: ${wordsWritten} words in ${Math.round(duration / 1000 / 60)}m`);
    }

    return completedSession;
  }, [currentSession, content, autoSave, metrics.currentWPM]);

  // Update content and track writing activity
  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
    lastActivityRef.current = Date.now();

    // Start session automatically if writing begins
    if (!currentSession && newContent.trim().length > 0) {
      startSession('writing');
      return;
    }

    // Update current session
    if (currentSession) {
      const wordCount = getWordCount(newContent);
      const now = Date.now();
      
      // Add to WPM history
      wpmHistoryRef.current.push({ timestamp: now, wordCount });
      
      // Keep only recent history for WPM calculation
      const cutoff = now - (wpmCalculationWindow * 1000);
      wpmHistoryRef.current = wpmHistoryRef.current.filter(entry => entry.timestamp > cutoff);

      // Calculate current WPM
      if (wpmHistoryRef.current.length >= 2) {
        const oldest = wpmHistoryRef.current[0];
        const newest = wpmHistoryRef.current[wpmHistoryRef.current.length - 1];
        const timeDiff = (newest.timestamp - oldest.timestamp) / 1000 / 60; // minutes
        const wordDiff = newest.wordCount - oldest.wordCount;
        const currentWPM = timeDiff > 0 ? Math.max(0, wordDiff / timeDiff) : 0;

        setMetrics(prev => ({
          ...prev,
          currentWPM: Math.round(currentWPM),
          isActive: true
        }));
      }

      // Update session data
      setCurrentSession(prev => prev ? {
        ...prev,
        finalWordCount: wordCount,
        wordsWritten: Math.max(0, wordCount - prev.initialWordCount),
        duration: now - prev.startTime,
        peakWPM: Math.max(prev.peakWPM, metrics.currentWPM)
      } : null);
    }

    // Reset inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setIsWriting(false);
      setMetrics(prev => ({ ...prev, isActive: false, currentWPM: 0 }));
      
      if (currentSession && Date.now() - lastActivityRef.current > inactivityThreshold * 1000) {
        // Add break period to session
        const breakStart = lastActivityRef.current;
        const breakEnd = Date.now();
        
        setCurrentSession(prev => prev ? {
          ...prev,
          breaks: [...prev.breaks, { start: breakStart, end: breakEnd }]
        } : null);
      }
    }, inactivityThreshold * 1000);
  }, [currentSession, startSession, wpmCalculationWindow, inactivityThreshold, metrics.currentWPM]);

  // Auto-save sessions
  useEffect(() => {
    if (autoSave && autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    if (autoSave) {
      autoSaveTimerRef.current = setInterval(() => {
        saveSessionsToStorage();
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [autoSave, autoSaveInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Helper functions
  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const saveSessionsToStorage = () => {
    try {
      localStorage.setItem('writing-sessions', JSON.stringify(sessionStorageRef.current));
    } catch (error) {
      console.warn('Failed to save writing sessions to storage:', error);
    }
  };

  const updateTodayMetrics = () => {
    const today = new Date().toDateString();
    const todaySessions = sessionStorageRef.current.filter(
      session => new Date(session.startTime).toDateString() === today
    );

    const totalWordsToday = todaySessions.reduce((sum, session) => sum + session.wordsWritten, 0);
    const totalTimeToday = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    const averageWPMToday = todaySessions.length > 0 
      ? todaySessions.reduce((sum, session) => sum + session.averageWPM, 0) / todaySessions.length
      : 0;

    const productivity = averageWPMToday >= 20 ? 'high' : averageWPMToday >= 10 ? 'medium' : 'low';

    setMetrics(prev => ({
      ...prev,
      totalWordsToday,
      totalTimeToday,
      averageWPMToday: Math.round(averageWPMToday),
      sessionsToday: todaySessions.length,
      productivity
    }));
  };

  // Public API
  return {
    // Session management
    startSession,
    endSession,
    currentSession,
    
    // Content tracking
    content,
    updateContent,
    
    // Metrics
    metrics,
    isWriting,
    
    // Session history
    getAllSessions: () => sessionStorageRef.current,
    getTodaySessions: () => {
      const today = new Date().toDateString();
      return sessionStorageRef.current.filter(
        session => new Date(session.startTime).toDateString() === today
      );
    },
    
    // Utilities
    clearAllSessions: () => {
      sessionStorageRef.current = [];
      saveSessionsToStorage();
      updateTodayMetrics();
    },
    
    exportSessions: () => {
      return JSON.stringify(sessionStorageRef.current, null, 2);
    }
  };
};

export default useWritingSession;