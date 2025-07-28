export interface Project {
  id: string;
  name: string;
  title?: string;
  type: 'novel' | 'screenplay' | 'comic' | 'dnd-campaign' | 'poetry';
  description?: string;
  synopsis?: string;
  genre?: string | string[];
  tone?: string;
  createdAt: Date;
  lastModified: Date;
  manuscript: {
    novel: string;
    screenplay: string;
  };
  outline: OutlineNode[];
  characters: Character[];
  proseDocuments: ProseDocument[];
  settings: ProjectSettings;
}

export interface OutlineNode {
  id: number;
  title: string;
  content: string;
  description?: string;
  children: OutlineNode[];
}

export interface Character {
  id: string;
  projectId: string;
  
  // Basic Information (Core Identity)
  name?: string;
  nicknames?: string;
  title?: string;
  aliases?: string;
  race?: string;
  ethnicity?: string;
  class?: string;
  profession?: string;
  occupation?: string;
  age?: string;
  birthdate?: string;
  zodiacSign?: string;
  role?: string;
  
  // Physical Appearance (Comprehensive Physical Description)
  physicalDescription?: string;
  height?: string;
  weight?: string;
  build?: string;
  bodyType?: string;
  facialFeatures?: string;
  eyes?: string;
  eyeColor?: string;
  hair?: string;
  hairColor?: string;
  hairStyle?: string;
  facialHair?: string;
  skin?: string;
  skinTone?: string;
  complexion?: string;
  scars?: string;
  tattoos?: string;
  piercings?: string;
  birthmarks?: string;
  distinguishingMarks?: string;
  attire?: string;
  clothingStyle?: string;
  accessories?: string;
  posture?: string;
  gait?: string;
  gestures?: string;
  mannerisms?: string;
  
  // Core Character Details (Central Character Definition)
  description?: string;
  characterSummary?: string;
  oneLine?: string;
  
  // Personality (Deep Psychological Profile)
  personality?: string;
  personalityTraits?: string[];
  temperament?: string;
  disposition?: string;
  worldview?: string;
  beliefs?: string;
  values?: string;
  principles?: string;
  morals?: string;
  ethics?: string;
  virtues?: string;
  vices?: string;
  habits?: string;
  quirks?: string;
  idiosyncrasies?: string;
  petPeeves?: string;
  likes?: string;
  dislikes?: string;
  hobbies?: string;
  interests?: string;
  passions?: string;
  
  // Psychological Profile (Mental & Emotional Depth)
  motivations?: string;
  desires?: string;
  needs?: string;
  drives?: string;
  ambitions?: string;
  fears?: string;
  phobias?: string;
  anxieties?: string;
  insecurities?: string;
  secrets?: string;
  shame?: string;
  guilt?: string;
  regrets?: string;
  trauma?: string;
  wounds?: string;
  copingMechanisms?: string;
  defenses?: string;
  vulnerabilities?: string;
  weaknesses?: string;
  blindSpots?: string;
  mentalHealth?: string;
  emotionalState?: string;
  maturityLevel?: string;
  intelligenceType?: string;
  learningStyle?: string;
  
  // Background & History (Life Story & Context)
  background?: string;
  backstory?: string;
  origin?: string;
  upbringing?: string;
  childhood?: string;
  familyHistory?: string;
  socialClass?: string;
  economicStatus?: string;
  education?: string;
  academicHistory?: string;
  formativeEvents?: string;
  lifeChangingMoments?: string;
  personalStruggle?: string;
  challenges?: string;
  achievements?: string;
  failures?: string;
  losses?: string;
  victories?: string;
  reputation?: string;
  
  // Abilities & Skills (Competencies & Powers)
  abilities?: string[];
  skills?: string[];
  talents?: string[];
  expertise?: string[];
  specialAbilities?: string;
  powers?: string;
  abilityLimitations?: string;
  superpowers?: string;
  strengths?: string;
  competencies?: string;
  training?: string;
  experience?: string;
  
  // Story Elements (Narrative Function & Arc)
  goals?: string;
  objectives?: string;
  wants?: string;
  obstacles?: string;
  conflicts?: string;
  conflictSources?: string;
  stakes?: string;
  consequences?: string;
  arc?: string;
  journey?: string;
  transformation?: string;
  growth?: string;
  relationships?: CharacterRelationship[];
  allies?: string;
  enemies?: string;
  mentors?: string;
  rivals?: string;
  connectionToEvents?: string;
  plotRelevance?: string;
  storyFunction?: string;
  
  // Language & Communication (Voice & Expression)
  spokenLanguages?: string;
  accent?: string;
  dialect?: string;
  voiceDescription?: string;
  speechPatterns?: string;
  vocabulary?: string;
  catchphrases?: string;
  slang?: string;
  communicationStyle?: string;
  
  // Social & Cultural (Relationships & Society)
  family?: string;
  parents?: string;
  siblings?: string;
  spouse?: string;
  children?: string;
  friends?: string;
  socialCircle?: string;
  community?: string;
  culturalBackground?: string;
  traditions?: string;
  customs?: string;
  religion?: string;
  spirituality?: string;
  politicalViews?: string;
  
  // Meta Information (Writing & Creative Elements)
  archetypes?: string[];
  tropes?: string[];
  inspiration?: string;
  basedOn?: string;
  tags?: string[];
  genre?: string;
  proseVibe?: string;
  narrativeRole?: string;
  characterType?: string;
  importance?: string;
  screenTime?: string;
  firstAppearance?: string;
  lastAppearance?: string;
  
  // Writer's Notes & Development (Creative Process)
  notes?: string;
  development?: string;
  evolution?: string;
  alternatives?: string;
  unused?: string;
  research?: string;
  references?: string;
  mood?: string;
  personalTheme?: string;
  symbolism?: string;
  
  // Technical (System & Display)
  isModelTrained?: boolean;
  displayImageId?: number;
  imageUrl?: string;
  portraits?: Array<{id: string, url: string, isMain: boolean}>;
  imageGallery?: ImageAsset[];
  modelImageUrls?: string[];
  createdAt?: Date;
}



export interface CharacterRelationship {
  characterId: string;
  relationshipType: string;
  description: string;
}

export interface ImageAsset {
  id: number;
  url: string;
}

export interface ProseDocument {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  lastModified: Date;
}

export interface ProjectSettings {
  aiCraftConfig: AICraftConfig;
}

export interface AICraftConfig {
  [key: string]: boolean;
}

export interface AICraftPreset {
  name: string;
  description: string;
  config: AICraftConfig;
}

export interface GeneratedCharacter {
  name: string;
  role: string;
  description: string;
  personality: string;
  backstory: string;
  motivations: string;
  archetypes: string[];
}

export interface FleshedOutCharacter extends GeneratedCharacter {
  fears: string;
  secrets: string;
  relationships: CharacterRelationship[];
}

export interface AICoachFeedback {
  corePrincipleAnalysis: string;
  actionableSuggestions: string[];
  guidingQuestions: string[];
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  toolId: string;
  isVisible: boolean;
  children?: SidebarItem[];
}

export interface ModalInfo {
  type: string | null;
  project: Project | null;
}
