/**
 * Character Component Index
 * Centralized exports for all character components to simplify imports
 */

// Main character components
export { CharacterManager } from '../CharacterManager';
export { CharacterUnifiedViewPremium } from '../CharacterUnifiedViewPremium';
export { CharacterTemplates } from '../CharacterTemplates';

// Utility components
export { CharacterPortraitModal } from '../CharacterPortraitModalImproved';
// CharacterGenerationModal removed - AI functionality removed

// Shared components are exported from their own files to avoid circular dependencies
// Import them directly: ./FieldRenderer, ./FormSection, ./CharacterProgress

// Hooks
export { useCharacterForm } from '../hooks/useCharacterForm';

// Types
// CharacterGenerationOptions type removed - AI functionality removed