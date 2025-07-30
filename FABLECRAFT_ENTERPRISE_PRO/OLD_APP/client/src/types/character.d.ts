/**
 * FABLECRAFT CHARACTER TYPE DEFINITION
 * 
 * This interface defines the complete character data structure used throughout the application.
 * It serves as the single source of truth for:
 * - Wizard input fields (CharacterGuidedCreationUnified)
 * - Display components (CharacterUnifiedViewPremium)
 * - API data transfer
 * - State management
 */

export interface Character {
  // System fields
  id: string;
  projectId: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;

  // ===== IDENTITY SECTION =====
  name?: string;                    // Full Name
  nicknames?: string;               // Nicknames
  pronouns?: string;                // Pronouns
  age?: string;                     // Age
  species?: string;                 // Species/Race
  gender?: string;                  // Gender Identity
  occupation?: string;              // Occupation
  title?: string;                   // Title/Rank
  birthdate?: string;               // Birth Date
  birthplace?: string;              // Birthplace
  currentLocation?: string;         // Current Location
  nationality?: string;             // Nationality

  // ===== APPEARANCE SECTION =====
  height?: string;                  // Height
  weight?: string;                  // Weight/Build
  bodyType?: string;                // Body Type
  hairColor?: string;               // Hair Color
  hairStyle?: string;               // Hair Style
  hairTexture?: string;             // Hair Texture
  eyeColor?: string;                // Eye Color
  eyeShape?: string;                // Eye Shape
  skinTone?: string;                // Skin Tone
  facialFeatures?: string;          // Facial Features
  physicalFeatures?: string;        // Physical Features
  scarsMarkings?: string;           // Scars & Markings
  clothing?: string;                // Typical Clothing
  accessories?: string;             // Accessories
  generalAppearance?: string;       // General Appearance

  // ===== PERSONALITY SECTION =====
  personalityTraits?: string[];     // Personality Traits
  positiveTraits?: string[];        // Positive Traits
  negativeTraits?: string[];        // Flaws and weaknesses
  quirks?: string[];                // Quirks & Habits
  mannerisms?: string;              // Mannerisms
  temperament?: string;             // Temperament
  emotionalState?: string;          // Emotional State
  sense_of_humor?: string;          // Sense of Humor
  speech_patterns?: string;         // Speech Patterns

  // ===== PSYCHOLOGY SECTION =====
  intelligence?: string;            // Intelligence
  education?: string;               // Education
  mentalHealth?: string;            // Mental Health
  phobias?: string[];               // Phobias & Fears
  motivations?: string[];           // Motivations
  goals?: string[];                 // Goals & Ambitions
  desires?: string[];               // Desires
  regrets?: string[];               // Regrets
  secrets?: string[];               // Secrets
  moral_code?: string;              // Moral Code
  worldview?: string;               // Worldview
  philosophy?: string;              // Philosophy

  // ===== ABILITIES SECTION =====
  skills?: string[];                // Skills
  talents?: string[];               // Natural Talents
  powers?: string[];                // Special Powers
  weaknesses?: string[];            // Weaknesses
  strengths?: string[];             // Strengths
  combat_skills?: string[];         // Combat Skills
  magical_abilities?: string[];     // Magical Abilities
  languages?: string[];             // Languages
  hobbies?: string[];               // Hobbies & Interests

  // ===== BACKGROUND SECTION =====
  backstory?: string;               // Backstory
  childhood?: string;               // Childhood
  formative_events?: string[];      // Formative Events
  trauma?: string;                  // Trauma
  achievements?: string[];          // Achievements
  failures?: string[];              // Failures
  education_background?: string;    // Educational Background
  work_history?: string;            // Work History
  military_service?: string;        // Military Service
  criminal_record?: string;         // Criminal Record

  // ===== RELATIONSHIPS SECTION =====
  family?: string[];                // Family
  friends?: string[];               // Friends
  enemies?: string[];               // Enemies
  allies?: string[];                // Allies
  mentors?: string[];               // Mentors
  romantic_interests?: string[];    // Romantic Interests
  relationship_status?: string;     // Relationship Status
  social_connections?: string[];    // Social Connections
  children?: string[];              // Children
  pets?: string[];                  // Pets

