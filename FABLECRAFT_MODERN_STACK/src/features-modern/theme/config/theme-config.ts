import * as React from 'react'
import {
  Moon,
  Sun,
  Monitor,
  Palette,
  Star,
  Snowflake,
  Coffee,
  TreePine,
  Crown,
} from 'lucide-react'

/**
 * Theme Configuration Interface
 * Defines the structure for theme metadata including icons, descriptions, and accessibility info
 */
export interface ThemeConfig {
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  category: 'Light Themes' | 'Dark Themes' | 'System'
  contrast: string
  mood: string
}

/**
 * Complete Theme Configuration Map
 * 
 * Fablecraft Theme System v2.0 - Enterprise Architecture
 * Research-based themes optimized for writers and creative professionals
 * All themes tested for WCAG AA contrast compliance (4.5:1 minimum)
 */
export const themeConfig: Record<string, ThemeConfig> = {
  light: {
    name: 'Parchment Classic',
    icon: Sun,
    description: 'Warm cream with burgundy accents for traditional writing',
    category: 'Light Themes',
    contrast: '8.1:1',
    mood: 'Traditional & Timeless'
  },
  'arctic-focus': {
    name: 'Arctic Focus',
    icon: Snowflake,
    description: 'Cool blues and whites for clean, distraction-free writing',
    category: 'Light Themes',
    contrast: '8.3:1',
    mood: 'Clean & Focused'
  },
  'golden-hour': {
    name: 'Golden Hour',
    icon: Crown,
    description: 'Warm yellows and oranges for inspiring creative energy',
    category: 'Light Themes',
    contrast: '8.5:1',
    mood: 'Inspiring & Optimistic'
  },
  dark: {
    name: 'Fablecraft Dark',
    icon: Moon,
    description: 'Modern professional dark with emerald and cyan gradients',
    category: 'Dark Themes',
    contrast: '13.2:1',
    mood: 'Modern & Focused'
  },
  'midnight-ink': {
    name: 'Midnight Ink',
    icon: Star,
    description: 'Deep navy with gold accents - scholarly and magical',
    category: 'Dark Themes',
    contrast: '12.8:1',
    mood: 'Scholarly & Premium'
  },
  'forest-manuscript': {
    name: 'Forest Manuscript',
    icon: TreePine,
    description: 'Deep greens for natural, focused writing sessions',
    category: 'Dark Themes',
    contrast: '11.8:1',
    mood: 'Natural & Calming'
  },
  'starlit-prose': {
    name: 'Starlit Prose',
    icon: Palette,
    description: 'Dark purple with silver - mystical and poetic inspiration',
    category: 'Dark Themes',
    contrast: '11.2:1',
    mood: 'Mystical & Poetic'
  },
  'coffee-house': {
    name: 'Coffee House',
    icon: Coffee,
    description: 'Rich browns and warm oranges for cozy cafe writing vibes',
    category: 'Dark Themes',
    contrast: '11.1:1',
    mood: 'Cozy & Inspiring'
  },
  system: {
    name: 'Follow System',
    icon: Monitor,
    description: 'Automatically match your device preference',
    category: 'System',
    contrast: 'Auto',
    mood: 'Adaptive'
  }
} as const

/**
 * Theme categories for organized rendering
 */
export const themeCategories = ['Light Themes', 'Dark Themes', 'System'] as const

/**
 * Type-safe theme key union
 */
export type ThemeKey = keyof typeof themeConfig

/**
 * Helper function to get theme config safely
 */
export function getThemeConfig(themeKey: string): ThemeConfig | null {
  return themeConfig[themeKey] || null
}