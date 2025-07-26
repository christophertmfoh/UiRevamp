import { User } from 'lucide-react';
import type { UniversalEntityConfig } from './EntityConfig';
import { createFieldDefinition, createSection, DEFAULT_AI_CONFIG, DEFAULT_RELATIONSHIP_CONFIG, DEFAULT_DISPLAY_CONFIG } from './EntityConfig';

// Character-specific field definitions
const CHARACTER_FIELDS = [
  // Identity Section
  createFieldDefinition('name', 'Name', 'text', 'identity', { 
    priority: 'essential', 
    required: true, 
    placeholder: 'Character name',
    displayInCard: true,
    displayInList: true
  }),
  createFieldDefinition('nicknames', 'Nicknames', 'text', 'identity', { 
    placeholder: 'Common nicknames or aliases' 
  }),
  createFieldDefinition('title', 'Title', 'text', 'identity', { 
    placeholder: 'Sir, Lady, Dr., etc.',
    displayInCard: true
  }),
  createFieldDefinition('aliases', 'Aliases', 'text', 'identity', { 
    placeholder: 'Secret identities or alternate names' 
  }),
  createFieldDefinition('race', 'Race', 'text', 'identity', { 
    placeholder: 'Human, Elf, Dwarf, etc.',
    displayInCard: true
  }),
  createFieldDefinition('species', 'Species', 'text', 'identity', { 
    placeholder: 'Biological species classification' 
  }),
  createFieldDefinition('ethnicity', 'Ethnicity', 'text', 'identity', { 
    placeholder: 'Cultural or ethnic background' 
  }),
  createFieldDefinition('class', 'Class', 'text', 'identity', { 
    placeholder: 'Warrior, Mage, Rogue, etc.',
    displayInCard: true
  }),
  createFieldDefinition('profession', 'Profession', 'text', 'identity', { 
    placeholder: 'Job or career' 
  }),
  createFieldDefinition('occupation', 'Occupation', 'text', 'identity', { 
    placeholder: 'Current work or role' 
  }),
  createFieldDefinition('age', 'Age', 'text', 'identity', { 
    placeholder: '25, Ancient, Timeless, etc.' 
  }),
  createFieldDefinition('role', 'Story Role', 'text', 'identity', { 
    placeholder: 'Protagonist, Antagonist, Supporting, etc.',
    displayInCard: true,
    displayInList: true
  }),

  // Core Description
  createFieldDefinition('description', 'Description', 'textarea', 'core', { 
    priority: 'essential',
    placeholder: 'Overall character description',
    displayInCard: true,
    displayInList: true
  }),
  createFieldDefinition('characterSummary', 'Character Summary', 'textarea', 'core', { 
    placeholder: 'Brief character overview' 
  }),
  createFieldDefinition('oneLine', 'One-Line Description', 'text', 'core', { 
    placeholder: 'Single sentence character summary' 
  }),

  // Physical Appearance
  createFieldDefinition('physicalDescription', 'Physical Description', 'textarea', 'physical', { 
    placeholder: 'Overall physical appearance' 
  }),
  createFieldDefinition('height', 'Height', 'text', 'physical', { 
    placeholder: "5'8\", tall, short, etc." 
  }),
  createFieldDefinition('weight', 'Weight', 'text', 'physical', { 
    placeholder: 'Heavy, light, average, etc.' 
  }),
  createFieldDefinition('build', 'Build', 'text', 'physical', { 
    placeholder: 'Athletic, slim, stocky, etc.' 
  }),
  createFieldDefinition('eyeColor', 'Eye Color', 'text', 'physical', { 
    placeholder: 'Blue, brown, green, etc.' 
  }),
  createFieldDefinition('hairColor', 'Hair Color', 'text', 'physical', { 
    placeholder: 'Blonde, black, red, etc.' 
  }),
  createFieldDefinition('hairStyle', 'Hair Style', 'text', 'physical', { 
    placeholder: 'Long, short, curly, etc.' 
  }),
  createFieldDefinition('skinTone', 'Skin Tone', 'text', 'physical', { 
    placeholder: 'Fair, dark, olive, etc.' 
  }),
  createFieldDefinition('distinguishingMarks', 'Distinguishing Marks', 'text', 'physical', { 
    placeholder: 'Scars, tattoos, birthmarks, etc.' 
  }),
  createFieldDefinition('attire', 'Attire', 'text', 'physical', { 
    placeholder: 'Typical clothing style' 
  }),

  // Personality
  createFieldDefinition('personality', 'Personality', 'textarea', 'personality', { 
    priority: 'essential',
    placeholder: 'Core personality traits and characteristics',
    displayInCard: true
  }),
  createFieldDefinition('personalityTraits', 'Personality Traits', 'array', 'personality', { 
    placeholder: 'Brave, cunning, compassionate, etc.' 
  }),
  createFieldDefinition('temperament', 'Temperament', 'text', 'personality', { 
    placeholder: 'Hot-headed, calm, unpredictable, etc.' 
  }),
  createFieldDefinition('values', 'Values', 'text', 'personality', { 
    placeholder: 'What the character believes in' 
  }),
  createFieldDefinition('beliefs', 'Beliefs', 'text', 'personality', { 
    placeholder: 'Religious, philosophical beliefs' 
  }),
  createFieldDefinition('quirks', 'Quirks', 'text', 'personality', { 
    placeholder: 'Unique behaviors or habits' 
  }),
  createFieldDefinition('likes', 'Likes', 'text', 'personality', { 
    placeholder: 'Things the character enjoys' 
  }),
  createFieldDefinition('dislikes', 'Dislikes', 'text', 'personality', { 
    placeholder: 'Things the character avoids' 
  }),
  createFieldDefinition('hobbies', 'Hobbies', 'text', 'personality', { 
    placeholder: 'Leisure activities and interests' 
  }),

  // Background & History
  createFieldDefinition('backstory', 'Backstory', 'textarea', 'background', { 
    priority: 'important',
    placeholder: 'Character history and background'
  }),
  createFieldDefinition('childhood', 'Childhood', 'textarea', 'background', { 
    placeholder: 'Early life experiences' 
  }),
  createFieldDefinition('education', 'Education', 'text', 'background', { 
    placeholder: 'Formal education and training' 
  }),
  createFieldDefinition('family', 'Family', 'text', 'background', { 
    placeholder: 'Family members and relationships' 
  }),
  createFieldDefinition('socialClass', 'Social Class', 'text', 'background', { 
    placeholder: 'Noble, merchant, peasant, etc.' 
  }),

  // Abilities & Skills
  createFieldDefinition('abilities', 'Abilities', 'array', 'abilities', { 
    placeholder: 'Special abilities and powers' 
  }),
  createFieldDefinition('skills', 'Skills', 'array', 'abilities', { 
    placeholder: 'Learned skills and expertise' 
  }),
  createFieldDefinition('talents', 'Talents', 'array', 'abilities', { 
    placeholder: 'Natural talents and gifts' 
  }),
  createFieldDefinition('strengths', 'Strengths', 'text', 'abilities', { 
    placeholder: 'Character strengths and advantages' 
  }),
  createFieldDefinition('weaknesses', 'Weaknesses', 'text', 'abilities', { 
    placeholder: 'Character flaws and limitations' 
  }),

  // Story Elements
  createFieldDefinition('goals', 'Goals', 'text', 'story', { 
    placeholder: 'What the character wants to achieve' 
  }),
  createFieldDefinition('motivations', 'Motivations', 'text', 'story', { 
    placeholder: 'What drives the character',
    displayInCard: true
  }),
  createFieldDefinition('fears', 'Fears', 'text', 'story', { 
    placeholder: 'What the character is afraid of' 
  }),
  createFieldDefinition('secrets', 'Secrets', 'text', 'story', { 
    placeholder: 'Hidden information about the character' 
  }),
  createFieldDefinition('arc', 'Character Arc', 'textarea', 'story', { 
    placeholder: 'How the character changes throughout the story' 
  }),
  createFieldDefinition('relationships', 'Relationships', 'text', 'story', { 
    placeholder: 'Key relationships with other characters' 
  }),

  // Meta Information
  createFieldDefinition('archetypes', 'Archetypes', 'array', 'meta', { 
    placeholder: 'Hero, Mentor, Trickster, etc.' 
  }),
  createFieldDefinition('inspiration', 'Inspiration', 'text', 'meta', { 
    placeholder: 'Real-world or fictional inspiration' 
  }),
  createFieldDefinition('notes', 'Writer Notes', 'textarea', 'meta', { 
    placeholder: 'Development notes and ideas' 
  }),
  createFieldDefinition('tags', 'Tags', 'array', 'meta', { 
    placeholder: 'Organizational tags' 
  })
];

