// ResizeObserver error suppression utility
// This prevents the harmless "ResizeObserver loop completed with undelivered notifications" error

let resizeObserverErrorSuppressed = false;

export function suppressResizeObserverError() {
  if (resizeObserverErrorSuppressed) return;
  
  const originalError = window.console.error;
  window.console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('ResizeObserver loop completed')) {
      // Suppress this specific error
      return;
    }
    originalError.apply(console, args);
  };
  
  // Also handle the error event
  window.addEventListener('error', (event) => {
    if (event.message.includes('ResizeObserver loop completed')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  
  resizeObserverErrorSuppressed = true;
}