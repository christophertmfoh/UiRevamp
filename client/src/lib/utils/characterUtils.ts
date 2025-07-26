/**
 * Character Utilities
 * Character-specific utility functions (now using shared utilities)
 */

import type { Character } from '@/lib/types';
import { FIELD_DEFINITIONS } from '@/lib/config/fieldConfig';
import { calculateEntityCompleteness, createEntitySummary } from '../utils/entityUtils';

export function calculateCharacterCompleteness(character: Partial<Character>): {
  total: number;
  filled: number;
  percentage: number;
} {
  return calculateEntityCompleteness(character as any, FIELD_DEFINITIONS);
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

/**
 * Complete list of all array fields in the character schema
 * This must match the backend ARRAY_FIELDS list for consistency
 */
export const CHARACTER_ARRAY_FIELDS = [
  'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
  'tropes', 'tags', 'spokenLanguages', 'nicknames', 'aliases', 
  'distinguishingMarks', 'coreAbilities', 'specialAbilities', 'strengths', 
  'weaknesses', 'values', 'beliefs', 'goals', 'motivations', 'fears', 
  'desires', 'quirks', 'likes', 'dislikes', 'habits', 'vices', 'mannerisms',
  'formativeEvents', 'family', 'friends', 'allies', 'enemies', 'rivals', 
  'mentors', 'archetypes'
];

/**
 * NUCLEAR OPTION: Aggressive array field cleaning for frontend
 */
function aggressiveCleanArrayField(value: any): string[] {
  if (!value || value === null || value === undefined) {
    return [];
  }
  
  if (Array.isArray(value)) {
    return value.filter(item => item && String(item).trim().length > 0);
  }
  
  if (typeof value === 'object') {
    // Handle PostgreSQL {} corruption - extract values and clean them
    const values = Object.values(value);
    
    return values.map(val => {
      if (typeof val !== 'string') return String(val);
      
      // DIRECT PATTERN MATCHING for corruption patterns
      let cleaned = val;
      
      // Pattern: '{"item"' - extract item between quotes
      const simplePattern = cleaned.match(/^\{"([^"]+)"/);
      if (simplePattern) {
        return simplePattern[1];
      }
      
      // Pattern: '{"item"}' - extract item between quotes
      const completePattern = cleaned.match(/^\{"([^"]+)"\}$/);
      if (completePattern) {
        return completePattern[1];
      }
      
      // Pattern: '{"{\\"item\\"}"' - double escaped
      if (cleaned.includes('\\"')) {
        cleaned = cleaned.replace(/\\"/g, '"');
        const doubleEscapedPattern = cleaned.match(/\{"([^"]+)"\}/);
        if (doubleEscapedPattern) {
          return doubleEscapedPattern[1];
        }
      }
      
      // Fallback: remove common JSON wrapper characters
      cleaned = cleaned.replace(/^[{"\s]+|[}"\s]+$/g, '');
      
      return cleaned.trim();
    }).filter(val => val && val.length > 0 && val !== '{}' && val !== '[]');
  }
  
  if (typeof value === 'string') {
    if (value === '' || value === '{}' || value === '[]') {
      return [];
    }
    return [value];
  }
  
  return [String(value)];
}

/**
 * Processes array fields from database/server responses to ensure proper frontend display
 * Handles the PostgreSQL {} conversion bug and various data formats
 */
export function processCharacterArrayFields(character: any): any {
  const processedCharacter = { ...character };
  
  CHARACTER_ARRAY_FIELDS.forEach(field => {
    const value = processedCharacter[field];
    
    if (value === null || value === undefined) {
      // Null/undefined becomes empty array
      processedCharacter[field] = [];
    } else if (typeof value === 'string') {
      // String handling
      if (value === '' || value === '{}' || value === '[]') {
        processedCharacter[field] = [];
      } else {
        try {
          // Try to parse as JSON first (handles objects from database)
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            processedCharacter[field] = parsed.filter(item => item && String(item).trim().length > 0);
          } else if (typeof parsed === 'object' && parsed !== null) {
            // Object becomes array of values
            processedCharacter[field] = Object.values(parsed).filter(val => val && String(val).trim().length > 0);
          } else {
            processedCharacter[field] = [String(parsed)];
          }
        } catch {
          // If JSON parsing fails, split by comma
          processedCharacter[field] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Use aggressive cleaning for corrupted object data
      processedCharacter[field] = aggressiveCleanArrayField(value);
    } else if (!Array.isArray(value)) {
      // Any other type becomes single-item array
      processedCharacter[field] = [String(value)];
    } else {
      // Already proper array, just filter out empty items
      processedCharacter[field] = value.filter(item => item && String(item).trim().length > 0);
    }
  });
  
  return processedCharacter;
}

export function convertArrayFieldsToStrings(character: any): any {
  const convertedCharacter = { ...character };
  
  CHARACTER_ARRAY_FIELDS.forEach(field => {
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

export function createCharacterSummary(character: Partial<Character>): string {
  return createEntitySummary(character as any, 'Character', FIELD_DEFINITIONS);
}