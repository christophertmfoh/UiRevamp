# PHASE 6: PRODUCTION STANDARDS REFACTOR
## Complete Guide for Replit & Cursor IDE Implementation

### 🎯 OBJECTIVE
Transform FableCraft from mixed architecture to production-grade React TypeScript application following 2025 industry standards.

---

## 📋 PHASE 6 COMPLETE TASK LIST

### PART A: ARCHITECTURAL RESTRUCTURE (Days 1-2)

#### A1. PROJECT ROOT CLEANUP ⚡ CRITICAL
```bash
# Current messy root structure → Clean monorepo structure
```

**BEFORE:**
```
fablecraft/
├── backend/              # ❌ Mixed structure
├── client/               # ❌ Unclear boundaries  
├── server/               # ❌ Duplicate backend
├── PHASE_*.md           # ❌ Docs in root
├── REFACTOR_*.md        # ❌ Planning files in root
└── 15+ other files      # ❌ Root clutter
```

**AFTER (2025 Standard):**
```
fablecraft/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── features/       # ✅ Feature-first organization
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── types/
│   │   │   │   │   └── index.ts    # Barrel export
│   │   │   │   ├── writing/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── WritingEditor/
│   │   │   │   │   │   │   ├── WritingEditor.tsx
│   │   │   │   │   │   │   ├── WritingEditor.test.tsx
│   │   │   │   │   │   │   ├── WritingEditor.types.ts
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── DocumentList/
│   │   │   │   │   │   └── AutoSave/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   ├── useWritingSession.ts
│   │   │   │   │   │   ├── useAutoSave.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── documentApi.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── types/
│   │   │   │   │   │   ├── document.types.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── characters/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── CharacterForm/
│   │   │   │   │   │   ├── CharacterList/
│   │   │   │   │   │   └── CharacterProfile/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── projects/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ProjectGrid/
│   │   │   │   │   │   ├── ProjectCard/
│   │   │   │   │   │   └── CreateProject/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── ai/
│   │   │   │       ├── components/
│   │   │   │       │   ├── AIAssistant/
│   │   │   │       │   └── ChatInterface/
│   │   │   │       ├── hooks/
│   │   │   │       ├── services/
│   │   │   │       │   ├── geminiApi.ts
│   │   │   │       │   └── openaiApi.ts
│   │   │   │       └── index.ts
│   │   │   ├── shared/             # ✅ Shared across features
│   │   │   │   ├── components/
│   │   │   │   │   ├── ui/         # Design system components
│   │   │   │   │   │   ├── Button/
│   │   │   │   │   │   ├── Input/
│   │   │   │   │   │   ├── Modal/
│   │   │   │   │   │   ├── Toast/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── layout/
│   │   │   │   │   │   ├── Header/
│   │   │   │   │   │   ├── Sidebar/
│   │   │   │   │   │   ├── Footer/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useTheme.ts
│   │   │   │   │   ├── useLocalStorage.ts
│   │   │   │   │   ├── useDebounce.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── utils/
│   │   │   │   │   ├── api.ts
│   │   │   │   │   ├── storage.ts
│   │   │   │   │   ├── validation.ts
│   │   │   │   │   ├── formatters.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── types/
│   │   │   │   │   ├── api.types.ts
│   │   │   │   │   ├── common.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── constants/
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   ├── config.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── providers/
│   │   │   │       ├── QueryProvider.tsx
│   │   │   │       ├── ThemeProvider.tsx
│   │   │   │       ├── AuthProvider.tsx
│   │   │   │       └── index.ts
│   │   │   ├── pages/              # ✅ Route components only
│   │   │   │   ├── HomePage/
│   │   │   │   │   ├── HomePage.tsx
│   │   │   │   │   ├── HomePage.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── AuthPage/
│   │   │   │   ├── WorkspacePage/
│   │   │   │   ├── WritingPage/
│   │   │   │   └── index.ts
│   │   │   ├── layouts/
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── AuthLayout.tsx
│   │   │   │   └── index.ts
│   │   │   ├── assets/
│   │   │   │   ├── images/
│   │   │   │   ├── icons/
│   │   │   │   └── fonts/
│   │   │   ├── styles/
│   │   │   │   ├── globals.css
│   │   │   │   ├── components.css
│   │   │   │   └── themes.css
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── router.tsx
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   └── README.md
│   └── api/                       # Express backend
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middleware/
│       │   ├── types/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/                      # ✅ Shared packages
│   ├── shared-types/              # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── user.types.ts
│   │   │   ├── project.types.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ui-components/             # Future: Shared UI library
├── docs/                          # ✅ Documentation organized
│   ├── architecture/
│   ├── development/
│   ├── deployment/
│   └── phases/
├── tools/                         # ✅ Development tools
│   ├── scripts/
│   └── configs/
├── .gitignore
├── package.json                   # Workspace root
├── tsconfig.json                  # Base TypeScript config
├── README.md
└── replit.md
```

