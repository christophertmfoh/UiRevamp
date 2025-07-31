/**
 * Landing Feature - Barrel Exports
 *
 * Provides clean, organized exports for the landing page feature
 * following Feature-Sliced Design (FSD) architecture patterns.
 */

// Main landing page component
export { LandingPage } from './landing-page';

// Individual section components
export { HeroSection } from './components/hero-section';
export { FeatureCards } from './components/feature-cards';
export { CTASection } from './components/cta-section';
export { ProcessSteps } from './components/process-steps';

// Type exports for external usage
export type {} from // Re-export component prop types if needed externally
'./landing-page';
