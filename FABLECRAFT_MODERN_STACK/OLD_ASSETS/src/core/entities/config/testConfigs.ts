import { User, MapPin, Users, Calendar, Sword, Book, Crown, Zap } from 'lucide-react';
import type { EnhancedUniversalEntityConfig } from './EntityConfig';

// SIMPLE TEST CONFIG: Basic Note Entity (minimal complexity)
export const SIMPLE_NOTE_CONFIG: EnhancedUniversalEntityConfig = {
  // Identity
  entityType: 'note',
  name: 'Note',
  pluralName: 'Notes',
  description: 'Simple note-taking entity for testing minimal configuration',
  
  // Visual
  icon: Book,
  color: '#3B82F6',
  
  // Minimal field structure
  fields: [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      priority: 'high',
      validation: {
        minLength: 1,
        maxLength: 100
      },
      aiEnhanceable: true
    },
    {
      key: 'content',
      label: 'Content',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: {
        maxLength: 1000
      },
      aiEnhanceable: true
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'array',
      required: false,
      priority: 'low',
      aiEnhanceable: true
    }
  ],
  
  sections: [
    {
      key: 'basic',
      label: 'Basic Information',
      description: 'Core note details',
      fields: ['title', 'content', 'tags'],
      collapsible: false,
      defaultExpanded: true
    }
  ],
  
  // Minimal UI Configuration
  wizard: {
    enabled: true,
    steps: [
      {
        key: 'basic',
        title: 'Note Details',
        description: 'Enter your note information',
        fields: ['title', 'content'],
        validation: {
          required: ['title']
        }
      }
    ],
    allowSkipping: false,
    showProgress: true,
    autoSave: false,
    methods: {
      guided: true,
      templates: true,
      ai: true,
      upload: false
    }
  },
  
  tabs: {
    enabled: true,
    tabs: [
      {
        key: 'overview',
        label: 'Overview',
        icon: Book,
        sections: [
          {
            key: 'basic',
            title: 'Note Content',
            fields: ['title', 'content', 'tags']
          }
        ]
      }
    ],
    orientation: 'horizontal',
    variant: 'default',
    lazyLoad: false,
    stickyTabs: false
  },
  
  form: {
    layout: 'single-column',
    sections: [
      {
        key: 'basic',
        title: 'Note Information',
        description: 'Basic note details',
        fields: ['title', 'content', 'tags'],
        collapsible: false,
        defaultExpanded: true
      }
    ],
    showFieldDescriptions: true,
    showRequiredIndicators: true,
    groupRelatedFields: false,
    enableConditionalLogic: false,
    autoFocus: true,
    submitOnEnter: true
  },
  
  display: {
    card: {
      layout: 'compact',
      showPortraits: false,
      fields: ['title', 'content'],
      maxFields: 3,
      showActions: true,
      showCompletion: false
    },
    list: {
      primaryField: 'title',
      secondaryFields: ['content'],
      showPortraits: false,
      density: 'comfortable'
    },
    sortOptions: [
      { key: 'title', label: 'Title', direction: 'asc' },
      { key: 'createdAt', label: 'Created', direction: 'desc' }
    ],
    filterOptions: [],
    searchFields: ['title', 'content', 'tags'],
    groupBy: [],
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50],
      showTotal: true,
      showQuickJumper: false
    }
  },
  
  // Minimal AI configuration
  ai: {
    promptTemplate: 'Generate a simple note about: {context}',
    contextFields: ['title'],
    enhancementRules: [],
    fallbackFields: {
      content: 'Generated note content'
    },
    maxRetries: 2,
    temperature: 0.7
  },
  
  // No relationships for simple entity
  relationships: {
    allowedTypes: [],
    defaultTypes: [],
    bidirectional: false,
    strengthLevels: [],
    statusOptions: []
  },
  
  // Simple template configuration
  templates: {
    enabled: true,
    categories: [],
    templates: [
      {
        id: 'quick-note',
        name: 'Quick Note',
        description: 'A simple note template',
        baseData: {
          title: 'New Note',
          content: 'Enter your note content here...',
          tags: []
        }
      }
    ]
  },
  
  // Simple AI configuration
  aiConfig: {
    enabled: true,
    prompts: [
      {
        id: 'general-note',
        name: 'General Note',
        description: 'Create a general-purpose note',
        template: 'Create a note about {topic} with helpful information',
        context: 'general'
      }
    ],
    customPromptsAllowed: true
  },
  
  // No upload for simple entity
  uploadConfig: {
    enabled: false,
    acceptedFormats: [],
    maxFileSize: 0,
    extractionRules: []
  },
  
  // Minimal features
  features: {
    hasPortraits: false,
    hasTemplates: true,
    hasRelationships: false,
    hasAIGeneration: true,
    hasDocumentUpload: false,
    hasGuidedCreation: true,
    hasFieldEnhancement: false,
    hasBulkOperations: false,
    hasAdvancedSearch: false,
    hasExport: false,
    hasImport: false,
    hasVersioning: false,
    hasComments: false,
    hasActivityLog: false
  },
  
  // Simple validation
  validation: {
    requiredFields: ['title'],
    uniqueFields: [],
    customValidators: {}
  },
  
  // Basic performance settings
  performance: {
    enableVirtualization: false,
    lazyLoading: false,
    cacheResults: true,
    prefetchRelated: false,
    optimisticUpdates: true
  },
  
  // Simple advanced features
  advanced: {
    customActions: [],
    bulkOperations: [],
    exportFormats: [],
    importSources: [],
    automationRules: []
  },
  
  // No workflow for simple entity
  workflow: {
    enabled: false,
    states: [],
    transitions: []
  },
  
  // Basic permissions
  permissions: {
    create: [],
    read: [],
    update: [],
    delete: [],
    fields: {}
  },
  
  // No integration for simple entity
  integration: {
    webhooks: [],
    apis: [],
    syncRules: []
  }
};

