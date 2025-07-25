// Experience mode configurations for different user types
export type ExperienceMode = 'beginner' | 'intermediate' | 'expert';

export interface FieldConfig {
  fieldKey: string;
  priority: 'essential' | 'important' | 'optional';
  section: string;
}

// Essential fields for beginner mode (15 fields)
export const BEGINNER_FIELDS: FieldConfig[] = [
  // Identity essentials
  { fieldKey: 'name', priority: 'essential', section: 'identity' },
  { fieldKey: 'race', priority: 'essential', section: 'identity' },
  { fieldKey: 'age', priority: 'essential', section: 'identity' },
  { fieldKey: 'role', priority: 'essential', section: 'identity' },
  
  // Physical essentials  
  { fieldKey: 'physicalDescription', priority: 'essential', section: 'physical' },
  { fieldKey: 'height', priority: 'essential', section: 'physical' },
  { fieldKey: 'build', priority: 'essential', section: 'physical' },
  
  // Personality essentials
  { fieldKey: 'personality', priority: 'essential', section: 'personality' },
  { fieldKey: 'personalityTraits', priority: 'essential', section: 'personality' },
  { fieldKey: 'goals', priority: 'essential', section: 'personality' },
  
  // Background essentials
  { fieldKey: 'background', priority: 'essential', section: 'background' },
  { fieldKey: 'occupation', priority: 'essential', section: 'background' },
  
  // Skills essentials
  { fieldKey: 'abilities', priority: 'essential', section: 'skills' },
  { fieldKey: 'talents', priority: 'essential', section: 'skills' },
  
  // Story essentials
  { fieldKey: 'motivations', priority: 'essential', section: 'story' }
];

// Additional fields for intermediate mode (~50 total fields)
export const INTERMEDIATE_ADDITIONAL_FIELDS: FieldConfig[] = [
  // Identity additions
  { fieldKey: 'nicknames', priority: 'important', section: 'identity' },
  { fieldKey: 'title', priority: 'important', section: 'identity' },
  { fieldKey: 'aliases', priority: 'important', section: 'identity' },
  { fieldKey: 'class', priority: 'important', section: 'identity' },
  { fieldKey: 'profession', priority: 'important', section: 'identity' },
  
  // Physical additions
  { fieldKey: 'eyeColor', priority: 'important', section: 'physical' },
  { fieldKey: 'hairColor', priority: 'important', section: 'physical' },
  { fieldKey: 'facialFeatures', priority: 'important', section: 'physical' },
  { fieldKey: 'distinguishingMarks', priority: 'important', section: 'physical' },
  { fieldKey: 'attire', priority: 'important', section: 'physical' },
  { fieldKey: 'posture', priority: 'important', section: 'physical' },
  
  // Personality additions
  { fieldKey: 'temperament', priority: 'important', section: 'personality' },
  { fieldKey: 'likes', priority: 'important', section: 'personality' },
  { fieldKey: 'dislikes', priority: 'important', section: 'personality' },
  { fieldKey: 'quirks', priority: 'important', section: 'personality' },
  { fieldKey: 'values', priority: 'important', section: 'personality' },
  { fieldKey: 'beliefs', priority: 'important', section: 'personality' },
  
  // Background additions
  { fieldKey: 'childhood', priority: 'important', section: 'background' },
  { fieldKey: 'education', priority: 'important', section: 'background' },
  { fieldKey: 'family', priority: 'important', section: 'background' },
  { fieldKey: 'pastEvents', priority: 'important', section: 'background' },
  { fieldKey: 'socialStatus', priority: 'important', section: 'background' },
  
  // Skills additions
  { fieldKey: 'skills', priority: 'important', section: 'skills' },
  { fieldKey: 'strengths', priority: 'important', section: 'skills' },
  { fieldKey: 'weaknesses', priority: 'important', section: 'skills' },
  { fieldKey: 'expertise', priority: 'important', section: 'skills' },
  { fieldKey: 'languages', priority: 'important', section: 'skills' },
  
  // Story additions
  { fieldKey: 'fears', priority: 'important', section: 'story' },
  { fieldKey: 'secrets', priority: 'important', section: 'story' },
  { fieldKey: 'flaws', priority: 'important', section: 'story' },
  { fieldKey: 'characterArc', priority: 'important', section: 'story' },
  { fieldKey: 'relationships', priority: 'important', section: 'story' },
  
  // Meta additions
  { fieldKey: 'storyFunction', priority: 'important', section: 'meta' },
  { fieldKey: 'archetypes', priority: 'important', section: 'meta' },
  { fieldKey: 'themes', priority: 'important', section: 'meta' },
  { fieldKey: 'inspiration', priority: 'important', section: 'meta' },
  { fieldKey: 'notes', priority: 'important', section: 'meta' }
];

// Get fields for a specific experience mode
export function getFieldsForMode(mode: ExperienceMode): FieldConfig[] {
  switch (mode) {
    case 'beginner':
      return BEGINNER_FIELDS;
    case 'intermediate':
      return [...BEGINNER_FIELDS, ...INTERMEDIATE_ADDITIONAL_FIELDS];
    case 'expert':
      return []; // Expert mode shows all fields - no filtering
    default:
      return BEGINNER_FIELDS;
  }
}

// Check if a field should be visible in the current mode
export function isFieldVisible(fieldKey: string, mode: ExperienceMode): boolean {
  if (mode === 'expert') return true;
  
  const modeFields = getFieldsForMode(mode);
  return modeFields.some(field => field.fieldKey === fieldKey);
}

// Get field priority for styling purposes
export function getFieldPriority(fieldKey: string, mode: ExperienceMode): 'essential' | 'important' | 'optional' {
  const modeFields = getFieldsForMode(mode);
  const field = modeFields.find(f => f.fieldKey === fieldKey);
  return field?.priority || 'optional';
}

// Get completion stats for a mode
export function getModeCompletionStats(character: any, mode: ExperienceMode) {
  const modeFields = getFieldsForMode(mode);
  if (modeFields.length === 0) {
    // Expert mode - count all non-empty fields
    const allFields = Object.keys(character).filter(key => 
      !['id', 'projectId', 'createdAt', 'updatedAt'].includes(key)
    );
    const filledFields = allFields.filter(key => {
      const value = character[key];
      return value && value !== '' && 
        (!Array.isArray(value) || value.length > 0);
    });
    return {
      total: allFields.length,
      filled: filledFields.length,
      percentage: Math.round((filledFields.length / allFields.length) * 100)
    };
  }
  
  const filledFields = modeFields.filter(field => {
    const value = character[field.fieldKey];
    return value && value !== '' && 
      (!Array.isArray(value) || value.length > 0);
  });
  
  return {
    total: modeFields.length,
    filled: filledFields.length,
    percentage: Math.round((filledFields.length / modeFields.length) * 100)
  };
}