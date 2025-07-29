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

// LOCATIONS - Following Character structure (Identity, Appearance, etc.) + Bloomweaver content
export interface Location extends BaseWorldEntity {
  // IDENTITY (like Character Identity section)
  fullName: string;
  nicknames: string;
  title: string;
  aliases: string;
  locationType: string; // Garden of Expanse = Cosmic Nexus, Aethelburg = Capital City
  region: string; // Somnus Verdant, Lithosclerosis, etc.
  coordinates: string;
  
  // APPEARANCE (like Character Appearance section)  
  geography: string; // "Sprawling landmass, dense forests, winding rivers"
  terrain: string; // "Crystalline fungal growths mimicking mineral veins"
  size: string; // "Sprawling mystical grove"
  climate: string; // "Unnaturally vibrant, unsettlingly still"
  architecture: string; // "Ancient fortresses carved into mountainsides"
  landmarks: string; // "Colossal stone monuments, luminous spores"
  naturalFeatures: string; // "Jagged peaks, mist-shrouded gorges, deep valleys"
  districts: string; // "Trade districts, residential quarters, sacred groves"
  
  // PERSONALITY (like Character Personality section)
  atmosphere: string; // "Cloying sweetness induces quietude/apathy"
  mood: string; // "Melancholically worn, ancient grandeur"
  reputation: string; // "Heart of tragic beginning, place of cosmic horror"
  culturalTraits: string; // "Patient endurance, communal well-being"
  dominantEmotions: string; // "Longing, despair, unified solace"
  
  // ABILITIES (like Character Abilities section)
  magicalProperties: string; // "Dream Weaver Impact: Prophetic visions, cosmic truths"
  naturalResources: string; // "Luminous spores, psychic resins, arcane components"
  defenses: string; // "Stone fortifications, mystical barriers"
  specialPowers: string; // "Shared dreamscapes, reality distortion"
  influences: string; // "Bloom Impact: Subtle absorption of individual will"
  
  // BACKGROUND (like Character Background section)
  history: string; // Full historical narrative
  foundingDate: string; // "Primordial Era - Witch's Transformation"
  founders: string; // "Essylt (The Bloom), ancient civilizations"
  majorEvents: string; // "Flow of Magic origin, Cataclysm onset"
  legends: string; // Stories and myths
  ruins: string; // Ancient remnants
  artifacts: string; // Important objects
  
  // RELATIONSHIPS (like Character Relationships section)
  connectedCharacters: string; // "Essylt (The Bloom), Somnus (Dream Weaver)"
  alliedLocations: string; // Friendly or connected places
  enemyLocations: string; // Hostile or rival locations
  tradingPartners: string; // Economic connections
  politicalTies: string; // Governance relationships
  culturalConnections: string; // Shared traditions/customs
  
  // META (like Character Meta section)
  symbolism: string; // "Twisted love, overwhelming embrace, cosmic connection"
  themes: string; // "Monstrousness of Misguided Love, Unity vs Individuality"
  plotRelevance: string; // Story importance
  questHooks: string; // Adventure opportunities
  secrets: string; // Hidden information
  mysteries: string; // Unexplained elements
  
  // Additional Location-specific fields
  population: string;
  government: string;
  economy: string;
  religion: string;
}

// TIMELINE - Following Character structure + Bloomweaver historical events
export interface TimelineEvent extends BaseWorldEntity {
  // IDENTITY (like Character Identity section)
  fullName: string; // "The Bloom's Genesis", "Dream Weaver's Return"
  nicknames: string; // Common names for the event
  title: string; // "The Great Cataclysm", "Championship Catalyst"
  aliases: string; // Alternative names
  eventType: string; // "Cosmic transformation", "Political upheaval", "Mystical awakening"
  era: string; // "Primordial Era", "Age of Magic", "Cataclysm Onset"
  date: string; // Specific timing
  
  // APPEARANCE (like Character Appearance section) 
  manifestation: string; // How the event appeared/looked
  scale: string; // "Realm-wide", "Continental", "Local"
  duration: string; // "Instantaneous", "Years-long transformation"
  location: string; // Where it occurred
  witnesses: string; // Who saw it happen
  physicalSigns: string; // Observable changes
  atmosphere: string; // Environmental impact
  spectacle: string; // Visual/sensory aspects
  
