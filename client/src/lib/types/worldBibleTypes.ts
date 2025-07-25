/**
 * World Bible Entity Type Definitions  
 * Consolidated types for Locations, Factions, Items, and other world elements
 */

import type { EnhancedEntityFields, BaseTemplate } from './baseTypes';

// Base World Bible entity interface
export interface WorldBibleEntity extends EnhancedEntityFields {
  // Common world bible fields
  history?: string;
  significance?: string;
  type?: string;
  scale?: string;
  atmosphere?: string;
}

// Location entity
export interface Location extends WorldBibleEntity {
  // Location-specific fields
  geography?: string;
  climate?: string;
  population?: string;
  culture?: string;
  government?: string;
  economy?: string;
  landmarks?: string[];
  resources?: string[];
  threats?: string[];
  secrets?: string[];
  connections?: string[];
}

// Faction entity
export interface Faction extends WorldBibleEntity {
  // Faction-specific fields
  goals?: string;
  methods?: string;
  leadership?: string;
  structure?: string;
  resources?: string;
  ideology?: string;
  recruitment?: string;
  strongholds?: string[];
  weaknesses?: string[];
  threatLevel?: string;
  currentOperations?: string[];
  keyFigures?: string[];
  originStory?: string;
  corruptionTechniques?: string[];
}

// Item entity
export interface Item extends WorldBibleEntity {
  // Item-specific fields
  powers?: string;
  rarity?: string;
  value?: string;
  creator?: string;
  currentOwner?: string;
  previousOwners?: string[];
  materials?: string[];
  enchantments?: string[];
  cursed?: boolean;
  limitations?: string;
  sideEffects?: string;
}

// Creature entity
export interface Creature extends WorldBibleEntity {
  // Creature-specific fields
  species?: string;
  habitat?: string[];
  behavior?: string;
  diet?: string;
  abilities?: string[];
  weaknesses?: string[];
  intelligence?: string;
  communication?: string;
  lifecycle?: string;
  reproduction?: string;
  socialStructure?: string;
  threats?: string[];
  uses?: string[];
}

// Organization entity
export interface Organization extends WorldBibleEntity {
  // Organization-specific fields
  purpose?: string;
  structure?: string;
  membership?: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  activities?: string[];
  influence?: string;
  reputation?: string;
  alliances?: string[];
  rivals?: string[];
  secrets?: string[];
}

// Magic System entity
export interface MagicSystem extends WorldBibleEntity {
  // Magic system-specific fields
  source?: string;
  mechanics?: string;
  limitations?: string;
  costs?: string;
  practitioners?: string[];
  schools?: string[];
  spells?: string[];
  artifacts?: string[];
  forbidden?: string[];
  consequences?: string;
  learning?: string;
  mastery?: string;
}

// Timeline Event entity
export interface TimelineEvent extends WorldBibleEntity {
  // Timeline-specific fields
  date?: string;
  era?: string;
  duration?: string;
  location?: string;
  participants?: string[];
  causes?: string[];
  effects?: string[];
  importance?: string;
  aftermath?: string;
  connections?: string[];
  evidence?: string[];
  mysteries?: string[];
}

// Language entity
export interface Language extends WorldBibleEntity {
  // Language-specific fields
  speakers?: string[];
  regions?: string[];
  family?: string;
  writing?: string;
  phonetics?: string;
  grammar?: string;
  vocabulary?: string;
  dialects?: string[];
  literature?: string[];
  influence?: string;
  status?: string;
  learning?: string;
}

// Culture entity
export interface Culture extends WorldBibleEntity {
  // Culture-specific fields
  values?: string[];
  traditions?: string[];
  customs?: string[];
  beliefs?: string[];
  practices?: string[];
  festivals?: string[];
  ceremonies?: string[];
  art?: string[];
  music?: string[];
  literature?: string[];
  architecture?: string;
  clothing?: string;
  cuisine?: string;
  taboos?: string[];
}

// Prophecy entity
export interface Prophecy extends WorldBibleEntity {
  // Prophecy-specific fields
  prophet?: string;
  recipient?: string;
  date?: string;
  content?: string;
  interpretation?: string;
  symbols?: string[];
  conditions?: string[];
  fulfillment?: string;
  impact?: string;
  believers?: string[];
  skeptics?: string[];
  consequences?: string[];
}

// Theme entity
export interface Theme extends WorldBibleEntity {
  // Theme-specific fields
  category?: string;
  expression?: string;
  examples?: string[];
  symbols?: string[];
  metaphors?: string[];
  conflicts?: string[];
  resolution?: string;
  characters?: string[];
  locations?: string[];
  events?: string[];
  messages?: string[];
}

// Union type for all world bible entities
export type AnyWorldBibleEntity = 
  | Location 
  | Faction 
  | Item 
  | Creature 
  | Organization 
  | MagicSystem 
  | TimelineEvent 
  | Language 
  | Culture 
  | Prophecy 
  | Theme;

// Entity type mappings
export const WORLD_BIBLE_ENTITY_TYPES = {
  locations: 'Location',
  factions: 'Faction', 
  items: 'Item',
  creatures: 'Creature',
  organizations: 'Organization',
  'magic-systems': 'Magic System',
  'timeline-events': 'Timeline Event', 
  languages: 'Language',
  cultures: 'Culture',
  prophecies: 'Prophecy',
  themes: 'Theme'
} as const;

export type WorldBibleEntityType = keyof typeof WORLD_BIBLE_ENTITY_TYPES;

// Templates for world bible entities
export interface LocationTemplate extends BaseTemplate<Location> {
  category: 'city' | 'wilderness' | 'structure' | 'realm' | 'landmark';
}

export interface FactionTemplate extends BaseTemplate<Faction> {
  category: 'government' | 'military' | 'religious' | 'criminal' | 'merchant' | 'academic';
}

export interface ItemTemplate extends BaseTemplate<Item> {
  category: 'weapon' | 'armor' | 'tool' | 'artifact' | 'consumable' | 'treasure';
}

export interface CreatureTemplate extends BaseTemplate<Creature> {
  category: 'beast' | 'humanoid' | 'magical' | 'undead' | 'construct' | 'elemental';
}

// Export all templates as union
export type AnyWorldBibleTemplate = 
  | LocationTemplate 
  | FactionTemplate 
  | ItemTemplate 
  | CreatureTemplate;