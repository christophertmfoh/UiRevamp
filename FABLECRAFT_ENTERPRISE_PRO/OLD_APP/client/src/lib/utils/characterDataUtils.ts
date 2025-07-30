/**
 * ENTERPRISE-GRADE CHARACTER DATA UTILITIES
 * 
 * Centralized data processing to prevent corruption across all character components.
 * This fixes the systematic JSON.stringify corruption bug and ensures type safety.
 * 
 * @author Senior Development Team
 * @version 2.0.0 - Anti-Corruption Edition
 */

import type { Character } from '@/lib/types';

// Define field categories based on database schema
const STRING_FIELDS = [
  'name', 'nicknames', 'pronouns', 'age', 'species', 'gender',
  'occupation', 'title', 'birthdate', 'birthplace', 'currentLocation', 'nationality',
  'beliefs', 'values', 'principles', 'virtues', 'vices', 'habits', 'quirks',
  'idiosyncrasies', 'petPeeves', 'likes', 'dislikes', 'hobbies', 'interests', 
  'passions', 'formativeEvents', 'failures', 'allies', 'enemies', 'mentors', 
  'rivals', 'friends', 'family', 'physicalDescription', 'backstory', 'goals', 'motivations'
];

const ARRAY_FIELDS = [
  'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
  'languages', 'archetypes', 'tropes', 'tags', 'spokenLanguages', 'aliases'
];

// Corruption patterns to detect and fix
const CORRUPTION_PATTERNS = [
  '{}', '[]', 'null', 'undefined', '[object Object]', 
  '{"{}"}', '"null"', '"undefined"', '{"[object Object]"}'
];

/**
 * Determines if a string value is corrupted
 */
function isCorruptedValue(value: string): boolean {
  return CORRUPTION_PATTERNS.some(pattern => 
    value === pattern || 
    value.includes(pattern) || 
    value.startsWith('{"') || 
    value.includes('\\u') || 
    value.includes('\\x')
  );
}

/**
 * CORE FUNCTION: Normalize character data to prevent corruption
 * This replaces all the inconsistent processDataForSave functions
 */
export function normalizeCharacterData(data: Partial<Character>): Partial<Character> {
  const normalized = { ...data };
  
  // Process string fields with corruption detection
  STRING_FIELDS.forEach(field => {
    const value = (normalized as any)[field];
    
    if (value === null || value === undefined) {
      (normalized as any)[field] = '';
    } else if (typeof value === 'object') {
      // CRITICAL FIX: Objects in string fields cause corruption
      console.warn(`🔧 CharacterDataUtils: Fixed object in string field '${field}':`, value);
      (normalized as any)[field] = '';
    } else if (Array.isArray(value)) {
      // Convert arrays to comma-separated strings
      (normalized as any)[field] = value.filter(Boolean).join(', ');
      console.log(`🔧 CharacterDataUtils: Fixed array in string field '${field}': converted to string`);
    } else if (typeof value === 'string') {
      // Clean corrupted string values
      if (isCorruptedValue(value)) {
        console.log(`🧹 CharacterDataUtils: Cleaned corrupted string field '${field}': "${value}" → ""`);
        (normalized as any)[field] = '';
      } else {
        (normalized as any)[field] = value;
      }
    } else {
      // Convert other types to string safely
      (normalized as any)[field] = String(value);
    }
  });
  
  // Process array fields with type safety
  ARRAY_FIELDS.forEach(field => {
    const value = (normalized as any)[field];
    
    if (!value || value === null || value === undefined) {
      (normalized as any)[field] = [];
    } else if (typeof value === 'string') {
      if (isCorruptedValue(value)) {
        (normalized as any)[field] = [];
      } else {
        // Parse comma-separated strings to arrays
        (normalized as any)[field] = value.split(',')
          .map(s => s.trim())
          .filter(s => s && !isCorruptedValue(s));
      }
    } else if (Array.isArray(value)) {
      // Filter out corrupted array items
      (normalized as any)[field] = value.filter(item => 
        item !== null && 
        item !== undefined && 
        item !== '' && 
        typeof item === 'string' &&
        !isCorruptedValue(item)
      );
    } else if (typeof value === 'object') {
      // Objects in array fields should be empty arrays
      console.warn(`🔧 CharacterDataUtils: Fixed object in array field '${field}':`, value);
      (normalized as any)[field] = [];
    } else {
      (normalized as any)[field] = [];
    }
  });
  
  return normalized;
}

