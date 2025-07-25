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

// Comprehensive field definitions
export const FIELD_DEFINITIONS: FieldDefinition[] = [
  // Identity Section
  {
    key: 'name',
    label: 'Full Name',
    type: 'text',
    section: 'identity',
    required: true,
    priority: 'essential',
    placeholder: 'Character\'s full name',
    aiPrompt: 'Generate a memorable character name that fits their background and world'
  },
  {
    key: 'nicknames',
    label: 'Nicknames',
    type: 'text',
    section: 'identity',
    priority: 'important',
    placeholder: 'Common nicknames or pet names',
    aiPrompt: 'Create believable nicknames based on their personality and relationships'
  },
  {
    key: 'title',
    label: 'Title/Rank',
    type: 'text',
    section: 'identity',
    priority: 'important',
    placeholder: 'Professional or noble title',
    aiPrompt: 'Generate an appropriate title that reflects their status and role'
  },
  {
    key: 'aliases',
    label: 'Aliases',
    type: 'text',
    section: 'identity',
    priority: 'important',
    placeholder: 'Secret identities or false names',
    aiPrompt: 'Create aliases that serve story purposes and fit their background'
  },
  {
    key: 'race',
    label: 'Race/Species',
    type: 'select',
    section: 'identity',
    priority: 'essential',
    options: ['Human', 'Elf', 'Dwarf', 'Halfling', 'Orc', 'Cat', 'Dragon', 'Other'],
    aiPrompt: 'Determine the most suitable race/species for this character'
  },
  {
    key: 'age',
    label: 'Age',
    type: 'text',
    section: 'identity',
    priority: 'essential',
    placeholder: 'Physical or apparent age',
    aiPrompt: 'Set an appropriate age that matches their experience and role'
  },
  {
    key: 'class',
    label: 'Class/Archetype',
    type: 'text',
    section: 'identity',
    priority: 'important',
    placeholder: 'Character class or archetype',
    aiPrompt: 'Define their primary character class or archetype'
  },
  {
    key: 'profession',
    label: 'Profession',
    type: 'text',
    section: 'identity',
    priority: 'important',
    placeholder: 'Primary occupation or career',
    aiPrompt: 'Create a profession that fits their skills and world setting'
  },

  // Physical Section
  {
    key: 'physicalDescription',
    label: 'Physical Description',
    type: 'textarea',
    section: 'physical',
    priority: 'essential',
    placeholder: 'Detailed physical appearance',
    aiPrompt: 'Write a vivid physical description that captures their unique appearance'
  },
  {
    key: 'height',
    label: 'Height',
    type: 'text',
    section: 'physical',
    priority: 'essential',
    placeholder: 'Height measurement',
    aiPrompt: 'Set an appropriate height for their race and build'
  },
  {
    key: 'build',
    label: 'Build/Body Type',
    type: 'text',
    section: 'physical',
    priority: 'essential',
    placeholder: 'Body build and physique',
    aiPrompt: 'Describe their body build reflecting their lifestyle and abilities'
  },
  {
    key: 'eyeColor',
    label: 'Eye Color',
    type: 'text',
    section: 'physical',
    priority: 'important',
    placeholder: 'Eye color and characteristics',
    aiPrompt: 'Choose eye color that complements their appearance and personality'
  },
  {
    key: 'hairColor',
    label: 'Hair Color',
    type: 'text',
    section: 'physical',
    priority: 'important',
    placeholder: 'Hair color and style',
    aiPrompt: 'Select hair color and style that fits their character and setting'
  },

  // Personality Section
  {
    key: 'personality',
    label: 'Personality Overview',
    type: 'textarea',
    section: 'personality',
    priority: 'essential',
    placeholder: 'Core personality description',
    aiPrompt: 'Create a rich personality overview with specific traits and quirks'
  },
  {
    key: 'personalityTraits',
    label: 'Personality Traits',
    type: 'array',
    section: 'personality',
    priority: 'essential',
    placeholder: 'Key personality traits',
    aiPrompt: 'List specific personality traits that define how they think and act'
  },
  {
    key: 'goals',
    label: 'Goals',
    type: 'textarea',
    section: 'personality',
    priority: 'essential',
    placeholder: 'What they want to achieve',
    aiPrompt: 'Define clear, compelling goals that drive their actions'
  },
  {
    key: 'motivations',
    label: 'Motivations',
    type: 'textarea',
    section: 'personality',
    priority: 'essential',
    placeholder: 'Why they pursue their goals',
    aiPrompt: 'Explain the deep motivations behind their goals and actions'
  },
  {
    key: 'fears',
    label: 'Fears',
    type: 'textarea',
    section: 'personality',
    priority: 'essential',
    placeholder: 'What they fear most',
    aiPrompt: 'Identify their deepest fears and how they impact their behavior'
  },

  // Background Section
  {
    key: 'background',
    label: 'Background Story',
    type: 'textarea',
    section: 'background',
    priority: 'essential',
    placeholder: 'Character\'s history and origins',
    aiPrompt: 'Write a compelling backstory that explains who they are today'
  },
  {
    key: 'occupation',
    label: 'Occupation',
    type: 'text',
    section: 'background',
    priority: 'essential',
    placeholder: 'Current job or role',
    aiPrompt: 'Define their current occupation and how it shapes their life'
  },

  // Skills Section
  {
    key: 'abilities',
    label: 'Abilities',
    type: 'array',
    section: 'skills',
    priority: 'essential',
    placeholder: 'Special abilities and powers',
    aiPrompt: 'List unique abilities that make them capable and interesting'
  },
  {
    key: 'talents',
    label: 'Natural Talents',
    type: 'array',
    section: 'skills',
    priority: 'essential',
    placeholder: 'Inborn gifts and talents',
    aiPrompt: 'Identify natural talents they were born with'
  },
  {
    key: 'skills',
    label: 'Learned Skills',
    type: 'array',
    section: 'skills',
    priority: 'important',
    placeholder: 'Acquired skills and training',
    aiPrompt: 'List skills they have learned through training and experience'
  },
  {
    key: 'strengths',
    label: 'Strengths',
    type: 'textarea',
    section: 'skills',
    priority: 'important',
    placeholder: 'What they excel at',
    aiPrompt: 'Describe their key strengths and what they do best'
  },

  // Story Section
  {
    key: 'flaws',
    label: 'Character Flaws',
    type: 'textarea',
    section: 'story',
    priority: 'important',
    placeholder: 'Weaknesses and character flaws',
    aiPrompt: 'Create meaningful flaws that create conflict and growth opportunities'
  },
  {
    key: 'role',
    label: 'Story Role',
    type: 'select',
    section: 'story',
    priority: 'important',
    options: ['Protagonist', 'Antagonist', 'Supporting Character', 'Comic Relief', 'Mentor', 'Love Interest', 'Villain', 'Anti-Hero'],
    aiPrompt: 'Determine their primary role in the story structure'
  }
];

