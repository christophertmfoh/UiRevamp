// Utility functions for transforming character data between frontend and database formats
import { processPortraitsForStorage } from './imageCompression';

// Fields that are stored as TEXT (strings) in database but might come as arrays from frontend
const ARRAY_TO_STRING_FIELDS = [
  'nicknames', 'hobbies', 'interests', 'habits', 'mannerisms', 
  'strengths', 'weaknesses', 'fears', 'phobias', 'values', 'beliefs', 
  'goals', 'motivations', 'secrets', 'flaws', 'quirks', 'equipment', 
  'possessions', 'relationships', 'allies', 'enemies', 'rivals', 
  'familyMembers', 'friends', 'acquaintances', 'children', 'parents', 
  'siblings', 'spouse', 'pets', 'companions', 'mentors', 'students', 
  'themes', 'symbolism', 'inspiration'
];

// Fields that should remain as arrays (defined with .array() in schema)
const KEEP_AS_ARRAY_FIELDS = [
  'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
  'tropes', 'tags', 'spokenLanguages', 'aliases'
];

export function transformCharacterData(data: Record<string, unknown>): Record<string, unknown> {
  const transformedData = { ...data };
  
  // Transform array fields to comma-separated strings with enterprise-grade corruption detection
  ARRAY_TO_STRING_FIELDS.forEach(field => {
    if (Array.isArray(transformedData[field])) {
      transformedData[field] = transformedData[field].filter(Boolean).join(', ');
    } else if (typeof transformedData[field] === 'object' && transformedData[field] !== null) {
      // CRITICAL FIX: Don't let objects get stored as strings (this causes the "{\"{}\"}" bug)
      console.warn(`⚠️ Object found in string field '${field}' during server transform:`, transformedData[field], 'Converting to empty string');
      transformedData[field] = '';
    } else if (typeof transformedData[field] === 'string') {
      // Clean up any corrupted values that might have slipped through
      const value = transformedData[field] as string;
      if (value === '{}' || value === '[]' || value === 'null' || value === 'undefined' ||
          value === '[object Object]' || value.includes('{"{}"}') || value.includes('"null"') ||
          value.startsWith('{"') || value.includes('\\u') || value.includes('\\x')) {
        console.log(`🧹 Server: Cleaned corrupted string field '${field}': "${value}" → ""`);
        transformedData[field] = '';
      }
    }
  });
  
  // Ensure array fields stay as arrays and handle empty strings
  KEEP_AS_ARRAY_FIELDS.forEach(field => {
    if (typeof transformedData[field] === 'string') {
      if (transformedData[field] === '' || !transformedData[field]) {
        transformedData[field] = [];
      } else {
        transformedData[field] = transformedData[field].split(',').map(s => s.trim()).filter(s => s);
      }
    } else if (!Array.isArray(transformedData[field])) {
      transformedData[field] = [];
    }
  });
  
  // Fix timestamp fields - ensure they are proper Date objects
  if (transformedData.createdAt && typeof transformedData.createdAt === 'string') {
    transformedData.createdAt = new Date(transformedData.createdAt);
  }
  if (transformedData.updatedAt && typeof transformedData.updatedAt === 'string') {
    transformedData.updatedAt = new Date(transformedData.updatedAt);
  }
  
  // Remove invalid timestamp fields if they exist
  if (transformedData.createdAt && transformedData.createdAt instanceof Date && isNaN(transformedData.createdAt.getTime())) {
    delete transformedData.createdAt;
  }
  if (transformedData.updatedAt && transformedData.updatedAt instanceof Date && isNaN(transformedData.updatedAt.getTime())) {
    delete transformedData.updatedAt;
  }
  
  // Handle portraits array processing with proper typing
  if (transformedData.portraits) {
    if (!Array.isArray(transformedData.portraits)) {
      transformedData.portraits = [];
    }
    // Compress portraits before storage with proper type assertion
    transformedData.portraits = processPortraitsForStorage(transformedData.portraits as any[]);
  }

  return transformedData;
}