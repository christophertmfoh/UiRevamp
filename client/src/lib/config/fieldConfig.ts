/**
 * Consolidated Field Configuration
 * Centralizes all character field definitions and metadata
 */

export interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'array' | 'tags';
  section: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  priority: 'essential' | 'important' | 'optional';
  aiPrompt?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

// Character sections with consistent organization
export const CHARACTER_SECTIONS = [
  {
    id: 'identity',
    title: 'Identity',
    description: 'Core character identification and basic information',
    icon: 'User',
    order: 1
  },
  {
    id: 'physical',
    title: 'Physical',
    description: 'Appearance, body characteristics, and physical traits',
    icon: 'Eye',
    order: 2
  },
  {
    id: 'personality',
    title: 'Personality',
    description: 'Character traits, behavior patterns, and psychological profile',
    icon: 'Heart',
    order: 3
  },
  {
    id: 'background',
    title: 'Background',
    description: 'History, origins, education, and formative experiences',
    icon: 'BookOpen',
    order: 4
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Abilities, talents, strengths, and learned competencies',
    icon: 'Zap',
    order: 5
  },
  {
    id: 'story',
    title: 'Story',
    description: 'Narrative elements, goals, motivations, and character arcs',
    icon: 'BookText',
    order: 6
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Connections to other characters and social dynamics',
    icon: 'Users',
    order: 7
  },
  {
    id: 'meta',
    title: 'Meta',
    description: 'Story function, themes, writer notes, and development tracking',
    icon: 'FileText',
    order: 8
  }
] as const;

// FACTION SECTIONS
export const FACTION_SECTIONS = [
  {
    id: 'identity',
    title: 'Identity',
    description: 'Core faction identification and basic information',
    icon: 'Shield',
    order: 1
  },
  {
    id: 'structure',
    title: 'Structure',
    description: 'Organization, hierarchy, and internal structure',
    icon: 'Users',
    order: 2
  },
  {
    id: 'beliefs',
    title: 'Beliefs',
    description: 'Ideology, values, and guiding principles',
    icon: 'Heart',
    order: 3
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Activities, methods, and areas of influence',
    icon: 'Zap',
    order: 4
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Assets, territories, and material holdings',
    icon: 'Package',
    order: 5
  },
  {
    id: 'history',
    title: 'History',
    description: 'Origin, past events, and historical significance',
    icon: 'Scroll',
    order: 6
  },
  {
    id: 'story',
    title: 'Story',
    description: 'Narrative role and story relevance',
    icon: 'BookText',
    order: 7
  }
] as const;

// ITEM SECTIONS
export const ITEM_SECTIONS = [
  {
    id: 'identity',
    title: 'Identity',
    description: 'Core item identification and basic information',
    icon: 'Package',
    order: 1
  },
  {
    id: 'physical',
    title: 'Physical',
    description: 'Appearance, materials, and physical properties',
    icon: 'Eye',
    order: 2
  },
  {
    id: 'mechanics',
    title: 'Mechanics',
    description: 'Functionality, usage, and mechanical properties',
    icon: 'Cog',
    order: 3
  },
  {
    id: 'powers',
    title: 'Powers',
    description: 'Magical properties, special abilities, and effects',
    icon: 'Sparkles',
    order: 4
  },
  {
    id: 'history',
    title: 'History',
    description: 'Origin, creation, and historical significance',
    icon: 'Scroll',
    order: 5
  },
  {
    id: 'story',
    title: 'Story',
    description: 'Narrative role and story importance',
    icon: 'BookText',
    order: 6
  }
] as const;

