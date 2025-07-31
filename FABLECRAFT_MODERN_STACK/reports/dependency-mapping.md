# DEPENDENCY MAPPING - STEP 1.2.2

## Executive Summary
Comprehensive dependency analysis for Landing Page, Theme System, and Authentication components to be migrated from legacy builds into FABLECRAFT_MODERN_STACK.

## Landing Page Dependencies

**Primary Dependencies:**
- `lucide-react` (icons) - ✅ VERIFIED: Used extensively
  - Icons: CheckCircle, Lightbulb, Zap, PenTool, Library, Globe, Star
- `framer-motion` (animations) - ⚠️ MINIMAL: Only 1 instance found (AuthPageRedesign)
- `tailwind-merge` + `clsx` (styling) - ❌ NOT FOUND: No direct usage in landing pages

**UI Component Dependencies:**
- `@/components/ui/badge` - ✅ USED: Badge components
- `@/components/ui/button` - ✅ USED: Button components  
- `@/components/ui/card` - ✅ USED: Card layouts

**React Dependencies:**
- `React` hooks: useState, useEffect, useRef - ✅ USED

**Special Components:**
- FloatingOrbs component (different paths in client vs enterprise)
- ThemeToggle component

## Theme System Dependencies

**Primary Dependencies:**
- `next-themes` (theme provider) - ✅ VERIFIED: Core dependency
  - ThemeProvider as NextThemesProvider
  - useTheme hook
- CSS custom properties (HSL variables) - ✅ USED: In CSS files

**React Dependencies:**
- `React` - ✅ USED: Core React functionality

**UI Dependencies:**
- `@/components/ui/button` - ✅ USED: In theme toggle

## Authentication Dependencies

**Primary Dependencies:**
- `react-hook-form` - ✅ VERIFIED: useForm hook
- `@hookform/resolvers` - ✅ VERIFIED: zodResolver
- `zod` - ✅ VERIFIED: Schema validation
- `zustand` - ✅ VERIFIED: State management (create, persist)

**Secondary Dependencies:**
- `@tanstack/react-query` - ✅ USED: useMutation hook
- `framer-motion` - ✅ USED: Animation in auth form
- JWT tokens (localStorage) - ✅ IMPLEMENTED: Via Zustand persistence

**UI Component Dependencies:**
- Multiple `@/components/ui/*` components (Button, Input, Label, Card, Tabs, Alert)
- `lucide-react` icons: AlertCircle, Loader2, UserPlus, LogIn, Check, X, Shield, ArrowLeft, Feather, Eye, EyeOff

**React Dependencies:**
- React hooks: useState, useEffect

## Migration Dependencies Analysis

**ALREADY AVAILABLE IN MODERN_STACK:**
- `React` and hooks - ✅ Available
- `@hookform/resolvers` - ✅ Available (v3.10.0)
- Basic UI components - ✅ Available

**NEED TO VERIFY/INSTALL:**
- `next-themes` - ⚠️ Verify availability
- `zustand` - ⚠️ Verify availability  
- `framer-motion` - ⚠️ Verify availability
- `@tanstack/react-query` - ⚠️ Verify availability
- `zod` - ⚠️ Verify availability

**MIGRATION IMPACT:**
- Landing Page: Low impact, mostly UI components and lucide-react
- Theme System: Medium impact, requires next-themes
- Authentication: High impact, requires multiple dependencies

## Recommendations

1. **Verify Modern Stack Dependencies:** Check if required packages are already installed
2. **Install Missing Dependencies:** Add any missing packages to package.json
3. **Path Resolution:** Update import paths to match FABLECRAFT_MODERN_STACK structure
4. **Component Mapping:** Map legacy UI components to modern stack equivalents

Date: $(date)
Migration Step: 1.2.2 Dependency Mapping

## DEPENDENCY VERIFICATION RESULTS

**✅ ALREADY INSTALLED IN MODERN STACK:**
- `zustand` (v4.x) - State management for authentication
- `zod` (v3.x) - Schema validation for forms
- `react-hook-form` (v7.x) - Form management
- `lucide-react` (v0.x) - Icon system
- `@hookform/resolvers` (v3.x) - Form validation resolvers

**❌ MISSING FROM MODERN STACK:**
- `next-themes` - Theme provider system (CRITICAL for theme migration)
- `framer-motion` - Animation library (OPTIONAL - minimal usage)
- `@tanstack/react-query` - Data fetching (CRITICAL for auth mutations)

**MIGRATION DEPENDENCY PLAN:**
1. Install `next-themes` for theme system migration
2. Install `@tanstack/react-query` for authentication system
3. Consider `framer-motion` for auth form animations (optional)

**RISK ASSESSMENT:**
- LOW RISK: Most core dependencies already available
- MEDIUM RISK: Need to install 2-3 additional packages
- HIGH CONFIDENCE: All required dependencies are actively maintained

Updated: $(date)
