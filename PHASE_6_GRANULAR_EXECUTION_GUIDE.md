# PHASE 6: GRANULAR EXECUTION GUIDE
## Step-by-Step AI Implementation Instructions

### 🎯 EXECUTION RULES FOR AI
1. Follow each step exactly in order
2. Complete all tasks in a step before moving to next step
3. Use exact file paths and commands provided
4. Verify each file creation/move before proceeding
5. Update imports immediately after each file move
6. Test application after each major section

---

## STEP 1: CREATE NEW DIRECTORY STRUCTURE
**Estimated Time: 10 minutes**

### 1.1 Create Root Monorepo Structure
```bash
mkdir -p apps/web/src
mkdir -p apps/api/src
mkdir -p packages/shared-types/src
mkdir -p docs/architecture
mkdir -p tools/scripts
```

### 1.2 Create Frontend Feature Directories
```bash
mkdir -p apps/web/src/features/auth/{components,hooks,services,types}
mkdir -p apps/web/src/features/writing/{components,hooks,services,types}
mkdir -p apps/web/src/features/characters/{components,hooks,services,types}
mkdir -p apps/web/src/features/projects/{components,hooks,services,types}
mkdir -p apps/web/src/features/ai/{components,hooks,services,types}
```

### 1.3 Create Shared Directories
```bash
mkdir -p apps/web/src/shared/components/ui
mkdir -p apps/web/src/shared/components/layout
mkdir -p apps/web/src/shared/hooks
mkdir -p apps/web/src/shared/utils
mkdir -p apps/web/src/shared/types
mkdir -p apps/web/src/shared/constants
mkdir -p apps/web/src/shared/providers
```

### 1.4 Create Page and Layout Directories
```bash
mkdir -p apps/web/src/pages/{HomePage,AuthPage,WorkspacePage,WritingPage,CharactersPage,ProjectsPage}
mkdir -p apps/web/src/layouts
mkdir -p apps/web/src/assets/{images,icons,fonts}
mkdir -p apps/web/src/styles
```

### 1.5 Create Backend Directories
```bash
mkdir -p apps/api/src/{routes,services,middleware,types,utils}
```

**VERIFICATION CHECKPOINT:** Ensure all directories exist using `ls -la` commands

---

## STEP 2: MOVE SHARED UI COMPONENTS
**Estimated Time: 15 minutes**

