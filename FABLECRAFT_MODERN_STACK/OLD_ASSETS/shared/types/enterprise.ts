/**
 * Enterprise-Grade Type Definitions
 * Eliminates all 'any' types with proper interfaces
 */

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId: string;
}

// Character System Types (replacing any usage)
export interface CharacterField {
  id: string;
  name: string;
  value: string | number | boolean | string[] | null;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'boolean';
  category: 'basic' | 'appearance' | 'personality' | 'background' | 'relationships' | 'skills';
  isRequired: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface CharacterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fantasy' | 'scifi' | 'modern' | 'historical' | 'custom';
  fields: CharacterField[];
  isDefault: boolean;
}

export interface CharacterData {
  id: string;
  projectId: string;
  name: string;
  fields: Record<string, CharacterField['value']>;
  template: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  portraitUrl?: string;
}

// Project System Types
export interface ProjectMetadata {
  wordCount: number;
  characterCount: number;
  chaptersCount: number;
  lastActivity: Date;
  completionPercentage: number;
}

export interface ProjectSettings {
  autoSave: boolean;
  collaborationEnabled: boolean;
  aiAssistanceLevel: 'none' | 'basic' | 'advanced';
  exportFormats: ('pdf' | 'docx' | 'epub' | 'txt')[];
  privacyLevel: 'private' | 'team' | 'public';
}

// User System Types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  preferences: UserPreferences;
  subscription: SubscriptionInfo;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface UserPreferences {
  theme: string;
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  projectUpdates: boolean;
  collaborationInvites: boolean;
  systemUpdates: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  keyboardNavigation: boolean;
}

export interface SubscriptionInfo {
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  renewsAt?: Date;
  features: string[];
}

// AI Integration Types
export interface AIRequest {
  prompt: string;
  context?: Record<string, unknown>;
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: 'stop' | 'length' | 'content_filter';
}

// Component Props Types (replacing any props)
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export interface FormComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  required?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

// Event Handler Types
export interface FormEventHandlers<T = Record<string, unknown>> {
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  onChange?: (field: keyof T, value: T[keyof T]) => void;
  onValidate?: (data: Partial<T>) => Record<keyof T, string> | null;
}

// Performance Monitoring Types
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  errorCount: number;
}

export interface ComponentPerformance {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  memoryLeaks: number;
  reRenderReasons: string[];
}

// Migration System Types
export interface MigrationConfig {
  phase: 'legacy' | 'hybrid' | 'modern';
  features: Record<string, boolean>;
  rollbackEnabled: boolean;
  errorThreshold: number;
}

export interface MigrationStatus {
  currentPhase: MigrationConfig['phase'];
  completedFeatures: string[];
  failedFeatures: string[];
  errorCount: number;
  startedAt: Date;
  lastUpdated: Date;
}

// Database Query Result Types
export interface QueryResult<T> {
  data: T[];
  count: number;
  totalCount: number;
  hasMore: boolean;
  cursor?: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  cursor?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

// Error Boundary Types
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
  eventType?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type NonNullable<T> = T extends null | undefined ? never : T;