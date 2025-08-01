/**
 * Design Tokens Tests
 * Validates token structure, naming conventions, and values
 */

import { describe, it, expect } from 'vitest';
import { tokens, primitiveTokens, semanticTokens, componentTokens, generateCSSVariables } from './index';

describe('Design Tokens System', () => {
  describe('Primitive Tokens', () => {
    it('should have all required color scales', () => {
      expect(primitiveTokens.colors).toHaveProperty('gray');
      expect(primitiveTokens.colors).toHaveProperty('brand');
      
      // Verify gray scale has all shades
      const grayShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
      grayShades.forEach(shade => {
        expect(primitiveTokens.colors.gray).toHaveProperty(shade);
      });
    });

    it('should have golden ratio typography scale', () => {
      const goldenScales = ['golden-xs', 'golden-sm', 'golden-md', 'golden-lg', 'golden-xl', 'golden-2xl', 'golden-3xl', 'golden-4xl', 'golden-5xl'];
      goldenScales.forEach(scale => {
        expect(primitiveTokens.typography.fontSizes).toHaveProperty(scale);
      });
    });

    it('should have friendship-based spacing system', () => {
      const friendshipLevels = ['strangers', 'neighbors', 'acquaintances', 'friends', 'close-friends', 'best-friends', 'family'];
      friendshipLevels.forEach(level => {
        expect(primitiveTokens.spacing).toHaveProperty(level);
      });
    });

    it('should have animation tokens with proper durations', () => {
      expect(primitiveTokens.animation.duration).toHaveProperty('instant');
      expect(primitiveTokens.animation.duration.instant).toBe('0ms');
      expect(primitiveTokens.animation.duration.fast).toBe('150ms');
      expect(primitiveTokens.animation.duration.normal).toBe('300ms');
    });
  });

  describe('Semantic Tokens', () => {
    it('should map to CSS variables for theming', () => {
      expect(semanticTokens.colors.background.primary).toContain('var(--background)');
      expect(semanticTokens.colors.text.primary).toContain('var(--foreground)');
      expect(semanticTokens.colors.interactive.primary).toContain('var(--primary)');
    });

    it('should have semantic spacing values', () => {
      expect(semanticTokens.spacing.component.padding).toBe(primitiveTokens.spacing.friends);
      expect(semanticTokens.spacing.section.padding).toBe(primitiveTokens.spacing.neighbors);
      expect(semanticTokens.spacing.page.maxWidth).toBe('80rem');
    });
  });

  describe('Component Tokens', () => {
    it('should have button size variants', () => {
      expect(componentTokens.button.padding).toHaveProperty('sm');
      expect(componentTokens.button.padding).toHaveProperty('md');
      expect(componentTokens.button.padding).toHaveProperty('lg');
      
      expect(componentTokens.button.fontSize).toHaveProperty('sm');
      expect(componentTokens.button.fontSize).toHaveProperty('md');
      expect(componentTokens.button.fontSize).toHaveProperty('lg');
    });

    it('should have glass card variants', () => {
      expect(componentTokens.card.glass.light).toContain('bg-card/95');
      expect(componentTokens.card.glass.heavy).toContain('bg-card/90');
      expect(componentTokens.card.glass.elevated).toContain('surface-elevated');
    });

    it('should have consistent border radius references', () => {
      expect(componentTokens.card.borderRadius).toBe('var(--radius)');
      expect(componentTokens.input.borderRadius).toBe('calc(var(--radius) - 2px)');
    });
  });

  describe('Token Naming Conventions', () => {
    it('should follow kebab-case for multi-word tokens', () => {
      const spacingKeys = Object.keys(primitiveTokens.spacing);
      spacingKeys.forEach(key => {
        if (key.includes(' ')) {
          fail(`Spacing key "${key}" contains spaces. Use kebab-case instead.`);
        }
      });
    });

    it('should have consistent naming patterns', () => {
      // Check that all color tokens are objects with proper structure
      Object.values(semanticTokens.colors).forEach(colorGroup => {
        expect(typeof colorGroup).toBe('object');
      });
    });
  });

  describe('CSS Variable Generation', () => {
    it('should generate valid CSS custom properties', () => {
      const cssVars = generateCSSVariables();
      
      expect(cssVars).toContain('--space-strangers: 3rem;');
      expect(cssVars).toContain('--text-golden-md: 1rem;');
      expect(cssVars).toContain('--duration-normal: 300ms;');
    });

    it('should generate variables with proper formatting', () => {
      const cssVars = generateCSSVariables();
      const lines = cssVars.split('\n');
      
      lines.forEach(line => {
        if (line.trim()) {
          expect(line).toMatch(/^--[\w-]+: .+;$/);
        }
      });
    });
  });

  describe('Token Type Safety', () => {
    it('should export proper TypeScript types', () => {
      // Type checking happens at compile time
      // This test ensures the exports exist
      expect(tokens).toHaveProperty('primitive');
      expect(tokens).toHaveProperty('semantic');
      expect(tokens).toHaveProperty('component');
    });
  });

  describe('Token Hierarchy', () => {
    it('should properly reference primitive tokens in semantic tokens', () => {
      // Verify semantic tokens reference primitive tokens
      expect(semanticTokens.spacing.component.padding).toBe(primitiveTokens.spacing.friends);
      expect(semanticTokens.spacing.component.gap).toBe(primitiveTokens.spacing['best-friends']);
    });

    it('should properly reference primitive tokens in component tokens', () => {
      // Verify component tokens reference primitive tokens
      expect(componentTokens.button.fontSize.md).toBe(primitiveTokens.typography.fontSizes['golden-md']);
      expect(componentTokens.card.padding).toBe(primitiveTokens.spacing.acquaintances);
    });
  });
});