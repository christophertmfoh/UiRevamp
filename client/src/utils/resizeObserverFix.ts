/**
 * ResizeObserver Error Suppression
 * Prevents harmless browser loop errors from appearing in console
 * This is a standard fix used in production React applications
 */

// Store original ResizeObserver
const OriginalResizeObserver = window.ResizeObserver;

// Create a wrapper that catches the loop error
class SafeResizeObserver extends OriginalResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    super((entries, observer) => {
      try {
        callback(entries, observer);
      } catch (error) {
        // Suppress ResizeObserver loop errors - these are browser implementation details
        if (
          error instanceof Error && 
          error.message.includes('ResizeObserver loop')
        ) {
          return;
        }
        throw error;
      }
    });
  }
}

// Replace global ResizeObserver with safe version
export const initializeResizeObserverFix = () => {
  if (typeof window !== 'undefined' && window.ResizeObserver) {
    window.ResizeObserver = SafeResizeObserver;
  }
};