// Helper functions
export function getFieldDefinition(key: string): FieldDefinition | undefined {
  return FIELD_DEFINITIONS.find(field => field.key === key);
}

export function getFieldsBySection(sectionId: string): FieldDefinition[] {
  return FIELD_DEFINITIONS.filter(field => field.section === sectionId);
}

export function getFieldsByPriority(priority: 'essential' | 'important' | 'optional'): FieldDefinition[] {
  return FIELD_DEFINITIONS.filter(field => field.priority === priority);
}

export function getSectionById(id: string) {
  return CHARACTER_SECTIONS.find(section => section.id === id);
}

// ================================
// LOCATION FIELD CONFIGURATIONS
// ================================

// Location sections with consistent organization
export const LOCATION_SECTIONS = [
  {
    id: 'identity',
    title: 'Identity',
    description: 'Basic location identification and classification',
    icon: 'MapPin',
    order: 1
  },
  {
    id: 'physical',
    title: 'Physical',
    description: 'Geography, terrain, climate, and physical characteristics',
    icon: 'Mountain',
    order: 2
  },
  {
    id: 'atmosphere',
    title: 'Atmosphere',
    description: 'Mood, environment, sensory details, and ambiance',
    icon: 'Cloud',
    order: 3
  },
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Buildings, structures, layout, and construction',
    icon: 'Building',
    order: 4
  },
  {
    id: 'society',
    title: 'Society',
    description: 'Population, culture, governance, and social structure',
    icon: 'Users',
    order: 5
  },
  {
    id: 'economy',
    title: 'Economy',
    description: 'Trade, resources, commerce, and economic systems',
    icon: 'Coins',
    order: 6
  },
  {
    id: 'history',
    title: 'History',
    description: 'Origin, past events, legends, and historical significance',
    icon: 'Scroll',
    order: 7
  },
  {
    id: 'story',
    title: 'Story',
    description: 'Narrative role, plot relevance, and story elements',
    icon: 'BookText',
    order: 8
  }
] as const;

