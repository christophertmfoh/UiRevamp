import * as React from 'react';
import { cn } from '@/lib/utils';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

/**
 * Enhanced Card Variants
 */
export type EnhancedCardVariant = 'default' | 'glass' | 'gradient' | 'glow';
export type EnhancedCardHover = 'none' | 'lift' | 'glow' | 'scale' | 'all';

/**
 * Enhanced Card Props Interface
 */
export interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: EnhancedCardVariant;
  hover?: EnhancedCardHover;
  animate?: boolean;
  glowColor?: string;
}

/**
 * ENHANCED CARD COMPONENT
 * 
 * Premium card component with multiple variants and hover effects.
 * Extends the base Card component with:
 * - Glass morphism effect
 * - Gradient backgrounds
 * - Hover animations
 * - Glow effects
 * - Smooth transitions
 */
const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    variant = 'default', 
    hover = 'lift',
    animate = true,
    glowColor,
    children,
    ...props 
  }, ref) => {
    // Build variant classes
    const variantClasses = {
      default: 'bg-card border-border',
      glass: 'glass-card',
      gradient: 'bg-gradient-to-br from-card to-card/80 border-border/50',
      glow: 'bg-card border-primary/20',
    };

    // Build hover classes
    const hoverClasses = {
      none: '',
      lift: 'hover-lift',
      glow: 'hover-glow',
      scale: 'hover-scale',
      all: 'hover-lift hover-glow hover-scale',
    };

    // Custom glow color style
    const customStyle = glowColor ? {
      '--glow-color': glowColor,
    } as React.CSSProperties : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg shadow-sm',
          variantClasses[variant],
          animate && hoverClasses[hover],
          animate && 'transition-all duration-300 ease-out',
          animate && 'animate-fade-in',
          className
        )}
        style={customStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EnhancedCard.displayName = 'EnhancedCard';

/**
 * ENHANCED CARD HEADER
 * Extends CardHeader with premium styling
 */
const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn('space-friends', className)}
    {...props}
  />
));
EnhancedCardHeader.displayName = 'EnhancedCardHeader';

/**
 * ENHANCED CARD TITLE
 * Extends CardTitle with gradient text option
 */
interface EnhancedCardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

const EnhancedCardTitle = React.forwardRef<
  HTMLDivElement,
  EnhancedCardTitleProps
>(({ className, gradient = false, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn(
      gradient && 'gradient-text',
      'text-golden-lg',
      className
    )}
    {...props}
  />
));
EnhancedCardTitle.displayName = 'EnhancedCardTitle';

/**
 * ENHANCED CARD CONTENT
 * Extends CardContent with better spacing
 */
const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn('space-friends', className)}
    {...props}
  />
));
EnhancedCardContent.displayName = 'EnhancedCardContent';

/**
 * FLOATING CARD COMPONENT
 * Special variant with float animation
 */
const FloatingCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <EnhancedCard
        ref={ref}
        variant="glass"
        hover="all"
        className={cn('animate-float', className)}
        {...props}
      >
        {children}
      </EnhancedCard>
    );
  }
);
FloatingCard.displayName = 'FloatingCard';

/**
 * INTERACTIVE CARD COMPONENT
 * Card optimized for click interactions
 */
const InteractiveCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, children, onClick, ...props }, ref) => {
    return (
      <EnhancedCard
        ref={ref}
        variant="default"
        hover="all"
        className={cn(
          'cursor-pointer active-press',
          'hover:border-primary/50',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {children}
      </EnhancedCard>
    );
  }
);
InteractiveCard.displayName = 'InteractiveCard';

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardContent,
  FloatingCard,
  InteractiveCard,
  // Re-export base components for convenience
  CardDescription,
  CardFooter,
};