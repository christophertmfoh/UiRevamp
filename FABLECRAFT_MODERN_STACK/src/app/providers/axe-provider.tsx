/**
 * AXE-CORE ACCESSIBILITY PROVIDER
 * 
 * Automatically runs accessibility checks in development mode
 * and reports violations to the browser console.
 * 
 * This helps catch accessibility issues during development
 * before they reach production.
 */

import { useEffect } from 'react'

// Only load axe-core in development
const loadAxe = async () => {
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    try {
      const React = await import('react')
      const ReactDOM = await import('react-dom')
      const axe = await import('@axe-core/react')
      
      // Initialize axe-core with React and ReactDOM
      // The third parameter (1000) is the debounce delay in milliseconds
      axe.default(React.default, ReactDOM.default, 1000)
      
      // Axe-core successfully loaded
    } catch {
      // Failed to load axe-core - fail silently in production
    }
  }
}

export const AxeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    loadAxe()
  }, [])
  
  return <>{children}</>
}

export default AxeProvider