// Location field definitions
export const LOCATION_FIELD_DEFINITIONS: FieldDefinition[] = [
  // Identity Section
  {
    key: 'name',
    label: 'Location Name',
    type: 'text',
    section: 'identity',
    required: true,
    priority: 'essential',
    placeholder: 'Name of the location',
    aiPrompt: 'Generate a memorable location name that fits the world and setting'
  },
  {
    key: 'nicknames',
    label: 'Nicknames',
    type: 'text',
    section: 'identity',
    priority: 'important',
    placeholder: 'Common nicknames or informal names',
    aiPrompt: 'Create believable nicknames locals might use for this place'
  },
  {
    key: 'locationType',
    label: 'Location Type',
    type: 'select',
    section: 'identity',
    priority: 'essential',
    options: ['City', 'Town', 'Village', 'Castle', 'Forest', 'Mountain', 'Desert', 'Ocean', 'Cave', 'Ruins', 'Temple', 'Tower', 'Other'],
    aiPrompt: 'Determine the most appropriate location type'
  },
  {
    key: 'classification',
    label: 'Classification',
    type: 'text',
    section: 'identity',
    priority: 'important',
    placeholder: 'Specific classification or subtype',
    aiPrompt: 'Provide more specific classification within the location type'
  },
  {
    key: 'size',
    label: 'Size',
    type: 'text',
    section: 'identity',
    priority: 'important',
    placeholder: 'Size description or measurements',
    aiPrompt: 'Describe the size and scale of this location'
  },
  {
    key: 'description',
    label: 'General Description',
    type: 'textarea',
    section: 'identity',
    priority: 'essential',
    placeholder: 'Overall description of the location',
    aiPrompt: 'Write a compelling overview that captures the essence of this place'
  },

  // Physical Section
  {
    key: 'physicalDescription',
    label: 'Physical Description',
    type: 'textarea',
    section: 'physical',
    priority: 'essential',
    placeholder: 'Detailed physical appearance and features',
    aiPrompt: 'Describe the physical features in vivid, immersive detail'
  },
  {
    key: 'geography',
    label: 'Geography',
    type: 'textarea',
    section: 'physical',
    priority: 'essential',
    placeholder: 'Geographic features and layout',
    aiPrompt: 'Detail the geographic characteristics and natural features'
  },
  {
    key: 'terrain',
    label: 'Terrain',
    type: 'text',
    section: 'physical',
    priority: 'important',
    placeholder: 'Type of terrain and landscape',
    aiPrompt: 'Specify the terrain type and landscape characteristics'
  },
  {
    key: 'climate',
    label: 'Climate & Weather',
    type: 'textarea',
    section: 'physical',
    priority: 'important',
    placeholder: 'Climate patterns and typical weather',
    aiPrompt: 'Describe the climate and weather patterns that affect this location'
  },
  {
    key: 'naturalFeatures',
    label: 'Natural Features',
    type: 'textarea',
    section: 'physical',
    priority: 'important',
    placeholder: 'Notable natural landmarks and features',
    aiPrompt: 'List distinctive natural features that make this place unique'
  },
  {
    key: 'landmarks',
    label: 'Landmarks',
    type: 'textarea',
    section: 'physical',
    priority: 'important',
    placeholder: 'Prominent landmarks and notable points',
    aiPrompt: 'Identify key landmarks that define this location'
  },

  // Atmosphere Section
  {
    key: 'atmosphere',
    label: 'Atmosphere',
    type: 'textarea',
    section: 'atmosphere',
    priority: 'essential',
    placeholder: 'Overall mood and feeling of the place',
    aiPrompt: 'Capture the emotional atmosphere and feeling visitors experience'
  },
  {
    key: 'mood',
    label: 'Mood',
    type: 'text',
    section: 'atmosphere',
    priority: 'important',
    placeholder: 'Dominant mood or emotional tone',
    aiPrompt: 'Define the primary emotional tone this place evokes'
  },
  {
    key: 'sounds',
    label: 'Sounds',
    type: 'textarea',
    section: 'atmosphere',
    priority: 'important',
    placeholder: 'Characteristic sounds and audio landscape',
    aiPrompt: 'Describe the sounds that define this place\'s auditory environment'
  },
  {
    key: 'smells',
    label: 'Smells',
    type: 'textarea',
    section: 'atmosphere',
    priority: 'important',
    placeholder: 'Notable scents and aromas',
    aiPrompt: 'Detail the scents and smells that characterize this location'
  },
  {
    key: 'lighting',
    label: 'Lighting',
    type: 'text',
    section: 'atmosphere',
    priority: 'important',
    placeholder: 'Lighting conditions and quality',
    aiPrompt: 'Describe the lighting conditions and how they affect the atmosphere'
  },

  // Architecture Section
  {
    key: 'architecture',
    label: 'Architecture',
    type: 'textarea',
    section: 'architecture',
    priority: 'important',
    placeholder: 'Architectural style and characteristics',
    aiPrompt: 'Describe the architectural style and construction methods'
  },
  {
    key: 'buildings',
    label: 'Buildings',
    type: 'textarea',
    section: 'architecture',
    priority: 'important',
    placeholder: 'Notable buildings and structures',
    aiPrompt: 'Detail the important buildings and what makes them significant'
  },
  {
    key: 'materials',
    label: 'Materials',
    type: 'text',
    section: 'architecture',
    priority: 'important',
    placeholder: 'Construction materials used',
    aiPrompt: 'Specify the materials used in construction and their significance'
  },
  {
    key: 'layout',
    label: 'Layout',
    type: 'textarea',
    section: 'architecture',
    priority: 'important',
    placeholder: 'Spatial organization and layout',
    aiPrompt: 'Describe how the location is organized and laid out'
  },

  // Society Section
  {
    key: 'population',
    label: 'Population',
    type: 'text',
    section: 'society',
    priority: 'important',
    placeholder: 'Population size and demographics',
    aiPrompt: 'Provide population details and demographic information'
  },
  {
    key: 'inhabitants',
    label: 'Inhabitants',
    type: 'textarea',
    section: 'society',
    priority: 'important',
    placeholder: 'Who lives here and their characteristics',
    aiPrompt: 'Describe the people who live in this location'
  },
  {
    key: 'culture',
    label: 'Culture',
    type: 'textarea',
    section: 'society',
    priority: 'important',
    placeholder: 'Cultural practices and traditions',
    aiPrompt: 'Detail the cultural characteristics and practices of this place'
  },
  {
    key: 'governance',
    label: 'Governance',
    type: 'textarea',
    section: 'society',
    priority: 'important',
    placeholder: 'How the location is governed',
    aiPrompt: 'Describe the governance structure and leadership'
  },
  {
    key: 'laws',
    label: 'Laws & Justice',
    type: 'textarea',
    section: 'society',
    priority: 'optional',
    placeholder: 'Legal system and justice',
    aiPrompt: 'Detail the legal system and how justice is administered'
  },

  // Economy Section
  {
    key: 'economy',
    label: 'Economy',
    type: 'textarea',
    section: 'economy',
    priority: 'important',
    placeholder: 'Economic system and activities',
    aiPrompt: 'Describe the economic activities and system that sustains this place'
  },
  {
    key: 'trade',
    label: 'Trade',
    type: 'textarea',
    section: 'economy',
    priority: 'important',
    placeholder: 'Trade relationships and commerce',
    aiPrompt: 'Detail trade relationships and commercial activities'
  },
  {
    key: 'resources',
    label: 'Resources',
    type: 'textarea',
    section: 'economy',
    priority: 'important',
    placeholder: 'Available resources and materials',
    aiPrompt: 'List the resources available to this location'
  },
  {
    key: 'currency',
    label: 'Currency',
    type: 'text',
    section: 'economy',
    priority: 'optional',
    placeholder: 'Local currency or exchange system',
    aiPrompt: 'Describe the currency or exchange system used here'
  },

  // History Section
  {
    key: 'history',
    label: 'History',
    type: 'textarea',
    section: 'history',
    priority: 'important',
    placeholder: 'Historical background and past events',
    aiPrompt: 'Create a rich history that explains how this place came to be'
  },
  {
    key: 'founding',
    label: 'Founding',
    type: 'textarea',
    section: 'history',
    priority: 'important',
    placeholder: 'Origin story and founding',
    aiPrompt: 'Tell the story of how this location was founded or discovered'
  },
  {
    key: 'pastEvents',
    label: 'Past Events',
    type: 'textarea',
    section: 'history',
    priority: 'important',
    placeholder: 'Significant historical events',
    aiPrompt: 'Detail important events that shaped this location\'s development'
  },
  {
    key: 'legends',
    label: 'Legends & Myths',
    type: 'textarea',
    section: 'history',
    priority: 'optional',
    placeholder: 'Local legends and mythical stories',
    aiPrompt: 'Create legends and myths associated with this location'
  },

  // Story Section
  {
    key: 'significance',
    label: 'Story Significance',
    type: 'textarea',
    section: 'story',
    priority: 'important',
    placeholder: 'Importance to the story',
    aiPrompt: 'Explain why this location is important to the narrative'
  },
  {
    key: 'narrativeRole',
    label: 'Narrative Role',
    type: 'text',
    section: 'story',
    priority: 'important',
    placeholder: 'Role in the story structure',
    aiPrompt: 'Define this location\'s function in the story'
  },
  {
    key: 'scenes',
    label: 'Story Scenes',
    type: 'textarea',
    section: 'story',
    priority: 'optional',
    placeholder: 'Scenes that take place here',
    aiPrompt: 'Describe key scenes or events that happen at this location'
  },
  {
    key: 'mysteries',
    label: 'Mysteries & Secrets',
    type: 'textarea',
    section: 'story',
    priority: 'optional',
    placeholder: 'Hidden secrets and mysteries',
    aiPrompt: 'Create intriguing mysteries or secrets hidden in this location'
  }
];