  // PERSONALITY (like Character Personality section)
  nature: string; // "Desperate act of love", "Fanatical ideology"
  mood: string; // "Tragic inevitability", "Chaotic upheaval"
  tone: string; // "Melancholic", "Horrifying", "Hopeful"
  emotionalImpact: string; // Effect on people's feelings
  culturalMeaning: string; // Significance to societies
  
  // ABILITIES (like Character Abilities section)
  powers: string; // "Reality reshaping", "Consciousness merging"
  effects: string; // "Widespread magic ushered in"
  influence: string; // "Forced unity consciousness"
  capabilities: string; // What the event could do
  limitations: string; // What it couldn't accomplish
  
  // BACKGROUND (like Character Background section)
  history: string; // Full narrative of the event
  causes: string; // "Essylt's unbearable longing for Warlock"
  context: string; // Surrounding circumstances
  buildup: string; // Events leading to it
  catalysts: string; // Immediate triggers
  preparation: string; // What led up to it
  origins: string; // Root sources
  
  // RELATIONSHIPS (like Character Relationships section)
  keyCharacters: string; // "Essylt (Witch), Somnus (Warlock)"
  affectedLocations: string; // Places impacted
  involvedFactions: string; // Groups participating
  casualties: string; // Who was harmed
  beneficiaries: string; // Who gained from it
  witnesses: string; // Who observed
  
  // META (like Character Meta section)
  symbolism: string; // "Monstrousness of misguided love"
  themes: string; // "Love becomes destruction, cosmic heartbreak"
  plotRelevance: string; // Story importance
  consequences: string; // Long-term results
  legacy: string; // How it's remembered
  prophecies: string; // Predicted outcomes
  
  // Additional Timeline-specific fields
  magnitude: string; // Scope of impact
  followupEvents: string; // What happened next
}

// FACTIONS - Following Character structure + Bloomweaver groups (Cultists, Stone Lords, etc.)
export interface Faction extends BaseWorldEntity {  
  // IDENTITY (like Character Identity section)
  fullName: string; // "The Cultist Group", "Stone Lords Alliance"
  nicknames: string; // Common names
  title: string; // "Order of Absolute Control", "Champions of Stone"
  aliases: string; // Alternative names
  factionType: string; // "Fanatical religious order", "Ancient magical nobility"
  structure: string; // "Hierarchical cult", "Feudal stone-bound lords"
  rank: string; // Their standing/position in world
  
  // APPEARANCE (like Character Appearance section)
  symbols: string; // "Chaos-control sigils", "Stone monument crests"
  colors: string; // "Shadow and gold", "Earth tones and granite"
  uniforms: string; // "Hooded robes with geometric patterns"
  insignia: string; // Distinctive markings
  architecture: string; // "Geometric strongholds", "Monument fortresses"
  banners: string; // Visual identifiers
  aesthetic: string; // Overall visual theme
  presence: string; // How they appear to others
  
  // PERSONALITY (like Character Personality section)
  philosophy: string; // "Dream Weaver's chaos must be controlled"
  beliefs: string; // "Absolute order prevents suffering"
  values: string; // "Control, unity, prevention of chaos"
  temperament: string; // "Fanatical, organized, desperate"
  attitude: string; // "Ruthlessly convinced of righteousness"
  worldview: string; // How they see reality
  motivation: string; // Core driving forces
  
  // ABILITIES (like Character Abilities section)
  powers: string; // "Dream corruption, psychological manipulation"
  capabilities: string; // "Harnessing nightmare patterns"
  specialties: string; // "Reality control magic", "Stone essence infusion"
  resources: string; // "Cult network", "Ancient stone monuments"
  influence: string; // "Despair-driven recruitment", "Magical authority"
  methods: string; // How they operate
  
  // BACKGROUND (like Character Background section)
  history: string; // Full origin story
  foundingDate: string; // "Born from despair during Age of Magic"
  founders: string; // Original leaders/creators
  origins: string; // "Emerged from widespread futility and terror"
  majorEvents: string; // "Corruption of Dream Weaver, Cataclysm onset"
  pastAchievements: string; // Previous successes
  failures: string; // Past mistakes
  
