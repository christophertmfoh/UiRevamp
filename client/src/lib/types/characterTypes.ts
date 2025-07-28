/**
 * Enhanced Character Types - Senior Dev Pattern
 * Comprehensive character system with backward compatibility
 */

import type { Character as LegacyCharacter } from '../types';

// ===== BASE ENTITY INTERFACES =====
export interface BaseEntity {
  id: string;
  projectId: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface EnhancedEntityFields {
  // Metadata
  tags?: string[];
  notes?: string;
  isArchived?: boolean;
  
  // AI Enhancement
  aiGenerated?: boolean;
  lastAIUpdate?: Date;
  
  // Relationships
  relationships?: string[];
  
  // Completion tracking
  completionPercentage?: number;
  lastModified?: Date;
}

// ===== CHARACTER INTERFACES =====
export interface Character extends BaseEntity, EnhancedEntityFields {
  // Identity Section
  name: string;
  nicknames?: string;
  title?: string;
  aliases?: string;
  role?: string;
  
  // Demographics
  age?: string;
  race?: string;
  ethnicity?: string;
  birthdate?: string;
  zodiacSign?: string;
  
  // Professional
  class?: string;
  profession?: string;
  occupation?: string;
  
  // Physical Description
  physicalDescription?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  distinguishingFeatures?: string;
  
  // Personality & Psychology
  personality?: string;
  traits?: string[];
  values?: string;
  goals?: string;
  fears?: string;
  strengths?: string;
  weaknesses?: string;
  
  // Background & History
  backstory?: string;
  familyBackground?: string;
  education?: string;
  keyEvents?: string;
  
  // Skills & Abilities
  skills?: string[];
  talents?: string;
  abilities?: string;
  languages?: string[];
  
  // Relationships
  familyMembers?: string;
  allies?: string;
  enemies?: string;
  romanticInterests?: string;
  
  // Story Integration
  motivations?: string;
  characterArc?: string;
  plotRole?: string;
  symbolism?: string;
  
  // Additional Fields
  equipment?: string;
  belongings?: string;
  secrets?: string;
  quirks?: string;
  habits?: string;
  speech?: string;
  mannerisms?: string;
  
  // World-specific
  species?: string;
  faction?: string;
  location?: string;
  
  // Visual Assets
  portraits?: string[];
  images?: string[];
  
  // Legacy compatibility
  description?: string;
  children?: string;
}

// ===== ENHANCED CHARACTER TYPES =====
export interface EnhancedCharacter extends Character {
  // Enhanced features for Phase 2 optimizations
  version: number;
  templates?: string[];
  aiInsights?: {
    personalityAnalysis?: string;
    archetypeMatch?: string;
    developmentSuggestions?: string[];
    consistencyScore?: number;
  };
  
  // Performance tracking (Phase 2 optimization)
  loadTime?: number;
  lastAccessed?: Date;
  accessCount?: number;
}

// ===== FORM & VALIDATION TYPES =====
export interface CharacterFormData extends Partial<Character> {
  // Required fields for forms
  name: string;
  projectId: string;
}

export interface CharacterValidationError {
  field: keyof Character;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface CharacterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fantasy' | 'sci-fi' | 'modern' | 'historical' | 'custom';
  baseData: Partial<Character>;
  requiredFields: (keyof Character)[];
  suggestedFields: (keyof Character)[];
}

// ===== RELATIONSHIP TYPES =====
export interface CharacterRelationship {
  id: string;
  sourceCharacterId: string;
  targetCharacterId: string;
  relationshipType: 'family' | 'friend' | 'enemy' | 'romantic' | 'professional' | 'mentor' | 'other';
  description?: string;
  strength: 1 | 2 | 3 | 4 | 5; // 1 = weak, 5 = very strong
  isPublic: boolean;
  notes?: string;
}

// ===== UTILITY TYPES =====
export type CharacterField = keyof Character;
export type RequiredCharacterFields = 'id' | 'projectId' | 'name';
export type OptionalCharacterFields = Exclude<CharacterField, RequiredCharacterFields>;

// ===== LEGACY COMPATIBILITY =====
// Maintain compatibility with existing code that expects the old Character type
export type LegacyCharacterCompat = LegacyCharacter;

// ===== TYPE GUARDS =====
export function isEnhancedCharacter(character: Character | EnhancedCharacter): character is EnhancedCharacter {
  return 'version' in character && typeof character.version === 'number';
}

export function isValidCharacter(obj: any): obj is Character {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.projectId === 'string' &&
    typeof obj.name === 'string'
  );
}