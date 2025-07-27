// Utility functions for transforming character data between frontend and database formats

// Fields that are stored as TEXT (strings) in database but might come as arrays from frontend
const ARRAY_TO_STRING_FIELDS = [
  'hobbies', 'interests', 'habits', 'mannerisms', 
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
  'tropes', 'tags', 'spokenLanguages'
];

export function transformCharacterData(data: any): any {
  const transformedData = { ...data };
  
  // Transform array fields to comma-separated strings
  ARRAY_TO_STRING_FIELDS.forEach(field => {
    if (Array.isArray(transformedData[field])) {
      transformedData[field] = transformedData[field].join(', ');
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
  
  return transformedData;
}