  // RELATIONSHIPS (like Character Relationships section)
  allies: string; // Friendly factions
  enemies: string; // "The Bloom, Dream Weaver, Stone Lords"
  rivals: string; // Competing groups
  members: string; // Key individuals in faction
  leader: string; // "Cult leadership hierarchy"
  relationships: string; // Complex connections
  dependencies: string; // What they rely on
  
  // META (like Character Meta section)
  symbolism: string; // "Dangers of extremist order, tyrannical control"
  themes: string; // "Order vs Chaos critique, fanatical ideology"
  plotRelevance: string; // Story importance
  questHooks: string; // Adventure opportunities
  secrets: string; // Hidden information
  weaknesses: string; // Vulnerabilities
  
  // Additional Faction-specific fields
  size: string;
  territory: string;
  goals: string;
}

// ITEMS - Following Character structure + Bloomweaver artifacts (Stone monuments, Bloom spores, etc.)
export interface Item extends BaseWorldEntity {
  // IDENTITY (like Character Identity section)
  fullName: string; // "The Chronicler's Quill", "Stone Lord's Monument"
  nicknames: string; // Common names for the item
  title: string; // "Artifact of Memory", "Monument of Eternal Suffering"
  aliases: string; // Alternative names
  itemType: string; // "Cosmic artifact", "Memory tool", "Power focus"
  category: string; // "Recording instruments", "Magical monuments"
  rarity: string; // "Unique", "Legendary", "Common"
  
  // APPEARANCE (like Character Appearance section)
  physicalAppearance: string; // "Ethereal quill that phases between reality"
  material: string; // "Crystallized memory essence", "Living stone"
  size: string; // "Small hand tool", "Colossal monument"
  weight: string; // Physical heft
  condition: string; // Current state
  craftsmanship: string; // Quality of make
  decorations: string; // Artistic elements
  aura: string; // Visible magical presence
  
  // PERSONALITY (like Character Personality section)
  essence: string; // "Desperate need to record truth", "Echoes of ancient suffering"
  temperament: string; // "Melancholic yet determined", "Imposing and immutable"
  behavior: string; // How it acts/responds
  quirks: string; // Unusual characteristics
  mood: string; // Emotional resonance
  personality: string; // If sentient/semi-sentient
  
  // ABILITIES (like Character Abilities section)
  powers: string; // "Records events as they happen", "Stores essence of rulers"
  abilities: string; // "Phases through time to capture truth"
  effects: string; // "Reveals hidden histories", "Projects past agonies"
  capabilities: string; // What it can accomplish
  limitations: string; // "Cannot lie", "Cannot undo history"
  requirements: string; // "Requires witnessing suffering"
  activation: string; // How to use it
  
  // BACKGROUND (like Character Background section)
  history: string; // "Created by cosmic forces to document apocalypse"
  origin: string; // "Manifested from Dream Weaver's need for remembrance"
  creator: string; // "Unknown cosmic entity", "Ancient Stone Lord"
  creationDate: string; // When it was made
  purpose: string; // "Record the unfolding horror for future understanding"
  pastOwners: string; // Previous wielders
  significantEvents: string; // Important moments in its existence
  
  // RELATIONSHIPS (like Character Relationships section)
  currentOwner: string; // "Aris Vellum (Chronicler)"
  previousOwners: string; // Past wielders
  connectedItems: string; // Related artifacts
  affects: string; // Who/what it influences
  seekers: string; // Who wants it
  enemies: string; // Who opposes it
  guardians: string; // Who protects it
  
  // META (like Character Meta section)
  symbolism: string; // "Human need to record/understand suffering"
  themes: string; // "Burden of witnessing, defiance against oblivion"
  plotRelevance: string; // Story importance
  questHooks: string; // Adventure potential
  secrets: string; // Hidden properties
  curses: string; // Negative aspects
  
  // Additional Item-specific fields
  value: string;
  location: string;
  availability: string;
}

// MAGIC SYSTEM - Following Character structure + Bloomweaver magic (Dream Weaver, Bloom magic, etc.)
export interface MagicSystem extends BaseWorldEntity {
  // IDENTITY (like Character Identity section)
  fullName: string; // "The Flow of Magic", "Dream Weaver's Reality Shaping"
  nicknames: string; // Common terms
  title: string; // "Cosmic Emanation System", "Nightmare Manifestation"
  aliases: string; // Alternative names
  systemType: string; // "Consciousness-based reality control", "Sentient flora magic"
  source: string; // "Combined emanations of Bloom and Dream Weaver"
  classification: string; // Type of magical system
  
