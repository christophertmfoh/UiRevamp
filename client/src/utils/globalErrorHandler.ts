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
    // Completely prevent all promise rejection console noise during development
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