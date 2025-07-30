import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// Example of a more complex store
interface AppState {
  theme: 'light' | 'dark'
  user: { name: string; email: string } | null
  toggleTheme: () => void
  setUser: (user: { name: string; email: string } | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  user: null,
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  setUser: (user) => set({ user }),
}))