  // APPEARANCE (like Character Appearance section)
  manifestation: string; // "Shared dreamscapes, reality distortion"
  visualEffects: string; // "Bioluminescent fungi, psychic wisps"
  physicalSigns: string; // "Crystalline growths, ethereal mists"
  components: string; // "Luminous spores, psychic resins"
  gestures: string; // Required movements
  symbols: string; // Magical signs/sigils
  rituals: string; // Ceremonial aspects
  
  // PERSONALITY (like Character Personality section)
  nature: string; // "Intertwined magical/emotional fabric"
  behavior: string; // "Responds to love, longing, despair"
  temperament: string; // "Chaotic, reality-bending, emotional"
  quirks: string; // Unusual characteristics
  mood: string; // Emotional resonance
  
  // ABILITIES (like Character Abilities section)
  powers: string; // "Reality reshaping, consciousness merging"
  capabilities: string; // "Dream manipulation, matter transformation"
  effects: string; // "Widespread magic ushering, shared consciousness"
  spells: string; // Specific magical workings
  limitations: string; // "Cannot overcome cosmic love's chaos"
  costs: string; // "Sanity, individual identity, reality stability"
  
  // BACKGROUND (like Character Background section)
  history: string; // "Born from Witch/Warlock's cosmic love story"
  origins: string; // "Primordial cosmic forces, latent magical potential"
  discovery: string; // How it became known
  evolution: string; // How it changed over time
  majorEvents: string; // "Age of Magic onset, Cataclysm amplification"
  wars: string; // Conflicts involving this magic
  
  // RELATIONSHIPS (like Character Relationships section)
  practitioners: string; // "Mages, Dream-Weavers, Life-Wardens"
  connectedEntities: string; // "The Bloom, Dream Weaver, Stone Lords"
  schools: string; // "Verdant magic, dream-scrying, reality control"
  traditions: string; // Different approaches
  forbidden: string; // Banned practices
  allies: string; // Supportive groups
  
  // META (like Character Meta section)
  symbolism: string; // "Magic as expression of cosmic love/chaos"
  themes: string; // "Power born from emotion, reality's fragility"
  plotRelevance: string; // Story importance
  questHooks: string; // Adventure opportunities
  mysteries: string; // Unknown aspects
  philosophy: string; // Underlying beliefs
  
  // Additional Magic-specific fields
  acceptance: string;
  regulation: string;
  theory: string;
}

// BESTIARY - Following Character structure + Bloomweaver creatures
export interface Creature extends BaseWorldEntity {
  // IDENTITY (like Character Identity section) 
  fullName: string; // "Bloom-Assimilated Forest Dragon", "Waking Phantom of Despair"
  nicknames: string; // Common names
  title: string; // "Hive Mind Guardian", "Living Nightmare"
  aliases: string; // Alternative names
  species: string; // "Corrupted dragon", "Manifested fear"
  classification: string; // "Bloom hybrid", "Dream construct"
  category: string; // General type
  
  // APPEARANCE (like Character Appearance section)
  physicalDescription: string; // "Fungal growths cover ancient scales"
  size: string; // "Gargantuan", "Medium", etc.
  height: string; // Physical dimensions
  weight: string; // Mass
  coloration: string; // Colors and patterns
  features: string; // Distinctive physical traits
  anatomy: string; // Body structure
  presence: string; // How they appear to others
  
  // PERSONALITY (like Character Personality section)
  temperament: string; // "Patient hunter", "Chaotic manifestation"
  behavior: string; // "Seeks to assimilate", "Projects inner fears"
  intelligence: string; // Mental capacity
  disposition: string; // General attitude
  quirks: string; // Unusual behaviors
  emotions: string; // Emotional range
  
  // ABILITIES (like Character Abilities section)
  powers: string; // "Reality distortion", "Consciousness absorption"  
  abilities: string; // "Phase between dreams and reality"
  attacks: string; // Combat capabilities
  defenses: string; // Protective abilities
  movement: string; // How they travel
  senses: string; // Perception abilities
  specialTraits: string; // Unique characteristics
  
