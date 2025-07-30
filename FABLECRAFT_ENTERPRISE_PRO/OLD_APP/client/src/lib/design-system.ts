// Design System Utilities for Consistent Spacing & Typography

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
  '5xl': '6rem',    // 96px
  '6xl': '8rem',    // 128px
} as const;

export const typography = {
  fontSizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  lineHeights: {
    tight: '1.2',
    normal: '1.4',
    relaxed: '1.6',
    loose: '1.8',
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const animations = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easings: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Utility functions for consistent styling
export const createSpacing = (size: keyof typeof spacing) => spacing[size];

export const createTypography = (
  size: keyof typeof typography.fontSizes,
  weight?: keyof typeof typography.fontWeights,
  lineHeight?: keyof typeof typography.lineHeights
) => ({
  fontSize: typography.fontSizes[size],
  fontWeight: weight ? typography.fontWeights[weight] : typography.fontWeights.normal,
  lineHeight: lineHeight ? typography.lineHeights[lineHeight] : typography.lineHeights.normal,
});

// Component-specific utilities
export const cardStyles = {
  default: 'surface-elevated rounded-xl border border-border/30 shadow-md hover:shadow-lg transition-all duration-300',
  interactive: 'surface-elevated rounded-xl border border-border/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer',
  glassmorphism: 'glass-card rounded-xl border border-border/30 backdrop-blur-xl shadow-xl',
} as const;

export const buttonStyles = {
  primary: 'gradient-primary text-primary-foreground font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:brightness-110 rounded-2xl relative overflow-hidden',
  secondary: 'surface-elevated text-foreground border border-border hover:bg-accent/10 transition-all duration-300 rounded-xl',
} as const;