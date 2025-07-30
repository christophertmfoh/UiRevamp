/**
 * DATA MIGRATION UTILITY
 * 
 * Cleans up existing corrupted character data in the database.
 * Run this migration to fix the {"{}","[object Object]"} corruption
 * that was caused by the JSON.stringify bug.
 * 
 * Usage: 
 * - Import this in your server startup
 * - Call runCharacterDataMigration() once during deployment
 */

import { storage } from '../storage';

// Same field definitions as the client utility
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

const CORRUPTION_PATTERNS = [
  '{}', '[]', 'null', 'undefined', '[object Object]', 
  '{"{}"}', '"null"', '"undefined"', '{"[object Object]"}'
];

function isCorruptedValue(value: string): boolean {
  return CORRUPTION_PATTERNS.some(pattern => 
    value === pattern || 
    value.includes(pattern) || 
    value.startsWith('{"') || 
    value.includes('\\u') || 
    value.includes('\\x')
  );
}

function cleanCharacterData(character: any): any {
  const cleaned = { ...character };
  let hasChanges = false;
  
  // Clean string fields
  STRING_FIELDS.forEach(field => {
    const value = cleaned[field];
    
    if (value === null || value === undefined) {
      cleaned[field] = '';
    } else if (typeof value === 'object' || Array.isArray(value)) {
      console.log(`🧹 Migration: Fixed object/array in string field '${field}' for character ${character.name}`);
      cleaned[field] = '';
      hasChanges = true;
    } else if (typeof value === 'string' && isCorruptedValue(value)) {
      console.log(`🧹 Migration: Cleaned corrupted string field '${field}': "${value}" → "" for character ${character.name}`);
      cleaned[field] = '';
      hasChanges = true;
    }
  });
  
  // Clean array fields
  ARRAY_FIELDS.forEach(field => {
    const value = cleaned[field];
    
    if (!value || value === null || value === undefined) {
      cleaned[field] = [];
    } else if (typeof value === 'string') {
      if (isCorruptedValue(value)) {
        console.log(`🧹 Migration: Cleaned corrupted array field '${field}': "${value}" → [] for character ${character.name}`);
        cleaned[field] = [];
        hasChanges = true;
      } else {
        // Parse comma-separated strings to arrays
        cleaned[field] = value.split(',').map(s => s.trim()).filter(s => s && !isCorruptedValue(s));
      }
    } else if (Array.isArray(value)) {
      const originalLength = value.length;
      cleaned[field] = value.filter(item => 
        item !== null && 
        item !== undefined && 
        item !== '' && 
        typeof item === 'string' &&
        !isCorruptedValue(item)
      );
      if (cleaned[field].length !== originalLength) {
        console.log(`🧹 Migration: Cleaned corrupted items from array field '${field}' for character ${character.name}`);
        hasChanges = true;
      }
    } else if (typeof value === 'object') {
      console.log(`🧹 Migration: Fixed object in array field '${field}' for character ${character.name}`);
      cleaned[field] = [];
      hasChanges = true;
    }
  });
  
  return { cleaned, hasChanges };
}

export async function runCharacterDataMigration(): Promise<void> {
  console.log('🚀 Starting character data migration to fix corruption...');
  
  try {
    // Get all projects to find all characters
    const projects = await storage.getProjects();
    let totalCharacters = 0;
    let corruptedCharacters = 0;
    let fixedCharacters = 0;
    
    for (const project of projects) {
      console.log(`📂 Processing project: ${project.name} (${project.id})`);
      
      const characters = await storage.getCharacters(project.id);
      totalCharacters += characters.length;
      
      for (const character of characters) {
        const { cleaned, hasChanges } = cleanCharacterData(character);
        
        if (hasChanges) {
          corruptedCharacters++;
          try {
            await storage.updateCharacter(character.id, cleaned);
            fixedCharacters++;
            console.log(`✅ Fixed character: ${character.name} (${character.id})`);
          } catch (error) {
            console.error(`❌ Failed to fix character ${character.name}:`, error);
          }
        }
      }
    }
    
    console.log('🎉 Character data migration completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total characters processed: ${totalCharacters}`);
    console.log(`   - Corrupted characters found: ${corruptedCharacters}`);
    console.log(`   - Characters successfully fixed: ${fixedCharacters}`);
    
    if (corruptedCharacters > 0) {
      console.log(`⚠️ Found ${corruptedCharacters} characters with data corruption.`);
      console.log(`✅ Successfully fixed ${fixedCharacters} characters.`);
    } else {
      console.log(`✨ No data corruption found. All characters are clean!`);
    }
    
  } catch (error) {
    console.error('💥 Character data migration failed:', error);
    throw error;
  }
}

export async function validateAllCharacterData(): Promise<void> {
  console.log('🔍 Validating all character data for corruption...');
  
  try {
    const projects = await storage.getProjects();
    let totalCharacters = 0;
    let issuesFound = 0;
    
    for (const project of projects) {
      const characters = await storage.getCharacters(project.id);
      totalCharacters += characters.length;
      
      for (const character of characters) {
        // Check for corruption patterns
        STRING_FIELDS.forEach(field => {
          const value = character[field];
          if (typeof value === 'string' && isCorruptedValue(value)) {
            console.warn(`🚨 Corruption found in ${character.name}.${field}: "${value}"`);
            issuesFound++;
          } else if (typeof value === 'object' && value !== null) {
            console.warn(`🚨 Object found in string field ${character.name}.${field}:`, value);
            issuesFound++;
          }
        });
        
        ARRAY_FIELDS.forEach(field => {
          const value = character[field];
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'string' && isCorruptedValue(item)) {
                console.warn(`🚨 Corruption found in ${character.name}.${field}[${index}]: "${item}"`);
                issuesFound++;
              }
            });
          } else if (value !== null && value !== undefined && !Array.isArray(value)) {
            console.warn(`🚨 Non-array found in array field ${character.name}.${field}:`, typeof value);
            issuesFound++;
          }
        });
      }
    }
    
    console.log(`📊 Validation completed:`);
    console.log(`   - Total characters: ${totalCharacters}`);
    console.log(`   - Issues found: ${issuesFound}`);
    
    if (issuesFound === 0) {
      console.log('✅ All character data is clean!');
    } else {
      console.log(`⚠️ ${issuesFound} data integrity issues found. Run runCharacterDataMigration() to fix.`);
    }
    
  } catch (error) {
    console.error('💥 Character data validation failed:', error);
    throw error;
  }
}