import type { LucideIcon } from 'lucide-react';
import type { Character } from '../../../client/src/lib/types';
import type { UniversalEntityConfig } from '../../../src/core/entities/config/EntityConfig';

// Base modular tab configuration
export interface ModularTabConfig {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon: LucideIcon;
  color: string;
  gradient?: string;
  
  // Tab metadata
  isCustom: boolean;
  clonedFrom?: string;
  createdAt: string;
  updatedAt: string;
  
  // Feature toggles (preserves all Character functionality)
  features: TabFeatures;
  
  // UI Customization
  ui: TabUIConfig;
  
  // Data & Behavior
  dataConfig: TabDataConfig;
  
  // Component mappings (preserves exact functionality)
  componentMappings: TabComponentMappings;
}

// Feature flags that preserve ALL Character Manager functionality
export interface TabFeatures {
  // Core Character Features
  hasAIGeneration: boolean;
  hasTemplates: boolean;
  hasGuidedCreation: boolean;
  hasDocumentUpload: boolean;
  hasPortraits: boolean;
  hasPortraitGeneration: boolean;
  hasPortraitUpload: boolean;
  
  // Data Management
  hasBulkOperations: boolean;
  hasBulkSelection: boolean;
  hasBulkDelete: boolean;
  hasAdvancedSearch: boolean;
  hasAdvancedFiltering: boolean;
  
  // Sorting Options (all 12+ from original)
  hasSorting: boolean;
  sortOptions: TabSortOption[];
  
  // View Modes
  hasViewModes: boolean;
  supportedViewModes: ('grid' | 'list')[];
  
  // Analytics & Progress
  hasCompletionTracking: boolean;
  hasProgressIndicators: boolean;
  hasStatistics: boolean;
  
  // Export & Import
  hasExport: boolean;
  hasImport: boolean;
  
  // Relationships
  hasRelationships: boolean;
  
  // Customization
  hasCustomFields: boolean;
  hasFieldValidation: boolean;
  
  // UI Enhancements
  hasPremiumCards: boolean;
  hasHoverEffects: boolean;
  hasAnimations: boolean;
  
  // Integration
  hasAPIIntegration: boolean;
  hasRealTimeUpdates: boolean;
}

// Sort options (preserves all original sorting)
export interface TabSortOption {
  key: string;
  label: string;
  direction: 'asc' | 'desc';
  category?: string;
}

// UI Configuration
export interface TabUIConfig {
  // Colors & Theming
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Layout
  defaultViewMode: 'grid' | 'list';
  cardLayout: 'simple' | 'detailed' | 'compact' | 'premium';
  
  // Display Fields (what shows in cards/lists)
  displayFields: {
    card: string[];
    list: string[];
    preview: string[];
  };
  
  // Icons & Branding
  icon: LucideIcon;
  iconColor?: string;
  
  // Custom styling
  customCSS?: string;
  
  // Behavior
  enableHoverEffects: boolean;
  enableAnimations: boolean;
  showProgressBars: boolean;
}

// Data Configuration
export interface TabDataConfig {
  // Entity Type
  entityType: string;
  
  // Field Configuration
  fields: TabFieldConfig[];
  sections: TabSectionConfig[];
  
  // Validation
  validation: {
    requiredFields: string[];
    uniqueFields: string[];
    customValidators?: Record<string, (value: any) => boolean | string>;
  };
  
  // Default Values
  defaultValues: Record<string, any>;
  
  // Custom Properties
  customProperties: TabCustomProperty[];
}

// Field Configuration (extends character fields)
export interface TabFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'array' | 'select' | 'number' | 'date' | 'boolean';
  section: string;
  
  // Display
  displayInCard?: boolean;
  displayInList?: boolean;
  displayInPreview?: boolean;
  
  // Behavior
  required?: boolean;
  placeholder?: string;
  options?: string[];
  
  // Customization
  isCustomField?: boolean;
  customValidation?: string;
  
  // AI Enhancement
  aiEnhanceable?: boolean;
  aiPromptTemplate?: string;
}