// ================================
// FACTION FIELD CONFIGURATIONS
// ================================

// Faction sections with consistent organization
export const FACTION_SECTIONS = [
  {
    id: 'identity',
    title: 'Identity',
    description: 'Basic faction identification and classification',
    icon: 'Shield',
    order: 1
  },
  {
    id: 'purpose',
    title: 'Purpose',
    description: 'Goals, ideology, mission, and motivations',
    icon: 'Target',
    order: 2
  },
  {
    id: 'structure',
    title: 'Structure',
    description: 'Organization, hierarchy, and leadership',
    icon: 'Network',
    order: 3
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Methods, activities, and current operations',
    icon: 'Cog',
    order: 4
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Assets, strongholds, and capabilities',
    icon: 'Coins',
    order: 5
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Alliances, enemies, and external connections',
    icon: 'Users',
    order: 6
  },
  {
    id: 'history',
    title: 'History',
    description: 'Origin, past events, and development',
    icon: 'Scroll',
    order: 7
  },
  {
    id: 'story',
    title: 'Story',
    description: 'Narrative role and story significance',
    icon: 'BookText',
    order: 8
  }
] as const;

// Faction field definitions
export const FACTION_FIELD_DEFINITIONS: FieldDefinition[] = [
  // Identity Section
  {
    key: 'name',
    label: 'Faction Name',
    type: 'text',
    section: 'identity',
    required: true,
    priority: 'essential',
    placeholder: 'Name of the faction or organization',
    aiPrompt: 'Generate a compelling faction name that reflects their nature and purpose'
  },
  {
    key: 'type',
    label: 'Faction Type',
    type: 'select',
    section: 'identity',
    priority: 'essential',
    options: ['Military', 'Religious', 'Political', 'Criminal', 'Merchant', 'Academic', 'Secret Society', 'Cult', 'Guild', 'Noble House', 'Rebel Group', 'Other'],
    aiPrompt: 'Determine the most appropriate faction type'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    section: 'identity',
    priority: 'essential',
    placeholder: 'General description of the faction',
    aiPrompt: 'Write a compelling overview that captures the faction\'s essence and reputation'
  },
  {
    key: 'status',
    label: 'Current Status',
    type: 'select',
    section: 'identity',
    priority: 'important',
    options: ['Active', 'Disbanded', 'Hidden', 'Declining', 'Rising', 'Dormant', 'Reformed'],
    aiPrompt: 'Determine the faction\'s current operational status'
  },

  // Purpose Section
  {
    key: 'goals',
    label: 'Goals & Objectives',
    type: 'textarea',
    section: 'purpose',
    priority: 'essential',
    placeholder: 'Primary goals and objectives',
    aiPrompt: 'Define clear, compelling goals that drive the faction\'s actions'
  },
  {
    key: 'ideology',
    label: 'Ideology',
    type: 'textarea',
    section: 'purpose',
    priority: 'essential',
    placeholder: 'Core beliefs and ideology',
    aiPrompt: 'Describe the belief system and values that unite the faction'
  },
  {
    key: 'methods',
    label: 'Methods',
    type: 'textarea',
    section: 'purpose',
    priority: 'important',
    placeholder: 'How they pursue their goals',
    aiPrompt: 'Detail the methods and approaches they use to achieve their objectives'
  },
  {
    key: 'recruitment',
    label: 'Recruitment',
    type: 'textarea',
    section: 'purpose',
    priority: 'important',
    placeholder: 'How they recruit new members',
    aiPrompt: 'Describe their recruitment methods and what they look for in members'
  },

  // Structure Section
  {
    key: 'leadership',
    label: 'Leadership',
    type: 'textarea',
    section: 'structure',
    priority: 'essential',
    placeholder: 'Leadership structure and key figures',
    aiPrompt: 'Detail the leadership hierarchy and key figures who run the faction'
  },
  {
    key: 'structure',
    label: 'Organization Structure',
    type: 'textarea',
    section: 'structure',
    priority: 'important',
    placeholder: 'Internal organization and hierarchy',
    aiPrompt: 'Describe how the faction is organized internally'
  },
  {
    key: 'key_figures',
    label: 'Key Figures',
    type: 'textarea',
    section: 'structure',
    priority: 'important',
    placeholder: 'Important members and their roles',
    aiPrompt: 'Identify important members and their roles within the faction'
  },

  // Operations Section
  {
    key: 'methods_detailed',
    label: 'Operational Methods',
    type: 'textarea',
    section: 'operations',
    priority: 'important',
    placeholder: 'Detailed operational methods',
    aiPrompt: 'Explain their detailed operational methods and tactics'
  },
  {
    key: 'current_operations',
    label: 'Current Operations',
    type: 'textarea',
    section: 'operations',
    priority: 'important',
    placeholder: 'Ongoing activities and operations',
    aiPrompt: 'Describe their current activities and ongoing operations'
  },
  {
    key: 'threat_level',
    label: 'Threat Level',
    type: 'select',
    section: 'operations',
    priority: 'important',
    options: ['Minimal', 'Low', 'Moderate', 'High', 'Extreme', 'Unknown'],
    aiPrompt: 'Assess the threat level this faction poses'
  },

  // Resources Section
  {
    key: 'resources',
    label: 'Resources',
    type: 'textarea',
    section: 'resources',
    priority: 'important',
    placeholder: 'Available resources and assets',
    aiPrompt: 'Detail the resources and assets at the faction\'s disposal'
  },
  {
    key: 'strongholds',
    label: 'Strongholds',
    type: 'textarea',
    section: 'resources',
    priority: 'important',
    placeholder: 'Bases, strongholds, and territories',
    aiPrompt: 'Describe their bases, strongholds, and controlled territories'
  },
  {
    key: 'weaknesses',
    label: 'Weaknesses',
    type: 'textarea',
    section: 'resources',
    priority: 'important',
    placeholder: 'Vulnerabilities and weaknesses',
    aiPrompt: 'Identify key weaknesses and vulnerabilities that could be exploited'
  },

  // Relationships Section
  {
    key: 'relationships',
    label: 'External Relationships',
    type: 'textarea',
    section: 'relationships',
    priority: 'important',
    placeholder: 'Relationships with other factions',
    aiPrompt: 'Describe relationships with other factions and organizations'
  },

  // History Section
  {
    key: 'history',
    label: 'History',
    type: 'textarea',
    section: 'history',
    priority: 'important',
    placeholder: 'Historical background and development',
    aiPrompt: 'Create a compelling history that explains the faction\'s origins and development'
  },
  {
    key: 'origin_story',
    label: 'Origin Story',
    type: 'textarea',
    section: 'history',
    priority: 'important',
    placeholder: 'How the faction was founded',
    aiPrompt: 'Tell the story of how and why this faction was founded'
  },

  // Story Section - Placeholder for narrative elements
  {
    key: 'corruption_techniques',
    label: 'Story Role',
    type: 'textarea',
    section: 'story',
    priority: 'optional',
    placeholder: 'Role in the narrative',
    aiPrompt: 'Define this faction\'s role and importance in the story'
  }
];

