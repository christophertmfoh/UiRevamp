/**
 * Design Tokens System
 * Central source of truth for all design values
 * 
 * Token Hierarchy:
 * 1. Primitive tokens (raw values)
 * 2. Semantic tokens (meaning-based)
 * 3. Component tokens (component-specific)
 */

// Import existing theme values from Tailwind config
import type { Config } from 'tailwindcss';

/**
 * Primitive Tokens - Raw design values
 */
export const primitiveTokens = {
  // Colors - HSL values from CSS variables
  colors: {
    // Core palette
    gray: {
      50: 'hsl(0 0% 98%)',
      100: 'hsl(240 4.8% 95.9%)',
      200: 'hsl(240 5.9% 90%)',
      300: 'hsl(240 4.9% 83.9%)',
      400: 'hsl(240 5% 64.9%)',
      500: 'hsl(240 3.8% 46.1%)',
      600: 'hsl(240 5.2% 33.9%)',
      700: 'hsl(240 5.3% 26.1%)',
      800: 'hsl(240 3.7% 15.9%)',
      900: 'hsl(240 5.9% 10%)',
      950: 'hsl(240 7.3% 8%)',
    },
    brand: {
      orange: '#ed7326',
      orangeDark: '#d4641f',
      orangeLight: '#f5a662',
    },
  },
  
  // Typography - Golden Ratio Scale (1.618)
  typography: {
    fontSizes: {
      'golden-xs': '0.618rem',   // ~9.88px
      'golden-sm': '0.764rem',   // ~12.23px
      'golden-md': '1rem',       // 16px (base)
      'golden-lg': '1.618rem',   // ~25.88px
      'golden-xl': '2.618rem',   // ~41.85px
      'golden-2xl': '4.236rem',  // ~67.67px
      'golden-3xl': '6.854rem',  // ~109.46px
      'golden-4xl': '11.089rem', // ~177.11px
      'golden-5xl': '17.942rem', // ~286.57px
    },
    fontWeights: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    fontFamilies: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      serif: ['Playfair Display', 'ui-serif', 'Georgia'],
      mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
    },
  },
  
  // Spacing - Friendship Levels (Mathematical scale)
  spacing: {
    // Base unit: 0.25rem (4px)
    'strangers': '3rem',      // 48px - Maximum distance
    'neighbors': '2rem',      // 32px - Polite distance
    'acquaintances': '1.5rem', // 24px - Comfortable space
    'friends': '1rem',        // 16px - Close but not too close
    'close-friends': '0.75rem', // 12px - Closer together
    'best-friends': '0.5rem', // 8px - Very close
    'family': '0.25rem',      // 4px - Minimal space
  },
  
  // Animation
  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
} as const;

/**
 * Semantic Tokens - Meaning-based values
 * These map to CSS variables for theme support
 */
export const semanticTokens = {
  colors: {
    // Background
    background: {
      primary: 'hsl(var(--background))',
      secondary: 'hsl(var(--card))',
      elevated: 'hsl(var(--popover))',
    },
    
    // Foreground
    text: {
      primary: 'hsl(var(--foreground))',
      secondary: 'hsl(var(--muted-foreground))',
      inverse: 'hsl(var(--card-foreground))',
    },
    
    // Interactive
    interactive: {
      primary: 'hsl(var(--primary))',
      primaryHover: 'hsl(var(--primary) / 0.9)',
      secondary: 'hsl(var(--secondary))',
      secondaryHover: 'hsl(var(--secondary) / 0.9)',
    },
    
    // Feedback
    feedback: {
      error: 'hsl(var(--destructive))',
      errorText: 'hsl(var(--destructive-foreground))',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(38 92% 50%)',
      info: 'hsl(var(--primary))',
    },
    
    // Borders
    border: {
      default: 'hsl(var(--border))',
      focus: 'hsl(var(--ring))',
      input: 'hsl(var(--input))',
    },
  },
  
  // Spacing shortcuts
  spacing: {
    component: {
      padding: primitiveTokens.spacing.friends,
      gap: primitiveTokens.spacing['best-friends'],
    },
    section: {
      padding: primitiveTokens.spacing.neighbors,
      gap: primitiveTokens.spacing.acquaintances,
    },
    page: {
      padding: primitiveTokens.spacing.strangers,
      maxWidth: '80rem', // 1280px
    },
  },
} as const;

/**
 * Component Tokens - Component-specific values
 */
export const componentTokens = {
  button: {
    padding: {
      sm: `${primitiveTokens.spacing.family} ${primitiveTokens.spacing['best-friends']}`,
      md: `${primitiveTokens.spacing['best-friends']} ${primitiveTokens.spacing.friends}`,
      lg: `${primitiveTokens.spacing['close-friends']} ${primitiveTokens.spacing.acquaintances}`,
    },
    fontSize: {
      sm: primitiveTokens.typography.fontSizes['golden-sm'],
      md: primitiveTokens.typography.fontSizes['golden-md'],
      lg: primitiveTokens.typography.fontSizes['golden-lg'],
    },
  },
  
  card: {
    glass: {
      light: 'bg-card/95 backdrop-blur-md',
      heavy: 'bg-card/90 backdrop-blur-lg',
      elevated: 'surface-elevated backdrop-blur-lg',
    },
    padding: primitiveTokens.spacing.acquaintances,
    borderRadius: 'var(--radius)',
  },
  
  input: {
    padding: `${primitiveTokens.spacing['best-friends']} ${primitiveTokens.spacing['close-friends']}`,
    fontSize: primitiveTokens.typography.fontSizes['golden-md'],
    borderRadius: 'calc(var(--radius) - 2px)',
  },
} as const;

/**
 * Export combined tokens for easy access
 */
export const tokens = {
  primitive: primitiveTokens,
  semantic: semanticTokens,
  component: componentTokens,
} as const;

/**
 * Type exports for TypeScript support
 */
export type PrimitiveTokens = typeof primitiveTokens;
export type SemanticTokens = typeof semanticTokens;
export type ComponentTokens = typeof componentTokens;
export type DesignTokens = typeof tokens;

/**
 * Utility function to generate CSS custom properties
 */
export function generateCSSVariables(): string {
  const cssVars: string[] = [];
  
  // Generate spacing variables
  Object.entries(primitiveTokens.spacing).forEach(([key, value]) => {
    cssVars.push(`--space-${key}: ${value};`);
  });
  
  // Generate typography variables
  Object.entries(primitiveTokens.typography.fontSizes).forEach(([key, value]) => {
    cssVars.push(`--text-${key}: ${value};`);
  });
  
  // Generate animation variables
  Object.entries(primitiveTokens.animation.duration).forEach(([key, value]) => {
    cssVars.push(`--duration-${key}: ${value};`);
  });
  
  return cssVars.join('\n');
}