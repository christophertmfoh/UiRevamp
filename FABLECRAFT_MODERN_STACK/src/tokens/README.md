# Design Tokens System

## Overview

The design tokens system provides a single source of truth for all design values in the Fablecraft application. It follows a three-tier hierarchy:

1. **Primitive Tokens** - Raw design values
2. **Semantic Tokens** - Meaning-based values that map to CSS variables
3. **Component Tokens** - Component-specific values

## Token Hierarchy

```
primitive tokens (raw values)
    ↓
semantic tokens (meaningful names)
    ↓
component tokens (specific use cases)
```

## Usage

```typescript
import { tokens } from '@/tokens';

// Access primitive tokens
const primarySpacing = tokens.primitive.spacing.friends;

// Access semantic tokens
const backgroundColor = tokens.semantic.colors.background.primary;

// Access component tokens
const buttonPadding = tokens.component.button.padding.md;
```

## Naming Conventions

### Spacing (Friendship Levels)
Based on social proximity metaphor:
- `strangers` (3rem) - Maximum distance
- `neighbors` (2rem) - Polite distance
- `acquaintances` (1.5rem) - Comfortable space
- `friends` (1rem) - Close but not too close
- `close-friends` (0.75rem) - Closer together
- `best-friends` (0.5rem) - Very close
- `family` (0.25rem) - Minimal space

### Typography (Golden Ratio)
Scale based on golden ratio (1.618):
- `golden-xs` through `golden-5xl`
- Each step multiplies by ~1.618

### Colors
- **Primitive**: Direct color values (gray scale, brand colors)
- **Semantic**: Purpose-based (background, text, interactive, feedback)
- **Component**: Component-specific overrides

## CSS Variable Generation

The system can generate CSS custom properties:

```typescript
import { generateCSSVariables } from '@/tokens';

const cssVars = generateCSSVariables();
// Output:
// --space-strangers: 3rem;
// --text-golden-md: 1rem;
// --duration-normal: 300ms;
```

## Theme Support

Semantic tokens reference CSS variables for theme switching:
- `hsl(var(--background))` - Adapts to current theme
- `hsl(var(--primary))` - Theme-aware primary color
- `hsl(var(--foreground))` - Theme-aware text color

## Testing

Run token validation tests:
```bash
npm test src/tokens/tokens.test.ts
```

## Best Practices

1. **Always use tokens** - Never hardcode values
2. **Start with semantic tokens** - Use primitive tokens only when needed
3. **Component tokens for consistency** - Use component tokens for component-specific values
4. **Type safety** - Import types for autocomplete and validation

```typescript
import type { DesignTokens } from '@/tokens';
```