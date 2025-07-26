import type { LucideIcon } from 'lucide-react';
import type { EntityType } from '../../../shared/schema';

// Base field definition interface
export interface UniversalFieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'array' | 'select' | 'number' | 'date' | 'boolean';
  section: string;
  category?: string;
  priority: 'essential' | 'important' | 'optional';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  maxLength?: number;
  
  // AI Enhancement
  aiEnhanceable?: boolean;
  aiPromptTemplate?: string;
  
  // Display & Search
  searchable?: boolean;
  exportable?: boolean;
  displayInCard?: boolean;
  displayInList?: boolean;
  
  // Validation
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
}

// Entity section configuration
export interface EntitySection {
  key: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  fields: string[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// AI configuration for entity generation
export interface AIGenerationConfig {
  promptTemplate: string;
  contextFields: string[];
  enhancementRules: AIEnhancementRule[];
  fallbackFields: Record<string, string>;
  maxRetries: number;
  temperature: number;
}

export interface AIEnhancementRule {
  fieldKey: string;
  promptTemplate: string;
  dependencies?: string[];
  conditions?: Record<string, any>;
}

// Relationship configuration
export interface RelationshipConfig {
  allowedTypes: string[];
  defaultTypes: string[];
  bidirectional: boolean;
  strengthLevels: string[];
  statusOptions: string[];
}

// Display and UI configuration
export interface UIDisplayConfig {
  cardLayout: 'simple' | 'detailed' | 'compact';
  showPortraits: boolean;
  defaultSortField: string;
  sortOptions: Array<{
    key: string;
    label: string;
    direction: 'asc' | 'desc';
  }>;
  filterOptions: Array<{
    key: string;
    label: string;
    type: 'text' | 'select' | 'multiselect';
    options?: string[];
  }>;
  searchFields: string[];
  displayFields: {
    card: string[];
    list: string[];
    detail: string[];
  };
}

// Main universal entity configuration interface
export interface UniversalEntityConfig {
  // Identity
  entityType: EntityType;
  name: string;
  pluralName: string;
  description: string;
  
  // Visual
  icon: LucideIcon;
  color: string;
  gradient?: string;
  
  // Field Structure
  fields: UniversalFieldDefinition[];
  sections: EntitySection[];
  
  // AI Configuration
  ai: AIGenerationConfig;
  
  // Relationships
  relationships: RelationshipConfig;
  
  // Display & UI
  display: UIDisplayConfig;
  
  // Features
  features: {
    hasPortraits: boolean;
    hasTemplates: boolean;
    hasRelationships: boolean;
    hasAIGeneration: boolean;
    hasFieldEnhancement: boolean;
    hasBulkOperations: boolean;
    hasAdvancedSearch: boolean;
    hasExport: boolean;
  };
  
  // Validation
  validation: {
    requiredFields: string[];
    uniqueFields: string[];
    customValidators?: Record<string, (value: any, entity: any) => boolean | string>;
  };
}

// Entity configuration registry
export class EntityConfigRegistry {
  private static configs: Map<EntityType, UniversalEntityConfig> = new Map();
  
  static register(config: UniversalEntityConfig) {
    this.configs.set(config.entityType, config);
  }
  
  static get(entityType: EntityType): UniversalEntityConfig | undefined {
    return this.configs.get(entityType);
  }
  
  static getAll(): UniversalEntityConfig[] {
    return Array.from(this.configs.values());
  }
  
  static getByCategory(category: string): UniversalEntityConfig[] {
    return Array.from(this.configs.values()).filter(config => 
      config.sections.some(section => section.key === category)
    );
  }
}

// Helper functions for configuration management
export const createFieldDefinition = (
  key: string,
  label: string,
  type: UniversalFieldDefinition['type'],
  section: string,
  options?: Partial<UniversalFieldDefinition>
): UniversalFieldDefinition => ({
  key,
  label,
  type,
  section,
  priority: 'important',
  aiEnhanceable: type === 'text' || type === 'textarea',
  searchable: type === 'text' || type === 'textarea',
  exportable: true,
  ...options
});

export const createSection = (
  key: string,
  label: string,
  fields: string[],
  options?: Partial<EntitySection>
): EntitySection => ({
  key,
  label,
  fields,
  collapsible: true,
  defaultExpanded: key === 'identity',
  ...options
});

// Default configurations that can be extended
export const DEFAULT_AI_CONFIG: AIGenerationConfig = {
  promptTemplate: '',
  contextFields: ['name', 'description'],
  enhancementRules: [],
  fallbackFields: {},
  maxRetries: 3,
  temperature: 0.8
};

export const DEFAULT_RELATIONSHIP_CONFIG: RelationshipConfig = {
  allowedTypes: ['related', 'connected', 'associated'],
  defaultTypes: ['related'],
  bidirectional: false,
  strengthLevels: ['weak', 'medium', 'strong'],
  statusOptions: ['active', 'inactive', 'past']
};

export const DEFAULT_DISPLAY_CONFIG: UIDisplayConfig = {
  cardLayout: 'detailed',
  showPortraits: true,
  defaultSortField: 'name',
  sortOptions: [
    { key: 'name', label: 'Name', direction: 'asc' },
    { key: 'createdAt', label: 'Created', direction: 'desc' },
    { key: 'updatedAt', label: 'Modified', direction: 'desc' }
  ],
  filterOptions: [],
  searchFields: ['name', 'description'],
  displayFields: {
    card: ['name', 'description'],
    list: ['name', 'description'],
    detail: ['name', 'description']
  }
};