// Character sections
const CHARACTER_SECTIONS = [
  createSection('identity', 'Identity', [
    'name', 'nicknames', 'title', 'aliases', 'race', 'species', 'ethnicity', 
    'class', 'profession', 'occupation', 'age', 'role'
  ], { defaultExpanded: true }),
  
  createSection('core', 'Core Description', [
    'description', 'characterSummary', 'oneLine'
  ], { defaultExpanded: true }),
  
  createSection('physical', 'Physical Appearance', [
    'physicalDescription', 'height', 'weight', 'build', 'eyeColor', 'hairColor', 
    'hairStyle', 'skinTone', 'distinguishingMarks', 'attire'
  ]),
  
  createSection('personality', 'Personality', [
    'personality', 'personalityTraits', 'temperament', 'values', 'beliefs', 
    'quirks', 'likes', 'dislikes', 'hobbies'
  ]),
  
  createSection('background', 'Background & History', [
    'backstory', 'childhood', 'education', 'family', 'socialClass'
  ]),
  
  createSection('abilities', 'Abilities & Skills', [
    'abilities', 'skills', 'talents', 'strengths', 'weaknesses'
  ]),
  
  createSection('story', 'Story Elements', [
    'goals', 'motivations', 'fears', 'secrets', 'arc', 'relationships'
  ]),
  
  createSection('meta', 'Meta Information', [
    'archetypes', 'inspiration', 'notes', 'tags'
  ])
];

