/**
 * Base Field Configuration System
 * Universal field definitions that can be extended for any entity type
 */

import type { BaseFieldDefinition, FieldType, FieldPriority } from '../types/baseTypes';

// Base field definition structure
export interface UniversalFieldDefinition extends BaseFieldDefinition {
  entityTypes: string[]; // Which entity types this field applies to
  category: FieldCategory;
  group?: string; // Optional grouping within sections
  dependencies?: string[]; // Fields this depends on
  conditional?: ConditionalRule; // When to show/hide this field
  aiPromptTemplate?: string; // Template for AI enhancement prompts
  searchable?: boolean; // Include in search functionality
  exportable?: boolean; // Include in exports by default
}

export type FieldCategory = 
  | 'identity' 
  | 'physical' 
  | 'personality' 
  | 'background' 
  | 'abilities' 
  | 'story' 
  | 'meta' 
  | 'relationships' 
  | 'development'
  | 'custom';

export interface ConditionalRule {
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'exists' | 'not-exists';
  value: any;
}

// Core universal fields that apply to ALL entity types
export const CORE_UNIVERSAL_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    required: true,
    entityTypes: ['*'], // Applies to all entity types
    placeholder: 'Enter name...',
    aiEnhanceable: false,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Suggest a compelling name for this {entityType} based on: {context}'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    section: 'identity',
    category: 'identity',
    priority: 'essential',
    entityTypes: ['*'],
    placeholder: 'Describe this {entityType}...',
    helpText: 'A brief overview that captures the essence and key characteristics',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Write a compelling description for this {entityType}: {name}. Focus on {context}'
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'tags',
    section: 'meta',
    category: 'meta',
    priority: 'important',
    entityTypes: ['*'],
    placeholder: 'Add tags...',
    helpText: 'Keywords and categories to help organize and find this {entityType}',
    aiEnhanceable: true,
    searchable: true,
    exportable: true,
    aiPromptTemplate: 'Suggest relevant tags for this {entityType} based on: {context}'
  },
  {
    key: 'notes',
    label: 'Writer Notes',
    type: 'textarea',
    section: 'meta',
    category: 'meta',
    priority: 'optional',
    entityTypes: ['*'],
    placeholder: 'Personal notes and development thoughts...',
    helpText: 'Private notes for your writing process and development ideas',
    aiEnhanceable: false,
    searchable: false,
    exportable: false
  }
];

// Common relationship fields for entities that support relationships
export const RELATIONSHIP_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'relationships',
    label: 'Relationships',
    type: 'json',
    section: 'relationships',
    category: 'relationships',
    priority: 'important',
    helpText: 'Connections with other entities in your world',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Suggest meaningful relationships for this {entityType} with other entities in the world'
  }
];

// Common development fields for entities that support arcs/progress
export const DEVELOPMENT_FIELDS: UniversalFieldDefinition[] = [
  {
    key: 'arcs',
    label: 'Development Arcs',
    type: 'json',
    section: 'development',
    category: 'development',
    priority: 'advanced',
    entityTypes: ['characters', 'factions', 'organizations'],
    helpText: 'Growth and change throughout the story',
    aiEnhanceable: true,
    searchable: false,
    exportable: true,
    aiPromptTemplate: 'Design development arcs for this {entityType} showing growth and change'
  },
  {
    key: 'insights',
    label: 'AI Insights',
    type: 'json',
    section: 'development',
    category: 'development',
    priority: 'advanced',
    entityTypes: ['*'],
    helpText: 'AI-generated analysis and suggestions',
    aiEnhanceable: false,
    searchable: false,
    exportable: false
  }
];

// Field sections configuration for different entity types
export const ENTITY_SECTIONS: Record<string, string[]> = {
  characters: ['identity', 'physical', 'personality', 'background', 'abilities', 'story', 'relationships', 'development', 'meta'],
  creatures: ['identity', 'physical', 'background', 'abilities', 'story', 'meta'],
};

// Section display names
export const SECTION_NAMES: Record<string, string> = {
  identity: 'Identity',
  physical: 'Physical',
  personality: 'Personality', 
  background: 'Background',
  abilities: 'Abilities',
  story: 'Story',
  relationships: 'Relationships',
  development: 'Development',
  meta: 'Meta'
};

// Utility functions for field configuration
export class FieldConfigManager {
  private static fieldRegistry = new Map<string, UniversalFieldDefinition>();
  
  static registerFields(fields: UniversalFieldDefinition[]) {
    fields.forEach(field => {
      this.fieldRegistry.set(field.key, field);
    });
  }
  
  static getFieldsForEntity(entityType: string): UniversalFieldDefinition[] {
    return Array.from(this.fieldRegistry.values()).filter(field => 
      field.entityTypes.includes('*') || field.entityTypes.includes(entityType)
    );
  }
  
  static getFieldsBySection(entityType: string, section: string): UniversalFieldDefinition[] {
    return this.getFieldsForEntity(entityType).filter(field => 
      field.section === section
    );
  }
  
  static getField(key: string): UniversalFieldDefinition | undefined {
    return this.fieldRegistry.get(key);
  }
  
  static getFieldsByPriority(entityType: string, priority: FieldPriority): UniversalFieldDefinition[] {
    return this.getFieldsForEntity(entityType).filter(field => 
      field.priority === priority
    );
  }
  
  static getSearchableFields(entityType: string): UniversalFieldDefinition[] {
    return this.getFieldsForEntity(entityType).filter(field => 
      field.searchable
    );
  }
  
  static getExportableFields(entityType: string): UniversalFieldDefinition[] {
    return this.getFieldsForEntity(entityType).filter(field => 
      field.exportable
    );
  }
  
  static getAIEnhanceableFields(entityType: string): UniversalFieldDefinition[] {
    return this.getFieldsForEntity(entityType).filter(field => 
      field.aiEnhanceable
    );
  }
  
  static getSectionsForEntity(entityType: string): string[] {
    return ENTITY_SECTIONS[entityType] || ENTITY_SECTIONS.characters;
  }
  
  static getSectionName(section: string): string {
    return SECTION_NAMES[section] || section;
  }
  
  static shouldShowField(field: UniversalFieldDefinition, formData: any): boolean {
    if (!field.conditional) return true;
    
    const { field: condField, operator, value } = field.conditional;
    const fieldValue = formData[condField];
    
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not-equals':
        return fieldValue !== value;
      case 'contains':
        return Array.isArray(fieldValue) ? fieldValue.includes(value) : String(fieldValue).includes(value);
      case 'not-contains':
        return Array.isArray(fieldValue) ? !fieldValue.includes(value) : !String(fieldValue).includes(value);
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
      case 'not-exists':
        return fieldValue === undefined || fieldValue === null || fieldValue === '';
      default:
        return true;
    }
  }
  
  static getAIPrompt(field: UniversalFieldDefinition, entityType: string, context: any): string {
    if (!field.aiPromptTemplate) return `Enhance the ${field.label} for this ${entityType}`;
    
    return field.aiPromptTemplate
      .replace('{entityType}', entityType)
      .replace('{name}', context.name || 'unnamed')
      .replace('{context}', JSON.stringify(context));
  }
}

// Initialize with core fields
FieldConfigManager.registerFields([
  ...CORE_UNIVERSAL_FIELDS,
  ...RELATIONSHIP_FIELDS, 
  ...DEVELOPMENT_FIELDS
]);