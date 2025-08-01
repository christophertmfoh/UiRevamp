/**
 * Accessibility Utilities
 * Focus management, ARIA helpers, and keyboard navigation
 */

/**
 * Trap focus within an element (useful for modals/dialogs)
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  // Focus first element
  firstFocusableElement?.focus();

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement?.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement?.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Restore focus to a previously focused element
 */
export function restoreFocus(element: HTMLElement | null) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  announcement.textContent = message;
  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generate unique ID for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix = 'aria'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

/**
 * Check if element is visible and focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;
  if (element.disabled) return false;
  
  const style = window.getComputedStyle(element);
  if (style.display === 'none') return false;
  if (style.visibility === 'hidden') return false;
  if (parseFloat(style.opacity) === 0) return false;
  
  return true;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
  );
  
  return Array.from(elements).filter(isFocusable);
}

/**
 * Handle escape key to close modals/popups
 */
export function handleEscapeKey(callback: () => void) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Skip links helper for keyboard navigation
 */
export function createSkipLink(targetId: string, text = 'Skip to main content') {
  const link = document.createElement('a');
  link.href = `#${targetId}`;
  link.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md';
  link.textContent = text;
  
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.scrollIntoView();
    }
  });
  
  return link;
}

/**
 * ARIA live region manager
 */
class LiveRegionManager {
  private region: HTMLElement | null = null;

  constructor() {
    this.createRegion();
  }

  private createRegion() {
    this.region = document.createElement('div');
    this.region.setAttribute('aria-live', 'polite');
    this.region.setAttribute('aria-atomic', 'true');
    this.region.className = 'sr-only';
    document.body.appendChild(this.region);
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.region) this.createRegion();
    
    if (this.region) {
      this.region.setAttribute('aria-live', priority);
      this.region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (this.region) {
          this.region.textContent = '';
        }
      }, 1000);
    }
  }

  destroy() {
    if (this.region && document.body.contains(this.region)) {
      document.body.removeChild(this.region);
      this.region = null;
    }
  }
}

export const liveRegion = new LiveRegionManager();

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation for menus/lists
   */
  handleArrowKeys(
    e: KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onChange: (newIndex: number) => void,
    options: {
      vertical?: boolean;
      loop?: boolean;
    } = {}
  ) {
    const { vertical = true, loop = true } = options;
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';

    let newIndex = currentIndex;

    if (e.key === nextKey) {
      newIndex = currentIndex + 1;
      if (newIndex >= totalItems) {
        newIndex = loop ? 0 : totalItems - 1;
      }
    } else if (e.key === prevKey) {
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = loop ? totalItems - 1 : 0;
      }
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = totalItems - 1;
    } else {
      return; // Key not handled
    }

    e.preventDefault();
    onChange(newIndex);
  },

  /**
   * Check if key is printable character for typeahead
   */
  isPrintableCharacter(key: string): boolean {
    return key.length === 1 && key.match(/\S/);
  }
};