/**
 * Senior-level ResizeObserver error handling
 * Implements multiple layers of protection against ResizeObserver loop errors
 */

let isInitialized = false;

export function suppressResizeObserverError() {
  if (isInitialized) return;
  
  // Method 1: Console error interception
  const originalError = console.error;
  console.error = (...args) => {
    const message = String(args[0] || '');
    if (message.includes('ResizeObserver loop completed') || 
        message.includes('ResizeObserver loop limit exceeded')) {
      return; // Silently ignore
    }
    originalError.apply(console, args);
  };
  
  // Method 2: Global error handler
  window.addEventListener('error', (event) => {
    if (event.message?.includes('ResizeObserver loop completed') ||
        event.message?.includes('ResizeObserver loop limit exceeded')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);
  
  // Method 3: Unhandled rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const message = String(event.reason?.message || event.reason || '');
    if (message.includes('ResizeObserver loop completed')) {
      event.preventDefault();
      return false;
    }
  });
  
  // Method 4: Polyfill ResizeObserver with debouncing if needed
  if (typeof window !== 'undefined' && window.ResizeObserver) {
    const OriginalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class extends OriginalResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        let timeoutId: number | null = null;
        
        const debouncedCallback: ResizeObserverCallback = (entries, observer) => {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            try {
              callback(entries, observer);
            } catch (error: any) {
              if (!error.message?.includes('ResizeObserver loop completed')) {
                throw error;
              }
            }
          }, 16); // ~60fps
        };
        
        super(debouncedCallback);
      }
    };
  }
  
  isInitialized = true;
}