/**
 * Centralized Type Exports - Senior Dev Pattern
 * Single source of truth for all type definitions across the application
 * Resolves import conflicts and provides clean type boundaries
 */

// ===== CORE TYPES (Foundation) =====
export type {
  Project,
  Character as LegacyCharacter,
  OutlineNode,
  ProseDocument,
  ProjectSettings,
  ImageAsset,
  CharacterRelationship
} from '../types';

// ===== ENHANCED CHARACTER TYPES =====
export type {
  Character,
  EnhancedCharacter,
  CharacterTemplate,
  CharacterFormData,
  CharacterValidationError
} from './characterTypes';

// ===== UTILITY TYPES =====
export interface EntityDetailViewProps<T = any> {
  entity: T;
  onUpdate: (entity: T) => void;
  onDelete?: (id: string) => void;
}

export interface EntityFormProps<T = any> {
  entity?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface EntityTemplate<T = any> {
  id: string;
  name: string;
  description: string;
  data: Partial<T>;
  category: string;
}

export interface EntityTemplatesProps<T = any> {
  templates: EntityTemplate<T>[];
  onSelect: (template: EntityTemplate<T>) => void;
  entityType: string;
}

export interface EntityCreationLaunchProps {
  entityType: string;
  projectId: string;
  onEntityCreated: (entity: any) => void;
}

export interface UniversalFieldRendererProps {
  fieldKey: string;
  fieldLabel: string;
  fieldValue: any;
  fieldConfig: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

// ===== API RESPONSE TYPES =====
export interface APIResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T = any> {
  entities: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ===== ERROR TYPES =====
export interface APIError {
  message: string;
  status: number;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface EntityError {
  message: string;
  context?: Record<string, any>;
}

// ===== COMPONENT PROP TYPES =====
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// ===== FORM TYPES =====
export interface FormFieldConfig {
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

// ===== REEXPORT COMMONLY USED TYPES =====
// This prevents import path confusion across the app
// Note: User and Session types are defined in useAuth hook
