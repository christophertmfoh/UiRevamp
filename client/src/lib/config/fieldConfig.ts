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
    description: 'Story function, writer notes, and development tracking',
    icon: 'FileText',
    order: 8
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

// Helper functions for characters
export function getCharacterFieldDefinition(key: string): FieldDefinition | undefined {
  return FIELD_DEFINITIONS.find(field => field.key === key);
}

export function getCharacterFieldsBySection(sectionId: string): FieldDefinition[] {
  return FIELD_DEFINITIONS.filter(field => field.section === sectionId);
}

export function getCharacterSectionById(id: string) {
  return CHARACTER_SECTIONS.find(section => section.id === id);
}