  // BACKGROUND (like Character Background section)
  origins: string; // "Created by Bloom's expansion", "Born from nightmares"
  history: string; // Individual creature's story
  habitat: string; // Where they live
  lifecycle: string; // Birth to death process
  diet: string; // What they consume
  socialStructure: string; // Group behavior
  reproduction: string; // How they reproduce
  
  // RELATIONSHIPS (like Character Relationships section)
  allies: string; // Friendly creatures/factions
  enemies: string; // Hostile relationships
  prey: string; // What they hunt
  predators: string; // What hunts them
  symbioticRelations: string; // Mutually beneficial relationships
  pack: string; // Group associations
  territorialDisputes: string; // Conflicts over space
  
  // META (like Character Meta section)
  symbolism: string; // "Beauty corrupted into horror"
  themes: string; // "Loss of individuality, forced unity"
  plotRelevance: string; // Story importance
  encounterHooks: string; // Adventure opportunities
  secrets: string; // Hidden information
  weaknesses: string; // Vulnerabilities
  
  // Additional Creature-specific fields
  lifespan: string;
  dangerLevel: string;
  rarity: string;
}

// LANGUAGES - Following Character structure + Bloomweaver languages
export interface Language extends BaseWorldEntity {
  // IDENTITY (like Character Identity section)
  fullName: string; // "Ancient Verdant Tongue", "Stone Lord's Resonance Speech"
  nicknames: string; // Common names
  title: string; // "Language of the Bloom", "Echoing Stone Speak"
  aliases: string; // Alternative names
  languageType: string; // "Mystical communion", "Psychic resonance"
  classification: string; // "Living language", "Dead ceremonial"
  family: string; // Language family group
  
  // APPEARANCE (like Character Appearance section)
  writingSystem: string; // "Flowing fungal patterns", "Carved stone runes"
  script: string; // Physical appearance of writing
  symbols: string; // Distinctive marks/characters
  pronunciation: string; // How words sound
  accent: string; // Regional variations
  intonation: string; // Tonal qualities
  physicalAspects: string; // Visual/auditory characteristics
  
  // PERSONALITY (like Character Personality section)
  tone: string; // "Melancholic and flowing", "Harsh and commanding"
  mood: string; // Emotional quality
  temperament: string; // Character of the language
  attitude: string; // How speakers feel about it
  culturalMood: string; // Social/cultural emotional resonance
  expressiveness: string; // Range of emotional expression
  
  // ABILITIES (like Character Abilities section)
  specialCapabilities: string; // "Conveys shared consciousness", "Echoes through stone"
  linguisticPowers: string; // "Reality-shaping words", "Dream communication"
  effects: string; // "Induces unity thoughts", "Awakens stone memories"
  vocabulary: string; // Word range and complexity
  grammar: string; // Structural capabilities
  limitations: string; // What it cannot express
  
  // BACKGROUND (like Character Background section)
  history: string; // "Evolved with Bloom's expansion"
  origins: string; // "Born from cosmic love's emanations"
  development: string; // How it changed over time
  majorChanges: string; // "Corruption during Cataclysm"
  keyEvents: string; // Important moments in language history
  evolution: string; // Natural development
  
  // RELATIONSHIPS (like Character Relationships section)
  speakers: string; // "Bloom-touched communities", "Ancient Stone Lords"
  relatedLanguages: string; // Connected or similar languages
  influences: string; // Languages that affected it
  dialects: string; // Regional variations
  competitions: string; // Rival languages
  alliances: string; // Cooperative linguistic relationships
  
  // META (like Character Meta section)
  symbolism: string; // "Unity vs individuality in communication"
  themes: string; // "Loss of personal voice, collective meaning"
  plotRelevance: string; // Story importance
  useInStory: string; // How it appears in narrative
  secrets: string; // Hidden linguistic knowledge
  mysteries: string; // Unknown aspects
  
  // Additional Language-specific fields
  complexity: string;
  speakerCount: string;
  status: string; // Living, dying, dead, etc.
}

