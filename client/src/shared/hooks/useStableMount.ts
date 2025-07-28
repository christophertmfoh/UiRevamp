import { useEffect, useState } from 'react';

/**
 * Senior-level stable mounting hook
 * Prevents hydration mismatches and ResizeObserver issues
 */
export function useStableMount(delay: number = 100) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isMounted;
}