### 2.1 Move Core UI Components
```bash
# Move each UI component individually and verify
mv client/src/components/ui/button.tsx apps/web/src/shared/components/ui/button.tsx
mv client/src/components/ui/input.tsx apps/web/src/shared/components/ui/input.tsx
mv client/src/components/ui/modal.tsx apps/web/src/shared/components/ui/modal.tsx
mv client/src/components/ui/toast.tsx apps/web/src/shared/components/ui/toast.tsx
mv client/src/components/ui/card.tsx apps/web/src/shared/components/ui/card.tsx
mv client/src/components/ui/badge.tsx apps/web/src/shared/components/ui/badge.tsx
mv client/src/components/ui/avatar.tsx apps/web/src/shared/components/ui/avatar.tsx
mv client/src/components/ui/separator.tsx apps/web/src/shared/components/ui/separator.tsx
mv client/src/components/ui/skeleton.tsx apps/web/src/shared/components/ui/skeleton.tsx
mv client/src/components/ui/progress.tsx apps/web/src/shared/components/ui/progress.tsx
mv client/src/components/ui/select.tsx apps/web/src/shared/components/ui/select.tsx
mv client/src/components/ui/form.tsx apps/web/src/shared/components/ui/form.tsx
mv client/src/components/ui/label.tsx apps/web/src/shared/components/ui/label.tsx
mv client/src/components/ui/checkbox.tsx apps/web/src/shared/components/ui/checkbox.tsx
mv client/src/components/ui/switch.tsx apps/web/src/shared/components/ui/switch.tsx
mv client/src/components/ui/tabs.tsx apps/web/src/shared/components/ui/tabs.tsx
mv client/src/components/ui/dropdown-menu.tsx apps/web/src/shared/components/ui/dropdown-menu.tsx
mv client/src/components/ui/dialog.tsx apps/web/src/shared/components/ui/dialog.tsx
mv client/src/components/ui/alert.tsx apps/web/src/shared/components/ui/alert.tsx
mv client/src/components/ui/scroll-area.tsx apps/web/src/shared/components/ui/scroll-area.tsx
mv client/src/components/ui/popover.tsx apps/web/src/shared/components/ui/popover.tsx
mv client/src/components/ui/tooltip.tsx apps/web/src/shared/components/ui/tooltip.tsx
mv client/src/components/ui/accordion.tsx apps/web/src/shared/components/ui/accordion.tsx
mv client/src/components/ui/alert-dialog.tsx apps/web/src/shared/components/ui/alert-dialog.tsx
mv client/src/components/ui/aspect-ratio.tsx apps/web/src/shared/components/ui/aspect-ratio.tsx
mv client/src/components/ui/collapsible.tsx apps/web/src/shared/components/ui/collapsible.tsx
mv client/src/components/ui/command.tsx apps/web/src/shared/components/ui/command.tsx
mv client/src/components/ui/context-menu.tsx apps/web/src/shared/components/ui/context-menu.tsx
mv client/src/components/ui/hover-card.tsx apps/web/src/shared/components/ui/hover-card.tsx
mv client/src/components/ui/menubar.tsx apps/web/src/shared/components/ui/menubar.tsx
mv client/src/components/ui/navigation-menu.tsx apps/web/src/shared/components/ui/navigation-menu.tsx
mv client/src/components/ui/radio-group.tsx apps/web/src/shared/components/ui/radio-group.tsx
mv client/src/components/ui/slider.tsx apps/web/src/shared/components/ui/slider.tsx
mv client/src/components/ui/toggle.tsx apps/web/src/shared/components/ui/toggle.tsx
mv client/src/components/ui/toggle-group.tsx apps/web/src/shared/components/ui/toggle-group.tsx
```

### 2.2 Create UI Barrel Export
```typescript
// Create apps/web/src/shared/components/ui/index.ts
export * from './button'
export * from './input'
export * from './modal'
export * from './toast'
export * from './card'
export * from './badge'
export * from './avatar'
export * from './separator'
export * from './skeleton'
export * from './progress'
export * from './select'
export * from './form'
export * from './label'
export * from './checkbox'
export * from './switch'
export * from './tabs'
export * from './dropdown-menu'
export * from './dialog'
export * from './alert'
export * from './scroll-area'
export * from './popover'
export * from './tooltip'
export * from './accordion'
export * from './alert-dialog'
export * from './aspect-ratio'
export * from './collapsible'
export * from './command'
export * from './context-menu'
export * from './hover-card'
export * from './menubar'
export * from './navigation-menu'
export * from './radio-group'
export * from './slider'
export * from './toggle'
export * from './toggle-group'
```

### 2.3 Move Theme Components
```bash
mv client/src/components/theme-provider.tsx apps/web/src/shared/components/theme-provider.tsx
mv client/src/components/theme-toggle.tsx apps/web/src/shared/components/theme-toggle.tsx
mv client/src/components/FloatingOrbs.tsx apps/web/src/shared/components/FloatingOrbs.tsx
```

**VERIFICATION CHECKPOINT:** Check that all UI files exist in new location

---

## STEP 3: MOVE WRITING FEATURE
**Estimated Time: 20 minutes**

### 3.1 Move Writing Components
```bash
# Move entire writing directory
cp -r client/src/components/writing/* apps/web/src/features/writing/components/
```

### 3.2 Move Writing Hooks
```bash
mv client/src/hooks/useWritingSession.ts apps/web/src/features/writing/hooks/useWritingSession.ts
mv client/src/hooks/useDebouncedSave.ts apps/web/src/features/writing/hooks/useDebouncedSave.ts
```

### 3.3 Create Writing Types
```typescript
// Create apps/web/src/features/writing/types/index.ts
export interface WritingSession {
  projectId: string
  startTime: Date
  endTime?: Date
  wordsWritten: number
  targetWords?: number
  isActive: boolean
}

export interface WritingDocument {
  id: string
  title: string
  content: string
  projectId: string
  wordCount: number
  lastModified: Date
  version: number
}

export interface WritingMetrics {
  totalWords: number
  todayWords: number
  weekWords: number
  averageDaily: number
  writingStreak: number
}
```

