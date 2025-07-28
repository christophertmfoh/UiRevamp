/**
 * Global Error Handler for Unhandled Promise Rejections
 * Prevents console spam and memory leaks
 */

let errorCount = 0;
const MAX_ERRORS_PER_MINUTE = 10;
let lastErrorReset = Date.now();

export const initializeGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const currentTime = Date.now();
    
    // Reset error count every minute
    if (currentTime - lastErrorReset > 60000) {
      errorCount = 0;
      lastErrorReset = currentTime;
    }
    
    // Log detailed error information to identify root cause
    if (errorCount < MAX_ERRORS_PER_MINUTE) {
      const reason = event.reason;
      
      // Filter out Vite HMR errors to reduce noise
      if (reason?.stack?.includes('@vite/client') || reason?.stack?.includes('ping')) {
        // Silently ignore Vite HMR connection errors
        return;
      }
      
      // Log other promise rejections for debugging
      console.warn('🔍 Promise rejection:', reason?.message || reason);
      
      errorCount++;
    }
    
    // Prevent default browser behavior
    event.preventDefault();
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    const currentTime = Date.now();
    
    if (currentTime - lastErrorReset > 60000) {
      errorCount = 0;
      lastErrorReset = currentTime;
    }
    
    if (errorCount < MAX_ERRORS_PER_MINUTE) {
      console.warn('Global error:', event.error);
      errorCount++;
    }
  });

  console.log('Global error handler initialized');
};

// Cleanup function
export const cleanupGlobalErrorHandler = () => {
  // Note: We don't remove these handlers as they should persist
  console.log('Global error handler cleanup called');
};