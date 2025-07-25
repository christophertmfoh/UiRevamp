/**
 * Character Utilities
 * Consolidated utility functions for character processing
 */

import type { Character } from '@/lib/types';
import { FIELD_DEFINITIONS, getFieldDefinition } from '@/lib/config/fieldConfig';

export function calculateCharacterCompleteness(character: Partial<Character>): {
  total: number;
  filled: number;
  percentage: number;
} {
  const totalFields = FIELD_DEFINITIONS.length;
  const filledFields = FIELD_DEFINITIONS.filter(field => {
    const value = character[field.key as keyof Character];
    return value && value !== '' && (!Array.isArray(value) || value.length > 0);
  }).length;
  
  return {
    total: totalFields,
    filled: filledFields,
    percentage: Math.round((filledFields / totalFields) * 100)
  };
}

export function getCharacterReadinessLevel(percentage: number): {
  level: string;
  color: string;
  description: string;
} {
  if (percentage >= 80) {
    return {
      level: 'Story Ready',
      color: 'text-green-600',
      description: 'Character is well-developed and ready for storytelling'
    };
  }
  
  if (percentage >= 60) {
    return {
      level: 'Well Developed',
      color: 'text-blue-600',
      description: 'Character has strong foundation with room for detail enhancement'
    };
  }
  
  if (percentage >= 40) {
    return {
      level: 'In Progress',
      color: 'text-yellow-600',
      description: 'Character development is underway but needs more work'
    };
  }
  
  return {
    level: 'Early Stage',
    color: 'text-gray-600',
    description: 'Character is in early development with basic information'
  };
}

export function convertArrayFieldsToStrings(character: any): any {
  const convertedCharacter = { ...character };
  
  // List of fields that should be arrays but might come as strings from AI
  const arrayFields = ['personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 'languages', 'archetypes', 'tropes', 'tags'];
  
  arrayFields.forEach(field => {
    if (convertedCharacter[field]) {
      if (typeof convertedCharacter[field] === 'string') {
        // Convert string to array by splitting on common delimiters
        convertedCharacter[field] = convertedCharacter[field]
          .split(/[,;\n]/)
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
      } else if (Array.isArray(convertedCharacter[field])) {
        // Clean up existing array
        convertedCharacter[field] = convertedCharacter[field]
          .map((item: any) => typeof item === 'string' ? item.trim() : String(item))
          .filter((item: string) => item.length > 0);
      }
    }
  });
  
  return convertedCharacter;
}

export function prepareCharacterForSave(character: any): any {
  const prepared = convertArrayFieldsToStrings(character);
  
  // Ensure required fields exist
  if (!prepared.projectId) {
    console.warn('Character missing projectId');
  }
  
  // Clean up empty values
  Object.keys(prepared).forEach(key => {
    const value = prepared[key];
    if (value === '' || (Array.isArray(value) && value.length === 0)) {
      delete prepared[key];
    }
  });
  
  return prepared;
}

export function validateCharacterData(character: Partial<Character>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  // Check required fields
  const requiredFields = FIELD_DEFINITIONS.filter(field => field.required);
  
  requiredFields.forEach(field => {
    const value = character[field.key as keyof Character];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field.key] = `${field.label} is required`;
    }
  });
  
  // Validate projectId
  if (!character.projectId) {
    errors.projectId = 'Project ID is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function getEmptyFields(character: Partial<Character>): string[] {
  return FIELD_DEFINITIONS
    .filter(field => {
      const value = character[field.key as keyof Character];
      return !value || value === '' || (Array.isArray(value) && value.length === 0);
    })
    .map(field => field.key);
}

export function getFieldsBySection(sectionId: string): typeof FIELD_DEFINITIONS {
  return FIELD_DEFINITIONS.filter(field => field.section === sectionId);
}

export function createCharacterSummary(character: Partial<Character>): string {
  const name = character.name || 'Unnamed Character';
  const race = character.race || 'Unknown';
  const role = character.role || 'Unknown';
  const completeness = calculateCharacterCompleteness(character);
  
  return `${name} (${race} ${role}) - ${completeness.percentage}% complete`;
}