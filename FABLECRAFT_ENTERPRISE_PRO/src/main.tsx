import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Enable React DevTools profiler
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {}
  
  // Log app version and build info
  console.log(`🚀 FableCraft Enterprise v${__APP_VERSION__}`)
  console.log(`📅 Built: ${__BUILD_DATE__}`)
  console.log(`⚛️  React: ${React.version}`)
  
  // Enable performance measurements
  if ('performance' in window && 'measure' in window.performance) {
    window.performance.mark('app-start')
  }
}

// Get root element
const container = document.getElementById('root')

if (!container) {
  throw new Error(
    'Failed to find the root element. Make sure you have a div with id="root" in your HTML.'
  )
}

// Create React root with React 19 concurrent features
const root = createRoot(container, {
  // Enable concurrent features for better performance
  onRecoverableError: (error, errorInfo) => {
    console.error('Recoverable error occurred:', error, errorInfo)
    
    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: errorTrackingService.captureError(error, errorInfo)
    }
  },
})

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  // Mark when React finishes rendering
  setTimeout(() => {
    if ('performance' in window && 'measure' in window.performance) {
      try {
        window.performance.mark('app-rendered')
        window.performance.measure('app-startup', 'app-start', 'app-rendered')
        
        const measure = window.performance.getEntriesByName('app-startup')[0]
        if (measure) {
          console.log(`⚡ App startup time: ${Math.round(measure.duration)}ms`)
        }
      } catch (error) {
        console.debug('Performance measurement failed:', error)
      }
    }
  }, 0)
}

// Service Worker registration for PWA capabilities
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}