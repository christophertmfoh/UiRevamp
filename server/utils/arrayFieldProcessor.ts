/**
 * PostgreSQL Array Field Processor
 * 
 * This utility handles the known PostgreSQL/node-postgres bug where empty JavaScript arrays []
 * get converted to empty objects {} during database operations.
 * 
 * Research sources:
 * - https://github.com/brianc/node-postgres/issues/2680
 * - https://github.com/brianc/node-postgres/issues/864
 * - https://github.com/brianc/node-postgres/issues/1920
 */

/**
 * List of all fields that should be treated as arrays
 */
export const ARRAY_FIELDS = [
  'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
  'tropes', 'tags', 'spokenLanguages', 'nicknames', 'aliases', 
  'distinguishingMarks', 'coreAbilities', 'specialAbilities', 'strengths', 
  'weaknesses', 'values', 'beliefs', 'goals', 'motivations', 'fears', 
  'desires', 'quirks', 'likes', 'dislikes', 'habits', 'vices', 'mannerisms',
  'formativeEvents', 'family', 'friends', 'allies', 'enemies', 'rivals', 
  'mentors', 'archetypes'
];

// Fields that commonly get corrupted with JSON-stringified objects
export const PROBLEMATIC_ARRAY_FIELDS = [
  'values', 'motivations', 'goals', 'fears', 'desires', 'strengths', 
  'weaknesses', 'formativeEvents', 'family', 'archetypes', 'beliefs',
  'quirks', 'dislikes', 'habits', 'vices', 'mannerisms', 'enemies',
  'friends', 'allies', 'rivals', 'mentors'
];

/**
 * NUCLEAR OPTION: Aggressive string cleaning for corrupted JSON fields
 */
export function aggressiveCleanArrayField(value: any): string[] {
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
 * Processes data BEFORE saving to database to ensure arrays are handled correctly
 */
export function processArrayFieldsForDatabase(data: any): any {
  const processedData = { ...data };
  
  ARRAY_FIELDS.forEach(field => {
    const value = processedData[field];
    
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Keep as array if it has content, empty array becomes null to avoid {} conversion
        processedData[field] = value.length > 0 ? value : null;
      } else if (typeof value === 'string') {
        // Handle string conversion
        if (value === '' || value === '{}' || value === '[]') {
          processedData[field] = null; // Null instead of empty array to avoid {} issue
        } else {
          // Convert comma-separated string to array
          processedData[field] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
      } else if (typeof value === 'object') {
        // Handle object that should be array (the bug scenario)
        if (Object.keys(value).length === 0) {
          processedData[field] = null; // Empty object becomes null
        } else {
          // Convert object values to array
          processedData[field] = Object.values(value).filter(val => val && String(val).trim().length > 0);
        }
      }
    } else {
      processedData[field] = null;
    }
  });
  
  return processedData;
}

/**
 * Processes data AFTER retrieving from database to ensure arrays are displayed correctly
 */
export function processArrayFieldsFromDatabase(data: any): any {
  const processedData = { ...data };
  
  ARRAY_FIELDS.forEach(field => {
    // NUCLEAR OPTION: Use aggressive cleaning for ALL array fields
    processedData[field] = aggressiveCleanArrayField(processedData[field]);
  });
  
  return processedData;
}

/**
 * Debug function to log array field processing
 */
export function debugArrayFields(data: any, stage: 'before_db' | 'after_db'): void {
  console.log(`Array field debugging - ${stage}:`);
  ARRAY_FIELDS.forEach(field => {
    const value = data[field];
    if (value !== undefined) {
      console.log(`  ${field}:`, {
        type: typeof value,
        isArray: Array.isArray(value),
        value: Array.isArray(value) ? `[${value.length} items]` : value,
        firstItem: Array.isArray(value) && value.length > 0 ? value[0] : null
      });
    }
  });
}