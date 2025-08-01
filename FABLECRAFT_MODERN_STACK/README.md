# 🚀 FableCraft Modern Stack

**Vite 7 + React 18 + TypeScript 5.8** - The bulletproof foundation for your creative writing platform.

## ⚡ **QUICK START**

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ **TECH STACK**

- **⚡ Vite 7.0** - Lightning fast build tool with native ESM
- **⚛️ React 18.2** - Modern React with concurrent features  
- **📘 TypeScript 5.8** - Strict type safety and latest features
- **🎨 Tailwind CSS 3.4** - Utility-first styling with custom theme
- **🧩 Radix UI** - Accessible component primitives
- **🔀 React Router 6** - Client-side routing
- **🏪 Zustand** - Lightweight state management
- **📝 React Hook Form** - Performant forms with validation
- **✅ Zod** - Schema validation
- **🧪 Vitest** - Fast unit testing

## 📁 **PROJECT STRUCTURE**

```
FABLECRAFT_MODERN_STACK/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ui/             # Base UI primitives
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and configurations
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles and CSS
│   └── utils/              # Helper functions
├── OLD_ASSETS/             # 📚 All your previous code (reference only)
│   ├── client/             # Original monorepo frontend
│   ├── server/             # Original monorepo backend
│   ├── shared/             # Shared utilities and types
│   └── fablecraft-enterprise/ # Previous standalone app
├── public/                 # Static assets
└── dist/                   # Production build output
```

## 🎯 **KEY FEATURES**

### **🔥 Performance**
- **Sub-second cold starts** with Vite 7
- **Instant HMR** - See changes immediately
- **Optimized builds** with automatic code splitting
- **Modern browser targets** for smaller bundles

### **🛡️ Type Safety**
- **Strict TypeScript** configuration
- **Path aliases** for clean imports (`@/components`)
- **Comprehensive type checking** with no implicit any
- **Runtime validation** with Zod schemas

### **🎨 Design System**
- **FableCraft brand colors** built into Tailwind
- **Consistent spacing** and typography
- **Dark mode ready** with CSS variables
- **Accessible components** with Radix UI

### **⚙️ Developer Experience**
- **ESLint** for code quality
- **Auto-formatting** with Prettier
- **Pre-commit hooks** with Husky
- **Testing setup** with Vitest and Testing Library

## 🚀 **DEPLOYMENT**

### **Vercel (Recommended)**
```bash
# Build and deploy
npm run build

# Deploy to Vercel (zero config)
vercel deploy
```

### **Other Platforms**
- **Netlify**: Works out of the box
- **Cloudflare Pages**: Perfect compatibility  
- **GitHub Pages**: Static deployment ready

## 📚 **MIGRATION FROM OLD_ASSETS**

Your complete previous codebase is preserved in `OLD_ASSETS/` for reference:

### **Extract Components**
```bash
# Copy a component from old codebase
cp OLD_ASSETS/client/src/components/ui/dialog.tsx src/components/ui/

# Update import paths
# OLD: import { Dialog } from '@/components/ui/dialog'
# NEW: import { Dialog } from '@/components/ui/dialog'
```

### **Key Migration Steps**
1. **Start with UI components** from `OLD_ASSETS/client/src/components/ui/`
2. **Copy business logic** from `OLD_ASSETS/client/src/components/`
3. **Extract types** from `OLD_ASSETS/shared/` and `OLD_ASSETS/client/src/types/`
4. **Update import paths** to match new structure
5. **Test everything** works in the new stack

## 🔧 **DEVELOPMENT COMMANDS**

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality  
npm run lint             # Run ESLint
npm run type-check       # TypeScript checking

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Coverage report

# Code Analysis
npm run analyze:deps     # Check for unused dependencies
npm run analyze:bundle   # Check bundle sizes against limits
npm run lighthouse       # Run Lighthouse performance audit
npm run duplicates       # Find duplicate code
npm run complexity       # Code complexity analysis

# Accessibility
npm run lint:a11y        # Run accessibility linting
npm run check:all        # Run all quality checks (lint + a11y + type-check)
```

## 🎨 **STYLING**

### **Custom Theme Variables**
```css
/* FableCraft brand colors */
--primary: 22 78% 54%;           /* Orange #ed7326 */
--fable-orange: #ed7326;
--fable-orange-dark: #d4641f;
--fable-orange-light: #f5a662;
```

### **Utility Classes**
```tsx
// Gradient backgrounds
<div className="fable-gradient">FableCraft Orange Gradient</div>

// Gradient text
<h1 className="fable-text-gradient">FableCraft</h1>
```

## 📖 **FOLDER EXPLANATIONS**

- **`OLD_ASSETS/`** - 🔒 **Complete preservation** of your previous work
- **`src/components/ui/`** - 🧩 Reusable UI primitives (Button, Card, etc.)
- **`src/pages/`** - 📄 Page-level components with routing
- **`src/lib/`** - 🛠️ Utilities, configurations, and shared logic
- **`src/hooks/`** - 🎣 Custom React hooks for reusable state logic
- **`src/types/`** - 📘 TypeScript type definitions
- **`src/styles/`** - 🎨 Global CSS and Tailwind configuration

## ⚠️ **IMPORTANT NOTES**

- **OLD_ASSETS is REFERENCE ONLY** - Don't import directly from it
- **Path aliases configured** - Use `@/` for clean imports
- **TypeScript strict mode** - All code must be properly typed
- **No loading conflicts** - Old and new code are completely separate

## 🤝 **NEXT STEPS**

1. **Run `npm install`** to install dependencies
2. **Start development** with `npm run dev`
3. **Browse `OLD_ASSETS/`** to see your previous code
4. **Begin migrating features** one component at a time
5. **Deploy to Vercel** when ready

---

**🎉 You now have a bulletproof modern React foundation with all your previous work safely preserved!**