// CULTURES - Following Character structure + Bloomweaver peoples
export interface Culture extends BaseWorldEntity {
  // IDENTITY (like Character Identity section)
  fullName: string; // "The Despair-Born Collective", "Stone-Touched Mountain Folk"
  nicknames: string; // Common names
  title: string; // "Seekers of Absolute Order", "Guardians of Ancient Memory"
  aliases: string; // Alternative names
  cultureType: string; // "Fanatical collective", "Stoic endurance society"
  classification: string; // General category
  ethnicity: string; // Ethnic/racial background
  
  // APPEARANCE (like Character Appearance section)
  clothing: string; // "Geometric robes", "Stone-carved garments"
  aesthetics: string; // "Stark simplicity", "Monumental grandeur"
  architecture: string; // "Control-obsessed strongholds", "Mountain fortresses"
  art: string; // Artistic expression
  colors: string; // Cultural color schemes
  symbols: string; // Important cultural symbols
  style: string; // Overall aesthetic approach
  
  // PERSONALITY (like Character Personality section)
  values: string; // "Order, control, prevention of chaos"
  beliefs: string; // "Chaos must be eliminated", "Memory must be preserved"
  temperament: string; // "Fanatically organized", "Stoically enduring"
  worldview: string; // How they see reality
  attitude: string; // General cultural disposition
  philosophy: string; // Core philosophical approach
  mentalTraits: string; // Collective psychological characteristics
  
  // ABILITIES (like Character Abilities section)
  skills: string; // "Psychological manipulation", "Stone-working mastery"
  specialties: string; // "Reality control magic", "Historical preservation"
  capabilities: string; // "Mass organization", "Endurance practices"
  strengths: string; // Cultural advantages
  techniques: string; // Special methods/practices
  crafts: string; // Artisanal abilities
  
  // BACKGROUND (like Character Background section)
  history: string; // "Emerged from despair during futility cycles"
  origins: string; // "Born from terror of Dream Weaver's chaos"
  foundation: string; // How the culture began
  majorEvents: string; // "Corruption of Dream Weaver", "Cataclysm response"
  traditions: string; // Long-standing practices
  legends: string; // Cultural stories
  ancestors: string; // Important historical figures
  
  // RELATIONSHIPS (like Character Relationships section)
  allies: string; // Friendly cultures/groups
  enemies: string; // "The Bloom", "Dream Weaver supporters"
  neighbors: string; // Adjacent cultures
  tradingPartners: string; // Economic relationships
  rivals: string; // Competitive relationships
  influences: string; // Cultures that shaped them
  dependencies: string; // What they rely on from others
  
  // META (like Character Meta section)
  symbolism: string; // "Dangers of extremist ideology"
  themes: string; // "Order vs chaos", "Collective vs individual"
  plotRelevance: string; // Story importance
  conflictPotential: string; // Sources of dramatic tension
  secrets: string; // Hidden cultural knowledge
  mysteries: string; // Unknown aspects
  
  // Additional Culture-specific fields
  population: string;
  territory: string;
  government: string;
}

// PROPHECIES - Following Character structure + Bloomweaver prophecies/fate
export interface Prophecy extends BaseWorldEntity {
  // IDENTITY (like Character Identity section)
  fullName: string; // "The Bloom's Eternal Embrace Prophecy"
  nicknames: string; // Common names
  title: string; // "Vision of Unified Solace", "Dream of Endless Peace"
  aliases: string; // Alternative names
  prophecyType: string; // "Cosmic love prophecy", "Apocalyptic vision"
  classification: string; // "Divine revelation", "Mystical foresight"
  origin: string; // Source of the prophecy
  
  // APPEARANCE (like Character Appearance section)
  manifestation: string; // "Shared consciousness visions", "Stone echo memories"
  visualElements: string; // "Fungal growth patterns", "Dream-state imagery"
  signs: string; // "Unnaturally still flora", "Reality distortions"
  symbols: string; // Prophetic symbols
  portents: string; // Warning signs
  omens: string; // Foretelling events
  visions: string; // Visionary aspects
  
  // PERSONALITY (like Character Personality section)
  tone: string; // "Melancholic inevitability", "Tragic beautiful horror"
  mood: string; // "Desperate longing fulfilled", "Cosmic love realized"
  nature: string; // "Misguided love becoming destruction"  
  emotion: string; // Emotional core
  atmosphere: string; // Feeling it creates
  sentiment: string; // Overall emotional direction
  
