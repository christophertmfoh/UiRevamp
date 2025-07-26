/**
 * Entity-Specific Field Configurations
 * Field definitions for all world bible entity types
 */

import { FieldConfigManager, type UniversalFieldDefinition } from './baseFieldConfig';

// CHARACTER FIELDS - Complete character field definitions
export const CHARACTER_FIELDS: UniversalFieldDefinition[] = [
  // Identity Section
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Character name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Generate a fitting name for this character'
  },
  {
    key: 'nickname',
    label: 'Nickname',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'optional',
    placeholder: 'Nicknames or aliases',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Suggest appropriate nicknames for {name}'
  },
  // Add more character fields as needed
];



// CREATURE FIELDS
export const CREATURE_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Creature name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'species',
    label: 'Species',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'important',
    placeholder: 'Species or creature type',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// COMBINED FIELD EXPORTS
export const ALL_ENTITY_FIELDS: UniversalFieldDefinition[] = [
  ...CHARACTER_FIELDS,
  ...CREATURE_FIELDS,
];

// Entity type to fields mapping
export const ENTITY_FIELD_MAP = {
  character: CHARACTER_FIELDS,
  creature: CREATURE_FIELDS,
};

// Initialize field configurations
export const fieldConfigManager = new FieldConfigManager();

// Register all field configurations
try {
  FieldConfigManager.registerFields([
    ...CHARACTER_FIELDS,
    ...CREATURE_FIELDS,
  ]);
} catch (error) {
  console.warn('Field registration warning:', error);
}