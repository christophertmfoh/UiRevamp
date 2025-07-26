/**
 * Entity-Specific Field Configurations
 * Field definitions for all world bible entity types
 */

import { FieldConfigManager, type UniversalFieldDefinition } from './baseFieldConfig';

export const LOCATION_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'type',
    type: 'select',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    options: ['City', 'Town', 'Village', 'Building', 'Landmark', 'Natural Feature', 'Realm', 'Other'],
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
  },
  {
    key: 'geography',
    label: 'Geography',
    type: 'textarea',
    section: 'physical',
    category: 'physical',
    priority: 'essential',
    placeholder: 'Physical layout and geographical features',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Describe the geography and physical layout of {name}'
  },
  {
    key: 'history',
    label: 'History',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'important',
    placeholder: 'Historical background and significant events',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Create a rich history for {name} including significant events'
  },
  {
    key: 'significance',
    label: 'Significance',
    type: 'textarea',
    section: 'story',
    category: 'story',
    priority: 'essential',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Explain the story significance and importance of {name}'
  },
  {
    key: 'atmosphere',
    label: 'Atmosphere',
    type: 'textarea',
    section: 'physical',
    category: 'physical',
    priority: 'important',
    placeholder: 'Mood, feeling, and ambiance',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Capture the atmosphere and mood of {name}'
  }
];

// Faction-specific fields
export const FACTION_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'type',
    label: 'Faction Type',
    type: 'select',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    entityTypes: ['factions'],
    options: ['Government', 'Military', 'Religious', 'Criminal', 'Merchant', 'Academic', 'Secret Society', 'Other'],
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Classify the type of faction that {name} represents'
  },
  {
    key: 'goals',
    label: 'Goals',
    type: 'textarea',
    section: 'story',
    category: 'story',
    priority: 'essential',
    entityTypes: ['factions'],
    placeholder: 'What the faction wants to achieve',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Define the primary goals and objectives of {name}'
  },
  {
    key: 'methods',
    label: 'Methods',
    type: 'textarea',
    section: 'story',
    category: 'story',
    priority: 'important',
    entityTypes: ['factions'],
    placeholder: 'How they operate and pursue their goals',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Describe the methods and tactics used by {name}'
  },
  {
    key: 'leadership',
    label: 'Leadership',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'important',
    entityTypes: ['factions'],
    placeholder: 'Who leads and how leadership is structured',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Design the leadership structure and key figures of {name}'
  },
  {
    key: 'resources',
    label: 'Resources',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'important',
    entityTypes: ['factions'],
    placeholder: 'Wealth, weapons, knowledge, connections',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Detail the resources and assets available to {name}'
  }
];

// Item-specific fields
export const ITEM_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'type',
    label: 'Item Type',
    type: 'select',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    entityTypes: ['items'],
    options: ['Weapon', 'Armor', 'Tool', 'Artifact', 'Consumable', 'Treasure', 'Document', 'Other'],
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Classify what type of item {name} is'
  },
  {
    key: 'powers',
    label: 'Powers/Properties',
    type: 'textarea',
    section: 'abilities',
    category: 'abilities',
    priority: 'important',
    entityTypes: ['items'],
    placeholder: 'Magical or special properties',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Design unique powers and properties for {name}'
  },
  {
    key: 'history',
    label: 'History',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'important',
    entityTypes: ['items'],
    placeholder: 'Origin story and past owners',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Create an intriguing history for {name} including its origins'
  },
  {
    key: 'significance',
    label: 'Story Significance',
    type: 'textarea',
    section: 'story',
    category: 'story',
    priority: 'essential',
    entityTypes: ['items'],
    placeholder: 'Why this item matters to the plot',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Explain why {name} is important to the story'
  }
];

// Creature-specific fields
export const CREATURE_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'species',
    label: 'Species',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    entityTypes: ['creatures'],
    placeholder: 'Scientific or common species name',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Name the species that {name} belongs to'
  },
  {
    key: 'habitat',
    label: 'Habitat',
    type: 'array',
    section: 'background',
    category: 'background',
    priority: 'important',
    entityTypes: ['creatures'],
    placeholder: 'Where they live and thrive',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Describe the natural habitats where {name} can be found'
  },
  {
    key: 'behavior',
    label: 'Behavior',
    type: 'textarea',
    section: 'personality',
    category: 'personality',
    priority: 'important',
    entityTypes: ['creatures'],
    placeholder: 'Behavioral patterns and temperament',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Detail the typical behavior patterns of {name}'
  },
  {
    key: 'abilities',
    label: 'Natural Abilities',
    type: 'array',
    section: 'abilities',
    category: 'abilities',
    priority: 'important',
    entityTypes: ['creatures'],
    placeholder: 'Special abilities and traits',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'List the natural abilities and special traits of {name}'
  }
];

// Organization-specific fields
export const ORGANIZATION_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'purpose',
    label: 'Purpose',
    type: 'textarea',
    section: 'story',
    category: 'story',
    priority: 'essential',
    entityTypes: ['organizations'],
    placeholder: 'Why the organization exists',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Define the core purpose and mission of {name}'
  },
  {
    key: 'structure',
    label: 'Structure',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'important',
    entityTypes: ['organizations'],
    placeholder: 'Organizational hierarchy and roles',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Design the organizational structure and hierarchy of {name}'
  },
  {
    key: 'membership',
    label: 'Membership',
    type: 'textarea',
    section: 'background',
    category: 'background',
    priority: 'important',
    entityTypes: ['organizations'],
    placeholder: 'Who can join and how',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Detail the membership requirements and process for {name}'
  }
];

// Register all entity field configurations
FieldConfigManager.registerFields([
  ...LOCATION_FIELDS,
  ...FACTION_FIELDS,
  ...ITEM_FIELDS,
  ...CREATURE_FIELDS,
  ...ORGANIZATION_FIELDS
]);

// Export entity-specific field getters
export const getFactionFields = () => FieldConfigManager.getFieldsForEntity('factions');
export const getItemFields = () => FieldConfigManager.getFieldsForEntity('items');
export const getCreatureFields = () => FieldConfigManager.getFieldsForEntity('creatures');
export const getOrganizationFields = () => FieldConfigManager.getFieldsForEntity('organizations');