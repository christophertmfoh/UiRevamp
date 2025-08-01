'use client';

import React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

export interface GradientButtonProps extends ButtonProps {
  /**
   * Whether to show the gradient overlay
   * @default true
   */
  showGradientOverlay?: boolean;
  /**
   * Custom gradient colors for the overlay
   * @default 'from-white/20 to-transparent'
   */
  gradientColors?: string;
  /**
   * Duration of the gradient transition
   * @default 'duration-500'
   */
  gradientDuration?: string;
}

/**
 * GradientButton Component
 * 
 * Extends the base Button component with a gradient overlay effect on hover.
 * Primarily used for primary CTAs and important actions.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <GradientButton>
 *   Start Your Journey
 * </GradientButton>
 * 
 * // With icon
 * <GradientButton>
 *   <Sparkles className="mr-2 h-4 w-4" />
 *   Create Magic
 * </GradientButton>
 * 
 * // Custom gradient
 * <GradientButton gradientColors="from-primary/30 to-transparent">
 *   Custom Gradient
 * </GradientButton>
 * 
 * // Disabled overlay
 * <GradientButton showGradientOverlay={false}>
 *   No Overlay
 * </GradientButton>
 * ```
 * 
 * @accessibility
 * - Inherits all accessibility features from base Button
 * - Gradient overlay is decorative and doesn't affect functionality
 * - Maintains proper contrast ratios with or without overlay
 */
export function GradientButton({
  children,
  className,
  showGradientOverlay = true,
  gradientColors = 'from-white/20 to-transparent',
  gradientDuration = 'duration-500',
  ...props
}: GradientButtonProps) {
  return (
    <Button
      className={cn(
        'relative overflow-hidden group',
        // Default primary button styles if no variant is specified
        !props.variant && 'bg-primary hover:bg-primary/90 text-primary-foreground',
        className
      )}
      {...props}
    >
      {/* Gradient overlay that appears on hover */}
      {showGradientOverlay && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity',
            gradientColors,
            gradientDuration
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Button content with relative positioning to stay above overlay */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </Button>
  );
}

// Named export for consistency
export default GradientButton;