// ================================
// ITEM FIELD CONFIGURATIONS
// ================================

// Item sections with consistent organization
export const ITEM_SECTIONS = [
  {
    id: 'identity',
    title: 'Identity',
    description: 'Basic item identification and classification',
    icon: 'Package',
    order: 1
  },
  {
    id: 'properties',
    title: 'Properties',
    description: 'Physical characteristics and properties',
    icon: 'Settings',
    order: 2
  },
  {
    id: 'abilities',
    title: 'Abilities',
    description: 'Powers, magical properties, and special abilities',
    icon: 'Zap',
    order: 3
  },
  {
    id: 'ownership',
    title: 'Ownership',
    description: 'Current owner, origin, and possession history',
    icon: 'User',
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
    description: 'Narrative role and story significance',
    icon: 'BookText',
    order: 6
  }
] as const;

// Item field definitions
export const ITEM_FIELD_DEFINITIONS: FieldDefinition[] = [
  // Identity Section
  {
    key: 'name',
    label: 'Item Name',
    type: 'text',
    section: 'identity',
    required: true,
    priority: 'essential',
    placeholder: 'Name of the item',
    aiPrompt: 'Generate a memorable item name that reflects its nature and significance'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    section: 'identity',
    priority: 'essential',
    placeholder: 'General description of the item',
    aiPrompt: 'Write a compelling description that captures the item\'s appearance and essence'
  },

  // Properties Section - Using basic schema since items table is simple
  {
    key: 'powers',
    label: 'Powers & Abilities',
    type: 'textarea',
    section: 'abilities',
    priority: 'important',
    placeholder: 'Magical or special abilities',
    aiPrompt: 'Detail any special powers or magical abilities this item possesses'
  },

  // History Section
  {
    key: 'history',
    label: 'History',
    type: 'textarea',
    section: 'history',
    priority: 'important',
    placeholder: 'Historical background and past',
    aiPrompt: 'Create a rich history explaining the item\'s origin and past significance'
  },

  // Story Section
  {
    key: 'significance',
    label: 'Story Significance',
    type: 'textarea',
    section: 'story',
    priority: 'important',
    placeholder: 'Importance to the story',
    aiPrompt: 'Explain why this item is important to the narrative and characters'
  }
];

