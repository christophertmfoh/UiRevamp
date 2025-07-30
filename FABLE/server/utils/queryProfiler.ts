// Database Query Performance Profiler
// Enterprise-grade query optimization for Phase 1-2 A-grade compliance

interface QueryMetric {
  name: string;
  duration: number;
  timestamp: number;
  slow: boolean;
}

const queryMetrics: QueryMetric[] = [];
const SLOW_QUERY_THRESHOLD = 100; // ms

export function profileQuery(queryName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      
      try {
        const result = await method.apply(this, args);
        const duration = performance.now() - start;
        const slow = duration > SLOW_QUERY_THRESHOLD;
        
        const metric: QueryMetric = {
          name: `${queryName}.${propertyName}`,
          duration,
          timestamp: Date.now(),
          slow
        };
        
        queryMetrics.push(metric);
        
        if (slow) {
          console.warn(`🐌 Slow Query: ${metric.name} took ${duration.toFixed(2)}ms`);
        } else {
          console.log(`⚡ Query: ${metric.name} took ${duration.toFixed(2)}ms`);
        }
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        console.error(`❌ Query Failed: ${queryName}.${propertyName} after ${duration.toFixed(2)}ms`, error);
        throw error;
      }
    };
    
    return descriptor;
  };
}

export function getQueryReport() {
  const totalQueries = queryMetrics.length;
  const slowQueries = queryMetrics.filter(m => m.slow);
  const averageDuration = queryMetrics.reduce((sum, m) => sum + m.duration, 0) / totalQueries;
  
  return {
    totalQueries,
    slowQueries: slowQueries.length,
    slowQueryPercentage: (slowQueries.length / totalQueries) * 100,
    averageDuration: averageDuration.toFixed(2),
    slowestQueries: queryMetrics
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10),
    recentMetrics: queryMetrics.slice(-20)
  };
}

export function logQueryReport() {
  const report = getQueryReport();
  console.log('\n📊 Database Query Performance Report:');
  console.log(`Total Queries: ${report.totalQueries}`);
  console.log(`Slow Queries: ${report.slowQueries} (${report.slowQueryPercentage.toFixed(1)}%)`);
  console.log(`Average Duration: ${report.averageDuration}ms`);
  console.log('\nSlowest Queries:');
  report.slowestQueries.forEach((query, index) => {
    console.log(`${index + 1}. ${query.name}: ${query.duration.toFixed(2)}ms`);
  });
}

// Log report every 5 minutes in development
if (process.env.NODE_ENV === 'development') {
  setInterval(logQueryReport, 5 * 60 * 1000);
}