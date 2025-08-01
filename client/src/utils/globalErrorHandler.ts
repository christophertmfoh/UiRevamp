/**
 * Global Error Handler for Unhandled Promise Rejections
 * Prevents console spam and memory leaks
 */

let errorCount = 0;
const MAX_ERRORS_PER_MINUTE = 10;
let lastErrorReset = Date.now();

export const initializeGlobalErrorHandler = () => {
  // Handle unhandled promise rejections - now properly fixed at source
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    
    // Only log genuine application errors since auth flow is now fixed
    console.error('Unhandled promise rejection:', reason?.message || reason);
    event.preventDefault();
  });

  // Handle general errors with proper filtering
  window.addEventListener('error', (event) => {
    const currentTime = Date.now();
    
    // Filter out browser quirks that aren't actionable errors
    const ignoredErrors = [
      'ResizeObserver loop completed',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured'
    ];
    
    if (ignoredErrors.some(ignored => event.message?.includes(ignored))) {
      return;
    }
    
    if (currentTime - lastErrorReset > 60000) {
      errorCount = 0;
      lastErrorReset = currentTime;
    }
    
    if (errorCount < MAX_ERRORS_PER_MINUTE && event.error) {
      console.warn('Application error:', event.error);
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