// Character AI configuration
const CHARACTER_AI_CONFIG = {
  ...DEFAULT_AI_CONFIG,
  promptTemplate: `Generate a detailed character that fits seamlessly into the story world. 
The character should be original, compelling, and have rich details that spark imagination.
Context: {context}
Character Type: {characterType}
Story Genre: {genre}
Setting: {setting}

Create a character with authentic personality, realistic background, and clear motivations.
Make them feel like a real person with depth, flaws, and complexity.`,
  contextFields: ['name', 'role', 'description', 'genre'],
  enhancementRules: [
    {
      fieldKey: 'personality',
      promptTemplate: 'Enhance the personality of {name}, a {role}. Current: {current}. Make it more detailed and nuanced.',
      dependencies: ['name', 'role']
    },
    {
      fieldKey: 'backstory',
      promptTemplate: 'Create a compelling backstory for {name}, considering their {personality} and {role}.',
      dependencies: ['name', 'personality', 'role']
    }
  ],
  fallbackFields: {
    name: 'Unnamed Character',
    role: 'Supporting Character',
    description: 'A mysterious figure whose story is yet to be told.'
  }
};

// Character relationship configuration
const CHARACTER_RELATIONSHIP_CONFIG = {
  ...DEFAULT_RELATIONSHIP_CONFIG,
  allowedTypes: [
    'family', 'friend', 'enemy', 'rival', 'mentor', 'student', 'ally', 
    'romantic', 'business', 'professional', 'neighbor', 'stranger'
  ],
  defaultTypes: ['friend', 'ally', 'family'],
  bidirectional: true
};

// Character display configuration
const CHARACTER_DISPLAY_CONFIG = {
  ...DEFAULT_DISPLAY_CONFIG,
  searchFields: ['name', 'role', 'description', 'personality', 'backstory'],
  sortOptions: [
    { key: 'name', label: 'Name', direction: 'asc' as const },
    { key: 'role', label: 'Role', direction: 'asc' as const },
    { key: 'createdAt', label: 'Created', direction: 'desc' as const },
    { key: 'updatedAt', label: 'Modified', direction: 'desc' as const }
  ],
  filterOptions: [
    { key: 'role', label: 'Role', type: 'select' as const },
    { key: 'race', label: 'Race', type: 'select' as const },
    { key: 'class', label: 'Class', type: 'select' as const }
  ],
  displayFields: {
    card: ['name', 'title', 'role', 'race', 'class', 'description', 'personality'],
    list: ['name', 'role', 'description'],
    detail: ['name', 'description', 'personality', 'backstory', 'motivations']
  }
};

// Complete character configuration
export const CHARACTER_CONFIG: UniversalEntityConfig = {
  entityType: 'character',
  name: 'Character',
  pluralName: 'Characters',
  description: 'Story characters and personalities',
  
  icon: User,
  color: 'amber',
  gradient: 'from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30',
  
  fields: CHARACTER_FIELDS,
  sections: CHARACTER_SECTIONS,
  
  ai: CHARACTER_AI_CONFIG,
  relationships: CHARACTER_RELATIONSHIP_CONFIG,
  display: CHARACTER_DISPLAY_CONFIG,
  
  features: {
    hasPortraits: true,
    hasTemplates: true,
    hasRelationships: true,
    hasAIGeneration: true,
    hasFieldEnhancement: true,
    hasBulkOperations: true,
    hasAdvancedSearch: true,
    hasExport: true
  },
  
  validation: {
    requiredFields: ['name'],
    uniqueFields: ['name'],
    customValidators: {
      name: (value: string) => {
        if (!value || value.trim().length === 0) {
          return 'Character name is required';
        }
        if (value.length > 100) {
          return 'Character name must be less than 100 characters';
        }
        return true;
      }
    }
  }
};