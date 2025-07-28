/**
 * Memory Analysis Utilities
 * Identifies memory usage patterns and leaks
 */

interface MemoryReport {
  timestamp: Date;
  breakdown: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    domNodes: number;
    eventListeners: number;
    componentCount: number;
  };
  suspects: string[];
}

export const analyzeMemoryUsage = (): MemoryReport => {
  const memory = (performance as any).memory;
  
  // Count DOM nodes
  const domNodes = document.querySelectorAll('*').length;
  
  // Count React components (approximate)
  const componentCount = document.querySelectorAll('[data-reactroot], [class*="react"], [class*="component"]').length;
  
  // Count event listeners (approximate)
  const eventListeners = Object.keys((window as any).getEventListeners?.() || {}).length;
  
  const suspects: string[] = [];
  
  // Identify memory suspects
  if (domNodes > 2000) suspects.push(`High DOM node count: ${domNodes}`);
  if (componentCount > 100) suspects.push(`High component count: ${componentCount}`);
  if (eventListeners > 50) suspects.push(`High event listener count: ${eventListeners}`);
  
  // Check for memory leaks in global objects
  const globalKeys = Object.keys(window).length;
  if (globalKeys > 500) suspects.push(`High global variable count: ${globalKeys}`);
  
  // Check for large arrays or objects in memory
  if (memory) {
    const heapUsed = Math.round(memory.usedJSHeapSize / (1024 * 1024));
    const heapTotal = Math.round(memory.totalJSHeapSize / (1024 * 1024));
    
    if (heapUsed > 50) suspects.push(`High heap usage: ${heapUsed}MB`);
    if (heapTotal > 70) suspects.push(`High heap allocation: ${heapTotal}MB`);
  }
  
  return {
    timestamp: new Date(),
    breakdown: {
      heapUsed: memory ? Math.round(memory.usedJSHeapSize / (1024 * 1024)) : 0,
      heapTotal: memory ? Math.round(memory.totalJSHeapSize / (1024 * 1024)) : 0,
      external: memory ? Math.round(memory.externalMemory / (1024 * 1024)) : 0,
      domNodes,
      eventListeners,
      componentCount
    },
    suspects
  };
};

export const logMemoryReport = () => {
  const report = analyzeMemoryUsage();
  
  console.group('🔍 Memory Analysis Report');
  console.log('Timestamp:', report.timestamp.toLocaleTimeString());
  console.table(report.breakdown);
  
  if (report.suspects.length > 0) {
    console.warn('Memory Suspects:');
    report.suspects.forEach(suspect => console.warn('- ' + suspect));
  }
  
  console.groupEnd();
  
  return report;
};