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
  'quirks', 'dislikes', 'habits', 'vices', 'mannerisms'
];

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
    const value = processedData[field];
    
    if (value === null || value === undefined) {
      // Null/undefined becomes empty array for frontend
      processedData[field] = [];
    } else if (typeof value === 'string') {
      // String handling
      if (value === '' || value === '{}' || value === '[]') {
        processedData[field] = [];
      } else {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            processedData[field] = parsed;
          } else if (typeof parsed === 'object' && parsed !== null) {
            // Object becomes array of values
            processedData[field] = Object.values(parsed).filter(val => val && String(val).trim().length > 0);
          } else {
            processedData[field] = [String(parsed)];
          }
        } catch {
          // If JSON parsing fails, split by comma
          processedData[field] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Object that should be array (the main PostgreSQL bug)
      if (Object.keys(value).length === 0) {
        processedData[field] = []; // Empty object becomes empty array
      } else {
        // Handle the specific corruption pattern: {"0": '{"item1"', "1": 'item2"}', etc.}
        const extractedValues = Object.values(value).map(val => {
          if (typeof val === 'string') {
            // Handle JSON-stringified objects like '{"Methodical"' or '{"Truth/Knowing"'
            if (val.startsWith('{"') && !val.endsWith('}')) {
              // Incomplete JSON string, extract the key
              try {
                const keyMatch = val.match(/^\{"([^"]+)"/);
                return keyMatch ? keyMatch[1] : val;
              } catch {
                return val;
              }
            } else if (val.startsWith('{"') && val.endsWith('}')) {
              // Complete JSON object, extract the first key
              try {
                const parsed = JSON.parse(val);
                if (typeof parsed === 'object') {
                  const keys = Object.keys(parsed);
                  return keys.length > 0 ? keys[0] : Object.values(parsed)[0] || val;
                }
                return parsed;
              } catch {
                return val;
              }
            } else if (val.startsWith('{') && val.endsWith('}')) {
              // JSON-like string without quotes
              try {
                const content = val.slice(1, -1); // Remove { }
                return content.split(':')[0].replace(/"/g, '').trim() || content;
              } catch {
                return val;
              }
            }
            return val;
          }
          return val;
        }).filter(val => val && String(val).trim().length > 0);
        
        processedData[field] = extractedValues;
      }
    } else if (!Array.isArray(value)) {
      // Any other type becomes single-item array
      processedData[field] = [String(value)];
    }
    // If it's already a proper array, leave it as-is
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