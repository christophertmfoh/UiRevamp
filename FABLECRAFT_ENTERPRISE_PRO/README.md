# 🚀 FableCraft Enterprise

> **Professional Creative Writing Platform**  
> The ultimate foundation for building sophisticated writing applications with React 19, Vite 7, and TypeScript.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## ✨ Enterprise Features

### 🎯 **Core Platform**
- **React 19** with concurrent features and Suspense
- **Vite 7** for lightning-fast development and builds
- **TypeScript 5.8** with strict type checking
- **TanStack Router** for type-safe routing
- **TanStack Query** for server state management
- **Zustand** for client state management

### 🎨 **Professional UI**
- **Tailwind CSS 3.4** with custom design system
- **Radix UI** for accessible, unstyled components
- **Framer Motion** for smooth animations
- **Custom FableCraft theme** with light/dark modes
- **Professional typography** (Inter, Playfair Display, Source Serif 4)

### 🔧 **Development Excellence**
- **ESLint + Prettier** for code quality
- **Husky + lint-staged** for pre-commit hooks
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Storybook** for component documentation
- **Bundle analysis** with visualizer

### 🚀 **Performance & SEO**
- **Code splitting** with manual chunks
- **PWA ready** with service worker
- **Critical CSS** for fast initial loads
- **Optimized fonts** with preloading
- **Comprehensive meta tags** and structured data

## 🛠️ Quick Start

### Prerequisites
- **Node.js** 20.0.0 or higher
- **npm** 10.0.0 or higher

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd FABLECRAFT_ENTERPRISE_PRO

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

#### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript compiler
```

#### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```

#### Testing
```bash
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
```

#### Analysis & Documentation
```bash
npm run analyze      # Analyze bundle size
npm run storybook    # Start Storybook
npm run build-storybook # Build Storybook
```

## 📁 Project Structure

```
FABLECRAFT_ENTERPRISE_PRO/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   │   ├── theme/          # Theme provider and toggle
│   │   └── error-boundary/ # Error handling
│   ├── features/           # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries and configurations
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   ├── api/                # API layer and data fetching
│   ├── assets/             # Static assets
│   ├── styles/             # Global styles and CSS
│   ├── constants/          # Application constants
│   └── pages/              # Route components
├── public/                 # Static public assets
├── tests/                  # Test files
├── .storybook/            # Storybook configuration
└── docs/                  # Documentation
```

## 🎨 Design System

### Color Palette
- **Primary**: Orange-based brand colors (`#ed7326`)
- **Semantic**: Success, warning, error, info colors
- **Neutral**: Comprehensive grayscale for text and backgrounds
- **Editor**: Specialized colors for writing interface

### Typography
- **Sans-serif**: Inter (UI elements)
- **Serif**: Playfair Display (headings)
- **Writing**: Source Serif 4 (editor content)
- **Monospace**: JetBrains Mono (code)

### Components
Pre-built components following design system principles:
- Buttons, inputs, cards, dialogs
- Navigation, sidebars, panels
- Editor-specific components
- Loading states and animations

## 🔌 Key Integrations

### Router Configuration
```typescript
// Type-safe routing with TanStack Router
import { Router } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = new Router({
  routeTree,
  defaultPreload: 'intent',
})
```

### State Management
```typescript
// Zustand store example
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface AppState {
  theme: 'light' | 'dark' | 'system'
  user: User | null
}

export const useAppStore = create<AppState>()(
  immer((set) => ({
    theme: 'system',
    user: null,
  }))
)
```

### Query Client
```typescript
// Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})
```

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- Store testing

### E2E Tests (Playwright)
- User journey testing
- Cross-browser compatibility
- Performance testing
- Accessibility testing

### Coverage Goals
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## 📦 Build Optimization

### Code Splitting
```typescript
// Manual chunks for optimal loading
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'router-vendor': ['@tanstack/react-router'],
  'ui-vendor': ['@radix-ui/*'],
  'editor-vendor': ['@tiptap/*'],
}
```

### Performance Features
- Tree shaking for minimal bundles
- Asset optimization (images, fonts)
- Service worker for caching
- Critical CSS inlining
- Preloading strategies

## 🔒 Security

### Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer Policy configuration

### Dependencies
- Regular security audits with `npm audit`
- Dependabot for automated updates
- Minimal dependency footprint

## 🌍 Environment Configuration

### Development
```bash
# .env.development
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
VITE_APP_ENV=development
```

### Production
```bash
# .env.production
VITE_API_URL=https://api.fablecraft.com
VITE_WS_URL=https://ws.fablecraft.com
VITE_APP_ENV=production
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 📈 Performance Monitoring

### Core Web Vitals
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### Monitoring Tools
- Lighthouse CI for automated audits
- Web Vitals library integration
- Performance API measurements
- Error boundary tracking

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run quality checks
5. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Include tests for new features
- Update documentation

### Commit Convention
```bash
feat: add new writing editor component
fix: resolve theme toggle issue
docs: update API documentation
test: add unit tests for auth service
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for React 19 features
- **Vite Team** for the amazing build tool
- **Radix UI** for accessible components
- **Tailwind CSS** for the utility framework
- **TypeScript Team** for type safety

---

## 📞 Support

For support and questions:
- 📧 **Email**: support@fablecraft.com
- 📚 **Documentation**: [docs.fablecraft.com](https://docs.fablecraft.com)
- 💬 **Discord**: [Join our community](https://discord.gg/fablecraft)
- 🐛 **Issues**: [GitHub Issues](https://github.com/fablecraft/enterprise/issues)

---

<div align="center">

**Built with ❤️ by the FableCraft Team**

[Website](https://fablecraft.com) • [Documentation](https://docs.fablecraft.com) • [Community](https://discord.gg/fablecraft)

</div>