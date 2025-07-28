import { useState, useEffect, useCallback } from 'react';
import { cleanupMemory } from '@/utils/memoryOptimizer';

/**
 * Memory Monitor Hook
 * Tracks and optimizes memory usage for creative workflow
 */

interface MemoryStats {
  used: number;
  total: number;
  percentage: number;
  trend: 'stable' | 'increasing' | 'decreasing';
}

export const useMemoryMonitor = (alertThreshold: number = 70) => {
  const [memoryStats, setMemoryStats] = useState<MemoryStats>({
    used: 0,
    total: 0,
    percentage: 0,
    trend: 'stable'
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false); // Disable memory monitoring to reduce overhead
  const [lastCleanup, setLastCleanup] = useState<Date>(new Date());

  const checkMemory = useCallback(() => {
    try {
      const memory = (performance as any).memory;
      if (!memory) return;

      const used = Math.round(memory.usedJSHeapSize / (1024 * 1024));
      const total = Math.round(memory.totalJSHeapSize / (1024 * 1024));
      const percentage = Math.round((used / total) * 100);

      setMemoryStats(prev => {
        let trend: 'stable' | 'increasing' | 'decreasing' = 'stable';
        
        if (percentage > prev.percentage + 5) trend = 'increasing';
        else if (percentage < prev.percentage - 5) trend = 'decreasing';

        return { used, total, percentage, trend };
      });

      // Auto-cleanup when memory usage is high
      if (percentage > alertThreshold) {
        const timeSinceCleanup = Date.now() - lastCleanup.getTime();
        if (timeSinceCleanup > 30000) { // More frequent cleanup: every 30 seconds
          cleanupMemory();
          setLastCleanup(new Date());
        }
      }
      
      // Memory monitoring disabled to reduce overhead

    } catch (error) {
      console.warn('Memory monitoring failed:', error);
    }
  }, [alertThreshold, lastCleanup]);

  const forceCleanup = useCallback(() => {
    cleanupMemory();
    setLastCleanup(new Date());
    
    // Check memory again after cleanup
    setTimeout(checkMemory, 1000);
  }, [checkMemory]);

  useEffect(() => {
    // Memory monitoring completely disabled
    return () => {};
  }, []);

  return {
    memoryStats,
    isMonitoring,
    setIsMonitoring,
    forceCleanup,
    lastCleanup,
    isHighUsage: memoryStats.percentage > alertThreshold
  };
};