# 🔧 PRE-PHASE 3 CLEANUP & ENHANCEMENT PLAN
**Date:** January 2025  
**Purpose:** Complete all cleanup and tooling before starting Phase 3

---

## 📍 CURRENT PAGE URLS

### Available Routes:
- **Home Page:** http://localhost:5173/
- **Login Page:** http://localhost:5173/login
- **Dashboard Page:** http://localhost:5173/dashboard (requires authentication)

### How to Access:
1. Go to login page
2. Enter credentials: `user` / `password`
3. You'll be redirected to dashboard

---

## 🔍 DUPLICATE CODE ANALYSIS

### Finding: Duplication in `protected-route.tsx`
- **Location:** Same file, NOT across different builds
- **Lines:** 54-71 duplicated in 101-118
- **Issue:** `ProtectedRoute` and `RequireAuth` components have identical logic
- **Risk Level:** Low - Safe to refactor

### Solution:
Extract shared logic into a custom hook to eliminate duplication while maintaining both component APIs for flexibility.

---

## 🛠 TOOL COMPATIBILITY RESEARCH

### Current Stack:
- React 18.2.0
- Vite 7.0.0
- TypeScript 5.8.2
- Node >= 20.19.0
- ESLint 9.32.0 (flat config)

### Tool Compatibility Analysis:

#### 1. ✅ **bundlesize** - COMPATIBLE
```json
"bundlesize": "^0.18.2"
```
- Works with any bundler
- Vite compatible
- No conflicts

#### 2. ✅ **axe-core** - COMPATIBLE
```json
"axe-core": "^4.10.2",
"@axe-core/react": "^4.10.2"
```
- React 18 compatible
- TypeScript support
- Works with Vite

#### 3. ✅ **lighthouse-ci** - COMPATIBLE
```json
"@lhci/cli": "^0.14.0"
```
- Framework agnostic
- Works with any build output
- Node 20 compatible

#### 4. ✅ **eslint-plugin-jsx-a11y** - COMPATIBLE
```json
"eslint-plugin-jsx-a11y": "^6.10.2"
```
- ESLint 9 compatible
- React 18 support
- Flat config ready

#### 5. ⚠️ **Storybook** - NEEDS VITE 5
```json
"@storybook/react-vite": "^8.5.0"
```
- Requires Vite 5.x (we have 7.0.0)
- Alternative: Use Ladle (Vite 7 compatible)

#### 6. ✅ **depcheck** - COMPATIBLE
```json
"depcheck": "^1.4.7"
```
- Universal compatibility
- Works with any package manager

---

## 📋 IMPLEMENTATION PLAN

### STEP 1: Fix Duplicate Code in Auth Components
**Time: 15 minutes**

1. Create shared hook for auth logic
2. Refactor both components to use the hook
3. Test both components still work
4. Commit changes

### STEP 2: Install Compatible Analysis Tools
**Time: 20 minutes**

```bash
yarn add -D bundlesize axe-core @axe-core/react @lhci/cli eslint-plugin-jsx-a11y depcheck
```

### STEP 3: Configure Each Tool
**Time: 30 minutes**

#### A. Bundlesize Configuration
```json
// package.json
"bundlesize": [
  {
    "path": "dist/**/*.js",
    "maxSize": "200 KB"
  },
  {
    "path": "dist/**/*.css",
    "maxSize": "50 KB"
  }
]
```

#### B. Axe-core Setup
```typescript
// src/app/providers/axe-provider.tsx
import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

#### C. Lighthouse CI Config
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

#### D. ESLint A11y Plugin
```javascript
// eslint.config.js additions
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // ... existing config
  {
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },
];
```

### STEP 4: Add New Scripts
**Time: 10 minutes**

```json
// package.json scripts
"analyze:deps": "depcheck",
"analyze:bundle": "bundlesize",
"lint:a11y": "eslint . --ext .tsx,.jsx",
"lighthouse": "lhci autorun",
"check:all": "npm run lint && npm run lint:a11y && npm run type-check"
```

### STEP 5: Create GitHub Workflow
**Time: 15 minutes**

```yaml
# .github/workflows/code-quality.yml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: yarn install
      - run: yarn check:all
      - run: yarn analyze:bundle
      - run: yarn lighthouse
```

### STEP 6: Documentation
**Time: 10 minutes**

Update README with new tools and their usage.

---

## 🚀 EXECUTION ORDER

1. **Fix Duplicates First** (Priority: High)
   - Prevents future confusion
   - Improves code maintainability

2. **Install & Configure Tools** (Priority: Medium)
   - One tool at a time
   - Test each configuration

3. **Add Scripts & Workflows** (Priority: Low)
   - Automate quality checks
   - Enable CI/CD integration

4. **Documentation** (Priority: Low)
   - Update README
   - Add usage examples

---

## ⏱ TOTAL TIME ESTIMATE: 1.5-2 hours

### Benefits:
- Eliminate code duplication
- Automated accessibility checking
- Performance monitoring
- Bundle size tracking
- Dependency analysis

### No Breaking Changes:
All changes are additive or refactoring only. No functionality will be broken.

---

## 🎯 SUCCESS CRITERIA

- [ ] Auth components have no duplication
- [ ] All tools installed and configured
- [ ] New scripts working
- [ ] Documentation updated
- [ ] All tests still passing
- [ ] No TypeScript errors
- [ ] No ESLint errors

Ready to execute! 🚀