/**
 * CORE FUNCTION: Deep comparison for character data
 * Replaces all dangerous JSON.stringify comparisons
 */
export function hasCharacterChanges(current: Partial<Character>, original: Partial<Character>): boolean {
  // Normalize both objects first
  const normalizedCurrent = normalizeCharacterData(current);
  const normalizedOriginal = normalizeCharacterData(original);
  
  // Compare meaningful fields only (exclude timestamps and internal fields)
  const fieldsToCompare = [...STRING_FIELDS, ...ARRAY_FIELDS, 'imageUrl'];
  
  for (const field of fieldsToCompare) {
    const currentValue = (normalizedCurrent as any)[field];
    const originalValue = (normalizedOriginal as any)[field];
    
    // Handle array comparison
    if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
      if (currentValue.length !== originalValue.length) return true;
      for (let i = 0; i < currentValue.length; i++) {
        if (currentValue[i] !== originalValue[i]) return true;
      }
    } 
    // Handle string comparison
    else if (currentValue !== originalValue) {
      return true;
    }
  }
  
  return false;
}

/**
 * CORE FUNCTION: Clean existing corrupted character data
 * Used when loading characters from storage
 */
export function cleanCorruptedCharacterData(character: Character): Character {
  console.log(`🔍 CharacterDataUtils: Cleaning character data for '${character.name}'`);
  
  const cleaned = normalizeCharacterData(character) as Character;
  
  // Preserve essential character properties
  cleaned.id = character.id;
  cleaned.projectId = character.projectId;
  cleaned.createdAt = character.createdAt;
  cleaned.updatedAt = character.updatedAt;
  
  return cleaned;
}

/**
 * CORE FUNCTION: Prepare character data for API save
 * Ensures data integrity before sending to server
 */
export function prepareCharacterForSave(character: Partial<Character>): Partial<Character> {
  const prepared = normalizeCharacterData(character);
  
  // Remove undefined fields to prevent API issues
  Object.keys(prepared).forEach(key => {
    if ((prepared as any)[key] === undefined) {
      delete (prepared as any)[key];
    }
  });
  
  return prepared;
}

/**
 * CORE FUNCTION: Validate character data integrity
 * Returns array of issues found
 */
export function validateCharacterDataIntegrity(character: Partial<Character>): string[] {
  const issues: string[] = [];
  
  // Check for corruption in string fields
  STRING_FIELDS.forEach(field => {
    const value = (character as any)[field];
    if (typeof value === 'string' && isCorruptedValue(value)) {
      issues.push(`String field '${field}' contains corrupted value: "${value}"`);
    } else if (typeof value === 'object' && value !== null) {
      issues.push(`String field '${field}' contains object: ${JSON.stringify(value)}`);
    }
  });
  
  // Check for corruption in array fields
  ARRAY_FIELDS.forEach(field => {
    const value = (character as any)[field];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string' && isCorruptedValue(item)) {
          issues.push(`Array field '${field}[${index}]' contains corrupted value: "${item}"`);
        }
      });
    } else if (value !== null && value !== undefined && !Array.isArray(value)) {
      issues.push(`Array field '${field}' is not an array: ${typeof value}`);
    }
  });
  
  return issues;
}

/**
 * UTILITY: Log character data integrity check
 */
export function logCharacterDataIntegrity(character: Partial<Character>, context: string): void {
  const issues = validateCharacterDataIntegrity(character);
  if (issues.length > 0) {
    console.warn(`🚨 CharacterDataUtils: Data integrity issues in ${context}:`, issues);
  } else {
    console.log(`✅ CharacterDataUtils: Data integrity check passed for ${context}`);
  }
}