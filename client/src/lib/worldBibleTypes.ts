/**
 * World Bible Entity Types
 * Comprehensive type definitions for all world-building categories
 * Each entity type mirrors the complexity of the character system (164+ fields)
 */

// Base entity interface shared by all world bible entities
export interface BaseWorldEntity {
  id: string;
  projectId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date | null;
  tags?: string[];
  imageUrl?: string;
  portraits?: Array<{id: string, url: string, isMain: boolean}>;
  notes?: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'in-progress' | 'complete' | 'archived';
}

// LOCATIONS - Geographic and architectural entities
export interface Location extends BaseWorldEntity {
  // Geographic Properties
  locationType: 'city' | 'town' | 'village' | 'region' | 'country' | 'continent' | 'building' | 'landmark' | 'natural' | 'mystical';
  geography: string;
  climate: string;
  terrain: string;
  size: string;
  population: string;
  coordinates: string;
  
  // Cultural & Social
  culture: string;
  demographics: string;
  languages: string[];
  government: string;
  laws: string;
  customs: string;
  traditions: string;
  festivals: string;
  religion: string;
  
  // Economic & Resources  
  economy: string;
  resources: string[];
  trade: string;
  currency: string;
  wealth: string;
  industries: string[];
  
  // Historical Context
  history: string;
  foundingDate: string;
  founders: string[];
  historicalEvents: string[];
  legends: string;
  ruins: string;
  artifacts: string[];
  
  // Physical Features
  landmarks: string[];
  architecture: string;
  defenses: string;
  districts: string[];
  buildings: string[];
  infrastructure: string;
  transportation: string;
  
  // Relationships & Connections
  parentLocation: string;
  childLocations: string[];
  alliedLocations: string[];
  enemyLocations: string[];
  tradingPartners: string[];
  
  // Atmosphere & Mood
  atmosphere: string;
  mood: string;
  reputation: string;
  rumors: string;
  secrets: string;
  mysteries: string;
  
  // Practical Information
  travelTime: string;
  accessMethods: string[];
  dangers: string[];
  opportunities: string[];
  questHooks: string[];
  plotRelevance: string;
}

// TIMELINE - Chronological events and history
export interface TimelineEvent extends BaseWorldEntity {
  // Time & Date
  date: string;
  era: string;
  age: string;
  season: string;
  duration: string;
  timeOfDay: string;
  
  // Event Classification
  eventType: 'battle' | 'political' | 'natural' | 'magical' | 'social' | 'religious' | 'technological' | 'personal' | 'prophetic';
  magnitude: 'local' | 'regional' | 'national' | 'continental' | 'global' | 'cosmic';
  category: string;
  
  // Participants & Involved Parties
  characters: string[];
  locations: string[];
  factions: string[];
  witnesses: string[];
  casualties: string[];
  beneficiaries: string[];
  
  // Causal Relationships
  causes: string[];
  prerequisites: string[];
  consequences: string[];
  followupEvents: string[];
  relatedEvents: string[];
  
  // Detailed Information
  summary: string;
  detailedAccount: string;
  alternateVersions: string[];
  sources: string[];
  reliability: 'confirmed' | 'likely' | 'disputed' | 'legendary' | 'mythical';
  
  // Impact & Legacy
  immediateEffects: string[];
  longTermEffects: string[];
  culturalImpact: string;
  politicalImpact: string;
  economicImpact: string;
  socialImpact: string;
  
  // Narrative Function
  plotRelevance: string;
  foreshadowing: string[];
  symbolism: string;
  themes: string[];
  characterArcs: string[];
}

// FACTIONS - Organizations, groups, and institutions
export interface Faction extends BaseWorldEntity {
  // Basic Organization
  factionType: 'guild' | 'religion' | 'military' | 'political' | 'mercantile' | 'criminal' | 'scholarly' | 'mystical' | 'family' | 'tribe';
  structure: 'hierarchical' | 'democratic' | 'oligarchy' | 'collective' | 'tribal' | 'feudal' | 'military' | 'religious';
  size: 'tiny' | 'small' | 'medium' | 'large' | 'massive' | 'continental';
  
