import { useEffect, useRef, useCallback, useState } from 'react';

// Hook for keyboard navigation
export function useKeyboardNavigation(
  items: HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
    onSelect?: (item: HTMLElement, index: number) => void;
    disabled?: boolean;
  } = {}
) {
  const { loop = true, orientation = 'both', onSelect, disabled = false } = options;
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled || items.length === 0) return;

    const { key } = event;
    let newIndex = currentIndex;

    switch (key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop 
            ? (currentIndex + 1) % items.length
            : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop
            ? currentIndex <= 0 ? items.length - 1 : currentIndex - 1
            : Math.max(currentIndex - 1, 0);
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop 
            ? (currentIndex + 1) % items.length
            : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop
            ? currentIndex <= 0 ? items.length - 1 : currentIndex - 1
            : Math.max(currentIndex - 1, 0);
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        if (currentIndex >= 0 && items[currentIndex]) {
          event.preventDefault();
          onSelect?.(items[currentIndex], currentIndex);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setCurrentIndex(-1);
        break;
    }

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
      setCurrentIndex(newIndex);
      items[newIndex]?.focus();
    }
  }, [items, currentIndex, loop, orientation, onSelect, disabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { currentIndex, setCurrentIndex };
}

// Hook for focus management
export function useFocusManagement() {
  const focusableElementsSelector = 
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(focusableElementsSelector);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
      
      if (event.key === 'Escape') {
        const closeButton = container.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
        closeButton?.click();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const restoreFocus = useCallback((element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      // Small delay to ensure DOM is ready
      setTimeout(() => element.focus(), 0);
    }
  }, []);

  const getFocusableElements = useCallback((container: HTMLElement) => {
    return Array.from(container.querySelectorAll(focusableElementsSelector)) as HTMLElement[];
  }, []);

  return { trapFocus, restoreFocus, getFocusableElements };
}

// Hook for screen reader announcements
export function useScreenReader() {
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create announcement container if it doesn't exist
    if (!announceRef.current) {
      const announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
      // announceRef.current = announcer; // Cannot assign to readonly - using direct DOM reference instead
    }

    return () => {
      if (announceRef.current) {
        document.body.removeChild(announceRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
      
      // Clear after announcement to ensure repeated messages are announced
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
}

// Hook for reduced motion preferences
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Hook for high contrast preferences
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}

// Hook for managing ARIA attributes
export function useAriaAttributes() {
  const setAriaExpanded = useCallback((element: HTMLElement, expanded: boolean) => {
    element.setAttribute('aria-expanded', expanded.toString());
  }, []);

  const setAriaSelected = useCallback((element: HTMLElement, selected: boolean) => {
    element.setAttribute('aria-selected', selected.toString());
  }, []);

  const setAriaChecked = useCallback((element: HTMLElement, checked: boolean | 'mixed') => {
    element.setAttribute('aria-checked', checked.toString());
  }, []);

  const setAriaPressed = useCallback((element: HTMLElement, pressed: boolean) => {
    element.setAttribute('aria-pressed', pressed.toString());
  }, []);

  const setAriaLabel = useCallback((element: HTMLElement, label: string) => {
    element.setAttribute('aria-label', label);
  }, []);

  const setAriaDescribedBy = useCallback((element: HTMLElement, ids: string[]) => {
    element.setAttribute('aria-describedby', ids.join(' '));
  }, []);

  const setAriaLabelledBy = useCallback((element: HTMLElement, ids: string[]) => {
    element.setAttribute('aria-labelledby', ids.join(' '));
  }, []);

  return {
    setAriaExpanded,
    setAriaSelected,
    setAriaChecked,
    setAriaPressed,
    setAriaLabel,
    setAriaDescribedBy,
    setAriaLabelledBy
  };
}

// Hook for managing tabindex
export function useTabIndex() {
  const makeUnfocusable = useCallback((element: HTMLElement) => {
    element.setAttribute('tabindex', '-1');
  }, []);

  const makeFocusable = useCallback((element: HTMLElement) => {
    element.setAttribute('tabindex', '0');
  }, []);

  const removeFocusability = useCallback((element: HTMLElement) => {
    element.removeAttribute('tabindex');
  }, []);

  return { makeUnfocusable, makeFocusable, removeFocusability };
}

// Hook for touch target size validation (44px minimum for accessibility)
export function useTouchTargets() {
  const validateTouchTarget = useCallback((element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // WCAG guideline minimum
    return rect.width >= minSize && rect.height >= minSize;
  }, []);

  const enhanceTouchTarget = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44;
    
    if (rect.width < minSize || rect.height < minSize) {
      element.style.minWidth = `${minSize}px`;
      element.style.minHeight = `${minSize}px`;
      element.style.padding = element.style.padding || '8px';
    }
  }, []);

  return { validateTouchTarget, enhanceTouchTarget };
}

// Comprehensive accessibility hook that combines multiple features
export function useAccessibility(options: {
  announcePageChanges?: boolean;
  trapFocus?: boolean;
  enhanceTouchTargets?: boolean;
} = {}) {
  const { announce } = useScreenReader();
  const { trapFocus } = useFocusManagement();
  const { enhanceTouchTarget } = useTouchTargets();
  const prefersReducedMotion = useReducedMotion();
  const prefersHighContrast = useHighContrast();

  // Announce page changes for screen readers
  useEffect(() => {
    if (options.announcePageChanges) {
      const title = document.title;
      announce(`Page loaded: ${title}`);
    }
  }, [announce, options.announcePageChanges]);

  // Enhanced touch targets
  useEffect(() => {
    if (options.enhanceTouchTargets) {
      const interactiveElements = document.querySelectorAll(
        'button, a[href], input, select, textarea, [role="button"], [role="link"]'
      );
      
      interactiveElements.forEach((element) => {
        enhanceTouchTarget(element as HTMLElement);
      });
    }
  }, [options.enhanceTouchTargets, enhanceTouchTarget]);

  return {
    announce,
    trapFocus,
    prefersReducedMotion,
    prefersHighContrast,
    enhanceTouchTarget
  };
}