/**
 * Character-Specific Field Configuration
 * Extends base field system with character-specific fields
 */

import { FieldConfigManager, type UniversalFieldDefinition } from './baseFieldConfig';

// Character-specific field definitions
export const CHARACTER_FIELDS: UniversalFieldDefinition[] = [
  // Identity Section - Character-specific
  {
    key: 'nicknames',
    label: 'Nicknames',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Common nicknames or aliases',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Suggest fitting nicknames for {name} based on their personality and background'
  },
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Formal titles or honorifics',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Suggest appropriate titles for {name} based on their status and achievements'
  },
  {
    key: 'race',
    label: 'Race/Species',
    type: 'select',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    entityTypes: ['characters'],
    options: ['Human', 'Elf', 'Dwarf', 'Halfling', 'Orc', 'Cat', 'Dragon', 'Other'],
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Choose the most suitable race/species for {name} based on their story role'
  },
  {
    key: 'age',
    label: 'Age',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    entityTypes: ['characters'],
    placeholder: 'Physical or apparent age',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Set appropriate age for {name} that matches their experience and role'
  },
  {
    key: 'profession',
    label: 'Profession',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Primary occupation or career',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Create profession for {name} that fits their skills and world setting'
  },
  {
    key: 'role',
    label: 'Story Role',
    type: 'select',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    entityTypes: ['characters'],
    options: ['Protagonist', 'Antagonist', 'Supporting Character', 'Love Interest', 'Mentor', 'Comic Relief', 'Other'],
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Determine the most fitting story role for {name} in the narrative'
  },

  // Physical Section
  {
    key: 'height',
    label: 'Height',
    type: 'text',
    section: 'physical',
    category: 'physical',
    priority: 'essential',
    entityTypes: ['characters'],
    placeholder: 'Height measurement',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Set appropriate height for {name} based on their race and build'
  },
  {
    key: 'build',
    label: 'Build/Body Type',
    type: 'text',
    section: 'physical',
    category: 'physical',
    priority: 'essential',
    entityTypes: ['characters'],
    placeholder: 'Body build and physique',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Describe {name}\'s body build reflecting their lifestyle and abilities'
  },
  {
    key: 'eyeColor',
    label: 'Eye Color',
    type: 'text',
    section: 'physical',
    category: 'physical',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Eye color and characteristics',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Choose eye color for {name} that complements their appearance and personality'
  },
  {
    key: 'hairColor',
    label: 'Hair Color',
    type: 'text',
    section: 'physical',
    category: 'physical',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Hair color and style',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Select hair color and style for {name} that fits their character'
  },
  {
    key: 'distinguishingMarks',
    label: 'Distinguishing Marks',
    type: 'text',
    section: 'physical',
    category: 'physical',
    priority: 'optional',
    entityTypes: ['characters'],
    placeholder: 'Scars, tattoos, birthmarks, etc.',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Suggest meaningful distinguishing marks for {name} that reflect their history'
  },

  // Personality Section
  {
    key: 'personalityTraits',
    label: 'Personality Traits',
    type: 'array',
    section: 'personality',
    category: 'personality',
    priority: 'essential',
    entityTypes: ['characters'],
    placeholder: 'Key personality traits',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'List specific personality traits that define how {name} thinks and acts'
  },
  {
    key: 'goals',
    label: 'Goals',
    type: 'textarea',
    section: 'personality',
    category: 'personality',
    priority: 'essential',
    entityTypes: ['characters'],
    placeholder: 'What they want to achieve',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Define meaningful goals for {name} that drive the story forward'
  },
  {
    key: 'motivations',
    label: 'Motivations',
    type: 'textarea',
    section: 'personality',
    category: 'personality',
    priority: 'essential',
    entityTypes: ['characters'],
    placeholder: 'What drives them',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Explore the deep motivations that drive {name}\'s actions and decisions'
  },
  {
    key: 'fears',
    label: 'Fears',
    type: 'textarea',
    section: 'personality',
    category: 'personality',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'What they fear most',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Identify fears for {name} that create internal conflict and story tension'
  },
  {
    key: 'secrets',
    label: 'Secrets',
    type: 'textarea',
    section: 'personality',
    category: 'personality',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Hidden aspects or past',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Create compelling secrets for {name} that could impact the story'
  },

  // Background Section
  {
    key: 'backstory',
    label: 'Backstory',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'essential',
    entityTypes: ['characters'],
    placeholder: 'Their history and life before the story',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Write a compelling backstory for {name} that explains their current situation'
  },
  {
    key: 'family',
    label: 'Family',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Family background and relationships',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Develop family background for {name} that influences their character'
  },
  {
    key: 'education',
    label: 'Education',
    type: 'text',
    section: 'background',
    category: 'background',
    priority: 'optional',
    entityTypes: ['characters'],
    placeholder: 'Educational background and training',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Design educational background for {name} that supports their skills'
  },

  // Abilities Section
  {
    key: 'abilities',
    label: 'Abilities',
    type: 'array',
    section: 'abilities',
    category: 'abilities',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Special abilities and powers',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Design abilities for {name} that fit their role and world setting'
  },
  {
    key: 'skills',
    label: 'Skills',
    type: 'array',
    section: 'abilities',
    category: 'abilities',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Learned skills and expertise',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'List practical skills for {name} based on their background and profession'
  },
  {
    key: 'strengths',
    label: 'Strengths',
    type: 'textarea',
    section: 'abilities',
    category: 'abilities',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'What they excel at',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Identify strengths for {name} that help them overcome challenges'
  },
  {
    key: 'weaknesses',
    label: 'Weaknesses',
    type: 'textarea',
    section: 'abilities',
    category: 'abilities',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'Limitations and flaws',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Define meaningful weaknesses for {name} that create story conflict'
  },

  // Story Section
  {
    key: 'storyFunction',
    label: 'Story Function',
    type: 'textarea',
    section: 'story',
    category: 'story',
    priority: 'essential',
    entityTypes: ['characters'],
    placeholder: 'Their role in advancing the plot',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Define how {name} functions in the story and advances the plot'
  },
  {
    key: 'conflictSources',
    label: 'Conflict Sources',
    type: 'textarea',
    section: 'story',
    category: 'story',
    priority: 'important',
    entityTypes: ['characters'],
    placeholder: 'What creates conflict for them',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Identify sources of conflict for {name} that drive story tension'
  },

  // Meta Section
  {
    key: 'archetypes',
    label: 'Archetypes',
    type: 'array',
    section: 'meta',
    category: 'meta',
    priority: 'optional',
    entityTypes: ['characters'],
    placeholder: 'Character archetypes they represent',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Identify archetypal patterns that {name} embodies in the story'
  },
  {
    key: 'themes',
    label: 'Themes',
    type: 'array',
    section: 'meta',
    category: 'meta',
    priority: 'optional',
    entityTypes: ['characters'],
    placeholder: 'Themes they represent or explore',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Identify themes that {name} represents or explores in the narrative'
  },
  {
    key: 'symbolism',
    label: 'Symbolism',
    type: 'textarea',
    section: 'meta',
    category: 'meta',
    priority: 'optional',
    entityTypes: ['characters'],
    placeholder: 'What they symbolize in the story',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Explore symbolic meanings and representations for {name} in the story'
  },
  {
    key: 'inspiration',
    label: 'Inspiration',
    type: 'textarea',
    section: 'meta',
    category: 'meta',
    priority: 'optional',
    entityTypes: ['characters'],
    placeholder: 'Real-world or fictional inspirations',
    aiEnhanceable: false,
    searchable: false,
    exportable: false
  }
];

// Register character fields with the field manager
FieldConfigManager.registerFields(CHARACTER_FIELDS);

// Export field access functions for backward compatibility
export function getFieldDefinition(key: string) {
  return FieldConfigManager.getField(key);
}

export function getCharacterFields() {
  return FieldConfigManager.getFieldsForEntity('characters');
}

export function getFieldsBySection(section: string) {
  return FieldConfigManager.getFieldsBySection('characters', section);
}

export function getCharacterSections() {
  return FieldConfigManager.getSectionsForEntity('characters');
}