**🎯 REPLIT/CURSOR COMMANDS:**
```bash
# 1. Create new structure
mkdir -p apps/web/src/{features,shared,pages,layouts,assets,styles}
mkdir -p apps/api/src/{routes,services,middleware,types}
mkdir -p packages/shared-types/src
mkdir -p docs/{architecture,development,deployment,phases}
mkdir -p tools/{scripts,configs}

# 2. Move current files (will detail in implementation steps)
# 3. Update all imports
# 4. Clean up old structure
```

---

#### A2. FEATURE-FIRST ORGANIZATION ⚡ CRITICAL

**TASK: Reorganize by Feature, Not File Type**

**Current Problems:**
```typescript
// ❌ BAD: Type-based organization
import { CharacterForm } from '../components/character/CharacterForm'
import { useAuth } from '../hooks/useAuth'
import { projectApi } from '../lib/services/projectApi'
```

**Production Solution:**
```typescript
// ✅ GOOD: Feature-based organization
import { CharacterForm, useCharacterForm } from '@features/characters'
import { useAuth } from '@features/auth'
import { useProjects } from '@features/projects'
```

**🎯 IMPLEMENTATION STEPS:**

1. **Create Feature Modules:**
```bash
# Each feature is self-contained
mkdir -p apps/web/src/features/{auth,writing,characters,projects,ai}/
mkdir -p apps/web/src/features/{auth,writing,characters,projects,ai}/{components,hooks,services,types}
```

2. **Move Components by Domain:**
```bash
# Characters feature
mv client/src/components/character/* apps/web/src/features/characters/components/
mv client/src/hooks/*Character* apps/web/src/features/characters/hooks/

# Writing feature  
mv client/src/components/writing/* apps/web/src/features/writing/components/
mv client/src/hooks/*Writing* apps/web/src/features/writing/hooks/

# Projects feature
mv client/src/components/project* apps/web/src/features/projects/components/
mv client/src/hooks/*Project* apps/web/src/features/projects/hooks/
```

3. **Add Barrel Exports:**
```typescript
// apps/web/src/features/characters/index.ts
export * from './components'
export * from './hooks'
export * from './services'
export * from './types'

// Clean import paths throughout app
```

---

#### A3. TYPESCRIPT ORGANIZATION ⚡ CRITICAL

**TASK: Proper TypeScript Architecture**

**Current Problems:**
- Types scattered across files
- No shared type definitions
- Inconsistent type exports

**Production Solution:**
```typescript
// packages/shared-types/src/index.ts
export interface User {
  id: string
  email: string
  profile: UserProfile
}

export interface Project {
  id: string
  title: string
  type: ProjectType
  author: User
}

// Feature-specific types
// apps/web/src/features/writing/types/index.ts
export interface WritingSession {
  projectId: string
  startTime: Date
  wordsWritten: number
}
```

**🎯 IMPLEMENTATION STEPS:**

1. **Create Shared Types Package:**
```bash
mkdir -p packages/shared-types/src
# Move all shared interfaces here
```

2. **Feature-Specific Types:**
```bash
# Each feature manages its own types
mkdir -p apps/web/src/features/*/types
```

3. **Clean Import Paths:**
```typescript
// tsconfig.json paths
{
  "paths": {
    "@features/*": ["src/features/*"],
    "@shared/*": ["src/shared/*"],
    "@types/*": ["../../packages/shared-types/src/*"]
  }
}
```

---

### PART B: COMPONENT ARCHITECTURE (Days 3-4)

#### B1. COMPONENT STANDARDIZATION ⚡ HIGH

**TASK: Each Component Gets Its Own Folder**

**Production Standard:**
```
WritingEditor/
├── WritingEditor.tsx        # Main component
├── WritingEditor.test.tsx   # Unit tests
├── WritingEditor.types.ts   # TypeScript interfaces
├── WritingEditor.module.css # Styles (if needed)
├── WritingEditor.stories.tsx # Storybook (future)
└── index.ts                 # Barrel export
```