// Character field definitions
export const FIELD_DEFINITIONS: FieldDefinition[] = [
  // Identity Section
  {
    key: 'name',
    label: 'Character Name',
    type: 'text',
    section: 'identity',
    required: true,
    priority: 'essential',
    placeholder: 'Enter character name',
    aiPrompt: 'Generate a meaningful name that fits the character\'s background, culture, and the story\'s setting'
  },
  {
    key: 'age',
    label: 'Age',
    type: 'text',
    section: 'identity',
    priority: 'essential',
    placeholder: 'Character age or age range',
    aiPrompt: 'Determine an appropriate age that matches the character\'s role and life experiences'
  },
  {
    key: 'role',
    label: 'Story Role',
    type: 'select',
    section: 'identity',
    priority: 'essential',
    options: ['Protagonist', 'Antagonist', 'Supporting', 'Minor', 'Mentor', 'Love Interest', 'Comic Relief', 'Foil'],
    aiPrompt: 'Define the character\'s primary function and importance in the narrative'
  }
];

// Faction field definitions
export const FACTION_FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: 'name',
    label: 'Faction Name',
    type: 'text',
    section: 'identity',
    required: true,
    priority: 'essential',
    placeholder: 'Enter faction name',
    aiPrompt: 'Create a compelling name that reflects the faction\'s identity and purpose'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    section: 'identity',
    priority: 'essential',
    placeholder: 'Brief description of the faction',
    aiPrompt: 'Write a concise overview of what this faction is and represents'
  }
];

// Item field definitions  
export const ITEM_FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: 'name',
    label: 'Item Name',
    type: 'text',
    section: 'identity',
    required: true,
    priority: 'essential',
    placeholder: 'Enter item name',
    aiPrompt: 'Create an evocative name that hints at the item\'s nature and significance'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    section: 'identity',
    priority: 'essential',
    placeholder: 'Brief description of the item',
    aiPrompt: 'Write a compelling description that captures the item\'s essence and importance'
  }
];

// ================================
// HELPER FUNCTIONS FOR ALL ENTITIES
// ================================

// Helper functions for characters
export function getCharacterFieldDefinition(key: string): FieldDefinition | undefined {
  return FIELD_DEFINITIONS.find(field => field.key === key);
}

export function getCharacterFieldsBySection(sectionId: string): FieldDefinition[] {
  return FIELD_DEFINITIONS.filter(field => field.section === sectionId);
}

// Legacy aliases for backwards compatibility
export const getFieldsBySection = getCharacterFieldsBySection;
export const getSectionById = getCharacterSectionById;
export const getFieldDefinition = getCharacterFieldDefinition;

export function getCharacterSectionById(id: string) {
  return CHARACTER_SECTIONS.find(section => section.id === id);
}

// Helper functions for factions
export function getFactionFieldDefinition(key: string): FieldDefinition | undefined {
  return FACTION_FIELD_DEFINITIONS.find(field => field.key === key);
}

export function getFactionFieldsBySection(sectionId: string): FieldDefinition[] {
  return FACTION_FIELD_DEFINITIONS.filter(field => field.section === sectionId);
}

export function getFactionSectionById(id: string) {
  return FACTION_SECTIONS.find(section => section.id === id);
}

// Helper functions for items
export function getItemFieldDefinition(key: string): FieldDefinition | undefined {
  return ITEM_FIELD_DEFINITIONS.find(field => field.key === key);
}

export function getItemFieldsBySection(sectionId: string): FieldDefinition[] {
  return ITEM_FIELD_DEFINITIONS.filter(field => field.section === sectionId);
}

export function getItemSectionById(id: string) {
  return ITEM_SECTIONS.find(section => section.id === id);
}

// Generic helper function to get field definitions by entity type
export function getFieldDefinitionsByEntityType(entityType: string): FieldDefinition[] {
  switch (entityType) {
    case 'character':
      return FIELD_DEFINITIONS;
    case 'faction':
      return FACTION_FIELD_DEFINITIONS;
    case 'item':
      return ITEM_FIELD_DEFINITIONS;
    default:
      return [];
  }
}

// Generic helper function to get sections by entity type
export function getSectionsByEntityType(entityType: string): readonly Section[] {
  switch (entityType) {
    case 'character':
      return CHARACTER_SECTIONS;
    case 'faction':
      return FACTION_SECTIONS;
    case 'item':
      return ITEM_SECTIONS;
    default:
      return [];
  }
}