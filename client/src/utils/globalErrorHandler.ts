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
      
      // Detailed logging to find the source
      if (reason && reason.message) {
        console.warn('🔍 Promise rejection:', reason.message);
        if (reason.url) {
          console.warn('Failed URL:', reason.url);
        }
        if (reason.name && reason.name.includes('HTTPError')) {
          console.warn('HTTP Error details:', reason.name);
        }
      } else if (reason && typeof reason === 'object') {
        console.warn('🔍 Promise rejection (object):', JSON.stringify(reason, null, 2));
      } else {
        console.warn('🔍 Promise rejection:', reason);
      }
      
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