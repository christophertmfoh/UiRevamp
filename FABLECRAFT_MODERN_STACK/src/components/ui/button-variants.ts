import { cva } from 'class-variance-authority';

/**
 * Button Variants
 *
 * Separated from button.tsx to comply with React Fast Refresh requirements.
 * Fast Refresh only works when a file only exports components.
 */

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active-press',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 hover-lift',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-lift',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground hover-lift',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover-lift',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Premium variants
        gradient: 'bg-gradient-to-r from-primary to-primary/60 text-primary-foreground hover:from-primary/90 hover:to-primary/50 hover-lift hover-glow shadow-lg',
        glow: 'bg-primary text-primary-foreground hover-glow hover-lift shadow-lg hover:shadow-primary/25',
        glass: 'glass-card text-foreground hover:bg-background/20 hover-lift border-border/50',
        premium: 'bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600 text-white hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-700 hover-lift hover-glow shadow-xl font-semibold tracking-wide',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
      animation: {
        none: '',
        subtle: 'hover:scale-105',
        bounce: 'hover:animate-bounce',
        pulse: 'animate-pulse',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none',
    },
  }
);

// Additional utility classes for special button states
export const loadingButtonClasses = 'cursor-wait opacity-70';
export const iconButtonClasses = 'p-0 hover:rotate-12 transition-transform';
