// --- AI Service & Configuration Types ---
export interface AICraftConfig {
    [toolId: string]: string[]; // toolId maps to array of built-in craft knowledge IDs
}

export interface AICraftPreset {
    name: string;
    config: AICraftConfig;
}


// --- Core Data Structures ---

export interface Project {
  id: number;
  name: string;
  type: string;
  genres: string[];
  subGenres: string[];
  manuscript: Manuscript;
  worldBible: WorldBible;
  outline: OutlineNode[];
  sidebarConfig: SidebarItem[];
  proseDocuments: ProseDocument[];
  aiCraftConfig: AICraftConfig;
}

export interface Manuscript {
  novel: string;
  screenplay: string;
}

export interface OutlineNode {
  id: number;
  title: string;
  content: string;
  description?: string;
  children: OutlineNode[];
}

export interface SidebarItem {
  id: string;
  toolId: string;
  label: string;
  icon: string;
  children?: SidebarItem[];
  isVisible?: boolean;
}

// --- Knowledge Base Documents ---
export interface ProseDocument {
    id: number;
    fileName: string;
    content: string;
}


// --- World Bible Data Models ---

export interface WorldBible {
    characters: Character[];
    locations: Location[];
    factions: Faction[];
    items: Item[];
    magicSystems: MagicSystem[];
    creatures: Creature[];
    cultures: Culture[];
    languages: Language[];
    lore: Lore[];
    timeline: TimelineEvent[];
    prophecies: Prophecy[];
    themes: Theme[];
    organizations: Organization[];
}

export interface CharacterRelationship {
    id: number;
    characterId: number;
    type: string;
    description: string;
}

export interface ImageAsset {
    id: number;
    url: string;
}

export interface Character {
  id: number;
  name: string;
  aliases: string[];
  archetype: string[];
  role: string; // e.g., Protagonist, Antagonist, Supporting
  imageGallery: ImageAsset[];
  modelImageUrls: string[];
  displayImageId?: number;
  isModelTrained?: boolean;
  
  // Profile
  description: string; // Physical appearance, etc.
  personalityTraits: string;
  strengths: string;
  flaws: string;

  // History
  backstory: string;
  fears: string;
  secrets: string;
  
  // Narrative & Abilities
  motivations: string;
  storyArc: string;
  internalConflict: string;
  abilities: string; // Newline-separated
  psychologicalProfile: string;

  // Connections
  relationships: CharacterRelationship[];
  factionId?: number;
  notes: string;
}

export interface Location {
    id: number;
    name: string;
    type: string; // e.g., City, Planet, Building, Realm
    description: string;
    imageGallery: ImageAsset[];
    modelImageUrls: string[];
    displayImageId?: number;
    isModelTrained?: boolean;
    history: string;
    keyLandmarks: string; // Newline-separated list
    postCataclysmImpact: string;
    dominantPeoples: string;
    governance: string;
}

export interface Faction {
    id: number;
    name: string;
    type: string; // e.g., Guild, Kingdom, Corporation, Cult
    description: string;
    ideology: string;
    leadership: string;
    methods: string;
    strongholds: string;
    impactOnWorld: string;
    goals: string;
    allies: number[]; // Array of Faction IDs
    enemies: number[]; // Array of Faction IDs
}

export interface Item {
    id: number;
    name: string;
    type: string; // e.g., Weapon, Artifact, Key Item
    description: string;
    imageUrl: string;
    history: string;
    abilities: string;
    ownerId?: number; // Character ID
}

export interface MagicSystem {
    id: number;
    name: string;
    description: string;
    rules: string;
    limitations: string;
    source: string;
    costs: string;
    culturalImpact: string;
}

export interface Creature {
    id: number;
    name:string;
    description: string;
    imageUrl: string;
    abilities: string;
    habitat: string; // Location ID or description
    behavior: string;
    roleInEcosystem: string;
}

export interface Culture {
    id: number;
    name: string;
    description: string;
    customs: string;
    beliefs: string;
    socialStructure: string;
    rituals: string;
    cuisine: string;
}

export interface Language {
    id: number;
    name: string;
    description: string;
    alphabetUrl: string;
    grammarRules: string;
    commonPhrases: string;
    culturalContext: string;
}

export interface Lore {
    id: number;
    title: string;
    content: string;
    category: string; // e.g., 'Symbolism', 'Cosmology'
    relatedElementIds: {type: string, id: number}[]; // e.g., {type: 'character', id: 1}
}

export interface TimelineEvent {
    id: number;
    name: string;
    description: string;
    date: string;
    involvedCharacterIds: number[];
    involvedFactionIds: number[];
    involvedLocationIds: number[];
    outcome: string;
    longTermImpact: string;
}

export interface Prophecy {
    id: number;
    name: string;
    text: string;
    interpretations: string;
    fulfillment: string;
    relatedElements: {type: string, id: number}[];
}

export interface Theme {
    id: number;
    name: string;
    description: string;
    symbols: string;
    relatedElements: {type: string, id: number}[];
}

export interface Organization {
    id: number;
    name: string;
    description: string;
    hierarchy: string;
    purpose: string;
    keyMembers: string;
}

// --- AI Service Result Types ---

export interface BrainstormResult {
  title: string;
  logline: string;
  characters: string[];
  plot_hooks: string[];
}

export interface GeneratedCharacter {
    name: string;
    aliases: string[];
    archetype: string[];
    role: string;
    description: string;
    personalityTraits: string;
    strengths: string;
    flaws: string;
    backstory: string;
    fears: string;
    motivations: string;
    secrets: string;
    internalConflict: string;
    storyArc: string;
    abilities: string;
    psychologicalProfile: string;
}

export interface FleshedOutCharacter {
    description: string;
    personalityTraits: string;
    strengths: string;
    flaws: string;
    backstory: string;
    fears: string;
    motivations: string;
    secrets?: string;
    internalConflict?: string;
    storyArc?: string;
    abilities?: string;
    psychologicalProfile?: string;
}

export interface FleshedOutItem {
    description: string;
    history: string;
    abilities: string;
}

export interface FleshedOutLocation {
    description: string;
    history: string;
    keyLandmarks: string;
    postCataclysmImpact: string;
    dominantPeoples: string;
    governance: string;
}

export interface FleshedOutFaction {
    description: string;
    ideology: string;
    leadership: string;
    methods: string;
    strongholds: string;
    impactOnWorld: string;
    goals: string;
}

export interface AICoachFeedback {
  corePrincipleAnalysis: string;
  actionableSuggestions: string[];
  guidingQuestions: string[];
}

// --- AI Import Service Result Types ---
export interface ExtractedCharacter {
    name: string;
    aliases: string[];
    archetype: string[];
    role: string;
    description: string;
}

export interface ExtractedLocation {
    name: string;
    type: string;
    description: string;
}

export interface ExtractedFaction {
    name: string;
    type: string;
    description: string;
    ideology: string;
}

export interface ExtractedWorldBibleData {
    characters: ExtractedCharacter[];
    locations: ExtractedLocation[];
    factions: ExtractedFaction[];
}

export interface ImportedData {
    outline: OutlineNode[];
    worldBible: ExtractedWorldBibleData;
}

export interface ImportedManuscriptData {
    manuscriptText: string;
    outline: OutlineNode[];
}