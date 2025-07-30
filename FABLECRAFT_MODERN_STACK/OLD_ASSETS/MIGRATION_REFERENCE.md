# 📁 OLD_ASSETS Migration Reference

## 🎯 **PURPOSE**
This folder contains **ALL** your previous FableCraft code and assets for reference during migration to the new Vite 7 + React 18 + TypeScript stack.

## 📂 **FOLDER STRUCTURE**

### **Core Applications**
- **`client/`** - Original monorepo frontend with all features
  - Complete UI component library (53+ components)
  - Character management system
  - Writing tools (Editor, Outline)
  - Project management
  - Landing pages
  - Testing infrastructure

- **`server/`** - Original monorepo backend
  - API routes and endpoints
  - Authentication system
  - Database integration
  - AI service integrations

- **`shared/`** - Common types and utilities
  - Shared TypeScript types
  - Database schemas
  - Common utilities

- **`fablecraft-enterprise/`** - Standalone React app (most recent)
  - Working Vite + React setup
  - Modern component patterns
  - Your latest UI implementations

### **Documentation & Config**
- **`*.md`** - All planning and technical documentation
- **`*.json, *.js, *.ts`** - Configuration references

## 🔧 **MIGRATION STRATEGY**

### **Phase 1: Extract Key Components**
1. **UI Components** - Copy essential components from `client/src/components/ui/`
2. **Business Logic** - Extract core features from `client/src/components/`
3. **Types** - Copy TypeScript definitions from `shared/` and `client/src/types/`

### **Phase 2: Modernize Patterns**
1. **Update Import Paths** - Change `@/` imports to match new structure
2. **Simplify Dependencies** - Remove unnecessary packages
3. **Type Safety** - Enhance with strict TypeScript

### **Phase 3: Feature Migration**
1. **Character System** - Rebuild using modern patterns
2. **Writing Tools** - Enhance with new architecture
3. **Project Management** - Streamline with better state management

## 🚨 **IMPORTANT NOTES**

- **NO LOADING CONFLICTS** - This folder is isolated from the new build system
- **REFERENCE ONLY** - Don't import directly from here
- **COMPLETE PRESERVATION** - Everything from your old app is here
- **PATH MAPPING** - Your `@/` imports from old code map to these locations

## 🎨 **KEY ASSETS TO EXTRACT**

### **Essential Components** (`client/src/components/ui/`)
- Button, Card, Badge, Input, Textarea
- Dropdown, Dialog, Tabs, Progress
- Forms, Tables, Charts
- Loading states, Error boundaries

### **Feature Components** (`client/src/components/`)
- Character management (`character/`)
- Writing tools (`writing/`)
- Project management (`project/`)
- Authentication (`auth/`)

### **Hooks & Utils** (`client/src/hooks/`, `client/src/lib/`)
- Custom React hooks
- Utility functions
- API clients
- State management patterns

### **Types & Schemas** (`shared/`, `client/src/types/`)
- Character types
- Project types
- API response types
- Database schemas

## ✅ **MIGRATION CHECKLIST**

- [ ] Extract core UI components
- [ ] Copy essential business logic
- [ ] Migrate TypeScript types
- [ ] Update import paths
- [ ] Test functionality in new stack
- [ ] Remove unused dependencies
- [ ] Verify no loading conflicts

---

**All your hard work is preserved here. Now build the future with the new stack!** 🚀