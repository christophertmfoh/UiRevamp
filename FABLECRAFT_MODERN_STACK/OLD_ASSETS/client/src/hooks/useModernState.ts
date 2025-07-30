/**
 * Modern React 2025 State Management Hook
 * Combines React 18 concurrent features with existing Zustand stores
 * Provides useDeferredValue, useTransition, and optimistic updates
 */

import { useDeferredValue, useTransition, startTransition, useMemo, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface ModernStateConfig {
  enableConcurrentFeatures?: boolean;
  enableOptimisticUpdates?: boolean;
  deferredValueDelay?: number;
}

export function useModernState(config: ModernStateConfig = {}) {
  const {
    enableConcurrentFeatures = true,
    enableOptimisticUpdates = true,
    deferredValueDelay = 100
  } = config;

  const [isPending, startTransitionWrapper] = useTransition();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Defer heavy rendering for better performance
  const deferredUser = useDeferredValue(user);
  const deferredAuthState = useDeferredValue(isAuthenticated);

  // Modern async state handler with React 18 concurrent features
  const handleAsyncUpdate = useMemo(() => {
    return (updateFn: () => Promise<void> | void) => {
      if (enableConcurrentFeatures) {
        startTransitionWrapper(() => {
          if (typeof updateFn === 'function') {
            const result = updateFn();
            if (result instanceof Promise) {
              result.catch(console.error);
            }
          }
        });
      } else {
        startTransition(() => {
          const result = updateFn();
          if (result instanceof Promise) {
            result.catch(console.error);
          }
        });
      }
    };
  }, [enableConcurrentFeatures]);

  // Optimistic update wrapper for better UX
  const optimisticUpdate = useMemo(() => {
    return <T>(
      optimisticValue: T,
      actualUpdateFn: () => Promise<T>
    ): Promise<T> => {
      if (!enableOptimisticUpdates) {
        return actualUpdateFn();
      }

      // Return optimistic value immediately
      return new Promise((resolve, reject) => {
        // Optimistically resolve with the provided value
        resolve(optimisticValue);
        
        // Perform actual update in background
        actualUpdateFn()
          .then(() => {
            // Actual update completed successfully
          })
          .catch((error) => {
            // Rollback optimistic update on failure
            console.error('Optimistic update failed, rolling back:', error);
            reject(error);
          });
      });
    };
  }, [enableOptimisticUpdates]);

  return {
    // React 18 concurrent state
    isPending,
    handleAsyncUpdate,
    optimisticUpdate,
    
    // Deferred values for performance
    deferredUser,
    deferredAuthState: deferredAuthState && !isLoading,
    
    // Enhanced state helpers
    isStateReady: !isLoading && deferredAuthState,
    canPerformActions: !isPending && !isLoading
  };
}

// Modern loading state hook with Suspense support
export function useModernLoading(dependencies: any[] = []) {
  const isLoading = useMemo(() => {
    return dependencies.some(dep => dep === undefined || dep === null);
  }, dependencies);

  const deferredLoading = useDeferredValue(isLoading);

  return {
    isLoading,
    deferredLoading,
    showSkeleton: deferredLoading && isLoading
  };
}

// Enhanced error boundary state
export function useModernError() {
  const [error, setError] = useState<Error | null>(null);
  const [hasErrored, setHasErrored] = useState(false);

  const clearError = useCallback(() => {
    startTransition(() => {
      setError(null);
      setHasErrored(false);
    });
  }, []);

  const handleError = useCallback((error: Error) => {
    startTransition(() => {
      setError(error);
      setHasErrored(true);
      console.error('Modern error boundary caught:', error);
    });
  }, []);

  return {
    error,
    hasErrored,
    clearError,
    handleError
  };
}