  // ABILITIES (like Character Abilities section)
  power: string; // "Reality-shaping force", "Consciousness manipulation"
  effects: string; // "Forced unity", "Individual absorption"
  influence: string; // "Compels cosmic love's fulfillment"
  scope: string; // "Realm-wide transformation"
  capabilities: string; // What the prophecy can cause
  limitations: string; // "Cannot undo cosmic love's nature"
  
  // BACKGROUND (like Character Background section)
  history: string; // "Foretold before Witch's transformation"
  origins: string; // "Born from cosmic forces' recognition"
  revelation: string; // How it was first revealed
  context: string; // Circumstances of prophecy
  timeline: string; // When events were predicted
  fulfillment: string; // How it's coming true
  
  // RELATIONSHIPS (like Character Relationships section)
  prophets: string; // "Ancient seers", "Stone Lord oracles"
  subjects: string; // "Essylt and Somnus", "All consciousness"
  witnesses: string; // Who has seen it
  believers: string; // Who accepts it as true
  skeptics: string; // Who doubts it
  affected: string; // Who will be impacted
  
  // META (like Character Meta section)
  symbolism: string; // "Love becoming monstrous", "Unity erasing individuality"
  themes: string; // "Inevitable tragic love", "Beauty corrupted by desperation"
  plotRelevance: string; // Story importance
  meaning: string; // Deeper significance
  interpretation: string; // How different groups understand it
  mysteries: string; // Unclear aspects
  
  // Additional Prophecy-specific fields
  timeline: string;
  fulfillmentStage: string;
  accuracy: string;
}

// THEMES - Following Character structure + Bloomweaver core themes
export interface Theme extends BaseWorldEntity {
  // IDENTITY (like Character Identity section)
  fullName: string; // "The Monstrousness of Misguided Love"
  nicknames: string; // Common terms
  title: string; // "Cosmic Love's Horrifying Expression"
  aliases: string; // Alternative names
  themeType: string; // "Philosophical concept", "Emotional truth"
  classification: string; // "Central narrative theme", "Character archetype"
  category: string; // Type of theme
  
  // APPEARANCE (like Character Appearance section)
  manifestation: string; // "Bloom's overwhelming embrace", "Stone Lord's eternal suffering"
  visualRepresentation: string; // "Fungal beauty turned horrifying"
  symbols: string; // "Gardens overrun by desperate love"
  imagery: string; // Associated visual elements
  metaphors: string; // Symbolic representations
  examples: string; // How it appears in story
  
  // PERSONALITY (like Character Personality section)
  essence: string; // "Purest intentions birthing unimaginable horror"
  nature: string; // "Love's capacity for destruction"
  character: string; // Core personality of theme
  temperament: string; // How the theme behaves
  disposition: string; // General tendency
  mood: string; // Emotional quality
  
  // ABILITIES (like Character Abilities section)
  influence: string; // "Shapes character motivations", "Drives plot conflicts"
  effects: string; // "Creates moral complexity", "Generates emotional resonance"
  power: string; // "Transforms beauty into horror"
  capabilities: string; // What the theme can accomplish narratively
  impact: string; // Effect on story and characters
  reach: string; // How far the theme extends
  
  // BACKGROUND (like Character Background section)
  origins: string; // "Born from cosmic love story"
  development: string; // "Evolved through Witch's desperation"
  history: string; // How theme developed in story
  evolution: string; // Changes over time
  precedents: string; // Earlier examples
  influences: string; // What shaped this theme
  
  // RELATIONSHIPS (like Character Relationships section)
  relatedThemes: string; // "Individuality vs Unity", "Order vs Chaos"
  opposingThemes: string; // Contrasting themes
  characterConnections: string; // "Essylt's transformation", "Cultists' extremism"
  plotConnections: string; // How it connects to story elements
  symbolicRelations: string; // Connected symbolic elements
  parallelThemes: string; // Similar thematic elements
  
  // META (like Character Meta section)
  meaning: string; // "Even purest love can become monstrous"
  message: string; // "Question nature of love and sacrifice"
  significance: string; // Why this theme matters
  interpretation: string; // How to understand it
  application: string; // How it applies to story
  universality: string; // Broader human relevance
  
  // Additional Theme-specific fields
  prominence: string;
  recurrence: string;
  resolution: string;
}
  
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