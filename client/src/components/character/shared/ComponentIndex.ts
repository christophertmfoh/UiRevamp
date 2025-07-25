/**
 * Character Component Index
 * Centralized exports for all character components to simplify imports
 */

// Main character components
export { CharacterManager } from '../CharacterManager';
export { CharacterUnifiedViewPremium } from '../CharacterUnifiedViewPremium';
export { CharacterFormExpanded } from '../CharacterFormExpanded';
export { CharacterTemplates } from '../CharacterTemplates';
export { CharacterCreationLaunch } from '../CharacterCreationLaunch';

// Utility components
export { FieldAIAssist } from '../FieldAIAssist';
export { CharacterPortraitModal } from '../CharacterPortraitModalImproved';
export { CharacterGenerationModal } from '../CharacterGenerationModal';

// Shared components are exported from their own files to avoid circular dependencies
// Import them directly: ./FieldRenderer, ./FormSection, ./CharacterProgress

// Hooks
export { useCharacterForm } from '../hooks/useCharacterForm';

// Types
export type { CharacterGenerationOptions } from '../CharacterGenerationModal';