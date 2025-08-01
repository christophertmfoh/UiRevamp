import { useEffect, useState } from 'react';

/**
 * useResponsiveLayout
 * Tiny helper that returns boolean break-points. Keeps logic in one place.
 * Breakpoints match Tailwind defaults (sm 640px, md 768px, lg 1024px).
 */
export const useResponsiveLayout = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    isDesktop: width >= 1024,
    isTablet: width >= 768 && width < 1024,
    isMobile: width < 768,
  } as const;
};