/**
 * Character-Specific Type Definitions
 * Consolidated character types using base types as foundation
 */

import type { 
  EnhancedEntityFields, 
  BaseTemplate,
  EntityArc,
  EntityRelationship,
  EntityInsights
} from './baseTypes';

// Legacy Character import for backward compatibility
type LegacyCharacter = import('../types').Character;

// Main Character interface (consolidated from scattered definitions)
// Extends both our enhanced base and maintains compatibility with legacy interface
export interface Character extends EnhancedEntityFields, Omit<LegacyCharacter, keyof EnhancedEntityFields> {
  // Identity Section
  name: string;
  nicknames?: string;
  title?: string;
  race?: string;
  age?: string;
  gender?: string;
  class?: string;
  profession?: string;
  role?: string;
  archetype?: string;
  
  // Physical Section
  height?: string;
  weight?: string;
  build?: string;
  eyeColor?: string;
  hairColor?: string;
  hairStyle?: string;
  skinTone?: string;
  distinguishingMarks?: string;
  clothing?: string;
  accessories?: string;
  posture?: string;
  mannerisms?: string;
  speech?: string;
  voice?: string;
  
  // Personality Section
  personalityTraits?: string[];
  temperament?: string;
  quirks?: string;
  likes?: string;
  dislikes?: string;
  values?: string;
  beliefs?: string;
  fears?: string;
  secrets?: string;
  goals?: string;
  motivations?: string;
  flaws?: string;
  
  // Background Section
  backstory?: string;
  childhood?: string;
  education?: string;
  family?: string;
  pastEvents?: string;
  
  // Skills Section
  abilities?: string[];
  skills?: string[];
  talents?: string[];
  strengths?: string;
  weaknesses?: string;
  
  // Story Section
  storyFunction?: string;
  conflictSources?: string;
  relationships?: EntityRelationship[];
  arcs?: EntityArc[];
  
  // Meta Section
  archetypes?: string[];
  themes?: string[];
  symbolism?: string;
  inspiration?: string;
  writerNotes?: string;
  
  // Enhanced fields
  portraits?: CharacterPortrait[];
  displayImageId?: string;
  insights?: EntityInsights;
  
  // Legacy fields for backward compatibility
  description?: string;
  imageUrl?: string;
}

// Character-specific portrait structure
export interface CharacterPortrait {
  id: string;
  imageUrl: string;
  isMain: boolean;
  description?: string;
  style?: string;
  createdAt: string;
}

// Character template (extends base template)
export interface CharacterTemplate extends BaseTemplate<Character> {
  category: 'fantasy' | 'modern' | 'scifi' | 'romance' | 'thriller' | 'universal';
  icon?: string;
  popularity?: number;
}

// Character-specific generation options
export interface CharacterGenerationOptions {
  entityType: 'characters';
  prompt: string;
  context?: string;
  style?: 'realistic' | 'fantasy' | 'anime' | 'cartoon';
  parameters?: {
    age?: string;
    gender?: string;
    race?: string;
    profession?: string;
    personality?: string[];
    setting?: string;
  };
  projectContext?: {
    projectId: string;
    existingCharacters?: Character[];
    worldContext?: string;
  };
}

// Character relationship types (extends base relationship)
export interface CharacterRelationship extends EntityRelationship {
  targetEntityType: 'characters';
  type: 'family' | 'romantic' | 'friend' | 'enemy' | 'ally' | 'mentor' | 'rival' | 'professional';
}

// Character arc types (extends base arc)
export interface CharacterArc extends EntityArc {
  characterId: string;
  arcType: 'character-growth' | 'redemption' | 'fall' | 'discovery' | 'romance' | 'revenge';
  psychologicalChange: string;
  externalChange: string;
}

// Character statistics
export interface CharacterStatistics {
  total: number;
  byRole: Record<string, number>;
  byArchetype: Record<string, number>;
  byCompleteness: {
    wellDeveloped: number;
    inProgress: number;
    needWork: number;
  };
  averageCompleteness: number;
  recentlyUpdated: number;
  withPortraits: number;
  withRelationships: number;
  withArcs: number;
}

// Character form data (for form handling)
export interface CharacterFormData {
  [key: string]: string | string[] | number | boolean | undefined;
}

// Character validation errors
export interface CharacterValidationErrors {
  [fieldKey: string]: string;
}

// Character export data
export interface CharacterExportData {
  basic: Character;
  relationships: CharacterRelationship[];
  arcs: CharacterArc[];
  portraits: CharacterPortrait[];
  insights: EntityInsights | null;
}

// Character import mapping
export interface CharacterImportMapping {
  [csvColumn: string]: keyof Character;
}

// Character search filters
export interface CharacterFilters {
  search?: string;
  role?: string[];
  archetype?: string[];
  race?: string[];
  completeness?: {
    min: number;
    max: number;
  };
  hasPortrait?: boolean;
  hasRelationships?: boolean;
  hasArcs?: boolean;
  recentlyUpdated?: boolean;
  tags?: string[];
}

// Character sort options
export type CharacterSortOption = 
  | 'alphabetical' 
  | 'recently-added' 
  | 'recently-edited' 
  | 'completeness' 
  | 'role'
  | 'archetype';

// Character view modes
export type CharacterViewMode = 'grid' | 'list' | 'table' | 'relationship-map';

// Character AI enhancement request
export interface CharacterAIEnhancementRequest {
  characterId: string;
  fieldKey: keyof Character;
  fieldLabel: string;
  currentValue: any;
  character: Character;
  fieldOptions?: string[];
  enhancementType?: 'expand' | 'improve' | 'suggest' | 'generate';
}

// Character AI enhancement response
export interface CharacterAIEnhancementResponse {
  success: boolean;
  enhancedValue: any;
  suggestions?: string[];
  warnings?: string[];
  confidence: number;
  reasoning?: string;
}