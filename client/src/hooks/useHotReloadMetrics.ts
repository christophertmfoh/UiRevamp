import { useEffect, useRef, useState } from 'react';

/**
 * Phase 5: Hot-Reload Performance Monitoring
 * Tracks and measures hot-reload performance for creative workflow optimization
 */

interface HotReloadMetrics {
  reloadCount: number;
  averageReloadTime: number;
  lastReloadTime: number;
  fastestReload: number;
  slowestReload: number;
  reloadTimes: number[];
}

interface PerformanceEntry {
  timestamp: number;
  reloadTime: number;
  componentName?: string;
}

export const useHotReloadMetrics = () => {
  const [metrics, setMetrics] = useState<HotReloadMetrics>({
    reloadCount: 0,
    averageReloadTime: 0,
    lastReloadTime: 0,
    fastestReload: Infinity,
    slowestReload: 0,
    reloadTimes: []
  });

  const reloadStartTime = useRef<number>(0);
  const performanceEntries = useRef<PerformanceEntry[]>([]);
  const isFirstLoad = useRef(true);

  // Track HMR updates
  useEffect(() => {
    if (import.meta.hot) {
      const handleHMRUpdate = () => {
        reloadStartTime.current = performance.now();
      };

      const handleHMRComplete = () => {
        if (reloadStartTime.current > 0) {
          const reloadTime = performance.now() - reloadStartTime.current;
          recordReloadTime(reloadTime);
          reloadStartTime.current = 0;
        }
      };

      // Listen to Vite HMR events
      import.meta.hot.on('vite:beforeUpdate', handleHMRUpdate);
      import.meta.hot.on('vite:afterUpdate', handleHMRComplete);

      return () => {
        import.meta.hot?.off('vite:beforeUpdate', handleHMRUpdate);
        import.meta.hot?.off('vite:afterUpdate', handleHMRComplete);
      };
    }
    // Return cleanup function for all code paths
    return () => {};
  }, []);

  // Track component mount/render times
  useEffect(() => {
    if (isFirstLoad.current) {
      const loadTime = performance.now();
      recordReloadTime(loadTime, 'initial-load');
      isFirstLoad.current = false;
    }
  }, []);

  const recordReloadTime = (reloadTime: number, componentName?: string) => {
    const entry: PerformanceEntry = {
      timestamp: Date.now(),
      reloadTime,
      componentName
    };

    performanceEntries.current.push(entry);
    
    // Keep only last 100 entries
    if (performanceEntries.current.length > 100) {
      performanceEntries.current = performanceEntries.current.slice(-100);
    }

    setMetrics(prev => {
      const newReloadTimes = [...prev.reloadTimes, reloadTime].slice(-50); // Keep last 50
      const newCount = prev.reloadCount + 1;
      const newAverage = newReloadTimes.reduce((sum, time) => sum + time, 0) / newReloadTimes.length;
      const newFastest = Math.min(prev.fastestReload, reloadTime);
      const newSlowest = Math.max(prev.slowestReload, reloadTime);

      // Log performance for development
      if (process.env.NODE_ENV === 'development') {
        const status = reloadTime < 100 ? '🚀' : reloadTime < 500 ? '⚡' : '🐌';
        console.log(`${status} Hot-reload: ${reloadTime.toFixed(2)}ms ${componentName ? `(${componentName})` : ''}`);
        
        if (reloadTime > 1000) {
          console.warn(`🚨 Slow hot-reload detected: ${reloadTime.toFixed(2)}ms`);
        }
      }

      return {
        reloadCount: newCount,
        averageReloadTime: newAverage,
        lastReloadTime: reloadTime,
        fastestReload: newFastest,
        slowestReload: newSlowest,
        reloadTimes: newReloadTimes
      };
    });
  };

  const getPerformanceReport = () => {
    const recentEntries = performanceEntries.current.slice(-10);
    const componentPerformance = recentEntries.reduce((acc, entry) => {
      if (entry.componentName) {
        if (!acc[entry.componentName]) {
          acc[entry.componentName] = [];
        }
        acc[entry.componentName]!.push(entry.reloadTime);
      }
      return acc;
    }, {} as Record<string, number[]>);

    return {
      ...metrics,
      recentPerformance: recentEntries,
      componentPerformance,
      performanceGrade: getPerformanceGrade(metrics.averageReloadTime),
      recommendations: getRecommendations(metrics)
    };
  };

  const getPerformanceGrade = (avgTime: number): string => {
    if (avgTime < 50) return 'A+';
    if (avgTime < 100) return 'A';
    if (avgTime < 200) return 'B';
    if (avgTime < 500) return 'C';
    return 'D';
  };

  const getRecommendations = (metrics: HotReloadMetrics): string[] => {
    const recommendations: string[] = [];

    if (metrics.averageReloadTime > 200) {
      recommendations.push('Consider reducing component complexity for faster hot-reload');
    }

    if (metrics.slowestReload > 1000) {
      recommendations.push('Some components are taking >1s to reload - check for heavy computations');
    }

    if (metrics.reloadTimes.length > 10) {
      const recentAvg = metrics.reloadTimes.slice(-5).reduce((sum, time) => sum + time, 0) / 5;
      const overallAvg = metrics.averageReloadTime;
      
      if (recentAvg > overallAvg * 1.5) {
        recommendations.push('Recent reloads are slower than average - check for performance degradation');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Hot-reload performance is optimal for creative workflow!');
    }

    return recommendations;
  };

  const resetMetrics = () => {
    setMetrics({
      reloadCount: 0,
      averageReloadTime: 0,
      lastReloadTime: 0,
      fastestReload: Infinity,
      slowestReload: 0,
      reloadTimes: []
    });
    performanceEntries.current = [];
  };

  return {
    metrics,
    getPerformanceReport,
    resetMetrics,
    recordReloadTime
  };
};

/**
 * Hook for tracking creative component render performance
 */
export const useComponentRenderMetrics = (componentName: string) => {
  const { recordReloadTime } = useHotReloadMetrics();
  const renderStartTime = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    recordReloadTime(renderTime, componentName);
  });

  return {
    markRenderStart: () => {
      renderStartTime.current = performance.now();
    },
    markRenderEnd: () => {
      const renderTime = performance.now() - renderStartTime.current;
      recordReloadTime(renderTime, componentName);
      return renderTime;
    }
  };
};