# 🥄 LADLE INTEGRATION PLAN - PROPER SETUP
**Date:** January 2025

---

## 🔍 AUDIT: WHAT'S MISSING

### Current Issues:
1. ❌ Themes not working - ThemeProvider not integrated
2. ❌ Global styles not imported properly
3. ❌ No TypeScript types for Ladle
4. ❌ Path aliases (@/) not configured for Ladle
5. ❌ Theme toggle not synced with Ladle's controls

### What Needs Integration:
1. **ThemeProvider** - Custom theme provider with 15+ themes
2. **Global CSS** - index.css and variables.css
3. **Path Aliases** - @/ imports need to work
4. **Theme Switching** - Sync with Ladle's built-in theme control
5. **Tailwind Classes** - Ensure they work in stories

---

## 📚 RESEARCH FINDINGS

### Best Practices from Ladle Docs:
1. Use `.ladle/components.tsx` for global providers
2. Import CSS files in the provider file
3. Use `globalState.theme` to sync with Ladle's theme switcher
4. Create `vite.config.ts` for path aliases
5. Use `GlobalProvider` type from `@ladle/react`

### Key Ladle Features:
- Built-in theme switching (light/dark)
- RTL support
- Background color control
- Global state management
- Zero config but customizable

---

## 🎯 IMPLEMENTATION PLAN

### Step 1: Create Proper .ladle/components.tsx
```typescript
import type { GlobalProvider } from '@ladle/react'
import '../src/index.css'
import '../src/shared/lib/theme/variables.css'
import { ThemeProvider } from '../src/app/providers/theme-provider'

export const Provider: GlobalProvider = ({ children, globalState }) => {
  // Map Ladle's theme to our theme system
  const theme = globalState.theme === 'dark' ? 'dark' : 'light'
  
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme={theme}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

// Global args for all stories
export const argTypes = {
  background: {
    control: { type: 'background' },
    options: ['white', 'gray', 'dark', 'primary'],
    defaultValue: 'white',
  },
}
```

### Step 2: Create vite.config.ts for Ladle
```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Step 3: Add Ladle TypeScript Types
```typescript
// ladle.d.ts
declare module '@ladle/react' {
  export interface GlobalState {
    theme: 'light' | 'dark'
    rtl: boolean
    background?: string
  }
}
```

### Step 4: Update Theme Toggle Story
- Add controls for all 15 themes
- Sync with Ladle's theme state
- Show theme preview colors

### Step 5: Create .ladle/config.mjs
```javascript
export default {
  stories: 'src/**/*.stories.{js,jsx,ts,tsx,mdx}',
  defaultStory: 'ui-components--button--default',
  // Enable addons
  addons: {
    theme: {
      enabled: true,
      defaultState: 'light',
    },
    rtl: {
      enabled: true,
      defaultState: false,
    },
    mode: {
      enabled: true,
      defaultState: 'full',
    },
    control: {
      enabled: true,
      defaultState: true,
    },
  },
}
```

---

## 🛠️ FIXES NEEDED

1. **Import Order**
   - CSS must be imported BEFORE providers
   - Theme variables need to be available globally

2. **Theme Sync**
   - Ladle theme control → Our ThemeProvider
   - Support all 15 custom themes
   - Dark/light mode detection

3. **CSS Modules**
   - Ensure Tailwind classes work
   - PostCSS configuration if needed

4. **Path Resolution**
   - @/ imports must resolve correctly
   - Consistent with main app

---

## ✅ SUCCESS CRITERIA

- [ ] All themes work in Ladle
- [ ] Theme toggle syncs with Ladle controls
- [ ] All components styled correctly
- [ ] No CSS missing
- [ ] TypeScript types working
- [ ] Path aliases resolved
- [ ] Hot reload working
- [ ] All existing stories display properly

---

## 🚀 BENEFITS

1. **Proper Theme Testing** - Test all 15 themes easily
2. **Consistent Styling** - Same styles as main app
3. **Better DX** - TypeScript support, path aliases
4. **Team Collaboration** - Self-documenting components
5. **Visual Testing** - Catch theme bugs early