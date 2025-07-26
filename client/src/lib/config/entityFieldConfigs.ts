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

// FACTION FIELDS
export const FACTION_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Faction name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    section: 'identity',
    category: 'identity',
    priority: 'important',
    options: ['Political', 'Military', 'Religious', 'Economic', 'Social', 'Criminal', 'Academic', 'Other'],
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// ITEM FIELDS  
export const ITEM_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Item name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    section: 'identity',
    category: 'identity',
    priority: 'important',
    options: ['Weapon', 'Armor', 'Tool', 'Artifact', 'Consumable', 'Vehicle', 'Document', 'Other'],
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
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

// CULTURE FIELDS
export const CULTURE_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Culture name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'origin',
    label: 'Origin',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'important',
    placeholder: 'Cultural origins and history',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// LANGUAGE FIELDS
export const LANGUAGE_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Language name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'family',
    label: 'Language Family',
    type: 'text',
    section: 'structure',
    category: 'linguistic',
    priority: 'important',
    placeholder: 'Language family or group',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// THEME FIELDS
export const THEME_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Theme name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    section: 'details',
    category: 'narrative',
    priority: 'important',
    placeholder: 'Theme description and meaning',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// PROPHECY FIELDS
export const PROPHECY_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Prophecy name or title',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'text',
    label: 'Prophecy Text',
    type: 'textarea',
    section: 'content',
    category: 'narrative',
    priority: 'essential',
    placeholder: 'The actual prophecy text',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// TIMELINE EVENT FIELDS
export const TIMELINE_EVENT_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Event name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'date',
    label: 'Date',
    type: 'text',
    section: 'timing',
    category: 'temporal',
    priority: 'important',
    placeholder: 'Event date or time period',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// MAGIC SYSTEM FIELDS
export const MAGIC_SYSTEM_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Magic system name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'source',
    label: 'Source of Power',
    type: 'textarea',
    section: 'mechanics',
    category: 'magical',
    priority: 'important',
    placeholder: 'Where magical power comes from',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// ORGANIZATION FIELDS
export const ORGANIZATION_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    placeholder: 'Organization name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    section: 'identity',
    category: 'identity',
    priority: 'important',
    options: ['Corporation', 'Government', 'Non-Profit', 'Educational', 'Religious', 'Military', 'Criminal', 'Other'],
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  }
];

// COMBINED FIELD EXPORTS
export const ALL_ENTITY_FIELDS: UniversalFieldDefinition[] = [
  ...CHARACTER_FIELDS,
  ...FACTION_FIELDS,
  ...ITEM_FIELDS,
  ...CREATURE_FIELDS,
  ...CULTURE_FIELDS,
  ...LANGUAGE_FIELDS,
  ...THEME_FIELDS,
  ...PROPHECY_FIELDS,
  ...TIMELINE_EVENT_FIELDS,
  ...MAGIC_SYSTEM_FIELDS,
  ...ORGANIZATION_FIELDS,
];

// Entity type to fields mapping
export const ENTITY_FIELD_MAP = {
  character: CHARACTER_FIELDS,
  faction: FACTION_FIELDS,
  item: ITEM_FIELDS,
  creature: CREATURE_FIELDS,
  culture: CULTURE_FIELDS,
  language: LANGUAGE_FIELDS,
  theme: THEME_FIELDS,
  prophecy: PROPHECY_FIELDS,
  'timeline-event': TIMELINE_EVENT_FIELDS,
  'magic-system': MAGIC_SYSTEM_FIELDS,
  organization: ORGANIZATION_FIELDS,
};

// Initialize field configurations
export const fieldConfigManager = new FieldConfigManager();

// Register all field configurations
try {
  FieldConfigManager.registerFields([
    ...CHARACTER_FIELDS,
    ...FACTION_FIELDS,
    ...ITEM_FIELDS,
    ...CREATURE_FIELDS,
    ...CULTURE_FIELDS,
    ...LANGUAGE_FIELDS,
    ...THEME_FIELDS,
    ...PROPHECY_FIELDS,
    ...TIMELINE_EVENT_FIELDS,
    ...MAGIC_SYSTEM_FIELDS,
    ...ORGANIZATION_FIELDS,
  ]);
} catch (error) {
  console.warn('Field registration warning:', error);
}