### 3.4 Create Writing Services
```typescript
// Create apps/web/src/features/writing/services/index.ts
export const writingApi = {
  saveDocument: async (doc: WritingDocument) => {
    // API implementation
  },
  getDocument: async (id: string) => {
    // API implementation
  },
  getMetrics: async (userId: string) => {
    // API implementation
  }
}
```

### 3.5 Create Writing Barrel Export
```typescript
// Create apps/web/src/features/writing/index.ts
export * from './components'
export * from './hooks'
export * from './services'
export * from './types'
```

**VERIFICATION CHECKPOINT:** Test writing feature imports

---

## STEP 4: MOVE CHARACTERS FEATURE
**Estimated Time: 20 minutes**

### 4.1 Move Character Components
```bash
cp -r client/src/components/character/* apps/web/src/features/characters/components/
```

### 4.2 Move Character-Related Hooks (identify by grep)
```bash
# Find character-related hooks first
grep -l "character\|Character" client/src/hooks/*.ts
# Move identified files to characters/hooks/
```

### 4.3 Create Character Types
```typescript
// Create apps/web/src/features/characters/types/index.ts
export interface Character {
  id: string
  name: string
  age?: number
  occupation?: string
  personality: string[]
  backstory: string
  goals: string[]
  relationships: CharacterRelationship[]
  appearance: CharacterAppearance
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface CharacterRelationship {
  targetCharacterId: string
  relationshipType: string
  description: string
  strength: number
}

export interface CharacterAppearance {
  height?: string
  build?: string
  hairColor?: string
  eyeColor?: string
  distinguishingFeatures: string[]
  style?: string
}

export interface CharacterFormData {
  name: string
  age: string
  occupation: string
  personality: string
  backstory: string
  goals: string
  appearance: string
}
```

### 4.4 Create Character Services
```typescript
// Create apps/web/src/features/characters/services/index.ts
export const charactersApi = {
  createCharacter: async (data: CharacterFormData) => {
    // API implementation
  },
  updateCharacter: async (id: string, data: Partial<Character>) => {
    // API implementation
  },
  deleteCharacter: async (id: string) => {
    // API implementation
  },
  getCharacters: async (projectId: string) => {
    // API implementation
  }
}
```

### 4.5 Create Characters Barrel Export
```typescript
// Create apps/web/src/features/characters/index.ts
export * from './components'
export * from './hooks'
export * from './services'
export * from './types'
```

---

## STEP 5: MOVE PROJECTS FEATURE
**Estimated Time: 20 minutes**

### 5.1 Move Project Components
```bash
cp -r client/src/components/project* apps/web/src/features/projects/components/
```

### 5.2 Move Project Hooks
```bash
mv client/src/hooks/useProjectsLogic.ts apps/web/src/features/projects/hooks/useProjectsLogic.ts
mv client/src/hooks/useTaskManagement.ts apps/web/src/features/projects/hooks/useTaskManagement.ts
```

### 5.3 Create Project Types
```typescript
// Create apps/web/src/features/projects/types/index.ts
export interface Project {
  id: string
  title: string
  description: string
  type: ProjectType
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
  authorId: string
  settings: ProjectSettings
  stats: ProjectStats
}

export type ProjectType = 'novel' | 'screenplay' | 'comic' | 'short-story' | 'poetry'
export type ProjectStatus = 'planning' | 'writing' | 'editing' | 'published' | 'archived'

export interface ProjectSettings {
  targetWordCount?: number
  genre?: string
  isPublic: boolean
  collaborators: string[]
}

export interface ProjectStats {
  wordCount: number
  characterCount: number
  chapterCount: number
  lastActivity: Date
}
```

### 5.4 Create Project Services
```typescript
// Create apps/web/src/features/projects/services/index.ts
export const projectsApi = {
  createProject: async (data: CreateProjectData) => {
    // API implementation
  },
  getProjects: async (userId: string) => {
    // API implementation
  },
  updateProject: async (id: string, data: Partial<Project>) => {
    // API implementation
  },
  deleteProject: async (id: string) => {
    // API implementation
  }
}
```

