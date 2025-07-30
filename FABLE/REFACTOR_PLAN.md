# FableCraft Structure Refactor Plan

## Current Issues vs Production Standards

### PROBLEM 1: Mixed Client/Server Structure
**Current:** Mixed backend/client in root
**Standard:** Clear separation with proper workspace structure

### PROBLEM 2: Poor Component Organization  
**Current:** Components scattered across folders
**Standard:** Feature-first organization with clear hierarchy

### PROBLEM 3: No Feature-Based Architecture
**Current:** Components grouped by type (ui/, dev/, character/)
**Standard:** Features grouped together (auth/, writing/, projects/)

### PROBLEM 4: Missing Production Patterns
**Current:** No barrel exports, mixed utils, scattered types
**Standard:** Clean imports, co-located code, proper TypeScript organization

## Recommended Refactor (Phase 6)

### New Structure:
```
fablecraft/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── features/    # Feature-first organization
│   │   │   │   ├── auth/
│   │   │   │   ├── writing/
│   │   │   │   ├── characters/
│   │   │   │   └── projects/
│   │   │   ├── shared/      # Shared components/utils
│   │   │   ├── pages/       # Route components
│   │   │   └── App.tsx
│   │   ├── public/
│   │   └── package.json
│   └── api/                 # Express backend
│       ├── src/
│       ├── routes/
│       └── package.json
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # Shared TypeScript types
│   └── config/              # Shared configuration
├── docs/
└── package.json             # Workspace root
```

### Migration Strategy:
1. Create new feature-based structure
2. Move components to proper features
3. Add barrel exports
4. Update imports
5. Clean up old structure

## Benefits:
- ✅ Scalable feature organization
- ✅ Clear component hierarchy  
- ✅ Better development experience
- ✅ Easier to onboard new developers
- ✅ Industry standard patterns