  // Leadership & Members
  leader: string;
  founders: string[];
  keyMembers: string[];
  totalMembers: string;
  membershipRequirements: string;
  ranks: string[];
  hierarchy: string;
  
  // Purpose & Goals
  mission: string;
  goals: string[];
  objectives: string[];
  methods: string[];
  philosophy: string;
  values: string[];
  beliefs: string;
  code: string;
  
  // Resources & Power
  wealth: string;
  territory: string[];
  assets: string[];
  resources: string[];
  influence: string;
  power: string;
  reputation: string;
  
  // Operations & Activities
  activities: string[];
  operations: string[];
  services: string[];
  products: string[];
  specialties: string[];
  capabilities: string[];
  
  // History & Background
  foundingDate: string;
  foundingStory: string;
  majorEvents: string[];
  achievements: string[];
  failures: string[];
  scandals: string[];
  
  // Relationships
  allies: string[];
  enemies: string[];
  rivals: string[];
  clients: string[];
  suppliers: string[];
  neutralFactions: string[];
  
  // Internal Dynamics
  culture: string;
  traditions: string[];
  customs: string[];
  rituals: string[];
  symbols: string[];
  colors: string[];
  uniforms: string;
  
  // Plot Integration
  plotRole: string;
  questGivers: string[];
  questTargets: string[];
  conflictPotential: string;
  storyArcs: string[];
}

// ITEMS/ARTIFACTS - Objects of significance
export interface Item extends BaseWorldEntity {
  // Classification
  itemType: 'weapon' | 'armor' | 'tool' | 'jewelry' | 'book' | 'artifact' | 'relic' | 'consumable' | 'container' | 'vehicle';
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique' | 'mythical';
  
  // Physical Properties
  material: string[];
  weight: string;
  size: string;
  durability: string;
  condition: string;
  age: string;
  appearance: string;
  
  // Magical/Special Properties
  magical: boolean;
  powers: string[];
  abilities: string[];
  effects: string[];
  limitations: string[];
  requirements: string[];
  drawbacks: string[];
  
  // Creation & Origin
  creator: string;
  craftingMethod: string;
  creationDate: string;
  materials: string[];
  creationStory: string;
  purpose: string;
  
  // Historical Context
  history: string;
  previousOwners: string[];
  significantEvents: string[];
  battles: string[];
  legends: string[];
  myths: string[];
  
  // Current Status
  currentOwner: string;
  location: string;
  guardians: string[];
  seekers: string[];
  knownCopies: string[];
  status: string;
  
  // Value & Economics
  value: string;
  cost: string;
  availability: string;
  marketDemand: string;
  tradingHistory: string[];
  
  // Usage & Function
  uses: string[];
  instructions: string;
  warnings: string[];
  maintenance: string;
  fuel: string;
  ammunition: string;
  
  // Plot Significance
  questItem: boolean;
  questRelevance: string;
  plotFunction: string;
  macguffin: boolean;
  symbolism: string;
  themes: string[];
}

// MAGIC & LORE - Magical systems and supernatural elements
export interface MagicSystem extends BaseWorldEntity {
  // System Classification
  systemType: 'arcane' | 'divine' | 'primal' | 'psionic' | 'elemental' | 'blood' | 'shadow' | 'light' | 'death' | 'life';
  source: 'internal' | 'external' | 'divine' | 'natural' | 'learned' | 'inherited' | 'artifact-based';
  
  // Fundamental Rules
  principles: string[];
  laws: string[];
  limitations: string[];
  restrictions: string[];
  costs: string[];
  consequences: string[];
  
  // Practitioners & Users
  practitioners: string[];
  schools: string[];
  traditions: string[];
  orders: string[];
  forbidden: string[];
  commonUsers: string[];
  
  // Manifestations & Effects
  spells: string[];
  rituals: string[];
  effects: string[];
  manifestations: string[];
  components: string[];
  gestures: string[];
  
  // Learning & Development
  learningMethods: string[];
  requirements: string[];
  training: string;
  advancement: string[];
  mastery: string[];
  dangers: string[];
  
  // Cultural Integration
  acceptance: 'forbidden' | 'feared' | 'tolerated' | 'accepted' | 'revered' | 'commonplace';
  regulation: string;
  institutions: string[];
  guilds: string[];
  laws: string[];
  
