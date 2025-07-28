import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { suppressResizeObserverError } from './shared/utils/resizeObserver'
import './index.css'

// Initialize ResizeObserver error suppression immediately
suppressResizeObserverError()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)