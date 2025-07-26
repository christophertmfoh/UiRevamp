import { MapPin } from 'lucide-react';
import type { UniversalEntityConfig } from './EntityConfig';
import { createFieldDefinition, createSection, DEFAULT_AI_CONFIG, DEFAULT_RELATIONSHIP_CONFIG, DEFAULT_DISPLAY_CONFIG } from './EntityConfig';

// Location-specific field definitions
const LOCATION_FIELDS = [
  // Identity Section
  createFieldDefinition('name', 'Name', 'text', 'identity', { 
    priority: 'essential', 
    required: true, 
    placeholder: 'Location name',
    displayInCard: true,
    displayInList: true
  }),
  createFieldDefinition('nicknames', 'Nicknames', 'text', 'identity', { 
    placeholder: 'Common names or local terms' 
  }),
  createFieldDefinition('aliases', 'Aliases', 'text', 'identity', { 
    placeholder: 'Alternative names or historical names' 
  }),
  createFieldDefinition('locationType', 'Location Type', 'text', 'identity', { 
    placeholder: 'City, Forest, Mountain, etc.',
    displayInCard: true
  }),
  createFieldDefinition('classification', 'Classification', 'text', 'identity', { 
    placeholder: 'Kingdom, Province, Village, etc.' 
  }),
  createFieldDefinition('size', 'Size', 'text', 'identity', { 
    placeholder: 'Vast, Large, Medium, Small, etc.' 
  }),
  createFieldDefinition('status', 'Status', 'text', 'identity', { 
    placeholder: 'Active, Ruins, Abandoned, etc.' 
  }),

  // Core Description
  createFieldDefinition('description', 'Description', 'textarea', 'core', { 
    priority: 'essential',
    placeholder: 'Overall location description',
    displayInCard: true,
    displayInList: true
  }),
  createFieldDefinition('significance', 'Significance', 'textarea', 'core', { 
    placeholder: 'Why this location is important to the story' 
  }),
  createFieldDefinition('atmosphere', 'Atmosphere', 'textarea', 'core', { 
    placeholder: 'The mood and feeling of this place',
    displayInCard: true
  }),

  // Geographic & Physical
  createFieldDefinition('physicalDescription', 'Physical Description', 'textarea', 'geographic', { 
    placeholder: 'Detailed physical appearance' 
  }),
  createFieldDefinition('geography', 'Geography', 'text', 'geographic', { 
    placeholder: 'Geographic features and layout' 
  }),
  createFieldDefinition('terrain', 'Terrain', 'text', 'geographic', { 
    placeholder: 'Mountains, plains, desert, etc.' 
  }),
  createFieldDefinition('climate', 'Climate', 'text', 'geographic', { 
    placeholder: 'Weather patterns and climate' 
  }),
  createFieldDefinition('naturalFeatures', 'Natural Features', 'text', 'geographic', { 
    placeholder: 'Rivers, lakes, forests, etc.' 
  }),
  createFieldDefinition('landmarks', 'Landmarks', 'text', 'geographic', { 
    placeholder: 'Notable landmarks and monuments' 
  }),
  createFieldDefinition('boundaries', 'Boundaries', 'text', 'geographic', { 
    placeholder: 'Borders and territorial limits' 
  }),

  // Architecture & Structures
  createFieldDefinition('architecture', 'Architecture', 'textarea', 'architecture', { 
    placeholder: 'Architectural style and construction' 
  }),
  createFieldDefinition('buildings', 'Buildings', 'textarea', 'architecture', { 
    placeholder: 'Notable buildings and structures' 
  }),
  createFieldDefinition('materials', 'Materials', 'text', 'architecture', { 
    placeholder: 'Construction materials used' 
  }),
  createFieldDefinition('layout', 'Layout', 'textarea', 'architecture', { 
    placeholder: 'Spatial organization and city planning' 
  }),
  createFieldDefinition('districts', 'Districts', 'text', 'architecture', { 
    placeholder: 'Different areas or neighborhoods' 
  }),
  createFieldDefinition('infrastructure', 'Infrastructure', 'text', 'architecture', { 
    placeholder: 'Roads, bridges, utilities, etc.' 
  }),

  // Society & Culture
  createFieldDefinition('population', 'Population', 'text', 'society', { 
    placeholder: 'Number and type of inhabitants' 
  }),
  createFieldDefinition('demographics', 'Demographics', 'text', 'society', { 
    placeholder: 'Breakdown of population groups' 
  }),
  createFieldDefinition('inhabitants', 'Inhabitants', 'text', 'society', { 
    placeholder: 'Who lives here and their characteristics' 
  }),
  createFieldDefinition('culture', 'Culture', 'text', 'society', { 
    placeholder: 'Cultural practices and traditions' 
  }),
  createFieldDefinition('customs', 'Customs', 'text', 'society', { 
    placeholder: 'Local customs and practices' 
  }),
  createFieldDefinition('traditions', 'Traditions', 'text', 'society', { 
    placeholder: 'Traditional ceremonies and events' 
  }),
  createFieldDefinition('languages', 'Languages', 'array', 'society', { 
    placeholder: 'Languages spoken in this location' 
  }),
  createFieldDefinition('governance', 'Governance', 'text', 'society', { 
    placeholder: 'How the location is governed' 
  }),
  createFieldDefinition('leadership', 'Leadership', 'text', 'society', { 
    placeholder: 'Leaders and ruling structure' 
  }),

  // Economy & Resources
  createFieldDefinition('economy', 'Economy', 'text', 'economy', { 
    placeholder: 'Economic system and activities' 
  }),
  createFieldDefinition('trade', 'Trade', 'text', 'economy', { 
    placeholder: 'Trading activities and commerce' 
  }),
  createFieldDefinition('resources', 'Resources', 'text', 'economy', { 
    placeholder: 'Natural and economic resources' 
  }),
  createFieldDefinition('exports', 'Exports', 'text', 'economy', { 
    placeholder: 'What the location exports' 
  }),
  createFieldDefinition('imports', 'Imports', 'text', 'economy', { 
    placeholder: 'What the location imports' 
  }),

  // History & Lore
  createFieldDefinition('history', 'History', 'textarea', 'history', { 
    priority: 'important',
    placeholder: 'Historical background and past events' 
  }),
  createFieldDefinition('origin', 'Origin', 'text', 'history', { 
    placeholder: 'How the location was founded or formed' 
  }),
  createFieldDefinition('founding', 'Founding', 'text', 'history', { 
    placeholder: 'Founding story and founders' 
  }),
  createFieldDefinition('pastEvents', 'Past Events', 'textarea', 'history', { 
    placeholder: 'Significant historical events' 
  }),
  createFieldDefinition('legends', 'Legends', 'text', 'history', { 
    placeholder: 'Local legends and stories' 
  }),
  createFieldDefinition('myths', 'Myths', 'text', 'history', { 
    placeholder: 'Mythological stories about the location' 
  }),

  // Story & Narrative
  createFieldDefinition('narrativeRole', 'Narrative Role', 'text', 'story', { 
    placeholder: 'Role in the story' 
  }),
  createFieldDefinition('storyImportance', 'Story Importance', 'text', 'story', { 
    placeholder: 'Why this location matters to the plot' 
  }),
  createFieldDefinition('scenes', 'Scenes', 'textarea', 'story', { 
    placeholder: 'Key scenes that take place here' 
  }),
  createFieldDefinition('events', 'Events', 'textarea', 'story', { 
    placeholder: 'Important events at this location' 
  }),
  createFieldDefinition('mysteries', 'Mysteries', 'text', 'story', { 
    placeholder: 'Secrets or mysteries of this place' 
  }),
  createFieldDefinition('secrets', 'Secrets', 'text', 'story', { 
    placeholder: 'Hidden aspects or secrets' 
  }),

  // Meta Information
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

// Location sections
const LOCATION_SECTIONS = [
  createSection('identity', 'Identity', [
    'name', 'nicknames', 'aliases', 'locationType', 'classification', 'size', 'status'
  ], { defaultExpanded: true }),
  
  createSection('core', 'Core Description', [
    'description', 'significance', 'atmosphere'
  ], { defaultExpanded: true }),
  
  createSection('geographic', 'Geography & Physical', [
    'physicalDescription', 'geography', 'terrain', 'climate', 'naturalFeatures', 
    'landmarks', 'boundaries'
  ]),
  
  createSection('architecture', 'Architecture & Structures', [
    'architecture', 'buildings', 'materials', 'layout', 'districts', 'infrastructure'
  ]),
  
  createSection('society', 'Society & Culture', [
    'population', 'demographics', 'inhabitants', 'culture', 'customs', 
    'traditions', 'languages', 'governance', 'leadership'
  ]),
  
  createSection('economy', 'Economy & Resources', [
    'economy', 'trade', 'resources', 'exports', 'imports'
  ]),
  
  createSection('history', 'History & Lore', [
    'history', 'origin', 'founding', 'pastEvents', 'legends', 'myths'
  ]),
  
  createSection('story', 'Story & Narrative', [
    'narrativeRole', 'storyImportance', 'scenes', 'events', 'mysteries', 'secrets'
  ]),
  
  createSection('meta', 'Meta Information', [
    'inspiration', 'notes', 'tags'
  ])
];

// Location AI configuration
const LOCATION_AI_CONFIG = {
  ...DEFAULT_AI_CONFIG,
  promptTemplate: `Generate a detailed location that fits seamlessly into the story world. 
The location should be vivid, atmospheric, and have rich details that bring it to life.
Context: {context}
Location Type: {locationType}
Story Genre: {genre}
Setting: {setting}

Create a location with authentic atmosphere, realistic geography, and clear significance to the story.
Make it feel like a real place with history, culture, and unique characteristics.`,
  contextFields: ['name', 'locationType', 'description', 'genre'],
  enhancementRules: [
    {
      fieldKey: 'atmosphere',
      promptTemplate: 'Enhance the atmosphere of {name}, a {locationType}. Current: {current}. Make it more immersive and detailed.',
      dependencies: ['name', 'locationType']
    },
    {
      fieldKey: 'history',
      promptTemplate: 'Create a compelling history for {name}, considering its {atmosphere} and {significance}.',
      dependencies: ['name', 'atmosphere', 'significance']
    }
  ],
  fallbackFields: {
    name: 'Unnamed Location',
    locationType: 'Settlement',
    description: 'A mysterious place whose story is yet to be told.'
  }
};

// Location relationship configuration
const LOCATION_RELATIONSHIP_CONFIG = {
  ...DEFAULT_RELATIONSHIP_CONFIG,
  allowedTypes: [
    'contains', 'borders', 'trade_with', 'allied_with', 'at_war_with', 
    'part_of', 'controls', 'protected_by', 'threatened_by', 'connected_to'
  ],
  defaultTypes: ['borders', 'trade_with', 'connected_to'],
  bidirectional: true
};

// Location display configuration
const LOCATION_DISPLAY_CONFIG = {
  ...DEFAULT_DISPLAY_CONFIG,
  searchFields: ['name', 'description', 'atmosphere', 'history', 'significance'],
  sortOptions: [
    { key: 'name', label: 'Name', direction: 'asc' as const },
    { key: 'locationType', label: 'Type', direction: 'asc' as const },
    { key: 'createdAt', label: 'Created', direction: 'desc' as const },
    { key: 'updatedAt', label: 'Modified', direction: 'desc' as const }
  ],
  filterOptions: [
    { key: 'locationType', label: 'Type', type: 'select' as const },
    { key: 'size', label: 'Size', type: 'select' as const },
    { key: 'status', label: 'Status', type: 'select' as const }
  ],
  displayFields: {
    card: ['name', 'locationType', 'description', 'atmosphere'],
    list: ['name', 'locationType', 'description'],
    detail: ['name', 'description', 'atmosphere', 'history', 'significance']
  }
};

// Complete location configuration
export const LOCATION_CONFIG: UniversalEntityConfig = {
  entityType: 'location',
  name: 'Location',
  pluralName: 'Locations',
  description: 'Places and environments in your world',
  
  icon: MapPin,
  color: 'emerald',
  gradient: 'from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-900/30',
  
  fields: LOCATION_FIELDS,
  sections: LOCATION_SECTIONS,
  
  ai: LOCATION_AI_CONFIG,
  relationships: LOCATION_RELATIONSHIP_CONFIG,
  display: LOCATION_DISPLAY_CONFIG,
  
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
          return 'Location name is required';
        }
        if (value.length > 100) {
          return 'Location name must be less than 100 characters';
        }
        return true;
      }
    }
  }
};