// COMPLEX TEST CONFIG: Advanced Character Entity (character-like complexity)
export const COMPLEX_CHARACTER_CONFIG: EnhancedUniversalEntityConfig = {
  // Identity
  entityType: 'character',
  name: 'Character',
  pluralName: 'Characters',
  description: 'Complex character entity for testing advanced configuration capabilities',
  
  // Visual
  icon: User,
  color: '#8B5CF6',
  gradient: 'from-purple-500 to-pink-500',
  
  // Complex field structure (character-like)
  fields: [
    // Identity Section
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      priority: 'critical',
      validation: {
        minLength: 2,
        maxLength: 100,
        pattern: '^[A-Za-z\\s\\'-]+$'
      },
      aiEnhanceable: true,
      helpText: 'Character\'s full name',
      placeholder: 'Enter character name'
    },
    {
      key: 'title',
      label: 'Title/Epithet',
      type: 'text',
      required: false,
      priority: 'high',
      validation: {
        maxLength: 50
      },
      aiEnhanceable: true,
      placeholder: 'e.g., The Brave, Lord of...'
    },
    {
      key: 'nicknames',
      label: 'Nicknames',
      type: 'array',
      required: false,
      priority: 'medium',
      aiEnhanceable: true,
      helpText: 'Known nicknames or aliases'
    },
    {
      key: 'age',
      label: 'Age',
      type: 'number',
      required: false,
      priority: 'high',
      validation: {
        min: 0,
        max: 10000
      },
      aiEnhanceable: true
    },
    {
      key: 'species',
      label: 'Species/Race',
      type: 'select',
      required: false,
      priority: 'high',
      options: [
        { value: 'human', label: 'Human' },
        { value: 'elf', label: 'Elf' },
        { value: 'dwarf', label: 'Dwarf' },
        { value: 'orc', label: 'Orc' },
        { value: 'other', label: 'Other' }
      ],
      aiEnhanceable: true
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      required: false,
      priority: 'medium',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'non-binary', label: 'Non-binary' },
        { value: 'other', label: 'Other' }
      ],
      aiEnhanceable: true
    },
    
    // Appearance Section
    {
      key: 'physicalDescription',
      label: 'Physical Description',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: {
        maxLength: 1000
      },
      aiEnhanceable: true,
      helpText: 'Detailed physical appearance'
    },
    {
      key: 'height',
      label: 'Height',
      type: 'text',
      required: false,
      priority: 'low',
      validation: {
        maxLength: 20
      },
      aiEnhanceable: true,
      placeholder: 'e.g., 6\'2"'
    },
    {
      key: 'weight',
      label: 'Weight',
      type: 'text',
      required: false,
      priority: 'low',
      validation: {
        maxLength: 20
      },
      aiEnhanceable: true,
      placeholder: 'e.g., 180 lbs'
    },
    {
      key: 'eyeColor',
      label: 'Eye Color',
      type: 'text',
      required: false,
      priority: 'low',
      aiEnhanceable: true,
      placeholder: 'e.g., Deep blue'
    },
    {
      key: 'hairColor',
      label: 'Hair Color',
      type: 'text',
      required: false,
      priority: 'low',
      aiEnhanceable: true,
      placeholder: 'e.g., Auburn'
    },
    
    // Personality Section
    {
      key: 'personality',
      label: 'Personality',
      type: 'textarea',
      required: false,
      priority: 'critical',
      validation: {
        maxLength: 2000
      },
      aiEnhanceable: true,
      helpText: 'Core personality traits and characteristics'
    },
    {
      key: 'traits',
      label: 'Key Traits',
      type: 'array',
      required: false,
      priority: 'high',
      aiEnhanceable: true,
      helpText: 'List of defining personality traits'
    },
    {
      key: 'flaws',
      label: 'Flaws & Weaknesses',
      type: 'array',
      required: false,
      priority: 'high',
      aiEnhanceable: true,
      helpText: 'Character flaws and weaknesses'
    },
    {
      key: 'motivations',
      label: 'Motivations',
      type: 'array',
      required: false,
      priority: 'high',
      aiEnhanceable: true,
      helpText: 'What drives this character'
    },
    {
      key: 'fears',
      label: 'Fears',
      type: 'array',
      required: false,
      priority: 'medium',
      aiEnhanceable: true,
      helpText: 'What the character fears most'
    },
    
    // Background Section
    {
      key: 'backstory',
      label: 'Backstory',
      type: 'textarea',
      required: false,
      priority: 'critical',
      validation: {
        maxLength: 5000
      },
      aiEnhanceable: true,
      helpText: 'Character\'s history and background'
    },
    {
      key: 'occupation',
      label: 'Occupation',
      type: 'text',
      required: false,
      priority: 'high',
      validation: {
        maxLength: 100
      },
      aiEnhanceable: true,
      placeholder: 'e.g., Knight, Merchant, Scholar'
    },
    {
      key: 'background',
      label: 'Social Background',
      type: 'select',
      required: false,
      priority: 'medium',
      options: [
        { value: 'noble', label: 'Noble' },
        { value: 'commoner', label: 'Commoner' },
        { value: 'merchant', label: 'Merchant' },
        { value: 'criminal', label: 'Criminal' },
        { value: 'scholar', label: 'Scholar' }
      ],
      aiEnhanceable: true
    },
    {
      key: 'birthplace',
      label: 'Birthplace',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: {
        maxLength: 100
      },
      aiEnhanceable: true,
      placeholder: 'Where the character was born'
    },
    
    // Skills & Abilities
    {
      key: 'skills',
      label: 'Skills',
      type: 'array',
      required: false,
      priority: 'high',
      aiEnhanceable: true,
      helpText: 'Special skills and abilities'
    },
    {
      key: 'magicalAbilities',
      label: 'Magical Abilities',
      type: 'array',
      required: false,
      priority: 'medium',
      aiEnhanceable: true,
      helpText: 'Magical powers and spells'
    },
    {
      key: 'equipment',
      label: 'Equipment',
      type: 'array',
      required: false,
      priority: 'medium',
      aiEnhanceable: true,
      helpText: 'Weapons, armor, and important items'
    },
    
    // Relationships & Social
    {
      key: 'allies',
      label: 'Allies',
      type: 'array',
      required: false,
      priority: 'medium',
      aiEnhanceable: true,
      helpText: 'Friends and allies'
    },
    {
      key: 'enemies',
      label: 'Enemies',
      type: 'array',
      required: false,
      priority: 'medium',
      aiEnhanceable: true,
      helpText: 'Enemies and rivals'
    },
    {
      key: 'family',
      label: 'Family',
      type: 'array',
      required: false,
      priority: 'medium',
      aiEnhanceable: true,
      helpText: 'Family members and relations'
    },
    
    // Story Elements
    {
      key: 'goals',
      label: 'Goals',
      type: 'array',
      required: false,
      priority: 'high',
      aiEnhanceable: true,
      helpText: 'Character\'s short and long-term goals'
    },
    {
      key: 'secrets',
      label: 'Secrets',
      type: 'array',
      required: false,
      priority: 'medium',
      aiEnhanceable: true,
      helpText: 'Hidden secrets and mysteries'
    },
    {
      key: 'notes',
      label: 'Additional Notes',
      type: 'textarea',
      required: false,
      priority: 'low',
      validation: {
        maxLength: 2000
      },
      aiEnhanceable: true,
      helpText: 'Any additional notes or details'
    }
  ],
  
  // Complex section structure
  sections: [
    {
      key: 'identity',
      label: 'Identity',
      description: 'Basic character identity and demographics',
      fields: ['name', 'title', 'nicknames', 'age', 'species', 'gender'],
      collapsible: true,
      defaultExpanded: true
    },
    {
      key: 'appearance',
      label: 'Appearance',
      description: 'Physical description and characteristics',
      fields: ['physicalDescription', 'height', 'weight', 'eyeColor', 'hairColor'],
      collapsible: true,
      defaultExpanded: false
    },
    {
      key: 'personality',
      label: 'Personality',
      description: 'Personality traits, flaws, and motivations',
      fields: ['personality', 'traits', 'flaws', 'motivations', 'fears'],
      collapsible: true,
      defaultExpanded: true
    },
    {
      key: 'background',
      label: 'Background',
      description: 'Character history and background',
      fields: ['backstory', 'occupation', 'background', 'birthplace'],
      collapsible: true,
      defaultExpanded: false
    },
    {
      key: 'abilities',
      label: 'Skills & Abilities',
      description: 'Character skills, abilities, and equipment',
      fields: ['skills', 'magicalAbilities', 'equipment'],
      collapsible: true,
      defaultExpanded: false
    },
    {
      key: 'relationships',
      label: 'Relationships',
      description: 'Social connections and relationships',
      fields: ['allies', 'enemies', 'family'],
      collapsible: true,
      defaultExpanded: false
    },
    {
      key: 'story',
      label: 'Story Elements',
      description: 'Goals, secrets, and story-related information',
      fields: ['goals', 'secrets', 'notes'],
      collapsible: true,
      defaultExpanded: false
    }
  ],
  
  // Complex wizard configuration
  wizard: {
    enabled: true,
    steps: [
      {
        key: 'identity',
        title: 'Character Identity',
        description: 'Define the basic identity of your character',
        fields: ['name', 'title', 'age', 'species', 'gender'],
        validation: {
          required: ['name']
        }
      },
      {
        key: 'personality',
        title: 'Personality',
        description: 'Define your character\'s personality and traits',
        fields: ['personality', 'traits', 'motivations'],
        validation: {
          required: []
        }
      },
      {
        key: 'background',
        title: 'Background',
        description: 'Establish your character\'s history and background',
        fields: ['backstory', 'occupation', 'birthplace'],
        validation: {
          required: []
        }
      },
      {
        key: 'details',
        title: 'Additional Details',
        description: 'Add appearance, skills, and other details',
        fields: ['physicalDescription', 'skills', 'goals'],
        validation: {
          required: []
        }
      }
    ],
    allowSkipping: true,
    showProgress: true,
    autoSave: true,
    autoSaveInterval: 30000,
    methods: {
      guided: true,
      templates: true,
      ai: true,
      upload: true
    }
  },
  
  // Complex tab configuration
  tabs: {
    enabled: true,
    tabs: [
      {
        key: 'overview',
        label: 'Overview',
        icon: User,
        sections: [
          {
            key: 'identity',
            title: 'Identity',
            fields: ['name', 'title', 'age', 'species']
          },
          {
            key: 'personality_summary',
            title: 'Personality',
            fields: ['personality', 'traits']
          }
        ]
      },
      {
        key: 'appearance',
        label: 'Appearance',
        icon: User,
        sections: [
          {
            key: 'physical',
            title: 'Physical Description',
            fields: ['physicalDescription', 'height', 'weight', 'eyeColor', 'hairColor']
          }
        ]
      },
      {
        key: 'personality',
        label: 'Personality',
        icon: User,
        sections: [
          {
            key: 'core_personality',
            title: 'Core Personality',
            fields: ['personality', 'traits', 'flaws']
          },
          {
            key: 'motivations_fears',
            title: 'Motivations & Fears',
            fields: ['motivations', 'fears']
          }
        ]
      },
      {
        key: 'background',
        label: 'Background',
        icon: Book,
        sections: [
          {
            key: 'history',
            title: 'History',
            fields: ['backstory', 'birthplace']
          },
          {
            key: 'social',
            title: 'Social Background',
            fields: ['occupation', 'background']
          }
        ]
      },
      {
        key: 'abilities',
        label: 'Abilities',
        icon: Zap,
        sections: [
          {
            key: 'skills_magic',
            title: 'Skills & Magic',
            fields: ['skills', 'magicalAbilities']
          },
          {
            key: 'equipment',
            title: 'Equipment',
            fields: ['equipment']
          }
        ]
      },
      {
        key: 'relationships',
        label: 'Relationships',
        icon: Users,
        sections: [
          {
            key: 'social_connections',
            title: 'Social Connections',
            fields: ['allies', 'enemies', 'family']
          }
        ]
      },
      {
        key: 'story',
        label: 'Story',
        icon: Crown,
        sections: [
          {
            key: 'story_elements',
            title: 'Story Elements',
            fields: ['goals', 'secrets', 'notes']
          }
        ]
      }
    ],
    orientation: 'horizontal',
    variant: 'default',
    lazyLoad: true,
    stickyTabs: true
  },
  
  // Complex form configuration
  form: {
    layout: 'two-column',
    sections: [
      {
        key: 'identity',
        title: 'Character Identity',
        description: 'Basic character information',
        fields: ['name', 'title', 'nicknames', 'age', 'species', 'gender'],
        collapsible: true,
        defaultExpanded: true
      },
      {
        key: 'appearance',
        title: 'Appearance',
        description: 'Physical characteristics',
        fields: ['physicalDescription', 'height', 'weight', 'eyeColor', 'hairColor'],
        collapsible: true,
        defaultExpanded: false
      },
      {
        key: 'personality',
        title: 'Personality',
        description: 'Personality and psychological traits',
        fields: ['personality', 'traits', 'flaws', 'motivations', 'fears'],
        collapsible: true,
        defaultExpanded: true
      },
      {
        key: 'background',
        title: 'Background',
        description: 'Character history and social background',
        fields: ['backstory', 'occupation', 'background', 'birthplace'],
        collapsible: true,
        defaultExpanded: false
      },
      {
        key: 'abilities',
        title: 'Skills & Abilities',
        description: 'Character capabilities and equipment',
        fields: ['skills', 'magicalAbilities', 'equipment'],
        collapsible: true,
        defaultExpanded: false
      },
      {
        key: 'relationships',
        title: 'Relationships',
        description: 'Social connections and relationships',
        fields: ['allies', 'enemies', 'family'],
        collapsible: true,
        defaultExpanded: false
      },
      {
        key: 'story',
        title: 'Story Elements',
        description: 'Goals, secrets, and additional notes',
        fields: ['goals', 'secrets', 'notes'],
        collapsible: true,
        defaultExpanded: false
      }
    ],
    showFieldDescriptions: true,
    showRequiredIndicators: true,
    groupRelatedFields: true,
    enableConditionalLogic: true,
    autoFocus: true,
    submitOnEnter: false
  },
  
  // Complex display configuration
  display: {
    card: {
      layout: 'detailed',
      showPortraits: true,
      fields: ['name', 'title', 'personality', 'occupation'],
      maxFields: 6,
      showActions: true,
      showCompletion: true
    },
    list: {
      primaryField: 'name',
      secondaryFields: ['title', 'occupation', 'species'],
      showPortraits: true,
      density: 'comfortable'
    },
    sortOptions: [
      { key: 'name', label: 'Name', direction: 'asc' },
      { key: 'age', label: 'Age', direction: 'desc' },
      { key: 'species', label: 'Species', direction: 'asc' },
      { key: 'occupation', label: 'Occupation', direction: 'asc' },
      { key: 'createdAt', label: 'Created', direction: 'desc' }
    ],
    filterOptions: [
      {
        key: 'species',
        label: 'Species',
        type: 'select',
        options: [
          { value: 'human', label: 'Human' },
          { value: 'elf', label: 'Elf' },
          { value: 'dwarf', label: 'Dwarf' },
          { value: 'orc', label: 'Orc' }
        ]
      },
      {
        key: 'background',
        label: 'Background',
        type: 'select',
        options: [
          { value: 'noble', label: 'Noble' },
          { value: 'commoner', label: 'Commoner' },
          { value: 'merchant', label: 'Merchant' }
        ]
      }
    ],
    searchFields: ['name', 'title', 'personality', 'backstory', 'occupation'],
    groupBy: [
      { key: 'species', label: 'Species' },
      { key: 'background', label: 'Background' }
    ],
    pagination: {
      enabled: true,
      pageSize: 12,
      pageSizeOptions: [6, 12, 24, 48],
      showTotal: true,
      showQuickJumper: true
    }
  },
  
  // Complex AI configuration
  ai: {
    promptTemplate: 'Generate a detailed character with the following context: {context}. Include personality traits, background, and motivations.',
    contextFields: ['name', 'species', 'occupation'],
    enhancementRules: [
      {
        fieldKey: 'personality',
        promptTemplate: 'Based on the character {name} who is a {occupation}, generate a detailed personality description',
        dependencies: ['name', 'occupation']
      },
      {
        fieldKey: 'backstory',
        promptTemplate: 'Create a compelling backstory for {name}, a {species} {occupation} from {birthplace}',
        dependencies: ['name', 'species', 'occupation', 'birthplace']
      }
    ],
    fallbackFields: {
      personality: 'A complex individual with unique traits and motivations',
      backstory: 'An intriguing character with a rich history'
    },
    maxRetries: 3,
    temperature: 0.8
  },
  
  // Complex relationships
  relationships: {
    allowedTypes: ['ally', 'enemy', 'family', 'mentor', 'student', 'rival', 'lover'],
    defaultTypes: ['ally', 'enemy'],
    bidirectional: true,
    strengthLevels: ['weak', 'moderate', 'strong', 'intense'],
    statusOptions: ['active', 'inactive', 'complicated', 'deceased']
  },
  
  // Complex template configuration
  templates: {
    enabled: true,
    categories: [
      {
        id: 'archetype',
        name: 'Character Archetypes',
        description: 'Classic character archetypes and roles'
      },
      {
        id: 'profession',
        name: 'Professions',
        description: 'Characters based on specific occupations'
      },
      {
        id: 'fantasy',
        name: 'Fantasy Races',
        description: 'Templates for different fantasy species'
      }
    ],
    templates: [
      {
        id: 'knight-template',
        name: 'Noble Knight',
        description: 'A classic knight character template',
        category: 'archetype',
        difficulty: 'beginner',
        estimatedTime: '5-10 min',
        isPopular: true,
        tags: ['combat', 'honor', 'nobility'],
        features: ['Pre-defined personality', 'Noble background', 'Combat skills'],
        namePattern: 'Sir {random} the {adjective}',
        baseData: {
          title: 'Sir',
          species: 'human',
          occupation: 'Knight',
          background: 'noble',
          personality: 'Honor-bound and brave, dedicated to protecting the innocent and upholding justice.',
          traits: ['Honorable', 'Brave', 'Protective', 'Disciplined'],
          skills: ['Swordsmanship', 'Horsemanship', 'Leadership', 'Tactics'],
          equipment: ['Longsword', 'Plate Armor', 'Shield', 'Warhorse']
        },
        dataTransforms: [
          {
            type: 'randomize',
            field: 'eyeColor',
            options: ['Blue', 'Brown', 'Green', 'Hazel']
          },
          {
            type: 'randomize',
            field: 'hairColor',
            options: ['Brown', 'Black', 'Blonde', 'Auburn']
          }
        ]
      },
      {
        id: 'wizard-template',
        name: 'Wise Wizard',
        description: 'A powerful spellcaster template',
        category: 'archetype',
        difficulty: 'intermediate',
        estimatedTime: '10-15 min',
        aiEnhanced: true,
        tags: ['magic', 'wisdom', 'mystery'],
        features: ['Magical abilities', 'Scholarly background', 'Ancient knowledge'],
        namePattern: '{name} the {title}',
        baseData: {
          occupation: 'Wizard',
          background: 'scholar',
          personality: 'Wise and contemplative, driven by the pursuit of knowledge and understanding of magical forces.',
          traits: ['Intelligent', 'Curious', 'Patient', 'Mysterious'],
          magicalAbilities: ['Fireball', 'Teleportation', 'Scrying', 'Enchantment'],
          skills: ['Arcane Knowledge', 'Alchemy', 'Ancient Languages', 'Meditation'],
          equipment: ['Staff of Power', 'Spellbook', 'Component Pouch', 'Robes']
        }
      },
      {
        id: 'elf-ranger',
        name: 'Elven Ranger',
        description: 'A forest guardian from the elven realms',
        category: 'fantasy',
        difficulty: 'beginner',
        estimatedTime: '5-10 min',
        tags: ['nature', 'archery', 'stealth'],
        features: ['Elven heritage', 'Nature skills', 'Ranged combat'],
        baseData: {
          species: 'elf',
          occupation: 'Ranger',
          background: 'commoner',
          personality: 'Connected to nature, protective of the wilderness and its creatures.',
          traits: ['Observant', 'Independent', 'Loyal', 'Patient'],
          skills: ['Archery', 'Tracking', 'Survival', 'Animal Handling'],
          equipment: ['Longbow', 'Arrows', 'Leather Armor', 'Hunting Knife']
        }
      }
    ]
  },
  
  // Complex AI configuration
  aiConfig: {
    enabled: true,
    prompts: [
      {
        id: 'heroic-character',
        name: 'Heroic Character',
        description: 'Create a character suitable for heroic adventures',
        template: 'Create a heroic character with noble qualities, interesting flaws, and clear motivations. Include detailed personality, background, and goals.',
        context: 'heroic',
        complexity: 'moderate',
        features: ['Detailed personality', 'Heroic qualities', 'Clear motivations']
      },
      {
        id: 'complex-villain',
        name: 'Complex Villain',
        description: 'Generate a multi-dimensional antagonist',
        template: 'Create a complex villain with understandable motivations, tragic background, and compelling personality. Avoid simple evil archetypes.',
        context: 'antagonist',
        complexity: 'complex',
        features: ['Sympathetic motivations', 'Tragic background', 'Character depth']
      },
      {
        id: 'supporting-character',
        name: 'Supporting Character',
        description: 'Create an interesting supporting character',
        template: 'Generate a supporting character with unique personality, helpful abilities, and connections to the main story.',
        context: 'supporting',
        complexity: 'simple',
        features: ['Unique personality', 'Story connections', 'Helpful abilities']
      }
    ],
    defaultSettings: {
      creativity: 0.8,
      complexity: 0.7,
      style: 'creative',
      includeDetails: true
    },
    customPromptsAllowed: true
  },
  
  // Complex upload configuration
  uploadConfig: {
    enabled: true,
    acceptedFormats: ['.pdf', '.txt', '.docx', '.json'],
    maxFileSize: 25,
    allowMultiple: false,
    extractionRules: [
      {
        field: 'name',
        pattern: '(?:Name|Character):\\s*(.+)',
        description: 'Extract character name from labeled field'
      },
      {
        field: 'age',
        pattern: '(?:Age):\\s*(\\d+)',
        description: 'Extract age as number'
      },
      {
        field: 'occupation',
        pattern: '(?:Occupation|Job|Class):\\s*(.+)',
        description: 'Extract occupation or class'
      },
      {
        field: 'personality',
        pattern: '(?:Personality|Traits):\\s*(.+?)(?=\\n\\n|\\n[A-Z]|$)',
        description: 'Extract personality description'
      }
    ]
  },
  
  // All advanced features enabled
  features: {
    hasPortraits: true,
    hasTemplates: true,
    hasRelationships: true,
    hasAIGeneration: true,
    hasDocumentUpload: true,
    hasGuidedCreation: true,
    hasFieldEnhancement: true,
    hasBulkOperations: true,
    hasAdvancedSearch: true,
    hasExport: true,
    hasImport: true,
    hasVersioning: true,
    hasComments: true,
    hasActivityLog: true
  },
  
  // Complex validation
  validation: {
    requiredFields: ['name'],
    uniqueFields: ['name'],
    customValidators: {
      age: (value: any) => {
        if (value && (isNaN(value) || value < 0 || value > 10000)) {
          return 'Age must be a number between 0 and 10,000';
        }
        return true;
      },
      name: (value: any) => {
        if (value && value.length < 2) {
          return 'Name must be at least 2 characters long';
        }
        return true;
      }
    }
  },
  
  // Advanced performance settings
  performance: {
    enableVirtualization: true,
    lazyLoading: true,
    cacheResults: true,
    prefetchRelated: true,
    optimisticUpdates: true
  },
  
  // Advanced features
  advanced: {
    customActions: [
      {
        key: 'generate-portrait',
        label: 'Generate Portrait',
        description: 'Generate an AI portrait for this character',
        icon: 'image',
        type: 'ai'
      },
      {
        key: 'character-sheet',
        label: 'Export Character Sheet',
        description: 'Export as game character sheet',
        icon: 'download',
        type: 'export'
      }
    ],
    bulkOperations: [
      {
        key: 'bulk-background',
        label: 'Set Background',
        description: 'Set background for multiple characters',
        fields: ['background']
      },
      {
        key: 'bulk-species',
        label: 'Set Species',
        description: 'Set species for multiple characters',
        fields: ['species']
      }
    ],
    exportFormats: [
      { key: 'json', label: 'JSON', mimeType: 'application/json' },
      { key: 'pdf', label: 'Character Sheet PDF', mimeType: 'application/pdf' },
      { key: 'txt', label: 'Text Summary', mimeType: 'text/plain' }
    ],
    importSources: [
      { key: 'json', label: 'JSON File', accept: '.json' },
      { key: 'csv', label: 'CSV File', accept: '.csv' }
    ],
    automationRules: [
      {
        trigger: 'field_change',
        condition: { field: 'species', value: 'elf' },
        action: { type: 'set_field', field: 'height', value: 'Tall (5\'8" - 6\'2")' }
      }
    ]
  },
  
  // No workflow for this test
  workflow: {
    enabled: false,
    states: [],
    transitions: []
  },
  
  // Basic permissions
  permissions: {
    create: ['admin', 'writer'],
    read: ['admin', 'writer', 'reader'],
    update: ['admin', 'writer'],
    delete: ['admin'],
    fields: {
      secrets: { read: ['admin', 'writer'] }
    }
  },
  
  // No integration for test
  integration: {
    webhooks: [],
    apis: [],
    syncRules: []
  }
};

// Export test configurations
export const TEST_CONFIGS = {
  simple: SIMPLE_NOTE_CONFIG,
  complex: COMPLEX_CHARACTER_CONFIG
} as const;

export type TestConfigType = keyof typeof TEST_CONFIGS;