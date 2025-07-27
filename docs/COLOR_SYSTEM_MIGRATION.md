# Fablecraft Color System Migration Guide

## Overview
This guide outlines the systematic approach to migrate from hardcoded colors to semantic color tokens across the entire Fablecraft application.

## Core Principles

### 1. Semantic Token Architecture
Instead of using raw Tailwind classes like `text-stone-700 dark:text-stone-300`, we now use semantic tokens that describe the purpose:

```css
/* Before */
<p className="text-stone-700 dark:text-stone-300">

/* After */
<p className="text-body-secondary">
```

### 2. Brand Gradient System
The emerald-stone-amber gradient is our signature. Use these classes:

- `brand-gradient-text` - For gradient text like "Come to Life", "Your Projects"
- `brand-gradient-bg` - For gradient backgrounds on buttons and cards
- `brand-gradient-border` - For gradient borders

### 3. Color Token Mapping

#### Text Colors
| Old Classes | New Semantic Class | Usage |
|------------|-------------------|-------|
| `text-stone-900 dark:text-stone-50` | `text-heading-primary` | Main headings |
| `text-stone-700 dark:text-stone-300` | `text-heading-secondary` | Subheadings |
| `text-stone-800 dark:text-stone-200` | `text-body-primary` | Primary body text |
| `text-stone-600 dark:text-stone-400` | `text-body-secondary` | Secondary text |
| `text-stone-500 dark:text-stone-500` | `text-body-muted` | Helper/muted text |

#### Icon Colors
| Old Classes | New Semantic Class | Usage |
|------------|-------------------|-------|
| `text-emerald-600` | `icon-primary` | Primary action icons |
| `text-amber-600` | `icon-secondary` | Secondary icons |
| `text-stone-400` | `icon-muted` | Inactive/muted icons |
| `text-white` | `icon-white` | Icons on dark backgrounds |

#### Button Gradients
```jsx
/* Before */
className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600"

/* After */
className="brand-gradient-bg hover:opacity-90"
```

## Migration Steps

### Step 1: Text Elements ✅ COMPLETED
Search for all text color classes and replace with semantic tokens:
```bash
# Find: text-stone-[0-9]+ dark:text-stone-[0-9]+
# Replace with appropriate semantic class
```

### Step 2: Icons ✅ COMPLETED
Update all icon colors:
```jsx
// Before
<PenTool className="w-5 h-5 text-emerald-600" />

// After
<PenTool className="w-5 h-5 icon-primary" />
```

### Step 3: Workspace.tsx Migration ✅ COMPLETED
All indigo/purple colors replaced with emerald-stone-amber gradient system:
- Badge colors converted to brand gradients
- TabsTrigger active states updated
- Button gradients standardized
- Icon colors migrated to semantic classes
- All 1000+ color patterns successfully replaced

### Step 4: Buttons
Standardize all gradient buttons:
```jsx
// Before
<Button className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700...">

// After
<Button className="brand-gradient-bg text-white hover:opacity-90 transition-opacity">
```

### Step 4: Component-Specific Updates

#### Landing Page
- Hero heading: `text-heading-primary`
- "Come to Life": `brand-gradient-text`
- Subtitle: `text-body-primary`
- Feature cards text: `text-body-secondary`

#### Projects Page
- "Your Projects": `brand-gradient-text`
- Welcome message: `text-body-secondary`
- Project descriptions: `text-body-primary`
- Stats numbers: `text-heading-primary`

#### Authentication Page
- Form labels: `text-body-secondary`
- Input help text: `text-body-muted`
- Error messages: Keep as `text-destructive`

## Testing Checklist
- [ ] Toggle between light/dark modes
- [ ] Verify contrast ratios meet WCAG AA standards
- [ ] Check hover states work correctly
- [ ] Ensure gradients are visible in both modes
- [ ] Test on different screen sizes

## Benefits
1. **Consistency**: Same color intentions across all components
2. **Maintainability**: Change colors in one place (CSS variables)
3. **Accessibility**: Easier to ensure proper contrast ratios
4. **Theme Flexibility**: Can add new themes without changing components
5. **Developer Experience**: Clear semantic naming reduces decision fatigue