// Section Configuration
export interface TabSectionConfig {
  key: string;
  label: string;
  fields: string[];
  icon?: LucideIcon;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  customOrder?: number;
}

// Custom Properties
export interface TabCustomProperty {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'boolean';
  defaultValue?: any;
  options?: string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Component Mappings (preserves exact Character Manager functionality)
export interface TabComponentMappings {
  // Main Manager Component
  manager: string; // 'AdvancedCharacterManager' or custom
  
  // Creation Components
  creationLaunch: string; // 'CharacterCreationLaunch'
  guidedCreation: string; // 'CharacterGuidedCreation'
  templates: string; // 'CharacterTemplates'
  aiGeneration: string; // 'CharacterGenerationModal'
  documentUpload: string; // 'CharacterDocumentUpload'
  
  // Detail & Edit Components
  detailView: string; // 'CharacterDetailView'
  form: string; // 'CharacterForm'
  
  // Enhancement Components
  portraitModal: string; // 'CharacterPortraitModal'
  aiAssist: string; // 'AIAssistModal'
  fieldAI: string; // 'FieldAIAssist'
  
  // Card Components
  card: string; // 'CharacterCard' or custom
  listItem: string; // 'CharacterListItem' or custom
  
  // Modals & Overlays
  confirmDelete: string;
  bulkActions: string;
  export: string;
  
  // Custom Components
  customComponents: Record<string, string>;
}

// Tab Template (for creating new tabs)
export interface TabTemplate {
  id: string;
  name: string;
  description: string;
  category: 'characters' | 'custom';
  icon: LucideIcon;
  
  // Template Configuration
  config: Partial<ModularTabConfig>;
  
  // Preview
  previewImage?: string;
  tags: string[];
  
  // Usage
  popularity: number;
  isBuiltIn: boolean;
  isVisible: boolean;
}

// Tab Instance (runtime representation)
export interface TabInstance {
  id: string;
  config: ModularTabConfig;
  projectId: string;
  
  // State
  isActive: boolean;
  lastAccessed: string;
  
  // Data
  entityCount: number;
  lastEntityUpdate: string;
  
  // Performance
  cacheKey: string;
  preloadData: boolean;
}

// Tab Factory Options (for creating/cloning tabs)
export interface TabFactoryOptions {
  // Basic Info
  name: string;
  displayName: string;
  description?: string;
  
  // Customization
  icon?: LucideIcon;
  color?: string;
  gradient?: string;
  
  // Features to Override
  featureOverrides?: Partial<TabFeatures>;
  
  // UI Overrides
  uiOverrides?: Partial<TabUIConfig>;
  
  // Data Overrides
  dataOverrides?: Partial<TabDataConfig>;
  
  // Custom Fields to Add
  customFields?: TabFieldConfig[];
  customSections?: TabSectionConfig[];
  customProperties?: TabCustomProperty[];
}

// Tab Clone Options (specific to cloning)
export interface TabCloneOptions extends TabFactoryOptions {
  sourceTabId: string;
  preserveData?: boolean;
  preserveSettings?: boolean;
  preserveCustomizations?: boolean;
}

// Tab Export/Import
export interface TabExportData {
  config: ModularTabConfig;
  instances: TabInstance[];
  templates: TabTemplate[];
  metadata: {
    version: string;
    exportedAt: string;
    exportedBy: string;
  };
}

// Tab Registry (for managing all tabs)
export interface TabRegistry {
  tabs: Record<string, ModularTabConfig>;
  instances: Record<string, TabInstance>;
  templates: Record<string, TabTemplate>;
  
  // Organization
  categories: string[];
  tags: string[];
  
  // Defaults
  defaultCharacterTabId: string;
}

// Tab Performance Metrics
export interface TabMetrics {
  tabId: string;
  entityCount: number;
  lastAccessTime: number;
  averageLoadTime: number;
  cacheHitRate: number;
  errorRate: number;
  userSatisfaction: number;
}