**🎯 IMPLEMENTATION:**
```bash
# Convert all major components to this structure
for component in WritingEditor CharacterForm ProjectCard; do
  mkdir -p "apps/web/src/features/*/components/$component"
  # Move and organize files
done
```

#### B2. DESIGN SYSTEM EXTRACTION ⚡ HIGH

**TASK: Extract Reusable UI Components**

**Current Problem:**
```typescript
// ❌ UI components mixed with business logic
components/
├── ui/Button.tsx           # ✅ Good
├── character/Form.tsx      # ❌ Should be in features/
├── FloatingOrbs.tsx        # ❌ Where does this belong?
```

**Production Solution:**
```typescript
// ✅ Clear separation
shared/components/ui/       # Reusable design system
features/characters/        # Business logic components
shared/components/layout/   # Layout components
```

**🎯 IMPLEMENTATION:**
1. **Extract Design System:**
```bash
mkdir -p apps/web/src/shared/components/ui
# Move Button, Input, Modal, Toast, etc.
```

2. **Create Component Index:**
```typescript
// apps/web/src/shared/components/ui/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Modal } from './Modal'
```

#### B3. BARREL EXPORTS EVERYWHERE ⚡ HIGH

**TASK: Clean Import Paths**

**Before:**
```typescript
// ❌ Messy relative imports
import { Button } from '../../../shared/components/ui/Button/Button'
import { useAuth } from '../../hooks/useAuth'
import { CharacterForm } from '../components/CharacterForm'
```

**After:**
```typescript
// ✅ Clean barrel exports
import { Button } from '@shared/ui'
import { useAuth } from '@features/auth'
import { CharacterForm } from '@features/characters'
```

**🎯 IMPLEMENTATION:**
Create `index.ts` in every folder:
```bash
find apps/web/src -type d -exec touch {}/index.ts \;
# Then populate each with appropriate exports
```

---

### PART C: DEVELOPMENT EXPERIENCE (Days 5-6)

#### C1. PATH MAPPING & IMPORTS ⚡ HIGH