  // ===== CULTURAL SECTION =====
  culture?: string;                 // Cultural Background
  religion?: string;                // Religion/Beliefs
  traditions?: string[];            // Traditions
  values?: string[];                // Values
  customs?: string[];               // Customs
  social_class?: string;            // Social Class
  political_views?: string;         // Political Views
  economic_status?: string;         // Economic Status

  // ===== STORY ROLE SECTION =====
  role?: 'Protagonist' | 'Antagonist' | 'Supporting Character' | 'Side Character' | 'Background Character';
  character_arc?: string;           // Character Arc
  narrative_function?: string;      // Narrative Function
  story_importance?: 'Critical' | 'Important' | 'Moderate' | 'Minor';
  first_appearance?: string;        // First Appearance
  last_appearance?: string;         // Last Appearance
  character_growth?: string;        // Character Growth
  internal_conflict?: string;       // Internal Conflict
  external_conflict?: string;       // External Conflict

  // ===== META INFORMATION SECTION =====
  inspiration?: string;             // Inspiration
  creation_notes?: string;          // Creation Notes
  character_concept?: string;       // Character Concept
  design_notes?: string;            // Design Notes
  voice_notes?: string;             // Voice Notes
  themes?: string[];                // Associated Themes
  symbolism?: string;               // Symbolism
  author_notes?: string;            // Author Notes

  // Legacy fields for backward compatibility
  description?: string;
  personality?: string;
  appearance?: string;
  background?: string;
  relationships?: CharacterRelationship[];
}

export interface CharacterRelationship {
  id: string;
  type: string;
  description: string;
  characterId?: string;
  characterName?: string;
}

/**
 * CHARACTER FIELD CATEGORIES
 * 
 * This maps the sections in the wizard to their corresponding field keys
 */
export const CHARACTER_FIELD_CATEGORIES = {
  identity: [
    'name', 'nicknames', 'pronouns', 'age', 'species', 'gender', 
    'occupation', 'title', 'birthdate', 'birthplace', 'currentLocation', 'nationality'
  ],
  appearance: [
    'height', 'weight', 'bodyType', 'hairColor', 'hairStyle', 'hairTexture',
    'eyeColor', 'eyeShape', 'skinTone', 'facialFeatures', 'physicalFeatures',
    'scarsMarkings', 'clothing', 'accessories', 'generalAppearance'
  ],
  personality: [
    'personalityTraits', 'positiveTraits', 'negativeTraits', 'quirks',
    'mannerisms', 'temperament', 'emotionalState', 'sense_of_humor', 'speech_patterns'
  ],
  psychology: [
    'intelligence', 'education', 'mentalHealth', 'phobias', 'motivations',
    'goals', 'desires', 'regrets', 'secrets', 'moral_code', 'worldview', 'philosophy'
  ],
  abilities: [
    'skills', 'talents', 'powers', 'weaknesses', 'strengths',
    'combat_skills', 'magical_abilities', 'languages', 'hobbies'
  ],
  background: [
    'backstory', 'childhood', 'formative_events', 'trauma', 'achievements',
    'failures', 'education_background', 'work_history', 'military_service', 'criminal_record'
  ],
  relationships: [
    'family', 'friends', 'enemies', 'allies', 'mentors', 'romantic_interests',
    'relationship_status', 'social_connections', 'children', 'pets'
  ],
  cultural: [
    'culture', 'religion', 'traditions', 'values', 'customs',
    'social_class', 'political_views', 'economic_status'
  ],
  story_role: [
    'role', 'character_arc', 'narrative_function', 'story_importance',
    'first_appearance', 'last_appearance', 'character_growth', 'internal_conflict', 'external_conflict'
  ],
  meta: [
    'inspiration', 'creation_notes', 'character_concept', 'design_notes',
    'voice_notes', 'themes', 'symbolism', 'author_notes'
  ]
} as const;

