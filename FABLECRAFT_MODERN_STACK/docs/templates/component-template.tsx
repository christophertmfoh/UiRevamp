/**
 * @file Component Template
 * @description Template for creating new components with proper documentation
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for ExampleComponent
 * 
 * @remarks
 * This interface demonstrates our documentation standards.
 * Only document non-obvious props or those with special behavior.
 */
export interface ExampleComponentProps {
  /** Visual style variant - affects background and text color */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /** Size of the component - affects padding and font size */
  size?: 'sm' | 'md' | 'lg';
  
  /** 
   * Whether the component is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /** 
   * Callback fired when the component is clicked
   * @param event - The click event
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Child elements */
  children: React.ReactNode;
}

/**
 * ExampleComponent - A template component showing documentation standards
 * 
 * @example
 * ```tsx
 * <ExampleComponent variant="primary" size="md">
 *   Hello World
 * </ExampleComponent>
 * ```
 * 
 * @remarks
 * Accessibility:
 * - Keyboard: Focusable with Tab, activates with Enter/Space
 * - Screen reader: Announces as button with label
 * - ARIA: Uses role="button" and appropriate aria-label
 * 
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/button/} - ARIA Button Pattern
 */
export function ExampleComponent({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  onClick,
  className,
  children,
}: ExampleComponentProps) {
  // Component-specific logic with inline comments only when necessary
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isLoading) return; // Prevent clicks during loading
    onClick?.(event);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        // Handle keyboard activation
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Size variants
        {
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-4 text-sm': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
        },
        
        // Visual variants
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
        },
        
        // Loading state
        isLoading && 'cursor-wait opacity-70',
        
        className
      )}
      aria-busy={isLoading}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {isLoading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </div>
  );
}

// Default export for lazy loading if needed
export default ExampleComponent;