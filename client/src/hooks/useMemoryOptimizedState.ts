import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Memory Optimized State Hook
 * Reduces memory footprint for large state objects
 */

export function useMemoryOptimizedState<T>(
  initialValue: T,
  maxHistorySize: number = 5
) {
  const [state, setState] = useState<T>(initialValue);
  const historyRef = useRef<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounced state updates to prevent excessive re-renders
  const debouncedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(prevState => {
        const nextState = typeof newState === 'function' 
          ? (newState as (prev: T) => T)(prevState) 
          : newState;

        // Add to history but keep it small
        historyRef.current = [
          ...historyRef.current.slice(-(maxHistorySize - 1)),
          prevState
        ];

        return nextState;
      });
    }, 50);
  }, [maxHistorySize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      historyRef.current = [];
    };
  }, []);

  return [state, debouncedSetState] as const;
}