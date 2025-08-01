'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Glass morphism card variants
 * - light: Subtle glass effect with 95% opacity and medium blur
 * - heavy: Strong glass effect with 90% opacity and large blur
 * - elevated: Surface-elevated style with large blur for premium feel
 */
const glassCardVariants = cva(
  'rounded-xl border transition-all duration-300',
  {
    variants: {
      variant: {
        light: 'bg-card/95 backdrop-blur-md border-border/30 shadow-md hover:shadow-lg',
        heavy: 'bg-card/90 backdrop-blur-lg border-border/30 shadow-lg hover:shadow-xl',
        elevated: 'surface-elevated backdrop-blur-lg border-border/30 shadow-xl hover:shadow-2xl'
      },
      hover: {
        true: 'hover:scale-[1.02]',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'light',
      hover: false
    }
  }
);

export interface GlassCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  /**
   * Visual variant of the glass card
   * @default 'light'
   */
  variant?: 'light' | 'heavy' | 'elevated';
  /**
   * Enable hover scale effect
   * @default false
   */
  hover?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Card content
   */
  children?: React.ReactNode;
}

/**
 * GlassCard Component
 * 
 * A reusable glass morphism card with multiple visual variants.
 * Provides consistent styling for glass effects across the application.
 * 
 * @example
 * ```tsx
 * // Light glass card (default)
 * <GlassCard>
 *   <p>Card content</p>
 * </GlassCard>
 * 
 * // Heavy glass card with hover effect
 * <GlassCard variant="heavy" hover>
 *   <p>Premium content</p>
 * </GlassCard>
 * 
 * // Elevated card for auth forms
 * <GlassCard variant="elevated" className="p-6">
 *   <LoginForm />
 * </GlassCard>
 * ```
 * 
 * @accessibility
 * - Semantic HTML structure
 * - Proper contrast ratios maintained with backdrop-blur
 * - Focus visible states inherited from global styles
 */
export function GlassCard({
  variant = 'light',
  hover = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(glassCardVariants({ variant, hover }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Named export for consistency
export default GlassCard;