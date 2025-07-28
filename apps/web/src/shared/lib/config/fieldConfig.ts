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
  {
    key: 'spokenLanguages',
    label: 'Spoken Languages',
    type: 'array',
    section: 'background',
    priority: 'important',
    placeholder: 'Languages they can speak',
    aiPrompt: 'List languages they speak based on their background and education'
  },
  {
    key: 'temperament',
    label: 'Temperament',
    type: 'select',
    section: 'personality',
    priority: 'important',
    options: [
      'Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Sanguine-Choleric', 'Sanguine-Phlegmatic',
      'Choleric-Sanguine', 'Choleric-Melancholic', 'Melancholic-Choleric', 'Melancholic-Phlegmatic',
      'Phlegmatic-Sanguine', 'Phlegmatic-Melancholic', 'Optimistic', 'Pessimistic', 'Realistic',
      'Idealistic', 'Cynical', 'Stoic', 'Emotional', 'Analytical', 'Intuitive', 'Impulsive',
      'Cautious', 'Adventurous', 'Reserved', 'Outgoing', 'Aggressive', 'Passive', 'Balanced'
    ],
    aiPrompt: 'Determine their natural temperament and emotional disposition'
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
    options: [
      'Protagonist', 'Antagonist', 'Deuteragonist', 'Tritagonist', 'Supporting Character', 
      'Comic Relief', 'Mentor', 'Love Interest', 'Sidekick', 'Rival', 'Anti-Hero', 'Anti-Villain',
      'Foil Character', 'Catalyst', 'Guardian', 'Threshold Guardian', 'Shapeshifter', 'Shadow',
      'Herald', 'Trickster', 'Innocent', 'Explorer', 'Sage', 'Hero', 'Outlaw', 'Magician',
      'Regular Guy/Girl', 'Lover', 'Jester', 'Caregiver', 'Creator', 'Ruler', 'Minor Character',
      'Background Character', 'Cameo', 'Narrator', 'Confidant', 'Red Herring', 'MacGuffin Guardian'
    ],
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