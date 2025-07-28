import { useEffect, useState } from 'react';

/**
 * Senior-level optimized scroll hook
 * Implements RAF-based throttling and passive listeners for maximum performance
 */
export function useOptimizedScroll() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    // Use passive listeners for better performance
    const options = { passive: true, capture: false };
    
    // Initial scroll position
    setScrollY(window.scrollY);
    
    // Add throttled scroll listener
    let rafId: number | null = null;
    const throttledScrollHandler = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          rafId = null;
        });
      }
    };
    
    window.addEventListener('scroll', throttledScrollHandler, options);
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
  
  return scrollY;
}