**TASK: Absolute Import Paths**

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@features/*": ["features/*"],
      "@shared/*": ["shared/*"],
      "@pages/*": ["pages/*"],
      "@layouts/*": ["layouts/*"],
      "@assets/*": ["assets/*"],
      "@types/*": ["../../packages/shared-types/src/*"]
    }
  }
}
```

**vite.config.ts:**
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@types': path.resolve(__dirname, '../packages/shared-types/src')
    }
  }
})
```

#### C2. WORKSPACE CONFIGURATION ⚡ HIGH

**TASK: Monorepo Workspace Setup**

**Root package.json:**
```json
{
  "name": "fablecraft",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm:dev:web\" \"npm:dev:api\"",
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:api": "npm run dev --workspace=apps/api",
    "build": "npm run build --workspace=apps/web",
    "test": "npm run test --workspaces",
    "type-check": "npm run type-check --workspaces"
  }
}
```

**🎯 REPLIT WORKFLOW UPDATE:**
```yaml
# .replit workflow update needed
name: "Start Application"
command: "npm run dev"
# Will now start both frontend and backend properly
```

#### C3. LINTING & FORMATTING ⚡ MEDIUM

**TASK: Production-Grade Code Quality**

**ESLint Config (eslint.config.js):**
```javascript
export default [
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external', 
          'internal',
          'parent',
          'sibling'
        ],
        'pathGroups': [
          {
            'pattern': '@features/**',
            'group': 'internal',
            'position': 'before'
          },
          {
            'pattern': '@shared/**', 
            'group': 'internal',
            'position': 'before'
          }
        ]
      }]
    }
  }
]
```

---

### PART D: PERFORMANCE & PRODUCTION (Days 7-8)

#### D1. CODE SPLITTING & LAZY LOADING ⚡ HIGH

**TASK: Optimize Bundle Size**

**Route-Based Code Splitting:**
```typescript
// apps/web/src/router.tsx
import { lazy, Suspense } from 'react'

const WritingPage = lazy(() => import('@pages/WritingPage'))
const CharactersPage = lazy(() => import('@pages/CharactersPage'))

export const AppRouter = () => (
  <Router>
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/characters" element={<CharactersPage />} />
      </Routes>
    </Suspense>
  </Router>
)
```

**Feature-Based Code Splitting:**
```typescript
// Dynamic imports for large features
const CharacterForm = lazy(() => 
  import('@features/characters').then(m => ({ default: m.CharacterForm }))
)
```

#### D2. TESTING ARCHITECTURE ⚡ MEDIUM

**TASK: Comprehensive Testing Setup**

**Test Structure:**
```
__tests__/
├── setup.ts                    # Test configuration
├── utils.tsx                   # Test utilities
└── mocks/                      # API mocks
features/
├── auth/
│   └── __tests__/
│       ├── useAuth.test.ts
│       └── LoginForm.test.tsx
└── writing/
    └── __tests__/
        ├── WritingEditor.test.tsx
        └── useWritingSession.test.ts
```

**Test Configuration:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    alias: {
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared')
    }
  }
})
```

#### D3. BUILD OPTIMIZATION ⚡ HIGH

**TASK: Production Build Configuration**

**Vite Build Optimization:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-form'],
          'writing-feature': ['./src/features/writing'],
          'characters-feature': ['./src/features/characters'],
          'projects-feature': ['./src/features/projects']
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  }
})
```

---

## 🚀 IMPLEMENTATION GUIDE FOR REPLIT/CURSOR

### Step-by-Step Migration Plan

#### WEEK 1: FOUNDATION (Days 1-2)
```bash
# Day 1: Create new structure
mkdir -p apps/web/src/{features,shared,pages,layouts}
mkdir -p apps/api/src/{routes,services,middleware}
mkdir -p packages/shared-types/src

# Day 2: Move core files
# Start with most important components first
```

#### WEEK 1: FEATURES (Days 3-4)
```bash
# Day 3: Move auth & writing features
# Day 4: Move characters & projects features
```

#### WEEK 2: OPTIMIZATION (Days 5-8)
```bash
# Day 5-6: Set up import paths and barrel exports
# Day 7-8: Testing, performance, build optimization
```

### 🎯 REPLIT-SPECIFIC CONFIGURATION

#### Workspace Setup:
```json
// package.json (root)
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "concurrently \"npm:dev:web\" \"npm:dev:api\"",
    "replit:setup": "npm install && npm run db:push"
  }
}
```

#### Environment Variables:
```bash
# .env (apps/web)
VITE_API_URL=http://localhost:5000

# .env (apps/api) 
DATABASE_URL=${DATABASE_URL}
GEMINI_API_KEY=${GEMINI_API_KEY}
```

### 🎯 CURSOR IDE SETUP

#### Settings (cursor-settings.json):
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.tsx": "typescriptreact"
  }
}
```

#### Extensions Recommended:
- TypeScript Importer
- Auto Rename Tag  
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense

---

## 📊 SUCCESS METRICS

### Before vs After Comparison:

**BEFORE (Current Mess):**
- ❌ 15+ files in root directory
- ❌ Mixed client/server structure
- ❌ Components scattered across folders
- ❌ Messy relative imports
- ❌ No clear feature boundaries
- ❌ Hard to find related code

**AFTER (Production Standard):**
- ✅ Clean monorepo structure
- ✅ Feature-first organization
- ✅ Clear component hierarchy
- ✅ Absolute imports with path mapping
- ✅ Barrel exports everywhere
- ✅ Industry-standard patterns

### Developer Experience Improvements:
1. **Faster Development** - Find code instantly by feature
2. **Better Testing** - Co-located tests with components
3. **Easier Refactoring** - Clear boundaries between features
4. **Team Collaboration** - Standard structure new devs recognize
5. **Scalability** - Add new features without touching existing code

---

## 🎯 FINAL DELIVERABLES

1. **Clean project structure** following 2025 React standards
2. **Feature-based organization** with proper separation
3. **Barrel exports** for clean import paths  
4. **TypeScript optimization** with shared types
5. **Production build** configuration
6. **Comprehensive testing** setup
7. **Development tooling** (ESLint, Prettier, etc.)
8. **Documentation** for new team members

**OUTCOME:** FableCraft will be structured like professional React applications used by companies like Notion, Linear, and Vercel - making it maintainable, scalable, and easy for new developers to contribute to.

---

## ⚡ PRIORITY EXECUTION ORDER

1. **CRITICAL (Do First):** A1, A2, A3 - Basic structure and feature organization
2. **HIGH (Week 1):** B1, B2, B3 - Component architecture  
3. **HIGH (Week 2):** C1, C2, D1 - Development experience and performance
4. **MEDIUM (Polish):** C3, D2, D3 - Code quality and testing

This refactor will transform FableCraft from a hobby project to a production-ready creative writing platform that could be deployed at scale.