// ================================
// HELPER FUNCTIONS FOR ALL ENTITIES
// ================================

// Helper functions for locations
export function getLocationFieldDefinition(key: string): FieldDefinition | undefined {
  return LOCATION_FIELD_DEFINITIONS.find(field => field.key === key);
}

export function getLocationFieldsBySection(sectionId: string): FieldDefinition[] {
  return LOCATION_FIELD_DEFINITIONS.filter(field => field.section === sectionId);
}

export function getLocationSectionById(id: string) {
  return LOCATION_SECTIONS.find(section => section.id === id);
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
export function getFieldDefinitionsByEntityType(entityType: 'character' | 'location' | 'faction' | 'item'): FieldDefinition[] {
  switch (entityType) {
    case 'character':
      return FIELD_DEFINITIONS;
    case 'location':
      return LOCATION_FIELD_DEFINITIONS;
    case 'faction':
      return FACTION_FIELD_DEFINITIONS;
    case 'item':
      return ITEM_FIELD_DEFINITIONS;
    default:
      return [];
  }
}

// Generic helper function to get sections by entity type
export function getSectionsByEntityType(entityType: 'character' | 'location' | 'faction' | 'item') {
  switch (entityType) {
    case 'character':
      return CHARACTER_SECTIONS;
    case 'location':
      return LOCATION_SECTIONS;
    case 'faction':
      return FACTION_SECTIONS;
    case 'item':
      return ITEM_SECTIONS;
    default:
      return [];
  }
}