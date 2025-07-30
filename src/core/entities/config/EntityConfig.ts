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

// Wizard step configuration for multi-step entity creation
export interface WizardStepConfig {
  key: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  fields: string[];
  required?: boolean;
  skipCondition?: (data: any) => boolean;
  validation?: {
    required: string[];
    custom?: (data: any) => boolean | string;
  };
}

// Wizard configuration for entity creation flows
export interface WizardConfig {
  enabled: boolean;
  steps: WizardStepConfig[];
  allowSkipping?: boolean;
  showProgress?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number; // milliseconds
  completionMessage?: string;
  methods: {
    guided: boolean;
    templates: boolean;
    ai: boolean;
    upload: boolean;
  };
}

// Tab configuration for entity detail views
export interface TabConfig {
  key: string;
  label: string;
  icon?: LucideIcon;
  fields: string[];
  conditional?: {
    field: string;
    value: any;
    operator?: 'equals' | 'notEquals' | 'contains' | 'exists';
  };
  order: number;
  defaultActive?: boolean;
}

// Enhanced tab configuration for detail views
export interface DetailTabConfig {
  enabled: boolean;
  tabs: TabConfig[];
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'pills' | 'underline';
  lazyLoad?: boolean;
  stickyTabs?: boolean;
}

// Form section configuration for dynamic form rendering
export interface FormSectionConfig {
  key: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  fields: string[];
  collapsible: boolean;
  defaultExpanded: boolean;
  columns?: 1 | 2 | 3 | 4;
  conditional?: {
    field: string;
    value: any;
    operator?: 'equals' | 'notEquals' | 'contains' | 'exists';
  };
  order: number;
}

// Enhanced form configuration
export interface FormConfig {
  layout: 'single-column' | 'two-column' | 'auto';
  sections: FormSectionConfig[];
  showFieldDescriptions: boolean;
  showRequiredIndicators: boolean;
  groupRelatedFields: boolean;
  enableConditionalLogic: boolean;
  autoFocus: boolean;
  submitOnEnter: boolean;
}

// Enhanced display configuration for cards, lists, and views
export interface EnhancedDisplayConfig {
  // Card display configuration
  card: {
    layout: 'simple' | 'detailed' | 'compact' | 'tile';
    showPortraits: boolean;
    fields: string[];
    maxFields?: number;
    showActions: boolean;
    actionPosition: 'top' | 'bottom' | 'overlay';
    aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  };
  
  // List display configuration
  list: {
    density: 'comfortable' | 'compact' | 'spacious';
    columns: Array<{
      key: string;
      label: string;
      width?: string | number;
      sortable?: boolean;
      filterable?: boolean;
      align?: 'left' | 'center' | 'right';
    }>;
    showRowActions: boolean;
    striped?: boolean;
    hoverable?: boolean;
    selectable?: boolean;
  };
  
  // Detail view configuration
  detail: {
    layout: 'tabbed' | 'stacked' | 'sidebar';
    showBreadcrumbs: boolean;
    showTimestamps: boolean;
    showMetadata: boolean;
    enableInlineEdit: boolean;
    stickyHeader?: boolean;
  };
  
  // Search and filtering
  search: {
    enabled: boolean;
    placeholder?: string;
    fields: string[];
    fuzzySearch?: boolean;
    searchDelay?: number;
  };
  
  // Sorting and filtering options
  sorting: {
    defaultField: string;
    defaultDirection: 'asc' | 'desc';
    options: Array<{
      key: string;
      label: string;
      direction: 'asc' | 'desc';
    }>;
  };
  
  filters: Array<{
    key: string;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'date' | 'range';
    options?: string[] | { value: string; label: string }[];
    defaultValue?: any;
  }>;
  
  // Pagination
  pagination: {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions?: number[];
    showTotal?: boolean;
    showQuickJumper?: boolean;
  };
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

// Template configuration for entity creation
export interface TemplateConfig {
  enabled: boolean;
  categories: Array<{
    key: string;
    label: string;
    description?: string;
    templates: Array<{
      key: string;
      label: string;
      description?: string;
      data: Record<string, any>;
      preview?: string;
    }>;
  }>;
}

// Enhanced universal entity configuration interface
export interface EnhancedUniversalEntityConfig {
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
  
  // UI Configuration - NEW ENHANCED CONFIGURATIONS
  wizard: WizardConfig;
  tabs: DetailTabConfig;
  form: FormConfig;
  display: EnhancedDisplayConfig;
  
