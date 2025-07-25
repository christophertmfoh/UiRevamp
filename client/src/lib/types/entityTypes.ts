/**
 * Universal Entity Type Definitions
 * Shared interfaces for all entity types with consistent prop patterns
 */

import type { BaseEntity } from '../utils/entityUtils';
import type { FieldDefinition } from '../config/fieldConfig';

// Base entity manager props (standardized across all entity types)
export interface EntityManagerProps {
  projectId: string;
  entityType: string;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
}

// Base entity detail view props
export interface EntityDetailViewProps<T extends BaseEntity> {
  projectId: string;
  entityType: string;
  entity: T;
  onBack: () => void;
  onDelete: (entity: T) => void;
}

// Base entity form props
export interface EntityFormProps<T extends BaseEntity> {
  projectId: string;
  entityType: string;
  onCancel: () => void;
  entity?: T;
  initialData?: Partial<T>;
}

// Base entity creation launch props
export interface EntityCreationLaunchProps {
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onOpenTemplates: () => void;
  onOpenAIGeneration: () => void;
}

// Base entity templates props
export interface EntityTemplatesProps<T extends BaseEntity> {
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: Partial<T>) => void;
}

// Base entity generation options
export interface EntityGenerationOptions {
  entityType: string;
  prompt: string;
  context?: string;
  style?: string;
  parameters?: Record<string, any>;
}

// Base entity generation modal props
export interface EntityGenerationModalProps {
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: EntityGenerationOptions) => void;
  isGenerating: boolean;
  projectId: string;
}

// Base entity portrait modal props
export interface EntityPortraitModalProps<T extends BaseEntity> {
  entity: T;
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (imageUrl: string) => void;
  onImageUploaded?: (imageUrl: string) => void;
}

// Base field AI assist props
export interface EntityFieldAIAssistProps<T extends BaseEntity> {
  entity: T;
  entityType: string;
  fieldKey: string;
  fieldLabel: string;
  currentValue: any;
  onFieldUpdate: (value: any) => void;
  disabled?: boolean;
  fieldOptions?: string[];
}

// Universal field renderer props
export interface UniversalFieldRendererProps {
  fieldKey: string;
  fieldDefinition: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  onEnhance?: (fieldKey: string, fieldLabel: string) => void;
  isEnhancing?: boolean;
  error?: string;
  disabled?: boolean;
  showPriority?: boolean;
  entityType?: string;
}

// Universal form section props
export interface UniversalFormSectionProps<T extends BaseEntity> {
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string;
  entity: T;
  entityType: string;
  fieldDefinitions: FieldDefinition[];
  onChange: (fieldKey: string, value: any) => void;
  onEnhanceField?: (fieldKey: string, fieldLabel: string) => void;
  fieldEnhancements?: Record<string, boolean>;
  validationErrors?: Record<string, string>;
  disabled?: boolean;
  showPriority?: boolean;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

// Entity relationship props
export interface EntityRelationshipsProps<T extends BaseEntity> {
  entity: T;
  entityType: string;
  allEntities: T[];
  onUpdateRelationships: (relationships: EntityRelationship[]) => void;
}

// Entity arc tracker props
export interface EntityArcTrackerProps {
  entityName: string;
  entityType: string;
  onUpdateArcs: (arcs: EntityArc[]) => void;
}

// Entity insights props
export interface EntityInsightsProps<T extends BaseEntity> {
  entity: T;
  entityType: string;
  fieldDefinitions: FieldDefinition[];
}

// Supporting interfaces
export interface EntityRelationship {
  id: string;
  targetEntityId: string;
  targetEntityName: string;
  targetEntityType: string;
  type: 'related' | 'contains' | 'belongs-to' | 'conflicts-with' | 'supports' | 'depends-on';
  status: 'active' | 'past' | 'potential' | 'unknown';
  description: string;
  strength: 'weak' | 'moderate' | 'strong' | 'critical';
  notes: string;
}

export interface EntityArcMilestone {
  id: string;
  title: string;
  description: string;
  chapter: string;
  progress: number; // 0-100
  status: 'planned' | 'in-progress' | 'completed' | 'revised';
  significance: string[];
  developmentType: 'introduction' | 'development' | 'climax' | 'resolution';
  notes: string;
}

export interface EntityArc {
  id: string;
  name: string;
  description: string;
  startingPoint: string;
  endingPoint: string;
  theme: string;
  overallProgress: number;
  milestones: EntityArcMilestone[];
}

// Entity statistics
export interface EntityStatistics {
  total: number;
  wellDeveloped: number;
  inProgress: number;
  needWork: number;
  averageCompleteness: number;
  recentlyUpdated: number;
}

// Sort and filter options
export type EntitySortOption = 'alphabetical' | 'recently-added' | 'recently-edited' | 'completeness' | 'type';
export type EntityViewMode = 'grid' | 'list' | 'table';

// Entity filter options
export interface EntityFilters {
  completeness?: {
    min: number;
    max: number;
  };
  hasImage?: boolean;
  recentlyUpdated?: boolean;
  tags?: string[];
  customFields?: Record<string, any>;
}

// Bulk operation interfaces
export interface EntityBulkOperationProps<T extends BaseEntity> {
  selectedEntities: T[];
  onUpdateEntities: (updates: Partial<T>) => void;
  onDeleteEntities: (entityIds: string[]) => void;
  onClose: () => void;
}

// Export options
export interface EntityExportOptions {
  format: 'csv' | 'json' | 'xlsx' | 'pdf';
  includeImages: boolean;
  includeRelationships: boolean;
  selectedFields?: string[];
  selectedEntities?: string[];
}

// Import options
export interface EntityImportOptions {
  file: File;
  format: 'csv' | 'json' | 'xlsx';
  fieldMapping: Record<string, string>;
  createMissing: boolean;
  updateExisting: boolean;
}

// Template definition for any entity type
export interface EntityTemplate<T extends BaseEntity> {
  id: string;
  name: string;
  description: string;
  category: string;
  entityType: string;
  data: Partial<T>;
  fieldValues: Record<string, any>;
  tags: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}