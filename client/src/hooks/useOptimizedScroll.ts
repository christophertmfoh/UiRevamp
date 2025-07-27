import { useState, useEffect, useCallback } from 'react';

interface UseOptimizedScrollOptions {
  throttleMs?: number;
  enabled?: boolean;
}

export function useOptimizedScroll({ 
  throttleMs = 16, // ~60fps
  enabled = true 
}: UseOptimizedScrollOptions = {}) {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    if (!enabled) return;
    
    setScrollY(window.scrollY);
    setIsScrolling(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: NodeJS.Timeout;
    let rafId: number;
    let lastScrollTime = 0;

    const throttledScroll = () => {
      const now = Date.now();
      
      if (now - lastScrollTime >= throttleMs) {
        handleScroll();
        lastScrollTime = now;
      }
      
      // Reset scrolling state after scroll ends
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const onScroll = () => {
      rafId = requestAnimationFrame(throttledScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll, throttleMs, enabled]);

  return { scrollY, isScrolling };
}