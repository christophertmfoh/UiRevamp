/**
 * Modern React 2025 Entry Point
 * Replaces old entry point with migration system
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import MigrationSystem, { MigrationStatus } from './migration/MigrationSystem';

// Enhanced error handling for the root
import { ModernErrorBoundary } from './components/modern/ModernErrorBoundary';

// Global styles and initialization
import './index.css';

// Initialize performance monitoring
if (process.env.NODE_ENV === 'development') {
  import('./utils/webVitals').then(({ measurePerformance }) => {
    measurePerformance();
  });
}

// Root component with migration system
function Root() {
  return (
    <ModernErrorBoundary>
      <MigrationStatus />
      <MigrationSystem />
    </ModernErrorBoundary>
  );
}

// Enhanced root mounting with React 18 features
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

// Render with concurrent features enabled
root.render(<Root />);

// Hot module replacement for development
if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept();
}