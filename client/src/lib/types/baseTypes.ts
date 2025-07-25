/**
 * Base Type Definitions
 * Core types that apply across all entity types in the application
 */

// Base audit fields that all entities should have
export interface AuditFields {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Base project-related fields
export interface ProjectFields {
  projectId: string;
}

// Core entity fields that every entity type should have
export interface CoreEntityFields extends AuditFields, ProjectFields {
  name: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  notes?: string;
}

// Enhanced entity fields for entities that support advanced features
export interface EnhancedEntityFields extends CoreEntityFields {
  // Relationships with other entities
  relationships?: EntityRelationship[];
  
  // Development progress tracking
  completeness?: number;
  
  // AI-generated insights
  insights?: EntityInsights;
  
  // Custom metadata
  metadata?: Record<string, any>;
}

// Generic relationship structure
export interface EntityRelationship {
  id: string;
  targetEntityId: string;
  targetEntityName: string;
  targetEntityType: string;
  type: RelationshipType;
  status: RelationshipStatus;
  description: string;
  strength: RelationshipStrength;
  notes: string;
}

export type RelationshipType = 
  | 'related' 
  | 'contains' 
  | 'belongs-to' 
  | 'conflicts-with' 
  | 'supports' 
  | 'depends-on'
  | 'family'
  | 'romantic'
  | 'friend'
  | 'enemy'
  | 'ally'
  | 'mentor'
  | 'rival';

export type RelationshipStatus = 'active' | 'past' | 'potential' | 'unknown';
export type RelationshipStrength = 'weak' | 'moderate' | 'strong' | 'critical';

// AI-generated insights for any entity
export interface EntityInsights {
  completenessScore: number;
  developmentSuggestions: string[];
  strengthsAnalysis: string[];
  weaknessesAnalysis: string[];
  potentialConflicts: string[];
  storyReadiness: 'low' | 'medium' | 'high';
  lastAnalyzed: string;
}

// Arc tracking for character/entity development
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

// Common field types used across entities
export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'array' 
  | 'tags' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'url' 
  | 'email'
  | 'json'
  | 'rich-text';

// Common validation patterns
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// Priority levels for fields
export type FieldPriority = 'essential' | 'important' | 'optional' | 'advanced';

// Common field definition structure
export interface BaseFieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  section: string;
  priority: FieldPriority;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule[];
  aiEnhanceable?: boolean;
  defaultValue?: any;
}

// Template definitions for any entity type
export interface BaseTemplate<T = any> {
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

// Common sorting and filtering
export type BaseSortOption = 'alphabetical' | 'recently-added' | 'recently-edited' | 'completeness';
export type BaseViewMode = 'grid' | 'list' | 'table';

export interface BaseFilters {
  search?: string;
  tags?: string[];
  completeness?: {
    min: number;
    max: number;
  };
  hasImage?: boolean;
  recentlyUpdated?: boolean;
  customFields?: Record<string, any>;
}

// API response structures
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Export/Import structures
export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx' | 'pdf';
  includeImages: boolean;
  includeRelationships: boolean;
  selectedFields?: string[];
  selectedEntities?: string[];
}

export interface ImportOptions {
  file: File;
  format: 'csv' | 'json' | 'xlsx';
  fieldMapping: Record<string, string>;
  createMissing: boolean;
  updateExisting: boolean;
}

// AI generation structures
export interface BaseGenerationOptions {
  entityType: string;
  prompt: string;
  context?: string;
  style?: string;
  parameters?: Record<string, any>;
  fieldTargets?: string[];
}

export interface GenerationResult<T = any> {
  success: boolean;
  data?: Partial<T>;
  error?: string;
  warnings?: string[];
  suggestions?: string[];
}