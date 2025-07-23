export interface Project {
  id: string;
  name: string;
  type: 'novel' | 'screenplay' | 'comic';
  description: string;
  genre: string[];
  createdAt: Date;
  lastModified: Date;
  manuscript: {
    novel: string;
    screenplay: string;
  };
  outline: OutlineNode[];
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  items: Item[];
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
  name: string;
  role: string;
  description: string;
  personality: string;
  backstory: string;
  motivations: string;
  fears: string;
  secrets: string;
  relationships: CharacterRelationship[];
  archetypes: string[];
  imageGallery: ImageAsset[];
  displayImageId?: number;
  modelImageUrls: string[];
  isModelTrained: boolean;
  tags: string[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  history: string;
  significance: string;
  atmosphere: string;
  imageGallery: ImageAsset[];
  displayImageId?: number;
  tags: string[];
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  goals: string;
  methods: string;
  history: string;
  leadership: string;
  resources: string;
  relationships: string;
  tags: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  history: string;
  powers: string;
  significance: string;
  imageGallery: ImageAsset[];
  displayImageId?: number;
  tags: string[];
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
