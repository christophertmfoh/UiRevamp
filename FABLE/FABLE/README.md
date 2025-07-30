# 🚀 FABLE - Modern React Starter Template

A clean, production-ready React starter template with modern tooling and best practices.

## ✨ Features

### Core Stack
- **React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Full type safety
- **Vite 7** - Lightning fast development
- **Tailwind CSS 3.4** - Utility-first styling with custom theme

### UI & Components
- **Radix UI** - Accessible, unstyled UI primitives
- **CVA** - Class variance authority for component variants
- **Tailwind Merge** - Intelligent class merging
- **Lucide React** - Beautiful icons

### State & Data
- **Zustand** - Simple, scalable state management
- **TanStack Query** - Powerful data fetching
- **React Hook Form + Zod** - Type-safe forms with validation
- **Axios** - HTTP client with interceptors

### Developer Experience
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Full type coverage
- **Vitest** - Fast unit testing
- **Path aliases** - Clean imports with `@/`

## 🏁 Quick Start

### 1. Copy to Replit
1. Download/copy the `FABLE` folder to your Replit project
2. Open terminal in Replit

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
FABLE/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── ui/          # Base UI components (Button, Card, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── services/        # API services
│   ├── stores/          # Zustand state stores
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 5173
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once
```

## 🎨 Styling System

### Theme Colors
The project uses a comprehensive color system with CSS custom properties:

- `background` / `foreground` - Base colors
- `primary` / `secondary` - Brand colors  
- `muted` / `accent` - Supporting colors
- `destructive` - Error states
- `border` / `input` / `ring` - UI elements

### Dark Mode Ready
```tsx
// Add 'dark' class to enable dark mode
<html className="dark">
```

### Component Variants
```tsx
<Button variant="default" size="lg">Primary Button</Button>
<Button variant="outline" size="sm">Secondary Button</Button>
```

## 🗄 State Management

### Zustand Store Example
```tsx
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))
```

### Usage in Components
```tsx
function Counter() {
  const { count, increment, reset } = useCounterStore()
  
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={increment}>+1</Button>
      <Button onClick={reset}>Reset</Button>
    </div>
  )
}
```

## 🌐 API Integration

### Basic API Service
```tsx
import { apiService } from '@/services/api'

// GET request
const users = await apiService.get<User[]>('/users')

// POST request  
const newUser = await apiService.post<User>('/users', userData)
```

### With React Query
```tsx
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.get<User[]>('/users')
  })

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

## 🧪 Testing

The project includes Vitest for testing:

```tsx
// Example test
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist` folder contains the production build ready for deployment.

### Environment Variables
Create a `.env` file for environment variables:

```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Fable
```

## 🎯 Next Steps

1. **Add Routing**: Set up TanStack Router for navigation
2. **Authentication**: Implement login/register system
3. **Database**: Connect to your backend API
4. **Testing**: Add more comprehensive tests
5. **CI/CD**: Set up deployment pipeline

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)
- [Zustand](https://zustand-demo.pmnd.rs)
- [TanStack Query](https://tanstack.com/query)

---

**Ready to build something amazing!** 🎉