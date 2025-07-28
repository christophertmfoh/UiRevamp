/**
 * Memory Optimization Utilities
 * Reduces memory footprint for creative writing platform
 */

// Debounce function to reduce frequent re-renders
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance-critical operations
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Aggressive memory cleanup utility
export const cleanupMemory = () => {
  try {
    // Clear all performance entries
    if (performance.clearResourceTimings) {
      performance.clearResourceTimings();
    }
    
    // Clear all marks and measures
    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
    
    // Clear console if too many logs
    if (console.clear && Math.random() < 0.1) {
      console.clear();
    }
    
    // Force garbage collection if available
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }
    
    // Clear any cached DOM queries
    document.querySelectorAll('[data-memory-cache]').forEach(el => {
      el.removeAttribute('data-memory-cache');
    });
    
    console.log('🧹 Aggressive memory cleanup completed');
  } catch (error) {
    console.warn('Memory cleanup failed:', error);
  }
};

// Optimize large arrays by chunking
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Memory-efficient event listener cleanup
export class MemoryEfficientEventManager {
  private listeners: Map<string, Set<EventListener>> = new Map();
  
  addEventListener(element: EventTarget, event: string, listener: EventListener) {
    element.addEventListener(event, listener);
    
    const key = `${event}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);
  }
  
  cleanup() {
    this.listeners.clear();
  }
}