/**
 * React 2025 Migration System
 * Handles the gradual migration from legacy App.tsx to ModernApp.tsx
 * Senior dev team approach: Gradual, safe migration with rollback capability
 */

import React, { useState, useEffect, Suspense } from 'react';
import { ModernErrorBoundary } from '@/components/modern/ModernErrorBoundary';
import { ModernSpinner } from '@/components/modern/ModernLoadingStates';

// Import both systems
const LegacyApp = React.lazy(() => import('@/App'));
const ModernApp = React.lazy(() => import('@/components/modern/ModernApp'));

interface MigrationConfig {
  enableMigration: boolean;
  migrationPhase: 'legacy' | 'hybrid' | 'modern';
  featureFlags: {
    modernCharacterSystem: boolean;
    modernWorldBible: boolean;
    modernProjects: boolean;
    concurrentFeatures: boolean;
    accessibilityEnhancements: boolean;
  };
  rollbackEnabled: boolean;
}

// Default migration configuration
const DEFAULT_MIGRATION_CONFIG: MigrationConfig = {
  enableMigration: true,
  migrationPhase: 'hybrid', // Start with hybrid approach
  featureFlags: {
    modernCharacterSystem: true,
    modernWorldBible: false, // Gradual rollout
    modernProjects: false,   // Gradual rollout
    concurrentFeatures: true,
    accessibilityEnhancements: true,
  },
  rollbackEnabled: true
};

export function MigrationSystem() {
  const [config, setConfig] = useState<MigrationConfig>(DEFAULT_MIGRATION_CONFIG);
  const [migrationError, setMigrationError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Load migration configuration from localStorage or environment
  useEffect(() => {
    try {
      // Check for development override
      const devConfig = process.env.NODE_ENV === 'development' 
        ? localStorage.getItem('fablecraft_migration_config')
        : null;

      if (devConfig) {
        const parsedConfig = JSON.parse(devConfig);
        setConfig({ ...DEFAULT_MIGRATION_CONFIG, ...parsedConfig });
      }

      setIsReady(true);
    } catch (error) {
      console.warn('Failed to load migration config, using defaults:', error);
      setIsReady(true);
    }
  }, []);

  // Migration error handler
  const handleMigrationError = (error: Error) => {
    console.error('Migration system error:', error);
    setMigrationError(error);
    
    // Auto-rollback on critical errors if enabled
    if (config.rollbackEnabled) {
      console.warn('Auto-rolling back to legacy system due to error');
      setConfig(prev => ({ ...prev, migrationPhase: 'legacy' }));
    }
  };

  // Development controls (only in dev mode)
  const DevMigrationControls = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">Migration Controls</h3>
        <div className="space-y-2">
          <select
            value={config.migrationPhase}
            onChange={(e) => {
              const newPhase = e.target.value as MigrationConfig['migrationPhase'];
              const newConfig = { ...config, migrationPhase: newPhase };
              setConfig(newConfig);
              localStorage.setItem('fablecraft_migration_config', JSON.stringify(newConfig));
            }}
            className="w-full text-xs p-1 border rounded"
          >
            <option value="legacy">Legacy System</option>
            <option value="hybrid">Hybrid (Recommended)</option>
            <option value="modern">Modern System</option>
          </select>
          
          <div className="text-xs space-y-1">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={config.featureFlags.modernCharacterSystem}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    featureFlags: {
                      ...config.featureFlags,
                      modernCharacterSystem: e.target.checked
                    }
                  };
                  setConfig(newConfig);
                  localStorage.setItem('fablecraft_migration_config', JSON.stringify(newConfig));
                }}
              />
              Modern Characters
            </label>
            
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={config.featureFlags.concurrentFeatures}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    featureFlags: {
                      ...config.featureFlags,
                      concurrentFeatures: e.target.checked
                    }
                  };
                  setConfig(newConfig);
                  localStorage.setItem('fablecraft_migration_config', JSON.stringify(newConfig));
                }}
              />
              Concurrent Features
            </label>
          </div>
        </div>
      </div>
    );
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ModernSpinner context="general" size="lg" message="Initializing migration system..." />
      </div>
    );
  }

  // Error state with rollback option
  if (migrationError && !config.rollbackEnabled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-destructive mb-4">Migration Error</h1>
          <p className="text-muted-foreground mb-4">
            The migration system encountered an error. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate system based on migration phase
  return (
    <ModernErrorBoundary onError={handleMigrationError}>
      <Suspense 
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <ModernSpinner 
              context="general" 
              size="lg" 
              message={`Loading ${config.migrationPhase} system...`} 
            />
          </div>
        }
      >
        {/* Legacy System */}
        {config.migrationPhase === 'legacy' && <LegacyApp />}
        
        {/* Hybrid System - Enhanced legacy with modern features */}
        {config.migrationPhase === 'hybrid' && (
          <HybridSystem config={config} onError={handleMigrationError} />
        )}
        
        {/* Modern System */}
        {config.migrationPhase === 'modern' && (
          <ModernApp 
            enableConcurrentFeatures={config.featureFlags.concurrentFeatures}
            enableOptimisticUpdates={true}
          />
        )}
      </Suspense>
      
      <DevMigrationControls />
    </ModernErrorBoundary>
  );
}

// Hybrid system that enhances legacy with modern features
function HybridSystem({ 
  config, 
  onError 
}: { 
  config: MigrationConfig; 
  onError: (error: Error) => void; 
}) {
  try {
    return (
      <React.Fragment>
        {/* Load legacy app as base */}
        <LegacyApp />
        
        {/* Overlay modern enhancements based on feature flags */}
        {config.featureFlags.accessibilityEnhancements && (
          <Suspense fallback={null}>
            {React.lazy(() => import('@/components/modern/ModernAccessibility').then(m => ({ 
              default: () => <m.AccessibilityProvider><div /></m.AccessibilityProvider>
            })))}
          </Suspense>
        )}
      </React.Fragment>
    );
  } catch (error) {
    onError(error as Error);
    return <LegacyApp />; // Fallback to legacy
  }
}

// Migration status component for monitoring
export function MigrationStatus() {
  const [status, setStatus] = useState<{
    phase: string;
    features: Record<string, boolean>;
    errors: number;
  }>({
    phase: 'unknown',
    features: {},
    errors: 0
  });

  useEffect(() => {
    const config = localStorage.getItem('fablecraft_migration_config');
    if (config) {
      const parsed = JSON.parse(config);
      setStatus({
        phase: parsed.migrationPhase || 'legacy',
        features: parsed.featureFlags || {},
        errors: 0
      });
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 left-4 z-40 bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
      <div className="font-semibold mb-1">Migration Status</div>
      <div>Phase: <span className="font-mono">{status.phase}</span></div>
      <div>Features: {Object.values(status.features).filter(Boolean).length}/{Object.keys(status.features).length}</div>
      {status.errors > 0 && (
        <div className="text-destructive">Errors: {status.errors}</div>
      )}
    </div>
  );
}

export default MigrationSystem;