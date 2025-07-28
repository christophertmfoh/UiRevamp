/**
 * Performance Monitoring Hook
 * Tracks application performance metrics for optimization
 */

import { useEffect, useCallback, useRef } from 'react';
import { usePerformanceStore } from '@/lib/store';

interface PerformanceMetrics {
  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  
  // Navigation Timing
  navigationStart?: number;
  domContentLoaded?: number;
  loadComplete?: number;
  
  // Resource Timing
  bundleSize?: number;
  imageLoadTime?: number;
  apiResponseTime?: number;
  
  // Component Performance
  componentMountTime?: number;
  renderTime?: number;
  
  // User Experience
  timeToInteractive?: number;
  firstContentfulPaint?: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
}

// Performance thresholds based on Google's recommendations
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // ms
  FID: { good: 100, poor: 300 }, // ms
  CLS: { good: 0.1, poor: 0.25 }, // score
  loadComplete: { good: 3000, poor: 5000 }, // ms
  componentMountTime: { good: 16, poor: 100 }, // ms (60fps = 16ms per frame)
  apiResponseTime: { good: 500, poor: 2000 }, // ms
  bundleSize: { good: 250000, poor: 500000 }, // bytes (250KB good, 500KB poor)
};

export function usePerformanceMonitoring() {
  const { 
    addMetric, 
    addAlert, 
    metrics, 
    alerts,
    isMonitoringEnabled 
  } = usePerformanceStore();
  
  const observerRef = useRef<PerformanceObserver | null>(null);
  const navigationRef = useRef<number>(performance.now());

  // Track Core Web Vitals
  const trackCoreWebVitals = useCallback(() => {
    if (!isMonitoringEnabled || !window.PerformanceObserver) return;

    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEntry[];
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        addMetric('LCP', lcp);
        
        if (lcp > PERFORMANCE_THRESHOLDS.LCP.poor) {
          addAlert({
            type: 'error',
            metric: 'LCP',
            value: lcp,
            threshold: PERFORMANCE_THRESHOLDS.LCP.poor,
            message: `LCP is ${Math.round(lcp)}ms (poor performance)`,
            timestamp: Date.now()
          });
        } else if (lcp > PERFORMANCE_THRESHOLDS.LCP.good) {
          addAlert({
            type: 'warning',
            metric: 'LCP',
            value: lcp,
            threshold: PERFORMANCE_THRESHOLDS.LCP.good,
            message: `LCP is ${Math.round(lcp)}ms (needs improvement)`,
            timestamp: Date.now()
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEventTiming[];
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          addMetric('FID', fid);
          
          if (fid > PERFORMANCE_THRESHOLDS.FID.poor) {
            addAlert({
              type: 'error',
              metric: 'FID',
              value: fid,
              threshold: PERFORMANCE_THRESHOLDS.FID.poor,
              message: `FID is ${Math.round(fid)}ms (poor responsiveness)`,
              timestamp: Date.now()
            });
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEntry[];
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        addMetric('CLS', clsValue);
        
        if (clsValue > PERFORMANCE_THRESHOLDS.CLS.poor) {
          addAlert({
            type: 'error',
            metric: 'CLS',
            value: clsValue,
            threshold: PERFORMANCE_THRESHOLDS.CLS.poor,
            message: `CLS is ${clsValue.toFixed(3)} (poor visual stability)`,
            timestamp: Date.now()
          });
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      observerRef.current = lcpObserver; // Keep reference for cleanup
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error);
    }
  }, [isMonitoringEnabled, addMetric, addAlert]);

  // Track navigation timing
  const trackNavigationTiming = useCallback(() => {
    if (!isMonitoringEnabled) return;

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          navigationStart: navigation.navigationStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          loadComplete: navigation.loadEventEnd - navigation.navigationStart,
          firstContentfulPaint: 0 // Will be updated by paint observer
        };

        Object.entries(metrics).forEach(([key, value]) => {
          if (value > 0) {
            addMetric(key as keyof PerformanceMetrics, value);
          }
        });

        // Check load time threshold
        if (metrics.loadComplete > PERFORMANCE_THRESHOLDS.loadComplete.poor) {
          addAlert({
            type: 'error',
            metric: 'loadComplete',
            value: metrics.loadComplete,
            threshold: PERFORMANCE_THRESHOLDS.loadComplete.poor,
            message: `Page load time is ${Math.round(metrics.loadComplete)}ms (too slow)`,
            timestamp: Date.now()
          });
        }
      }
    } catch (error) {
      console.warn('Navigation timing failed:', error);
    }
  }, [isMonitoringEnabled, addMetric, addAlert]);

  // Track paint timing
  const trackPaintTiming = useCallback(() => {
    if (!isMonitoringEnabled || !window.PerformanceObserver) return;

    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            addMetric('firstContentfulPaint', entry.startTime);
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Paint timing setup failed:', error);
    }
  }, [isMonitoringEnabled, addMetric]);

  // Track component performance
  const trackComponentMount = useCallback((componentName: string, startTime: number) => {
    if (!isMonitoringEnabled) return;

    const mountTime = performance.now() - startTime;
    addMetric('componentMountTime', mountTime);

    if (mountTime > PERFORMANCE_THRESHOLDS.componentMountTime.poor) {
      addAlert({
        type: 'warning',
        metric: 'componentMountTime',
        value: mountTime,
        threshold: PERFORMANCE_THRESHOLDS.componentMountTime.poor,
        message: `${componentName} took ${Math.round(mountTime)}ms to mount (slow)`,
        timestamp: Date.now()
      });
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`⚡ ${componentName} mounted in ${Math.round(mountTime)}ms`);
    }
  }, [isMonitoringEnabled, addMetric, addAlert]);

  // Track API response times
  const trackApiCall = useCallback((endpoint: string, responseTime: number) => {
    if (!isMonitoringEnabled) return;

    addMetric('apiResponseTime', responseTime);

    if (responseTime > PERFORMANCE_THRESHOLDS.apiResponseTime.poor) {
      addAlert({
        type: 'warning',
        metric: 'apiResponseTime',
        value: responseTime,
        threshold: PERFORMANCE_THRESHOLDS.apiResponseTime.poor,
        message: `${endpoint} responded in ${Math.round(responseTime)}ms (slow)`,
        timestamp: Date.now()
      });
    }
  }, [isMonitoringEnabled, addMetric, addAlert]);

  // Track bundle size
  const trackBundleSize = useCallback(async () => {
    if (!isMonitoringEnabled) return;

    try {
      // Estimate bundle size from resource timing
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(resource => 
        resource.name.includes('.js') && 
        resource.name.includes(window.location.origin)
      );

      const totalSize = jsResources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);

      if (totalSize > 0) {
        addMetric('bundleSize', totalSize);

        if (totalSize > PERFORMANCE_THRESHOLDS.bundleSize.poor) {
          addAlert({
            type: 'error',
            metric: 'bundleSize',
            value: totalSize,
            threshold: PERFORMANCE_THRESHOLDS.bundleSize.poor,
            message: `Bundle size is ${Math.round(totalSize / 1024)}KB (too large)`,
            timestamp: Date.now()
          });
        } else if (totalSize > PERFORMANCE_THRESHOLDS.bundleSize.good) {
          addAlert({
            type: 'warning',
            metric: 'bundleSize',
            value: totalSize,
            threshold: PERFORMANCE_THRESHOLDS.bundleSize.good,
            message: `Bundle size is ${Math.round(totalSize / 1024)}KB (could be optimized)`,
            timestamp: Date.now()
          });
        }
      }
    } catch (error) {
      console.warn('Bundle size tracking failed:', error);
    }
  }, [isMonitoringEnabled, addMetric, addAlert]);

  // Memory monitoring
  const trackMemoryUsage = useCallback(() => {
    if (!isMonitoringEnabled || !(performance as any).memory) return;

    try {
      const memory = (performance as any).memory;
      const memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };

      // Track memory usage percentage
      const memoryPercentage = (memoryUsage.used / memoryUsage.limit) * 100;
      
      if (memoryPercentage > 80) {
        addAlert({
          type: 'error',
          metric: 'memoryUsage',
          value: memoryPercentage,
          threshold: 80,
          message: `Memory usage is ${Math.round(memoryPercentage)}% (critical)`,
          timestamp: Date.now()
        });
      } else if (memoryPercentage > 60) {
        addAlert({
          type: 'warning',
          metric: 'memoryUsage',
          value: memoryPercentage,
          threshold: 60,
          message: `Memory usage is ${Math.round(memoryPercentage)}% (high)`,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.warn('Memory monitoring failed:', error);
    }
  }, [isMonitoringEnabled, addAlert]);

  // Performance report generation
  const generatePerformanceReport = useCallback(() => {
    const recentMetrics = metrics.slice(-100); // Last 100 metrics
    const recentAlerts = alerts.slice(-20); // Last 20 alerts
    
    const report = {
      timestamp: Date.now(),
      summary: {
        totalMetrics: recentMetrics.length,
        totalAlerts: recentAlerts.length,
        errorAlerts: recentAlerts.filter(a => a.type === 'error').length,
        warningAlerts: recentAlerts.filter(a => a.type === 'warning').length
      },
      coreWebVitals: {
        LCP: recentMetrics.find(m => m.name === 'LCP')?.value,
        FID: recentMetrics.find(m => m.name === 'FID')?.value,
        CLS: recentMetrics.find(m => m.name === 'CLS')?.value
      },
      averages: {
        componentMountTime: recentMetrics
          .filter(m => m.name === 'componentMountTime')
          .reduce((sum, m, _, arr) => sum + m.value / arr.length, 0),
        apiResponseTime: recentMetrics
          .filter(m => m.name === 'apiResponseTime')
          .reduce((sum, m, _, arr) => sum + m.value / arr.length, 0)
      },
      recommendations: generateRecommendations(recentAlerts)
    };

    return report;
  }, [metrics, alerts]);

  // Generate performance recommendations
  const generateRecommendations = useCallback((alerts: PerformanceAlert[]) => {
    const recommendations = [];
    
    const errorMetrics = alerts.filter(a => a.type === 'error').map(a => a.metric);
    const warningMetrics = alerts.filter(a => a.type === 'warning').map(a => a.metric);
    
    if (errorMetrics.includes('LCP')) {
      recommendations.push('Optimize images and implement lazy loading');
      recommendations.push('Minimize render-blocking resources');
    }
    
    if (errorMetrics.includes('FID')) {
      recommendations.push('Reduce JavaScript execution time');
      recommendations.push('Split large tasks into smaller ones');
    }
    
    if (errorMetrics.includes('CLS')) {
      recommendations.push('Set size attributes on images and videos');
      recommendations.push('Avoid inserting content above existing content');
    }
    
    if (warningMetrics.includes('bundleSize')) {
      recommendations.push('Implement code splitting');
      recommendations.push('Remove unused dependencies');
    }
    
    if (warningMetrics.includes('componentMountTime')) {
      recommendations.push('Optimize component rendering');
      recommendations.push('Use React.memo for expensive components');
    }
    
    return recommendations;
  }, []);

  // Initialize monitoring
  useEffect(() => {
    if (!isMonitoringEnabled) return;

    // Set up all monitoring
    trackCoreWebVitals();
    trackNavigationTiming();
    trackPaintTiming();
    trackBundleSize();
    
    // Set up periodic monitoring
    const memoryInterval = setInterval(trackMemoryUsage, 30000); // Every 30 seconds
    
    // Clean up
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(memoryInterval);
    };
  }, [isMonitoringEnabled, trackCoreWebVitals, trackNavigationTiming, trackPaintTiming, trackBundleSize, trackMemoryUsage]);

  return {
    // Metrics
    metrics,
    alerts,
    
    // Tracking functions
    trackComponentMount,
    trackApiCall,
    
    // Reports
    generatePerformanceReport,
    
    // Utilities
    isMonitoringEnabled,
    thresholds: PERFORMANCE_THRESHOLDS
  };
}

// Higher-order component for automatic component performance tracking
export function withPerformanceTracking<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName?: string
) {
  const TrackedComponent = (props: T) => {
    const { trackComponentMount } = usePerformanceMonitoring();
    const mountStartTime = useRef(performance.now());
    
    useEffect(() => {
      trackComponentMount(
        componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown',
        mountStartTime.current
      );
    }, [trackComponentMount]);
    
    return <WrappedComponent {...props} />;
  };
  
  TrackedComponent.displayName = `withPerformanceTracking(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;
  return TrackedComponent;
}

export type { PerformanceMetrics, PerformanceAlert };