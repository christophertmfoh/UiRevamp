/**
 * ResizeObserver Error Suppression for Radix UI
 * This patches the specific cause: Radix components triggering resize loops
 */

export const initializeResizeObserverFix = () => {
  if (typeof window === 'undefined') return;

  // Store the original ResizeObserver
  const OriginalResizeObserver = window.ResizeObserver;
  
  // Create a patched version that prevents error propagation
  window.ResizeObserver = class PatchedResizeObserver {
    private observer: ResizeObserver;
    
    constructor(callback: ResizeObserverCallback) {
      // Wrap the callback to prevent errors from propagating
      const safeCallback: ResizeObserverCallback = (entries, observer) => {
        // Use requestAnimationFrame to defer the callback and prevent sync errors
        window.requestAnimationFrame(() => {
          try {
            callback(entries, observer);
          } catch (error) {
            // Only suppress ResizeObserver loop errors, let real errors through
            if (
              error instanceof Error &&
              error.message.includes('ResizeObserver loop')
            ) {
              return; // Silently ignore
            }
            // Re-throw actual errors
            console.error('ResizeObserver error:', error);
          }
        });
      };
      
      this.observer = new OriginalResizeObserver(safeCallback);
    }
    
    observe(target: Element, options?: ResizeObserverOptions) {
      return this.observer.observe(target, options);
    }
    
    unobserve(target: Element) {
      return this.observer.unobserve(target);
    }
    
    disconnect() {
      return this.observer.disconnect();
    }
  };
  
  // Also catch any errors that still slip through
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (message.includes('ResizeObserver loop')) {
      return; // Suppress console.error for ResizeObserver loops
    }
    originalError.apply(console, args);
  };
};