  // History & Evolution
  origins: string;
  discovery: string;
  evolution: string[];
  majorEvents: string[];
  wars: string[];
  golden_ages: string[];
  
  // Theoretical Framework
  theory: string;
  philosophy: string;
  branches: string[];
  schools_of_thought: string[];
  debates: string[];
  mysteries: string[];
  
  // Plot Integration
  plot_relevance: string;
  character_connections: string[];
  conflict_potential: string;
  quest_hooks: string[];
  macguffins: string[];
}

// BESTIARY - Creatures and species
export interface Creature extends BaseWorldEntity {
  // Biological Classification
  species: string;
  subspecies: string;
  genus: string;
  family: string;
  category: 'beast' | 'humanoid' | 'dragon' | 'undead' | 'construct' | 'elemental' | 'fey' | 'fiend' | 'celestial' | 'aberration';
  
  // Physical Characteristics
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
  height: string;
  weight: string;
  lifespan: string;
  appearance: string;
  anatomy: string;
  distinguishing_features: string[];
  
  // Abilities & Powers
  abilities: string[];
  special_abilities: string[];
  magical_abilities: string[];
  resistances: string[];
  immunities: string[];
  weaknesses: string[];
  
  // Behavior & Psychology
  intelligence: 'animal' | 'low' | 'average' | 'high' | 'genius' | 'cosmic';
  temperament: string;
  behavior: string;
  social_structure: string;
  communication: string[];
  languages: string[];
  
  // Habitat & Ecology
  habitat: string[];
  climate: string[];
  territory: string;
  migration: string;
  diet: string[];
  predators: string[];
  prey: string[];
  
  // Reproduction & Life Cycle
  reproduction: string;
  mating: string;
  gestation: string;
  offspring: string;
  maturation: string;
  lifecycle: string[];
  
  // Cultural Significance
  cultural_role: string[];
  mythology: string[];
  legends: string[];
  folklore: string[];
  symbolism: string[];
  religious_significance: string;
  
  // Interaction with Civilization
  domestication: string;
  uses: string[];
  products: string[];
  threats: string[];
  benefits: string[];
  relationship: 'hostile' | 'neutral' | 'peaceful' | 'domesticated' | 'worshipped' | 'feared';
  
  // Conservation & Rarity
  population: string;
  distribution: string[];
  rarity: 'extinct' | 'nearly extinct' | 'rare' | 'uncommon' | 'common' | 'abundant';
  threats: string[];
  conservation: string;
  
  // Plot Integration
  encounter_likelihood: string;
  threat_level: string;
  quest_relevance: string[];
  story_role: string;
  character_connections: string[];
}

// LANGUAGES - Communication systems
export interface Language extends BaseWorldEntity {
  // Classification
  language_family: string;
  language_type: 'spoken' | 'signed' | 'telepathic' | 'written_only' | 'magical' | 'dead' | 'constructed';
  script: string;
  
  // Speakers & Demographics
  native_speakers: string;
  total_speakers: string;
  speaker_locations: string[];
  speaker_races: string[];
  social_classes: string[];
  
  // Linguistic Properties
  phonology: string;
  grammar: string;
  syntax: string;
  morphology: string;
  vocabulary_size: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'extremely_complex';
  
  // Writing System
  writing_system: string;
  alphabet: string[];
  writing_direction: string;
  punctuation: string[];
  numerals: string[];
  
  // Historical Development
  origin: string;
  evolution: string[];
  influences: string[];
  borrowings: string[];
  historical_changes: string[];
  
  // Dialects & Variants
  dialects: string[];
  regional_variants: string[];
  social_variants: string[];
  formal_registers: string[];
  informal_registers: string[];
  
  // Cultural Context
  cultural_significance: string;
  literature: string[];
  oral_traditions: string[];
  ceremonies: string[];
  sacred_uses: string;
  taboos: string[];
  
  // Learning & Education
  difficulty: 'trivial' | 'easy' | 'moderate' | 'hard' | 'extremely_hard';
  learning_time: string;
  teaching_methods: string[];
  schools: string[];
  texts: string[];
  
