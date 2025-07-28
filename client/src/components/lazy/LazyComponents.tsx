/**
 * Lazy Loading Components
 * Code splitting implementation for performance optimization
 */

import { lazy, Suspense, ComponentType } from 'react';
import { LoadingStates } from '@/components/ui/LoadingStates';

// Higher-order component for lazy loading with error boundaries
function withLazyLoading<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  loadingComponent?: ComponentType,
  displayName?: string
) {
  const LazyComponent = lazy(importFn);
  LazyComponent.displayName = displayName || 'LazyComponent';

  const WrappedComponent = (props: T) => (
    <Suspense fallback={loadingComponent ? loadingComponent({}) : <LoadingStates.Component />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `withLazyLoading(${displayName || 'Component'})`;
  return WrappedComponent;
}

// Page-level lazy components (largest impact)
export const LazyWorkspace = withLazyLoading(
  () => import('@/pages/workspace'),
  LoadingStates.Page,
  'LazyWorkspace'
);

export const LazyAuthPage = withLazyLoading(
  () => import('@/pages/AuthPage'),
  LoadingStates.Page,
  'LazyAuthPage'
);

export const LazyAuthPageRedesign = withLazyLoading(
  () => import('@/pages/AuthPageRedesign'),
  LoadingStates.Page,
  'LazyAuthPageRedesign'
);

// Large character components (high priority for code splitting)
export const LazyCharacterUnifiedViewPremium = withLazyLoading(
  () => import('@/components/character/CharacterUnifiedViewPremium'),
  LoadingStates.Card,
  'LazyCharacterUnifiedViewPremium'
);

export const LazyCharacterManager = withLazyLoading(
  () => import('@/components/character/CharacterManager'),
  LoadingStates.Component,
  'LazyCharacterManager'
);

export const LazyCharacterPortraitModalImproved = withLazyLoading(
  () => import('@/components/character/CharacterPortraitModalImproved'),
  LoadingStates.Modal,
  'LazyCharacterPortraitModalImproved'
);

export const LazyCharacterUnifiedView = withLazyLoading(
  () => import('@/components/character/CharacterUnifiedView'),
  LoadingStates.Component,
  'LazyCharacterUnifiedView'
);

export const LazyCharacterDetailView = withLazyLoading(
  () => import('@/components/character/CharacterDetailView'),
  LoadingStates.Component,
  'LazyCharacterDetailView'
);

export const LazyCharacterFormExpanded = withLazyLoading(
  () => import('@/components/character/CharacterFormExpanded'),
  LoadingStates.Form,
  'LazyCharacterFormExpanded'
);

export const LazyCharacterGuidedCreation = withLazyLoading(
  () => import('@/components/character/CharacterGuidedCreation'),
  LoadingStates.Component,
  'LazyCharacterGuidedCreation'
);

export const LazyCharacterGenerationModal = withLazyLoading(
  () => import('@/components/character/CharacterGenerationModal'),
  LoadingStates.Modal,
  'LazyCharacterGenerationModal'
);

// Large project components
export const LazyProjectsPageRedesign = withLazyLoading(
  () => import('@/components/project/ProjectsPageRedesign'),
  LoadingStates.Page,
  'LazyProjectsPageRedesign'
);

export const LazyProjectCreationWizard = withLazyLoading(
  () => import('@/components/project/ProjectCreationWizard'),
  LoadingStates.Modal,
  'LazyProjectCreationWizard'
);

export const LazyProjectDashboard = withLazyLoading(
  () => import('@/components/project/ProjectDashboard'),
  LoadingStates.Component,
  'LazyProjectDashboard'
);

// Feature-specific lazy components
export const LazyWorldBible = withLazyLoading(
  () => import('@/components/world/WorldBible'),
  LoadingStates.Component,
  'LazyWorldBible'
);

// AI-related components (optional features)
export const LazyAIAssistModal = withLazyLoading(
  () => import('@/components/character/AIAssistModal'),
  LoadingStates.Modal,
  'LazyAIAssistModal'
);

export const LazyFieldAIAssist = withLazyLoading(
  () => import('@/components/character/FieldAIAssist'),
  LoadingStates.Spinner,
  'LazyFieldAIAssist'
);

// Modal components (loaded on demand)
export const LazyCharacterTemplates = withLazyLoading(
  () => import('@/components/character/CharacterTemplates'),
  LoadingStates.Modal,
  'LazyCharacterTemplates'
);

export const LazyImagePreviewModal = withLazyLoading(
  () => import('@/components/character/ImagePreviewModal'),
  LoadingStates.Modal,
  'LazyImagePreviewModal'
);

export const LazyCharacterDocumentUpload = withLazyLoading(
  () => import('@/components/character/CharacterDocumentUpload'),
  LoadingStates.Component,
  'LazyCharacterDocumentUpload'
);

// Dashboard widgets (loaded progressively)
export const LazyDashboardWidgets = withLazyLoading(
  () => import('@/components/projects/DashboardWidgets'),
  LoadingStates.Grid,
  'LazyDashboardWidgets'
);

export const LazyQuickTasksWidget = withLazyLoading(
  () => import('@/components/projects/QuickTasksWidget'),
  LoadingStates.Card,
  'LazyQuickTasksWidget'
);

// Landing page components (not critical for authenticated users)
export const LazyLandingPage = withLazyLoading(
  () => import('@/components/LandingPage'),
  LoadingStates.Page,
  'LazyLandingPage'
);

export const LazyHeroSection = withLazyLoading(
  () => import('@/components/landing/HeroSection'),
  LoadingStates.Component,
  'LazyHeroSection'
);

export const LazyFeatureCards = withLazyLoading(
  () => import('@/components/landing/FeatureCards'),
  LoadingStates.Grid,
  'LazyFeatureCards'
);

export const LazyCTASection = withLazyLoading(
  () => import('@/components/landing/CTASection'),
  LoadingStates.Component,
  'LazyCTASection'
);

// Bundle splitting by feature
export const CharacterFeature = {
  Manager: LazyCharacterManager,
  UnifiedView: LazyCharacterUnifiedView,
  UnifiedViewPremium: LazyCharacterUnifiedViewPremium,
  DetailView: LazyCharacterDetailView,
  FormExpanded: LazyCharacterFormExpanded,
  GuidedCreation: LazyCharacterGuidedCreation,
  GenerationModal: LazyCharacterGenerationModal,
  PortraitModal: LazyCharacterPortraitModalImproved,
  Templates: LazyCharacterTemplates,
  DocumentUpload: LazyCharacterDocumentUpload,
  AIAssist: LazyAIAssistModal,
  FieldAIAssist: LazyFieldAIAssist,
  ImagePreview: LazyImagePreviewModal
};

export const ProjectFeature = {
  PageRedesign: LazyProjectsPageRedesign,
  CreationWizard: LazyProjectCreationWizard,
  Dashboard: LazyProjectDashboard,
  DashboardWidgets: LazyDashboardWidgets,
  QuickTasks: LazyQuickTasksWidget
};

export const PageFeature = {
  Workspace: LazyWorkspace,
  Auth: LazyAuthPage,
  AuthRedesign: LazyAuthPageRedesign,
  Landing: LazyLandingPage
};

export const LandingFeature = {
  Page: LazyLandingPage,
  Hero: LazyHeroSection,
  Features: LazyFeatureCards,
  CTA: LazyCTASection
};

export const LazyLoadingMetrics = {
  trackComponentLoad: (componentName: string, loadTime: number) => {
    if (import.meta.env.DEV) {
      console.log(`⚡ Lazy loaded: ${componentName} in ${loadTime.toFixed(2)}ms`);
    }
  },
  preloadComponent: async (importFn: () => Promise<any>) => {
    // Simple preload for Replit
    try {
      await importFn();
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  }
};

// Component route mapping for dynamic imports
export const RouteComponents = {
  '/workspace': LazyWorkspace,
  '/auth': LazyAuthPage,
  '/auth-redesign': LazyAuthPageRedesign,
  '/': LazyLandingPage
} as const;

// Export utility for creating custom lazy components
export { withLazyLoading };

// Export all components for easy importing
export * from '@/components/ui/LoadingStates';