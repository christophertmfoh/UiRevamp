import { useEffect } from 'react';

export function useDebouncedSave(callback: () => void, delay: number) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
}