/**
 * FIELD DISPLAY LABELS
 * 
 * Human-readable labels for each field key
 */
export const CHARACTER_FIELD_LABELS: Record<string, string> = {
  // Identity
  name: 'Full Name',
  nicknames: 'Nicknames',
  pronouns: 'Pronouns',
  age: 'Age',
  species: 'Species/Race',
  gender: 'Gender Identity',
  occupation: 'Occupation',
  title: 'Title/Rank',
  birthdate: 'Birth Date',
  birthplace: 'Birthplace',
  currentLocation: 'Current Location',
  nationality: 'Nationality',

  // Appearance
  height: 'Height',
  weight: 'Weight/Build',
  bodyType: 'Body Type',
  hairColor: 'Hair Color',
  hairStyle: 'Hair Style',
  hairTexture: 'Hair Texture',
  eyeColor: 'Eye Color',
  eyeShape: 'Eye Shape',
  skinTone: 'Skin Tone',
  facialFeatures: 'Facial Features',
  physicalFeatures: 'Physical Features',
  scarsMarkings: 'Scars & Markings',
  clothing: 'Typical Clothing',
  accessories: 'Accessories',
  generalAppearance: 'General Appearance',

  // Personality
  personalityTraits: 'Personality Traits',
  positiveTraits: 'Positive Traits',
  negativeTraits: 'Negative Traits',
  quirks: 'Quirks & Habits',
  mannerisms: 'Mannerisms',
  temperament: 'Temperament',
  emotionalState: 'Emotional State',
  sense_of_humor: 'Sense of Humor',
  speech_patterns: 'Speech Patterns',

  // Psychology
  intelligence: 'Intelligence',
  education: 'Education',
  mentalHealth: 'Mental Health',
  phobias: 'Phobias & Fears',
  motivations: 'Motivations',
  goals: 'Goals & Ambitions',
  desires: 'Desires',
  regrets: 'Regrets',
  secrets: 'Secrets',
  moral_code: 'Moral Code',
  worldview: 'Worldview',
  philosophy: 'Philosophy',

  // Abilities
  skills: 'Skills',
  talents: 'Natural Talents',
  powers: 'Special Powers',
  weaknesses: 'Weaknesses',
  strengths: 'Strengths',
  combat_skills: 'Combat Skills',
  magical_abilities: 'Magical Abilities',
  languages: 'Languages',
  hobbies: 'Hobbies & Interests',

  // Background
  backstory: 'Backstory',
  childhood: 'Childhood',
  formative_events: 'Formative Events',
  trauma: 'Trauma',
  achievements: 'Achievements',
  failures: 'Failures',
  education_background: 'Educational Background',
  work_history: 'Work History',
  military_service: 'Military Service',
  criminal_record: 'Criminal Record',

  // Relationships
  family: 'Family',
  friends: 'Friends',
  enemies: 'Enemies',
  allies: 'Allies',
  mentors: 'Mentors',
  romantic_interests: 'Romantic Interests',
  relationship_status: 'Relationship Status',
  social_connections: 'Social Connections',
  children: 'Children',
  pets: 'Pets',

  // Cultural
  culture: 'Cultural Background',
  religion: 'Religion/Beliefs',
  traditions: 'Traditions',
  values: 'Values',
  customs: 'Customs',
  social_class: 'Social Class',
  political_views: 'Political Views',
  economic_status: 'Economic Status',

  // Story Role
  role: 'Story Role',
  character_arc: 'Character Arc',
  narrative_function: 'Narrative Function',
  story_importance: 'Story Importance',
  first_appearance: 'First Appearance',
  last_appearance: 'Last Appearance',
  character_growth: 'Character Growth',
  internal_conflict: 'Internal Conflict',
  external_conflict: 'External Conflict',

  // Meta
  inspiration: 'Inspiration',
  creation_notes: 'Creation Notes',
  character_concept: 'Character Concept',
  design_notes: 'Design Notes',
  voice_notes: 'Voice Notes',
  themes: 'Associated Themes',
  symbolism: 'Symbolism',
  author_notes: 'Author Notes'
};