  // Modern Status
  vitality: 'thriving' | 'stable' | 'declining' | 'endangered' | 'dormant' | 'extinct';
  official_status: string;
  literary_status: string;
  trade_status: string;
  preservation_efforts: string[];
  
  // Plot Integration
  code_potential: boolean;
  ancient_knowledge: string[];
  magical_uses: string[];
  diplomatic_importance: string;
  quest_relevance: string[];
}

// CULTURES - Societies and civilizations
export interface Culture extends BaseWorldEntity {
  // Basic Classification
  culture_type: 'tribal' | 'feudal' | 'urban' | 'nomadic' | 'agricultural' | 'industrial' | 'magical' | 'theocratic' | 'military' | 'scholarly';
  population_size: string;
  geographic_range: string[];
  
  // Social Structure
  social_hierarchy: string;
  class_system: string[];
  mobility: string;
  family_structure: string;
  gender_roles: string;
  age_roles: string;
  
  // Beliefs & Values
  worldview: string;
  core_values: string[];
  beliefs: string[];
  taboos: string[];
  superstitions: string[];
  philosophy: string;
  
  // Religion & Spirituality
  religious_system: string;
  deities: string[];
  religious_practices: string[];
  clergy: string;
  sacred_sites: string[];
  afterlife_beliefs: string;
  
  // Customs & Traditions
  customs: string[];
  traditions: string[];
  ceremonies: string[];
  festivals: string[];
  rites_of_passage: string[];
  hospitality: string;
  
  // Arts & Expression
  art_forms: string[];
  music: string[];
  literature: string[];
  architecture: string[];
  crafts: string[];
  performance: string[];
  
  // Daily Life
  daily_routine: string;
  work_culture: string;
  leisure_activities: string[];
  food_culture: string;
  clothing: string;
  housing: string;
  
  // Education & Knowledge
  education_system: string;
  literacy_rate: string;
  knowledge_transmission: string;
  scholarship: string[];
  libraries: string[];
  schools: string[];
  
  // Technology & Innovation
  technology_level: string;
  innovations: string[];
  tools: string[];
  weapons: string[];
  transportation: string[];
  communication: string[];
  
  // Economics & Trade
  economic_system: string;
  primary_industries: string[];
  trade_goods: string[];
  currency: string;
  trade_partners: string[];
  economic_status: string;
  
  // Politics & Governance
  government_type: string;
  leadership: string;
  laws: string[];
  justice_system: string;
  military: string;
  diplomacy: string;
  
  // External Relations
  allies: string[];
  enemies: string[];
  neutral_relations: string[];
  cultural_exchange: string[];
  conflicts: string[];
  
  // Historical Context
  origins: string;
  major_periods: string[];
  golden_ages: string[];
  dark_periods: string[];
  migrations: string[];
  
  // Plot Integration
  character_origins: string[];
  conflict_sources: string[];
  adventure_hooks: string[];
  cultural_challenges: string[];
  story_themes: string[];
}

// PROPHECIES - Predictions and oracles
export interface Prophecy extends BaseWorldEntity {
  // Classification
  prophecy_type: 'divine' | 'magical' | 'natural' | 'technological' | 'inherited' | 'scholarly' | 'cursed';
  scope: 'personal' | 'local' | 'regional' | 'national' | 'global' | 'cosmic' | 'temporal';
  
  // Content & Text
  original_text: string;
  translation: string;
  interpretations: string[];
  hidden_meanings: string[];
  symbolism: string[];
  metaphors: string[];
  
  // Origin & Source
  prophet: string;
  oracle: string;
  divine_source: string;
  circumstances: string;
  revelation_date: string;
  witnesses: string[];
  
  // Prophecy Details
  subject: string[];
  predicted_events: string[];
  timeline: string;
  conditions: string[];
  triggers: string[];
  signs: string[];
  
  // Interpretation & Understanding
  clarity: 'crystal_clear' | 'clear' | 'ambiguous' | 'cryptic' | 'incomprehensible';
  scholars: string[];
  interpretations: string[];
  schools_of_thought: string[];
  debates: string[];
  
  // Fulfillment Status
  fulfillment_status: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'failed' | 'impossible' | 'misinterpreted';
  fulfilled_parts: string[];
  remaining_parts: string[];
  failed_parts: string[];
  
