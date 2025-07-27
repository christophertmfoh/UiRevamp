import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme-aware class builders for consistent styling patterns
export const themeClasses = {
  // Surface/Background patterns
  surface: {
    base: "bg-background text-foreground",
    elevated: "bg-card text-card-foreground border border-border",
    muted: "bg-muted text-muted-foreground",
    subtle: "bg-secondary text-secondary-foreground",
  },
  
  // Interactive elements
  interactive: {
    button: "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
    ghost: "hover:bg-accent/10 hover:text-accent-foreground transition-colors duration-200",
    card: "hover:bg-accent/5 transition-colors duration-200 cursor-pointer",
  },
  
  // Input elements
  input: {
    base: "bg-input border-border text-foreground placeholder:text-muted-foreground",
    focus: "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
  },
  
  // Text patterns
  text: {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    accent: "text-accent-foreground",
    muted: "text-muted-foreground",
  },
  
  // Border patterns
  border: {
    base: "border-border",
    muted: "border-border/50",
    accent: "border-accent",
  },
  
  // Glass/blur effects
  glass: {
    card: "glass-card",
    bg: "bg-glass-bg border border-glass-border backdrop-blur-lg",
  },
  
  // Gradient patterns
  gradient: {
    primary: "gradient-primary",
    text: "gradient-text",
  },
} as const;

// Common component patterns using theme variables
export const componentClasses = {
  card: cn(
    themeClasses.surface.elevated,
    "rounded-lg shadow-sm"
  ),
  
  cardInteractive: cn(
    themeClasses.surface.elevated,
    themeClasses.interactive.card,
    "rounded-lg shadow-sm"
  ),
  
  input: cn(
    themeClasses.input.base,
    themeClasses.input.focus,
    "rounded-md px-3 py-2"
  ),
  
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200", 
    ghost: themeClasses.interactive.ghost,
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
  },
  
  badge: "bg-secondary text-secondary-foreground",
  
  dropdown: cn(
    themeClasses.surface.elevated,
    "rounded-md shadow-lg"
  ),
} as const;

// Utility for creating theme-aware glass effects
export const glassEffect = themeClasses.glass.bg;

// Utility for floating card effects
export const floatingCard = cn(
  componentClasses.card,
  "shadow-lg hover:shadow-xl transition-shadow duration-200"
);

// Replace hardcoded colors with theme variables - mapping guide
export const colorReplacements = {
  // Slate colors -> theme variables
  "bg-slate-50": "bg-background",
  "bg-slate-100": "bg-secondary", 
  "bg-slate-200": "bg-muted",
  "bg-slate-300": "bg-border",
  "bg-slate-400": "bg-muted",
  "bg-slate-500": "bg-muted",
  "bg-slate-600": "bg-secondary",
  "bg-slate-700": "bg-card",
  "bg-slate-800": "bg-card",
  "bg-slate-900": "bg-background",
  
  // Text colors
  "text-slate-50": "text-foreground",
  "text-slate-100": "text-foreground",
  "text-slate-200": "text-foreground", 
  "text-slate-300": "text-secondary-foreground",
  "text-slate-400": "text-muted-foreground",
  "text-slate-500": "text-muted-foreground",
  "text-slate-600": "text-secondary-foreground",
  "text-slate-700": "text-foreground",
  "text-slate-800": "text-foreground",
  "text-slate-900": "text-foreground",
  "text-white": "text-foreground",
  "text-black": "text-foreground",
  
  // Gray colors -> theme variables
  "bg-gray-50": "bg-background",
  "bg-gray-100": "bg-secondary",
  "bg-gray-200": "bg-muted", 
  "bg-gray-300": "bg-border",
  "bg-gray-400": "bg-muted",
  "bg-gray-500": "bg-muted",
  "bg-gray-600": "bg-secondary",
  "bg-gray-700": "bg-card",
  "bg-gray-800": "bg-card",
  "bg-gray-900": "bg-background",
  
  "text-gray-50": "text-foreground",
  "text-gray-100": "text-foreground",
  "text-gray-200": "text-foreground",
  "text-gray-300": "text-secondary-foreground", 
  "text-gray-400": "text-muted-foreground",
  "text-gray-500": "text-muted-foreground",
  "text-gray-600": "text-secondary-foreground",
  "text-gray-700": "text-foreground",
  "text-gray-800": "text-foreground", 
  "text-gray-900": "text-foreground",
  
  // Borders
  "border-slate-200": "border-border",
  "border-slate-300": "border-border",
  "border-slate-600": "border-border", 
  "border-slate-700": "border-border",
  "border-gray-200": "border-border",
  "border-gray-300": "border-border",
  
  // Glass effects with opacity
  "bg-white/80": "glass-card",
  "bg-white/90": "glass-card",
  "bg-slate-800/40": "glass-card",
  "bg-slate-800/50": "glass-card", 
  "bg-slate-800/60": "glass-card",
  "bg-slate-800/70": "glass-card",
  "bg-slate-800/80": "glass-card",
  "bg-slate-800/90": "glass-card",
  "bg-slate-900/70": "glass-card",
  "bg-slate-900/80": "glass-card",
  "bg-slate-900/90": "glass-card",
} as const;

// Helper function to get theme-aware gradient classes
export const getGradientClasses = () => ({
  primary: "bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end",
  text: "bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end bg-clip-text text-transparent",
  hover: "hover:bg-gradient-to-r hover:from-gradient-start hover:via-gradient-middle hover:to-gradient-end",
});

// Theme-aware status colors
export const statusColors = {
  success: {
    bg: "bg-success",
    text: "text-success-foreground", 
    border: "border-success",
  },
  warning: {
    bg: "bg-warning",
    text: "text-warning-foreground",
    border: "border-warning", 
  },
  error: {
    bg: "bg-destructive", 
    text: "text-destructive-foreground",
    border: "border-destructive",
  },
  info: {
    bg: "bg-info",
    text: "text-info-foreground",
    border: "border-info",
  },
};