### 5.5 Create Projects Barrel Export
```typescript
// Create apps/web/src/features/projects/index.ts
export * from './components'
export * from './hooks'
export * from './services'
export * from './types'
```

---

## STEP 6: MOVE AUTH FEATURE
**Estimated Time: 15 minutes**

### 6.1 Move Auth Hooks
```bash
mv client/src/hooks/useAuth.ts apps/web/src/features/auth/hooks/useAuth.ts
```

### 6.2 Move Auth Pages
```bash
mv client/src/pages/AuthPage.tsx apps/web/src/features/auth/components/AuthPage.tsx
mv client/src/pages/AuthPageRedesign.tsx apps/web/src/features/auth/components/AuthPageRedesign.tsx
```

### 6.3 Create Auth Types
```typescript
// Create apps/web/src/features/auth/types/index.ts
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  subscription?: UserSubscription
}

export interface UserSubscription {
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired'
  expiresAt?: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
}
```

### 6.4 Create Auth Services
```typescript
// Create apps/web/src/features/auth/services/index.ts
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    // API implementation
  },
  register: async (data: RegisterData) => {
    // API implementation
  },
  logout: async () => {
    // API implementation
  },
  refreshToken: async () => {
    // API implementation
  },
  getCurrentUser: async () => {
    // API implementation
  }
}
```

### 6.5 Create Auth Barrel Export
```typescript
// Create apps/web/src/features/auth/index.ts
export * from './components'
export * from './hooks'
export * from './services'
export * from './types'
```

---

## STEP 7: MOVE SHARED UTILITIES
**Estimated Time: 15 minutes**

### 7.1 Move Core Utils
```bash
mv client/src/lib/utils.ts apps/web/src/shared/utils/utils.ts
mv client/src/utils/memoryOptimizer.ts apps/web/src/shared/utils/memoryOptimizer.ts
mv client/src/utils/globalErrorHandler.ts apps/web/src/shared/utils/globalErrorHandler.ts
mv client/src/utils/resizeObserverFix.ts apps/web/src/shared/utils/resizeObserverFix.ts
```

### 7.2 Move Shared Hooks
```bash
mv client/src/hooks/useMemoryOptimizedState.ts apps/web/src/shared/hooks/useMemoryOptimizedState.ts
mv client/src/hooks/useOptimizedScroll.ts apps/web/src/shared/hooks/useOptimizedScroll.ts
mv client/src/hooks/useAccessibility.ts apps/web/src/shared/hooks/useAccessibility.ts
mv client/src/hooks/use-mobile.tsx apps/web/src/shared/hooks/use-mobile.tsx
```

### 7.3 Move Config Files
```bash
mv client/src/lib/queryClient.ts apps/web/src/shared/utils/queryClient.ts
mv client/src/lib/store.ts apps/web/src/shared/utils/store.ts
```

### 7.4 Create Shared Barrel Exports
```typescript
// Create apps/web/src/shared/utils/index.ts
export * from './utils'
export * from './memoryOptimizer'
export * from './globalErrorHandler'
export * from './resizeObserverFix'
export * from './queryClient'
export * from './store'

// Create apps/web/src/shared/hooks/index.ts
export * from './useMemoryOptimizedState'
export * from './useOptimizedScroll'
export * from './useAccessibility'
export * from './use-mobile'
```

---

## STEP 8: CREATE PAGES STRUCTURE
**Estimated Time: 15 minutes**

### 8.1 Create Individual Page Components
```typescript
// Create apps/web/src/pages/HomePage/HomePage.tsx
import React from 'react'

export const HomePage = () => {
  return (
    <div>
      <h1>FableCraft - Creative Writing Platform</h1>
      {/* Move landing page content here */}
    </div>
  )
}

// Create apps/web/src/pages/HomePage/index.ts
export { HomePage } from './HomePage'
```

### 8.2 Create Other Page Components
```typescript
// Create apps/web/src/pages/WorkspacePage/WorkspacePage.tsx
// Create apps/web/src/pages/WritingPage/WritingPage.tsx  
// Create apps/web/src/pages/CharactersPage/CharactersPage.tsx
// Create apps/web/src/pages/ProjectsPage/ProjectsPage.tsx
```