  // AI Configuration
  ai: AIGenerationConfig;
  
  // Relationships
  relationships: RelationshipConfig;
  
  // Templates
  templates: TemplateConfig;
  
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
    hasImport: boolean;
    hasVersioning: boolean;
    hasComments: boolean;
    hasActivityLog: boolean;
  };
  
  // Validation
  validation: {
    requiredFields: string[];
    uniqueFields: string[];
    customValidators?: Record<string, (value: any, entity: any) => boolean | string>;
  };
  
  // Performance and behavior
  performance: {
    enableVirtualization: boolean;
    lazyLoading: boolean;
    cacheResults: boolean;
    prefetchRelated: boolean;
    optimisticUpdates: boolean;
  };
}

// Maintain backward compatibility
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

// Backward compatible main interface
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
  private static configs: Map<EntityType, EnhancedUniversalEntityConfig> = new Map();
  
  static register(config: EnhancedUniversalEntityConfig) {
    this.configs.set(config.entityType, config);
  }
  
  static get(entityType: EntityType): EnhancedUniversalEntityConfig | undefined {
    return this.configs.get(entityType);
  }
  
  static getAll(): EnhancedUniversalEntityConfig[] {
    return Array.from(this.configs.values());
  }
  
  static getByCategory(category: string): EnhancedUniversalEntityConfig[] {
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

// New helper functions for enhanced configurations
export const createWizardStep = (
  key: string,
  label: string,
  fields: string[],
  options?: Partial<WizardStepConfig>
): WizardStepConfig => ({
  key,
  label,
  fields,
  required: true,
  ...options
});

export const createTab = (
  key: string,
  label: string,
  fields: string[],
  order: number,
  options?: Partial<TabConfig>
): TabConfig => ({
  key,
  label,
  fields,
  order,
  ...options
});

export const createFormSection = (
  key: string,
  label: string,
  fields: string[],
  order: number,
  options?: Partial<FormSectionConfig>
): FormSectionConfig => ({
  key,
  label,
  fields,
  collapsible: true,
  defaultExpanded: order === 0,
  order,
  columns: 1,
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

export const DEFAULT_WIZARD_CONFIG: WizardConfig = {
  enabled: true,
  steps: [],
  allowSkipping: false,
  showProgress: true,
  autoSave: true,
  autoSaveInterval: 3000,
  methods: {
    guided: true,
    templates: true,
    ai: false,
    upload: false
  }
};

export const DEFAULT_TAB_CONFIG: DetailTabConfig = {
  enabled: true,
  tabs: [],
  orientation: 'horizontal',
  variant: 'default',
  lazyLoad: true,
  stickyTabs: false
};

export const DEFAULT_FORM_CONFIG: FormConfig = {
  layout: 'single-column',
  sections: [],
  showFieldDescriptions: true,
  showRequiredIndicators: true,
  groupRelatedFields: true,
  enableConditionalLogic: false,
  autoFocus: true,
  submitOnEnter: false
};

export const DEFAULT_ENHANCED_DISPLAY_CONFIG: EnhancedDisplayConfig = {
  card: {
    layout: 'detailed',
    showPortraits: true,
    fields: ['name', 'description'],
    maxFields: 6,
    showActions: true,
    actionPosition: 'overlay',
    aspectRatio: 'auto'
  },
  list: {
    density: 'comfortable',
    columns: [
      { key: 'name', label: 'Name', sortable: true, filterable: true, align: 'left' },
      { key: 'createdAt', label: 'Created', sortable: true, align: 'right' }
    ],
    showRowActions: true,
    striped: false,
    hoverable: true,
    selectable: true
  },
  detail: {
    layout: 'tabbed',
    showBreadcrumbs: true,
    showTimestamps: true,
    showMetadata: false,
    enableInlineEdit: true,
    stickyHeader: true
  },
  search: {
    enabled: true,
    placeholder: 'Search...',
    fields: ['name', 'description'],
    fuzzySearch: true,
    searchDelay: 300
  },
  sorting: {
    defaultField: 'name',
    defaultDirection: 'asc',
    options: [
      { key: 'name', label: 'Name', direction: 'asc' },
      { key: 'createdAt', label: 'Created', direction: 'desc' },
      { key: 'updatedAt', label: 'Modified', direction: 'desc' }
    ]
  },
  filters: [],
  pagination: {
    enabled: true,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: true,
    showQuickJumper: false
  }
};

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  enabled: false,
  categories: []
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