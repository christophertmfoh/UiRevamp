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
    button: "hover:bg-accent hover:text-accent-foreground transition-colors",
    ghost: "hover:bg-accent/10 hover:text-accent-foreground transition-colors",
    card: "hover:bg-accent/5 transition-colors cursor-pointer",
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
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", 
    ghost: themeClasses.interactive.ghost,
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
  },
  
  badge: "bg-secondary text-secondary-foreground",
  
  dropdown: cn(
    themeClasses.surface.elevated,
    "rounded-md shadow-lg"
  ),
} as const;

// Utility for creating theme-aware glass effects
export const glassEffect = "backdrop-blur-sm bg-background/80 border border-border/50";

// Utility for floating card effects
export const floatingCard = cn(
  componentClasses.card,
  "shadow-lg hover:shadow-xl transition-shadow duration-200"
);

// Replace hardcoded colors with theme variables
export const replaceHardcodedColors = {
  // Common slate replacements
  "bg-slate-900": "bg-background",
  "bg-slate-800": "bg-card", 
  "bg-slate-700": "bg-secondary",
  "bg-slate-600": "bg-muted",
  "text-slate-400": "text-muted-foreground",
  "text-slate-300": "text-secondary-foreground",
  "text-slate-200": "text-foreground",
  "border-slate-700": "border-border",
  "border-slate-600": "border-border/70",
  "hover:bg-slate-700": "hover:bg-accent",
  "hover:bg-slate-600": "hover:bg-accent/80",
} as const;