### 8.3 Create Pages Barrel Export
```typescript
// Create apps/web/src/pages/index.ts
export { HomePage } from './HomePage'
export { AuthPage } from './AuthPage'
export { WorkspacePage } from './WorkspacePage'
export { WritingPage } from './WritingPage'
export { CharactersPage } from './CharactersPage'
export { ProjectsPage } from './ProjectsPage'
```

---

## STEP 9: UPDATE TSCONFIG AND VITE CONFIG
**Estimated Time: 10 minutes**

### 9.1 Update tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@features/*": ["features/*"],
      "@shared/*": ["shared/*"],
      "@pages/*": ["pages/*"],
      "@layouts/*": ["layouts/*"],
      "@assets/*": ["assets/*"]
    }
  }
}
```

### 9.2 Update vite.config.ts
```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  }
})
```

---

## STEP 10: UPDATE ALL IMPORTS
**Estimated Time: 30 minutes**

### 10.1 Update App.tsx Imports
```typescript
// Replace all imports in apps/web/src/App.tsx
import { ThemeProvider } from '@shared/components/theme-provider'
import { ThemeToggle } from '@shared/components/theme-toggle'
import { useAuth } from '@features/auth'
import { HomePage } from '@pages/HomePage'
```

### 10.2 Update Component Imports Systematically
Go through each moved file and update imports:
- Replace `../components/ui/` with `@shared/components/ui/`
- Replace `../hooks/useAuth` with `@features/auth`
- Replace relative paths with absolute paths

### 10.3 Create Import Update Script
```bash
# Use find and sed to update imports across all files
find apps/web/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|../components/ui|@shared/components/ui|g'
find apps/web/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|../hooks/useAuth|@features/auth|g'
# Continue for all common import patterns
```

---

## STEP 11: MOVE BACKEND FILES
**Estimated Time: 15 minutes**

### 11.1 Move Server Files
```bash
cp -r server/* apps/api/src/
```

### 11.2 Update Backend Package.json
```json
{
  "name": "@fablecraft/api",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## STEP 12: CREATE WORKSPACE ROOT
**Estimated Time: 10 minutes**

### 12.1 Create Root Package.json
```json
{
  "name": "fablecraft",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm:dev:web\" \"npm:dev:api\"",
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:api": "npm run dev --workspace=apps/api",
    "build": "npm run build --workspace=apps/web",
    "test": "npm run test --workspaces"
  }
}
```

### 12.2 Update Replit Configuration
```toml
# Update .replit file
run = "npm run dev"

[deployment]
build = "npm run build"
```

---

## STEP 13: TEST AND VERIFY
**Estimated Time: 15 minutes**

### 13.1 Start Development Server
```bash
npm run dev
```

### 13.2 Verify All Features Work
- Test authentication flow
- Test writing features
- Test character creation
- Test project management
- Test theme switching

### 13.3 Fix Any Import Errors
- Check browser console for import errors
- Fix any missing barrel exports
- Verify all components render correctly

---

## STEP 14: CLEANUP OLD STRUCTURE
**Estimated Time: 10 minutes**

### 14.1 Remove Old Directories (ONLY AFTER VERIFICATION)
```bash
rm -rf client/src/components
rm -rf client/src/hooks
rm -rf client/src/lib
rm -rf client/src/utils
rm -rf client/src/pages
```

### 14.2 Update Documentation
```bash
mv PHASE_*.md docs/phases/
mv REFACTOR_*.md docs/architecture/
```

---

## FINAL VERIFICATION CHECKLIST

- [ ] All features work in development
- [ ] No console errors
- [ ] All imports resolve correctly
- [ ] Build process works
- [ ] Tests pass (if any)
- [ ] Hot reload works
- [ ] No broken relative imports
- [ ] Barrel exports working
- [ ] TypeScript compilation successful
- [ ] Replit deployment ready

**TOTAL ESTIMATED TIME: 4-6 hours**

---

## ROLLBACK PLAN (IF NEEDED)

If anything breaks during migration:
1. Stop at current step
2. Revert last changes using git
3. Debug specific issue
4. Continue from working state

This granular guide ensures each step can be completed independently and verified before proceeding to the next step.