  // Historical Impact
  belief_level: 'universally_accepted' | 'widely_believed' | 'contested' | 'minority_belief' | 'rejected' | 'forgotten';
  historical_influence: string[];
  wars_caused: string[];
  movements_inspired: string[];
  decisions_influenced: string[];
  
  // Cultural Reception
  cultural_impact: string;
  religious_significance: string;
  political_implications: string[];
  social_effects: string[];
  popular_culture: string[];
  
  // Related Elements
  connected_prophecies: string[];
  contradicting_prophecies: string[];
  supporting_omens: string[];
  related_artifacts: string[];
  prophetic_bloodlines: string[];
  
  // Plot Integration
  plot_relevance: string;
  character_destinies: string[];
  quest_objectives: string[];
  story_climax: boolean;
  narrative_tension: string;
  
  // Mechanical Elements
  self_fulfilling: boolean;
  paradox_potential: boolean;
  alterable: boolean;
  avoidance_attempts: string[];
  consequences_of_prevention: string[];
}

// THEMES/META - Narrative and symbolic elements
export interface Theme extends BaseWorldEntity {
  // Classification
  theme_type: 'universal' | 'cultural' | 'personal' | 'political' | 'philosophical' | 'moral' | 'spiritual' | 'psychological';
  narrative_level: 'surface' | 'subtext' | 'deep_structure' | 'archetypal' | 'metaphysical';
  
  // Core Concept
  central_idea: string;
  statement: string;
  question: string;
  conflict: string;
  resolution: string;
  
  // Manifestations
  symbols: string[];
  motifs: string[];
  metaphors: string[];
  allegories: string[];
  archetypes: string[];
  
  // Character Integration
  protagonist_connection: string;
  antagonist_connection: string;
  supporting_characters: string[];
  character_arcs: string[];
  internal_conflicts: string[];
  
  // Plot Integration
  inciting_incident: string;
  rising_action: string[];
  climax: string;
  falling_action: string[];
  resolution: string;
  
  // World Building Connection
  setting_reflection: string;
  cultural_embodiment: string[];
  historical_examples: string[];
  institutional_representation: string[];
  environmental_symbolism: string[];
  
  // Philosophical Dimensions
  moral_questions: string[];
  ethical_dilemmas: string[];
  philosophical_positions: string[];
  contradictions: string[];
  paradoxes: string[];
  
  // Emotional Resonance
  emotional_core: string;
  audience_connection: string;
  catharsis: string;
  empathy_points: string[];
  fear_elements: string[];
  hope_elements: string[];
  
  // Literary Techniques
  foreshadowing: string[];
  irony: string[];
  juxtaposition: string[];
  parallelism: string[];
  repetition: string[];
  
  // Cultural Commentary
  social_critique: string;
  political_message: string;
  cultural_values: string[];
  contemporary_relevance: string;
  historical_parallels: string[];
  
  // Artistic Expression
  visual_representation: string[];
  musical_themes: string[];
  color_symbolism: string[];
  architectural_embodiment: string[];
  natural_symbolism: string[];
  
  // Reader Experience
  interpretation_levels: string[];
  discussion_points: string[];
  debate_topics: string[];
  emotional_journey: string;
  intellectual_engagement: string;
  
  // Meta-Narrative
  genre_conventions: string[];
  trope_subversion: string[];
  audience_expectations: string[];
  narrative_innovation: string[];
  intertextuality: string[];
}

// Union type for all world bible entities
export type WorldBibleEntity = Location | TimelineEvent | Faction | Item | MagicSystem | Creature | Language | Culture | Prophecy | Theme;

// Entity type mapping for configuration
export const WORLD_BIBLE_ENTITY_TYPES = {
  locations: 'Location',
  timeline: 'TimelineEvent', 
  factions: 'Faction',
  items: 'Item',
  magic: 'MagicSystem',
  bestiary: 'Creature',
  languages: 'Language',
  cultures: 'Culture',
  prophecies: 'Prophecy',
  themes: 'Theme'
} as const;

export type WorldBibleCategory = keyof typeof WORLD_BIBLE_ENTITY_TYPES;