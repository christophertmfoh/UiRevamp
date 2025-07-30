// Web Vitals Performance Monitoring
// Enterprise-grade performance tracking for Phase 1-2 A-grade compliance

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

const performanceMetrics: PerformanceMetric[] = [];

export function measurePerformance() {
  const logMetric = (metric: Metric) => {
    performanceMetrics.push({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now()
    });
    console.log(`${metric.name}:`, metric);
  };

  // Cumulative Layout Shift
  onCLS(logMetric);
  // Interaction to Next Paint (replaces FID)
  onINP(logMetric);
  // First Contentful Paint
  onFCP(logMetric);
  // Largest Contentful Paint
  onLCP(logMetric);
  // Time to First Byte
  onTTFB(logMetric);
}

export function getPerformanceReport() {
  return {
    metrics: performanceMetrics,
    summary: {
      totalMetrics: performanceMetrics.length,
      goodRatings: performanceMetrics.filter(m => m.rating === 'good').length,
      needsImprovement: performanceMetrics.filter(m => m.rating === 'needs-improvement').length,
      poorRatings: performanceMetrics.filter(m => m.rating === 'poor').length
    }
  };
}

// Automatic measurement on app load (client-side only)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  measurePerformance();
}